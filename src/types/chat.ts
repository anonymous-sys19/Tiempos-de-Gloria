// Tipos para el chat
export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface MediaFile {
  id: number;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  name: string;
  size: number;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: Date;
  replyTo?: number; // ID del mensaje al que responde
  deleted?: boolean; // Indica si el mensaje fue eliminado
  deletedFor?: number[]; // IDs de usuarios para los que el mensaje está eliminado
  media?: MediaFile[]; // Archivos multimedia adjuntos
}

// Mock de datos - Fácil de reemplazar con datos reales de Supabase
export const mockUsers: User[] = [
  { id: 1, name: "Alice", avatar: "https://github.com/nutlope.png" },
  { id: 2, name: "Beta", avatar: "https://github.com/shadcn.png" },
  { id: 3, name: "Charlie", avatar: "https://github.com/lee-robinson.png" },
];

export const mockMessages: Message[] = [
  { 
    id: 1, 
    senderId: 1, 
    text: "¡Hola! ¿Cómo estás?",
    timestamp: new Date()
  },
  { 
    id: 2, 
    senderId: 2, 
    text: "¡Todo bien! ¿Y tú?",
    timestamp: new Date()
  },
];