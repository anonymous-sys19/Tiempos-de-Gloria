// Interfaces de los post en Dashboard y Profile
export interface PostTypes {
    likes: number;
    id: string;
    name: string;
    url: string;
    uid: string;
    description: string;
    createdAt: string;
    avatar_url: string | null;
    name_Username: string;
    slug: string;
    fileType: 'image' | 'video';
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