import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Music, Mic, Radio } from 'lucide-react'
import { supabase } from '@/supabaseClient'
import dayjs from 'dayjs'
// import { Layout } from '@/components/Loyout'
import { Card, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { Input } from '../ui/input'

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
    const [currentSong, setCurrentSong] = useState<Song | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [playlist, setPlaylist] = useState<Song[]>([])
    const [showLyrics, setShowLyrics] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [isRadioMode, setIsRadioMode] = useState(false)
    const [playbackError, setPlaybackError] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)


    
    useEffect(() => {
        const loadTracks = async () => {
            try {
                const fetchedTracks = await fetchAudioTracks()
                setPlaylist(fetchedTracks)
                if (fetchedTracks.length > 0) {
                    setCurrentSong(fetchedTracks[0])
                }
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
            console.log('Error fetching audio tracks:', error)
            throw error
        }
    }
    if (error) {
        console.log("Nada que mostrar");

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

        // Cuando cambiamos a modo radio, intentamos reproducir inmediatamente
        if (isRadioMode && !isPlaying) {
            setIsPlaying(true)
            playAudio()
        }
    }, [isPlaying, currentSong, isRadioMode])

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
        if (!isRadioMode) {
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
        if (!isRadioMode) {
            const currentIndex = playlist.findIndex(song => song.id === currentSong?.id)
            const nextIndex = isShuffle ? Math.floor(Math.random() * playlist.length) : (currentIndex + 1) % playlist.length
            setCurrentSong(playlist[nextIndex])
        }
    }

    const playPreviousSong = () => {
        if (!isRadioMode) {
            const currentIndex = playlist.findIndex(song => song.id === currentSong?.id)
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
        setIsPlaying(true)
        setIsRadioMode(false)
    }

    const toggleRadioMode = () => {
        setIsRadioMode(!isRadioMode)
        setIsPlaying(false)
        if (!isRadioMode) {
            setCurrentSong(null)
        }
    }

    return (
        < >
            <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gradient-to-br via-purple-900 to-violet-800 text-white p-8">
                <div className="w-full lg:w-2/3 max-w-3xl bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden mb-8 lg:mb-0 lg:mr-8 transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="relative pb-2/3">
                        <img
                            src={isRadioMode ? '/radio_cover.png' : currentSong?.cover}
                            alt={isRadioMode ? 'Radio' : `${currentSong?.album} cover`}
                            className="absolute h-full w-full object-cover transition-opacity duration-500 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                    <div className="p-8">
                        <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            {isRadioMode ? 'Unción Radio 106.7' : currentSong?.title}
                        </h2>
                        <p className={`text-xl mb-6 flex items-center ${isRadioMode ? 'text-red-500 flex' : 'text-gray-500'}`}>
                            {isRadioMode ? (
                                <>
                                    <Radio className='mr-1' size={16} /> Live Radio
                                </>
                            ) : `${currentSong?.artist} - ${currentSong?.album}`}
                        </p>

                        <div className="relative h-2 bg-gray-700 rounded-full mb-6 cursor-pointer" onClick={handleSeek}>
                            <div ref={progressBarRef} className="absolute h-full bg-purple-500 rounded-full transition-all duration-100 ease-out"></div>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm">{formatTime(currentTime)}</span>
                            <span className={`text-sm flex items-center ${isRadioMode ? 'text-red-500' : ''}`}>
                                {isRadioMode ? (
                                    <>
                                        <Radio className="mr-1" size={16} /> Live
                                    </>
                                ) : (
                                    formatTime(duration)
                                )}
                            </span>

                        </div>
                        <CardFooter className="flex items-center justify-between mb-8">
                            <Button onClick={toggleShuffle} className={` bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors ${isShuffle ? 'text-purple-500' : ''}`} disabled={isRadioMode}>
                                <Shuffle size={28} />
                            </Button>
                            <Button onClick={playPreviousSong} className=" bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors" disabled={isRadioMode}>
                                <SkipBack size={32} />
                            </Button>
                            <Button onClick={togglePlay} className="bg-purple-600 rounded-full p-6 hover:bg-purple-700 transition-colors transform hover:scale-105">
                                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                            </Button>
                            <Button onClick={playNextSong} className="bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors" disabled={isRadioMode}>
                                <SkipForward size={32} />
                            </Button>
                            <Button onClick={toggleRepeat} className={`bg-transparent text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors ${isRepeat ? 'text-purple-500' : ''}`} disabled={isRadioMode}>
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
                                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${currentSong?.id === song.id ? 'bg-purple-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'
                                            }`}
                                        onClick={() => selectSong(song)}
                                    >
                                        <Avatar className="w-16 h-16 object-cover rounded-lg mr-4">
                                            <AvatarImage src={song.cover} alt={song.title} />
                                            <AvatarFallback className='bg-gray-500 '>{song.title ? getInitials(song.title) : 'U'}</AvatarFallback>
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
                    <div className="bg-gray-800 bg-opacity-0 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform  hover:scale-[1.02]">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center cursor-pointer text-slate-500" onClick={() => setShowLyrics(!showLyrics)}>
                                <Mic size={28} className="mr-2 text-purple-500" />
                                Letras
                                <span className="ml-2 text-sm text-gray-400">(Click para {showLyrics ? 'ocultar' : 'mostrar'})</span>
                            </h3>
                            {showLyrics && (
                                <div className="text-gray-300 max-h-48 overflow-y-auto custom-scrollbar">
                                    <p className="whitespace-pre-line">{currentSong?.lyrics}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <Card
                        className="mt-8 bg-gray-800 bg-opacity-0 backdrop-filter backdrop-blur-lg text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]  cursor-pointer"
                        onClick={toggleRadioMode}
                    >
                        <div className="p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center text-gray-500">
                                <Radio
                                    className={`mr-3 ${isRadioMode ? 'text-red-500' : 'text-purple-500'}`} // Icono en rojo si está en modo en vivo
                                    size={28}
                                />
                                Unción Radio 106.7
                            </h2>
                            <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${isRadioMode ? 'bg-red-500 text-white flex text-center m-auto' : 'bg-gray-700 text-gray-300'
                                    }`}
                            >
                                {isRadioMode ? 'En vivo' : 'Apagado'}
                            </div>
                        </div>
                    </Card>

                </div>
                <audio
                    ref={audioRef}
                    src={isRadioMode ? "http://localhost:3002/stream" : currentSong?.audio}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleSongEnd}
                />
            </div>
        </>
    )
}