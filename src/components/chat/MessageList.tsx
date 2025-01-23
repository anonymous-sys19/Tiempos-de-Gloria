import { useRef, useEffect } from "react";
import { Message, User, MediaFile } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {  Reply, Trash, Download, CircleChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  users: User[];
  onReply: (messageId: number) => void;
  onDelete: (messageId: number, deleteForAll: boolean) => void;
}

export const MessageList = ({ 
  messages, 
  currentUserId, 
  users,
  onReply,
  onDelete 
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para obtener el mensaje referenciado
  const getReplyMessage = (replyId?: number) => {
    if (!replyId) return null;
    return messages.find(m => m.id === replyId);
  };

  // Función para obtener el nombre del usuario
  const getUserName = (userId: number) => {
    return users.find(u => u.id === userId)?.name || 'Usuario';
  };

  // Función para renderizar archivos multimedia
  const renderMedia = (media: MediaFile[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {media.map((file) => {
          switch (file.type) {
            case 'image':
              return (
                <div key={file.id} className="relative group">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-w-[200px] max-h-[200px] rounded object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              );
            case 'video':
              return (
                <div key={file.id} className="relative group">
                  <video
                    src={file.url}
                    controls
                    className="max-w-[200px] rounded"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              );
            default:
              return (
                <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              );
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          const replyMessage = getReplyMessage(message.replyTo);
          
          // Si el mensaje está eliminado para el usuario actual
          if (message.deletedFor?.includes(currentUserId)) {
            return null;
          }

          return (
            <div
              key={message.id}
              className={`group flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="relative max-w-[80%]">
                {/* Mensaje referenciado */}
                {replyMessage && !replyMessage.deletedFor?.includes(currentUserId) && (
                  <div className={`text-xs p-2 rounded-t-lg ${
                    isCurrentUser ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                    <span className="font-bold">{getUserName(replyMessage.senderId)}</span>
                    <p className="opacity-75">{replyMessage.deleted ? "Mensaje eliminado" : replyMessage.text}</p>
                  </div>
                )}

                {/* Mensaje principal */}
                <div
                  className={`p-3 rounded-lg ${
                    message.deleted 
                      ? "bg-gray-100 italic text-gray-500" 
                      : isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text && (
                    <p className="break-words">
                      {message.deleted ? "Mensaje eliminado" : message.text}
                    </p>
                  )}
                  
                  {/* Renderizar archivos multimedia si existen */}
                  {message.media && !message.deleted && renderMedia(message.media)}
                  
                  <span className="text-xs opacity-70 block mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Menú de opciones */}
                {!message.deleted && (
                  <div className={`absolute top-0 ${
                    isCurrentUser ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                  } h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <CircleChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onReply(message.id)}>
                          <Reply className="h-4 w-4 mr-2" />
                          Responder
                        </DropdownMenuItem>
                        {isCurrentUser && (
                          <>
                            <DropdownMenuItem onClick={() => onDelete(message.id, false)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Eliminar para mí
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(message.id, true)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Eliminar para todos
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};