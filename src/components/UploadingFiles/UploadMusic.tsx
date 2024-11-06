import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Check, Music, Play, Pause, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast'; // Corregido: Importación de useToast

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3'];

export default function UploadForm() {
  const [files, setFiles] = useState<Array<{
    file: File;
    id: number;
    title: string;
    artist: string;
    error?: string;
  }>>([]);
  const [currentTrack, setCurrentTrack] = useState<typeof files[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileChange(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).map((file, index) => {
      let error;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        error = 'Tipo de archivo no soportado';
      } else if (file.size > MAX_FILE_SIZE) {
        error = 'El archivo excede el tamaño máximo permitido';
      }
      return {
        file,
        id: Date.now() + index,
        title: file.name.split('.').slice(0, -1).join('.'),
        artist: '',
        error,
      };
    });
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: number) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    if (currentTrack?.id === id) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const handleInputChange = useCallback((id: number, field: 'title' | 'artist', value: string) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === id ? { ...file, [field]: value } : file
      )
    );
  }, []);

  const selectTrack = useCallback((track: typeof files[0]) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(track.file);
      audioRef.current.load();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Error",
            description: "No se pudo reproducir el audio. Por favor, intente de nuevo.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, toast]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const seekPosition = e.nativeEvent.offsetX / progressRef.current.offsetWidth;
      audioRef.current.currentTime = seekPosition * audioRef.current.duration;
    }
  }, []);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsUploading(true);
    // Aquí iría la lógica para subir los archivos
    // Por ahora, simularemos una carga exitosa después de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setUploadSuccess(true);
    toast({
      title: "Éxito",
      description: "Archivos subidos correctamente",
    });
  }, [toast]);

  const validFiles = files.filter(file => !file.error);

  useEffect(() => {
    if (files.length > 0 && !currentTrack) {
      setCurrentTrack(files[0]);
    }
  }, [files, currentTrack]);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="container mx-auto p-2 sm:p-4 flex flex-col h-screen max-h-screen">
        <Card className="flex-1 bg-white shadow-lg flex flex-col overflow-hidden">
          {/* Header Section */}
          <div className="p-3 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B74E4]">Subir música</h2>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isUploading || uploadSuccess || validFiles.length === 0}
                className={cn(
                  "w-full sm:w-auto bg-[#1B74E4] hover:bg-[#1B74E4]/90 min-w-[160px]",
                  (isUploading || uploadSuccess || validFiles.length === 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subiendo...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check className="-ml-1 mr-2 h-5 w-5" />
                    ¡Subido con éxito!
                  </>
                ) : (
                  <>
                    <Music className="-ml-1 mr-2 h-5 w-5" />
                    Subir ({validFiles.length})
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 sm:p-6 overflow-hidden">
            {/* Left Column - Upload Area & File List */}
            <div className="flex-1 flex flex-col min-w-0 order-2 lg:order-1">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "relative border-2 border-dashed rounded-lg transition-all duration-200 mb-4",
                  isDragging ? "border-[#1B74E4] bg-blue-50" : "border-gray-300 hover:border-[#1B74E4]"
                )}
              >
                <label htmlFor="file" className="flex flex-col items-center justify-center h-24 sm:h-32 cursor-pointer">
                  <Upload className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 transition-colors duration-200",
                    isDragging ? "text-[#1B74E4]" : "text-gray-400"
                  )} />
                  <p className="mb-1 sm:mb-2 text-sm text-gray-600 text-center px-4">
                    <span className="font-semibold text-[#1B74E4]">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">MP3, WAV (MAX. 30MB por archivo)</p>
                </label>
                <input
                  id="file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e.target.files || [])}
                  className="hidden"
                  multiple
                />
              </div>

              {files.length > 0 && (
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Canciones seleccionadas ({files.length})
                  </h3>
                  <ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-320px)]">
                    <div className="space-y-3 pr-4">
                      {files.map((file) => (
                        <Card key={file.id} className={cn(
                          "p-3 sm:p-4",
                          file.error ? "bg-red-50" : "hover:shadow-md transition-shadow duration-200",
                          currentTrack?.id === file.id && "ring-2 ring-[#1B74E4] ring-opacity-50"
                        )}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <Music className={cn(
                                "w-5 h-5 flex-shrink-0",
                                currentTrack?.id === file.id ? "text-[#1B74E4]" : "text-gray-400"
                              )} />
                              <button
                                type="button"
                                onClick={() => !file.error && selectTrack(file)}
                                className={cn(
                                  "font-medium truncate text-left",
                                  file.error ? "text-red-600" : "text-[#1B74E4] hover:underline"
                                )}
                              >
                                {file.file.name}
                              </button>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-2"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>

                          {file.error ? (
                            <div className="flex items-center space-x-2 text-red-600 text-sm mb-3">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>{file.error}</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <Input
                                  type="text"
                                  value={file.title}
                                  onChange={(e) => handleInputChange(file.id, 'title', e.target.value)}
                                  className="bg-gray-50"
                                  placeholder="Título de la canción"
                                />
                              </div>
                              <div>
                                <Input
                                  type="text"
                                  value={file.artist}
                                  onChange={(e) => handleInputChange(file.id, 'artist', e.target.value)}
                                  className="bg-gray-50"
                                  placeholder="Nombre del artista"
                                />
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Right Column - Player */}
            {currentTrack && !currentTrack.error && (
              <div className="lg:w-80 flex-shrink-0 order-1 lg:order-2">
                <Card className="p-4 bg-gradient-to-r from-[#1B74E4]/5 to-[#1B74E4]/10 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 truncate">
                    {currentTrack.title || currentTrack.file.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      
                      type="button"
                      onClick={togglePlay}
                      variant="default"
                      className="bg-[#1B74E4] hover:bg-[#1B74E4]/90"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div
                    ref={progressRef}
                    onClick={handleSeek}
                    className="h-2 bg-gray-200 rounded-full cursor-pointer"
                  >
                    <div
                      className="h-2 bg-[#1B74E4] rounded-full transition-all duration-100"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  {currentTrack.artist && (
                    <p className="mt-2 text-sm text-gray-600 truncate">
                      Artista: {currentTrack.artist}
                    </p>
                  )}
                </Card>
              </div>
            )}
          </div>
        </Card>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}