// Interfaces de los post en Dashboard y Profile
export interface PostTypes {
    id: string; // ID del post
    url: string; // URL pública del archivo (imagen o video)
    fileType: 'image' | 'video'; // Tipo de archivo
    description: string; // Descripción o contenido del post (si aplica)
    createdAt: string; // Fecha de creación
    likes: number; // Número de likes
    slug: string; // Slug único (si lo usas para SEO o rutas)
    profile: {
      id: string; // ID del usuario asociado al perfil
      avatar_url: string | null; // URL del avatar del usuario
      display_name: string; // Nombre para mostrar del usuario
      portada_url: string | null; // URL de la portada del usuario
    };
  }
  
//Obtengo los Types de los comentarios
export interface Comment {
    id: string
    content: string
    user_id: string
    post_id: string
    created_at: string
    likes: number
    avatar_url: string
    username: string

}

export interface UserType {
    user_id: string
    avatarUrl: string
    email: string
    nameUser: string
}

export interface SharedPost {
    id: string;
    url: string;
    description: string;
    created_at: string;
    avatarUrl: string | null;
    nameUser: string;
    slug: string;
    likes: number;
    comments: number;
}