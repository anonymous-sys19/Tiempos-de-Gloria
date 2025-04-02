export interface Comentario {
    id: string;
    publicacionId: string;
    usuarioId: string;
    usuario: {
      nombre: string;
      avatar: string;
    };
    contenido: string;
    createdAt: string;
    likes: number;
    respuestas: Respuesta[];
  }
  
  export interface Respuesta {
    id: string;
    comentarioId: string;
    usuarioId: string;
    usuario: {
      nombre: string;
      avatar: string;
    };
    contenido: string;
    createdAt: string;
    likes: number;
}