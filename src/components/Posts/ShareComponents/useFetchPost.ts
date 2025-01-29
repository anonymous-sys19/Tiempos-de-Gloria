/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { SharedPost } from '@/types/postTypes/posts';

// export const useFetchPost = (slug: string | undefined, toast: any, navigate: any) => {
//     const [post, setPost] = useState<SharedPost | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
//     const [isImageModalOpen, setIsImageModalOpen] = useState(false);

//     const shareUrl = `${window.location.origin}/post/${post?.slug}`;

//     useEffect(() => {
//         const fetchPost = async () => {
//             if (!slug) {
//                 toast({
//                     title: "Error",
//                     description: "No se pudo encontrar la publicación.",
//                     variant: "destructive",
//                 });
//                 navigate('/');
//                 return;
//             }

//             setIsLoading(true);

//             const { data, error } = await supabase
//                 .from("idectableimages")
//                 .select('*')
//                 .eq('slug', slug)
//                 .single();

//             if (error) {
//                 toast({
//                     title: "Error",
//                     description: "No se pudo cargar la publicación.",
//                     variant: "destructive",
//                 });
//                 navigate('/');
//             } else if (data) {
//                 setPost({
//                     ...data,
//                     likes: data.likes || 10,
//                     comments: data.comments || 2,
//                 } as SharedPost);
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "La publicación no existe.",
//                     variant: "destructive",
//                 });
//                 navigate('/');
//             }

//             setIsLoading(false);
//         };

//         fetchPost();
//     }, [slug, navigate, toast]);

//     return { post, isLoading, isShareDialogOpen, setIsShareDialogOpen, isImageModalOpen, setIsImageModalOpen, shareUrl };
// };


import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // Ajusta según tu configuración de Supabase

interface Comment {
    id: string;
    avatarUrl: string;
    nameUser: string;
    content: string;
    created_at: string;
}

interface Post {
    id: string;
    avatarUrl: string;
    nameUser: string;
    description: string;
    url: string;
    created_at: string;
    likes: number;
    comments: number;
}

export const useFetchPost = (slug?: string) => {
    // const supabase = useSupabaseClient();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [newComment, setNewComment] = useState("");
    const [hasLiked, setHasLiked] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);

                // Obtener detalles del post
                const { data: postData, error: postError } = await supabase
                    .from("idectableimages")
                    .select("*")
                    .eq("slug", slug) // Asegúrate de que `slug` sea único
                    .single();

                if (postError) throw postError;

                setPost(postData);

                // Obtener comentarios relacionados
                const { data: commentData, error: commentError } = await supabase
                    .from("comments")
                    .select("*")
                    .eq("post_id", slug)
                    .order("created_at", { ascending: false });

                if (commentError) throw commentError;

                setComments(commentData);

                // URL para compartir
                setShareUrl(window.location.href);
            } catch (error) {
                console.log(error);

            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();

        // Obtener detalles del usuario actual (si aplica)
        const fetchUser = async () => {
            const { data: userData } = await supabase.auth.getUser();
            setUser(userData?.user);
        };

        fetchUser();
    }, [slug, supabase]);

    const handleLike = async () => {
        if (!post) return;

        try {
            const newLikes = hasLiked ? post.likes - 1 : post.likes + 1;

            const { error } = await supabase
                .from("posts")
                .update({ likes: newLikes })
                .eq("id", post.id);

            if (error) throw error;

            setPost((prevPost) => (prevPost ? { ...prevPost, likes: newLikes } : null));
            setHasLiked(!hasLiked);
        } catch {
            console.log("");

        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim() || !post) return;

        try {
            const { data: newCommentData, error } = await supabase
                .from("comments")
                .insert({
                    post_id: post.id,
                    content: newComment,
                    avatarUrl: user?.user_metadata.avatar_url,
                    nameUser: user?.user_metadata.name,
                })
                .select("*")
                .single();

            if (error) throw error;

            setComments((prevComments) => [newCommentData, ...prevComments]);
            setNewComment("");
            setPost((prevPost) => (prevPost ? { ...prevPost, comments: prevPost.comments + 1 } : null));
        } catch {
            console.log("");

        }
    };

    const handleShare = (method: "copy" | "whatsapp") => {
        switch (method) {
            case "copy":
                navigator.clipboard.writeText(shareUrl);
                console.log("");

                break;
            case "whatsapp":
                { const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
                window.open(whatsappUrl, "_blank");
                break; }
            default:
                break;
        }
    };

    return {
        post,
        comments,
        isLoading,
        user,
        newComment,
        setNewComment,
        hasLiked,
        isShareDialogOpen,
        setIsShareDialogOpen,
        shareUrl,
        handleLike,
        handleComment,
        handleShare,
    };
};
