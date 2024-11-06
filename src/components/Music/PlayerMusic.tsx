// FacebookStyleMusicPlayer
import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Music, Radio } from 'lucide-react'
import { supabase } from '@/supabaseClient'
import dayjs from 'dayjs'
import { Card, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import useStreamUrl from '@/hooks/HooksMusic/UseStreamUrl'
import useRadioStream from '../../hooks/HooksMusic/HooksInfoMusic'
interface Song {
    id: string
    title: string
    artist: string
    album: string
    cover: string
    audio: string
    lyrics: string
    bytes: string
    updated_at: string
}


interface RadioStation {
    id: string
    name: string
    streamUrl: string
    logo: string
    description: string
    song: string
}


const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
}

const VisualizerBars: React.FC = () => {
    const bars = 50
    return (
        <div className="flex items-end justify-center h-16 gap-[2px] mt-4">
            {[...Array(bars)].map((_, i) => (
                <div
                    key={i}
                    className="w-1 bg-purple-500 rounded-t-sm opacity-75"
                    style={{
                        height: `${Math.random() * 100}%`,
                        animation: `equalizer-bar 1s ease-in-out infinite`,
                        animationDelay: `${i * (1 / bars)}s`
                    }}
                ></div>
            ))}
        </div>
    )
}

export default function FacebookStyleMusicPlayer() {
    const RadioUncion = useStreamUrl()

    const [currentSong, setCurrentSong] = useState<Song | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [playlist, setPlaylist] = useState<Song[]>([])
    const [activeRadio, setActiveRadio] = useState<RadioStation | null>(null)
    const [error, setError] = useState<string | undefined>()
    const [playbackError, setPlaybackError] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)

    const { streamInfo } = useRadioStream()
    const RADIO_STATIONS: RadioStation[] = [
        {
            id: 'uncion',
            name: 'Unción 106.7',
            streamUrl: RadioUncion,
            logo: 'https://cdn.instant.audio/images/logos/radios-co-cr/uncion-san-jose.png',
            description: "",
            song: ""
        },
        {
            id: 'enlace',
            name: 'Enlace Juvenil 88.4',
            streamUrl: 'https://stream.zeno.fm/52hf40q405quv',
            logo: 'https://cdn.instant.audio/images/logos/radios-co-cr/enlace-juvenil.png',
            description: "",
            song: ""
        },
        {
            id: "influencia",
            name: streamInfo.title,
            streamUrl: "https://gruponovaradial.azuracast.com.es/listen/influencia_positiva_radio_/radio.mp3",
            logo: "https://cdn.instant.audio/images/logos/radios-co-cr/influencia-positiva.png",
            description: streamInfo.description,
            song: streamInfo.currentSong
        },
        {
            id: "maranatha",
            name: "Radio Maranatha",
            streamUrl: "https://stream-153.zeno.fm/3gu8hehkp2zuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiIzZ3U4aGVoa3AyenV2IiwiaG9zdCI6InN0cmVhbS0xNTMuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjhRWW1sUEFjVGpXT0Y0QThGVWRlbVEiLCJpYXQiOjE3MzA4ODA4MjcsImV4cCI6MTczMDg4MDg4N30.9UfUozhjjfgPna9w_pzYP4xchOMD0SC8bRQrJfI8Ua4",
            logo: "https://zeno.fm/_ipx/f_webp&q_85&fit_cover&s_64x64/https://images.zeno.fm/5V5o58JZhtUAi-dhHkiq36M1GxYI05YsgMQlVmZwFAg/rs:fill:288:288/g:ce:0:0/aHR0cHM6Ly9wcm94eS56ZW5vLmZtL2NvbnRlbnQvc3RhdGlvbnMvYWd4emZucGxibTh0YzNSaGRITnlNZ3NTQ2tGMWRHaERiR2xsYm5RWWdJQ1FxZmU5aEFnTUN4SU9VM1JoZEdsdmJsQnliMlpwYkdVWWdJQ1EtWkNUcWdrTW9nRUVlbVZ1YncvaW1hZ2UvP3U9MTY2MTU0OTU0ODAwMA.webp",
            description: "Religius",
            song: ""
        }
    ]

    useEffect(() => {
        const loadTracks = async () => {
            try {
                const fetchedTracks = await fetchAudioTracks()
                setPlaylist(fetchedTracks)
            } catch (error) {
                setError('Error loading tracks.')
                console.error('Error loading tracks:', error)
            }
        }

        loadTracks()
    }, [])

    const fetchAudioTracks = async () => {
        try {
            const { data: audioTracks, error } = await supabase
                .storage
                .from('idec-public')
                .list('playlistMusic/')

            if (error) throw error

            const trackList = audioTracks.map((file) => {
                const encodedFileName = encodeURIComponent(file.name)
                const formatBytesToMB = (bytes: number): string => {
                    const megabytes = bytes / (1024 * 1024)
                    return `${megabytes.toFixed(2)} MB`
                }

                const { data: publicURL } = supabase.storage
                    .from('idec-public')
                    .getPublicUrl(`playlistMusic/${encodedFileName}`)

                if (!publicURL) throw new Error('Failed to get public URL')

                return {
                    id: file.id,
                    title: file.name,
                    artist: file.name,
                    album: 'Unknown Album',
                    cover: '/default_cover.png',
                    audio: `https://janbrtgwtomzffqqcmfo.supabase.co/storage/v1/object/public/idec-public/playlistMusic/${file.name}`,
                    lyrics: 'Lyrics not available',
                    bytes: formatBytesToMB(file.metadata.size),
                    updated_at: file.updated_at,
                }
            }).filter(Boolean)

            return trackList
        } catch (error) {
            console.error('Error fetching audio tracks:', error)
            throw error
        }
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    useEffect(() => {
        const playAudio = async () => {
            try {
                setPlaybackError(null)
                if (isPlaying) {
                    await audioRef.current?.play()
                    if (error) {
                        console.log('error');

                    }
                } else {
                    audioRef.current?.pause()
                }
            } catch (error) {
                console.error('Error de reproducción:', error)
                setPlaybackError('Error al reproducir el audio. Por favor, inténtelo de nuevo.')
                setIsPlaying(false)
            }
        }

        playAudio()
    }, [isPlaying, currentSong, activeRadio])

    const togglePlay = () => setIsPlaying(!isPlaying)

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            setDuration(audioRef.current.duration)
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
            if (progressBarRef.current) {
                progressBarRef.current.style.width = `${progress}%`
            }
        }
    }

    const handleSeek: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!activeRadio) {
            const seekTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * duration
            setCurrentTime(seekTime)
            if (audioRef.current) {
                audioRef.current.currentTime = seekTime
            }
        }
    }

    const handleVolumeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        if (isMuted) {
            setVolume(1)
            setIsMuted(false)
        } else {
            setVolume(0)
            setIsMuted(true)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const playNextSong = () => {
        if (!activeRadio && currentSong) {
            const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
            const nextIndex = isShuffle ? Math.floor(Math.random() * playlist.length) : (currentIndex + 1) % playlist.length
            setCurrentSong(playlist[nextIndex])
        }
    }

    const playPreviousSong = () => {
        if (!activeRadio && currentSong) {
            const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
            const previousIndex = (currentIndex - 1 + playlist.length) % playlist.length
            setCurrentSong(playlist[previousIndex])
        }
    }

    const toggleRepeat = () => setIsRepeat(!isRepeat)

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle)
        if (!isShuffle) {
            const shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5)
            setPlaylist(shuffledPlaylist)
        } else {
            setPlaylist([...playlist])
        }
    }

    const handleSongEnd = () => {
        if (isRepeat) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play()
            }
        } else {
            playNextSong()
        }
    }

    const selectSong = (song: Song) => {
        setCurrentSong(song)
        setActiveRadio(null)
        setIsPlaying(true)
    }

    const selectRadio = (station: RadioStation) => {
        if (activeRadio?.id === station.id) {
            setActiveRadio(null)
            setIsPlaying(false)
        } else {
            setActiveRadio(station)
            setCurrentSong(null)
            setIsPlaying(true)
        }
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gradient-to-br via-purple-900 to-violet-800 text-white p-8">
                <div className="w-full lg:w-2/3 max-w-3xl bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden mb-8 lg:mb-0 lg:mr-8 transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="relative pb-2/3">
                        <img
                            src={activeRadio ? activeRadio.logo : (currentSong?.cover || '/default_cover.png')}
                            alt={activeRadio ? activeRadio.name : `${currentSong?.album || 'Default'} cover`}
                            className="absolute h-full w-full object-cover transition-opacity duration-500 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                    <div className="p-8">
                        <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            {activeRadio ? activeRadio.name : currentSong?.title || 'Select a track'}
                        </h2>
                        <p className={`text-xl mb-6 flex items-center ${activeRadio ? 'text-red-500 flex' : 'text-gray-500'}`}>


                            {activeRadio ? (
                                <span className="blog items-center justify-around"> 
                                    <pre className='mr-3 text-gray-600'>{activeRadio?.song}</pre>
                                    <pre className='mr-3 text-gray-600'>{activeRadio?.description}</pre> 
                                    {/* <Radio className='ml-2 mr-1' size={16} /> Live Radio  */}
                                </span>
                            ) : currentSong ? `${currentSong.artist} - ${currentSong.album} ` : 'No track selected'}
                        </p>

                        <div className="relative h-2 bg-gray-700 rounded-full mb-6 cursor-pointer" onClick={handleSeek}>
                            <div ref={progressBarRef} className="absolute h-full bg-purple-500 rounded-full transition-all duration-100 ease-out"></div>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm">{!activeRadio ? formatTime(currentTime) : '--:--'}</span>
                            <span className={`text-sm flex items-center ${activeRadio ? 'text-red-500' : ''}`}>
                                {activeRadio ? (
                                    <>
                                        <Radio className="mr-1" size={16} /> Live
                                    </>
                                ) : (
                                    formatTime(duration)
                                )}
                            </span>
                        </div>
                        <CardFooter className="flex items-center justify-between mb-8">
                            <Button
                                onClick={toggleShuffle}
                                className={`bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors ${isShuffle ? 'text-purple-500' : ''}`}
                                disabled={!!activeRadio}
                            >
                                <Shuffle size={28} />
                            </Button>
                            <Button
                                onClick={playPreviousSong}
                                className="bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                                disabled={!!activeRadio}
                            >
                                <SkipBack size={32} />
                            </Button>
                            <Button
                                onClick={togglePlay}
                                className="bg-purple-600 rounded-full p-6 hover:bg-purple-700 transition-colors transform hover:scale-105"
                            >
                                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                            </Button>
                            <Button
                                onClick={playNextSong}
                                className="bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                                disabled={!!activeRadio}
                            >
                                <SkipForward size={32} />
                            </Button>
                            <Button
                                onClick={toggleRepeat}
                                className={`bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors ${isRepeat ? 'text-purple-500' : ''}`}
                                disabled={!!activeRadio}
                            >
                                <Repeat size={28} />
                            </Button>
                        </CardFooter>
                        {playbackError && (
                            <div className="mt-4 p-2 bg-red-600 text-white rounded-md text-sm">
                                {playbackError}
                            </div>
                        )}
                        <div className="flex items-center">
                            <Button onClick={toggleMute} className="bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors mr-4">
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </Button>
                            <Input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-full accent-purple-500"
                            />
                        </div>
                        <VisualizerBars />
                    </div>
                </div>
                <div className="w-full lg:w-1/3 max-w-md">
                    <div className="rounded-3xl shadow-2xl overflow-hidden mb-8 transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-500">
                                <Music size={28} className="mr-2 text-purple-500" />
                                Lista de reproducción
                            </h3>
                            <ul className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                {playlist.map((song) => (
                                    <li
                                        key={song.id}
                                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${currentSong?.id === song.id ? 'bg-purple-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`}
                                        onClick={() => selectSong(song)}
                                    >
                                        <Avatar className="w-16 h-16 object-cover rounded-lg mr-4">
                                            <AvatarImage src={song.cover} alt={song.title} />
                                            <AvatarFallback className='bg-gray-500'>{song.title ? getInitials(song.title) : 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-gray-500 font-semibold text-lg">{song.title}</h4>
                                            <p className="text-sm text-gray-400">{dayjs(song.updated_at).format("MMM D, YYYY h:mm A")} {song.bytes}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {RADIO_STATIONS.map((station) => (
                            <Card
                                key={station.id}
                                className="bg-gray-800 bg-opacity-0 backdrop-filter backdrop-blur-lg text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02] cursor-pointer"
                                onClick={() => selectRadio(station)}
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold flex items-center text-gray-500">
                                        <img className='mr-3' width={48} src={station.logo} alt={station.name} />
                                        {station.name}
                                    </h2>
                                    <div
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${activeRadio?.id === station.id ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                    >
                                        {activeRadio?.id === station.id ? 'En vivo' : 'Apagado'}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                </div>
                <audio
                    ref={audioRef}
                    src={activeRadio ? activeRadio.streamUrl : currentSong?.audio}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleSongEnd}
                />
            </div>
        </>
    )
}