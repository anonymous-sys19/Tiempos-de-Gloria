import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  Radio,
} from "lucide-react";
import { supabase } from "@/supabaseClient";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Slider } from "../../components/ui/slider";
import useStreamUrl from "@/data/hooks/HooksMusic/UseStreamUrl";
import useRadioStream from "@/data/hooks/HooksMusic/HooksInfoMusic";
import "./globalMusic.css";
interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audio: string;
  lyrics: string;
  bytes: string;
  updated_at: string;
}

interface RadioStation {
  id: string;
  name: string;
  streamUrl: string;
  logo: string;
  description: string;
  song: string;
}

const FacebookStyleMusicPlayer: React.FC = () => {
  const RadioUncion = useStreamUrl();
  const { streamInfo } = useRadioStream();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [activeRadio, setActiveRadio] = useState<RadioStation | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showRadioList, setShowRadioList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const RADIO_STATIONS: RadioStation[] = [
    {
      id: "uncion",
      name: "Unción 106.7",
      streamUrl: RadioUncion,
      logo: "https://cdn.instant.audio/images/logos/radios-co-cr/uncion-san-jose.png",
      description: "Radio Cristiana",
      song: "",
    },
    {
      id: "enlace",
      name: "Enlace Juvenil 88.4",
      streamUrl: "https://stream.zeno.fm/52hf40q405quv",
      logo: "https://cdn.instant.audio/images/logos/radios-co-cr/enlace-juvenil.png",
      description: "Radio Juvenil Cristiana",
      song: "",
    },
    {
      id: "influencia",
      name: streamInfo.title,
      streamUrl:
        "https://gruponovaradial.azuracast.com.es/listen/influencia_positiva_radio_/radio.mp3",
      logo: "https://cdn.instant.audio/images/logos/radios-co-cr/influencia-positiva.png",
      description: streamInfo.description,
      song: streamInfo.currentSong,
    },
  ];

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const fetchedTracks = await fetchAudioTracks();
        setPlaylist(fetchedTracks);
      } catch (err) {
        setError("Error loading tracks");
        console.error("Error loading tracks:", err);
      }
    };
    loadTracks();
  }, []);

  const fetchAudioTracks = async () => {
    try {
      const { data: audioTracks, error } = await supabase.storage
        .from("idec-public")
        .list("playlistMusic/");

      if (error) throw error;

      return audioTracks.map((file) => ({
        id: file.id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        album: "Unknown Album",
        cover:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        audio: `https://janbrtgwtomzffqqcmfo.supabase.co/storage/v1/object/public/idec-public/playlistMusic/${encodeURIComponent(
          file.name
        )}`,
        lyrics: "",
        bytes: `${(file.metadata.size / (1024 * 1024)).toFixed(2)} MB`,
        updated_at: file.updated_at,
      }));
    } catch (err) {
      console.error("Error fetching tracks:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const playAudio = async () => {
      try {
        if (isPlaying) {
          await audioRef.current?.play();
        } else {
          audioRef.current?.pause();
        }
      } catch (err) {
        console.error("Playback error:", err);
        setError("Error playing audio");
        setIsPlaying(false);
      }
    };
    playAudio();
  }, [isPlaying, currentSong, activeRadio]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (!activeRadio && audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const playNextSong = () => {
    if (!activeRadio && currentSong && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song.id === currentSong.id
      );
      const nextIndex = isShuffle
        ? Math.floor(Math.random() * playlist.length)
        : (currentIndex + 1) % playlist.length;
      setCurrentSong(playlist[nextIndex]);
    }
  };

  const playPreviousSong = () => {
    if (!activeRadio && currentSong && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song.id === currentSong.id
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      setCurrentSong(playlist[previousIndex]);
    }
  };

  const selectSong = (song: Song) => {
    setCurrentSong(song);
    setActiveRadio(null);
    setIsPlaying(true);
  };

  const selectRadio = (station: RadioStation) => {
    setActiveRadio(station);
    setCurrentSong(null);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-custom text-white p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl glass-morphism rounded-xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Album Art / Radio Logo */}
          <div className="w-full md:w-1/3">
            <div className="relative aspect-square rounded-lg overflow-hidden hover-scale">
              <img
                src={
                  activeRadio?.logo ||
                  currentSong?.cover ||
                  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop"
                }
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gradient truncate">
                {activeRadio?.name || currentSong?.title || "Select a track"}
              </h2>
              <p className="text-gray-400">
                {activeRadio?.description || currentSong?.artist || "No artist"}
              </p>
            </div>

            {/* Progress Bar */}
            {!activeRadio && (
              <div className="my-4">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 my-4">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                  isShuffle ? "text-purple-400" : ""
                }`}
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={playPreviousSong}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                disabled={!!activeRadio}
              >
                <SkipBack size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="p-4 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors hover-scale"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button
                onClick={playNextSong}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                disabled={!!activeRadio}
              >
                <SkipForward size={24} />
              </button>
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                  isRepeat ? "text-purple-400" : ""
                }`}
              >
                <Repeat size={20} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="w-32"
              />
            </div>
          </div>
        </div>

        {/* Playlist & Radio Toggles */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => {
              setShowPlaylist(!showPlaylist);
              setShowRadioList(false);
            }}
            className="flex items-center gap-2 px-4 py-2 glass-morphism rounded-full hover:bg-white/20 transition-colors"
          >
            <Music size={20} />
            <span>Playlist</span>
          </button>
          <button
            onClick={() => {
              setShowRadioList(!showRadioList);
              setShowPlaylist(false);
            }}
            className="flex items-center gap-2 px-4 py-2 glass-morphism rounded-full hover:bg-white/20 transition-colors"
          >
            <Radio size={20} />
            <span>Radio</span>
          </button>
        </div>

        {/* Lists */}
        <ScrollArea
          className={`mt-4 h-60 rounded-lg ${
            !showPlaylist && !showRadioList ? "hidden" : ""
          }`}
        >
          {showPlaylist && (
            <div className="space-y-2 p-4">
              {playlist.map((song) => (
                <button
                  key={song.id}
                  onClick={() => selectSong(song)}
                  className={`w-full flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors ${
                    currentSong?.id === song.id ? "bg-purple-600/20" : ""
                  }`}
                >
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium truncate">{song.title}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {song.artist}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{song.bytes}</div>
                </button>
              ))}
            </div>
          )}
          {showRadioList && (
            <div className="space-y-2 p-4">
              {RADIO_STATIONS.map((station) => (
                <button
                  key={station.id}
                  onClick={() => selectRadio(station)}
                  className={`w-full flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors ${
                    activeRadio?.id === station.id ? "bg-purple-600/20" : ""
                  }`}
                >
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{station.name}</div>
                    <div className="text-sm text-gray-400">
                      {station.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <audio
        ref={audioRef}
        src={activeRadio?.streamUrl || currentSong?.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNextSong}
        onError={() => setError("Error playing media")}
      />

      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default FacebookStyleMusicPlayer;
