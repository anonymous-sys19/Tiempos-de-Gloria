/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types/chat";
import { Send, Smile, Paperclip, Image, Video, FileText, X } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSendMessage: (text: string, media?: File[]) => void;
  replyingTo: Message | null;
}

// Componente para el input de mensajes
export const MessageInput = ({ onSendMessage, replyingTo }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || selectedFiles.length > 0) {
      onSendMessage(message, selectedFiles);
      setMessage("");
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Cuando implementes con Supabase, aquí irían las validaciones de tamaño y tipo
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Función para obtener el tipo de archivo para el icono
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="p-4 border-t border-gray-200">
      {/* Previsualizacion de archivos */}
      {selectedFiles.length > 0 && (
        <div className="max-w-4xl mx-auto mb-2 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <div className="w-20 h-20 relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                  {getFileIcon(file)}
                  <span className="text-sm truncate max-w-[100px]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Selector de emojis */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-[40px] w-[40px]">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Picker 
              data={data} 
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              previewPosition="none"
            />
          </PopoverContent>
        </Popover>

        {/* Selector de archivos */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-[40px] w-[40px]">
              <Paperclip className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Image className="h-4 w-4 mr-2" />
              Imagen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Video className="h-4 w-4 mr-2" />
              Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <FileText className="h-4 w-4 mr-2" />
              Documento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
          // Cuando implementes con Supabase, ajusta los tipos de archivo permitidos
          accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={replyingTo ? "Escribe tu respuesta..." : "Escribe un mensaje..."}
          className="min-h-[40px] max-h-[120px]"
          rows={1}
        />
        
        <Button 
          onClick={handleSend}
          className="h-[40px] w-[40px] p-2"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};