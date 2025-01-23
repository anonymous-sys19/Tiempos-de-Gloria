export interface MediaPost {
    id: string;
    url: string;
    description: string;
    user_id: string;
    email: string;
    nameUser: string;
    avatarUrl: string | null;
    hashtags: string;
    slug: string;
    created_at: string;
    likes: number;
}

export interface MediaFile extends File {
    preview: string;
    isVideo: boolean;
}

