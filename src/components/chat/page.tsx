import { useState, useEffect } from "react";
import { User, Message, mockUsers, mockMessages } from "@/types/chat";
import { UserList } from "@/components/chat/UserList";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const MAX_MESSAGES = 60; // Máximo número de mensajes a mantener

// Componente principal del chat
export default function App() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [activeUser, setActiveUser] = useState<User>(mockUsers[1]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Limpia mensajes antiguos cuando se supera el límite
  useEffect(() => {
    if (messages.length > MAX_MESSAGES) {
      const messagesToKeep = messages.slice(-MAX_MESSAGES);
      setMessages(messagesToKeep);
    }
  }, [messages]);

  // Simula respuestas automáticas
  useEffect(() => {
    if (messages[messages.length - 1]?.senderId === currentUser.id) {
      const timer = setTimeout(() => {
        const newMessage: Message = {
          id: Date.now(),
          senderId: activeUser.id,
          text: `Respuesta automática de ${activeUser.name}`,
          timestamp: new Date(),
          replyTo: replyingTo?.id, // Mantiene el contexto de la respuesta
        };
        setMessages((prev) => [...prev, newMessage]);
        setReplyingTo(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, activeUser, currentUser, replyingTo]);

  const handleSendMessage = async (text: string, files?: File[]) => {
    // Aquí iría la lógica para subir archivos a Supabase Storage
    let mediaFiles: string | any[] | undefined = [];
    
    if (files && files.length > 0) {
      // Ejemplo de cómo sería con Supabase:
      /*
      mediaFiles = await Promise.all(files.map(async (file) => {
        const { data, error } = await supabase.storage
          .from('chat-files')
          .upload(`${Date.now()}-${file.name}`, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('chat-files')
          .getPublicUrl(data.path);
          
        return {
          id: Date.now(),
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          name: file.name,
          size: file.size
        };
      }));
      */
      
      // Por ahora, creamos URLs temporales
      mediaFiles = files.map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' as const : 
              file.type.startsWith('video/') ? 'video' as const : 'document' as const,
        name: file.name,
        size: file.size
      }));
    }

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      replyTo: replyingTo?.id,
      media: mediaFiles.length > 0 ? mediaFiles : undefined
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setReplyingTo(null);
  };

  const handleReply = (messageId: number) => {
    const messageToReply = messages.find(m => m.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageToReply);
    }
  };

  const handleDelete = (messageId: number, deleteForAll: boolean) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        if (deleteForAll) {
          return { ...message, deleted: true };
        } else {
          return {
            ...message,
            deletedFor: [...(message.deletedFor || []), currentUser.id]
          };
        }
      }
      return message;
    }));
  };

  const handleUserSwitch = (user: User) => {
    if (user.id !== currentUser.id) {
      setActiveUser(user);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleCurrentUserSwitch = () => {
    const nextUser = mockUsers.find(u => u.id !== currentUser.id) || mockUsers[0];
    setCurrentUser(nextUser);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Lista de usuarios */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-20
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-200 ease-in-out
        w-72 bg-white border-r border-gray-200
      `}>
        <UserList 
          users={mockUsers} 
          activeUser={activeUser} 
          onUserSelect={handleUserSwitch}
        />
      </div>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Área principal del chat */}
      <div className="flex-1 flex flex-col w-full bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={activeUser.avatar} alt={activeUser.name} />
                <AvatarFallback>{activeUser.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium">{activeUser.name}</h3>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleCurrentUserSwitch}
            className="text-sm"
          >
            Cambiar a: {mockUsers.find(u => u.id !== currentUser.id)?.name}
          </Button>
        </div>

        {/* Barra de respuesta */}
        {replyingTo && (
          <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Respondiendo a:</span>
                <p className="text-gray-500 truncate">{replyingTo.text}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setReplyingTo(null)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <MessageList 
          messages={messages} 
          currentUserId={currentUser.id}
          users={mockUsers}
          onReply={handleReply}
          onDelete={handleDelete}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          replyingTo={replyingTo}
        />
      </div>
    </div>
  );
}