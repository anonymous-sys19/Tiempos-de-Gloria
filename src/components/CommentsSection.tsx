import  { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, Trash2 } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/hooks/userAuth';
import { toast } from '@/hooks/use-toast';

interface Comment {
    id: string;
    content: string;
    user_id: string;
    post_id: string;
    created_at: string;
    likes: number; // Asegúrate de que esto esté aquí
    avatar_url: string;
    username: string;
}

const CommentsSection = ({ postId }: { postId: string }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // Función para obtener comentarios
    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
            return;
        }

        // Obtener likes de los comentarios para el usuario actual
        const { data: likedCommentsData, error: likesError } = await supabase
            .from('comments_liked')
            .select('comment_id')
            .eq('user_id', user?.id);

        if (likesError) {
            console.error("Error fetching liked comments:", likesError);
            return;
        }

        const likedCommentIds = new Set<string>(likedCommentsData.map(({ comment_id }) => comment_id));

        const commentsWithLikes = await Promise.all(
            (data as Comment[]).map(async (comment) => {
                const { data: likesData, error: likesError } = await supabase
                    .from('comments_liked')
                    .select('comment_id')
                    .eq('comment_id', comment.id);

                const likesCount = likesError ? 0 : likesData?.length || 0; // Contar likes
                return { ...comment, likes: likesCount };
            })
        );

        setComments(commentsWithLikes);
        setLikedComments(likedCommentIds); // Actualizar el estado de likedComments
    };

    // Función para manejar likes en los comentarios
    const handleLikeComment = async (commentId: string) => {
        const isLiked = likedComments.has(commentId); // Verifica si el comentario ya fue "likeado"

        try {
            if (isLiked) {
                // Eliminar el like
                const { error } = await supabase
                    .from('comments_liked')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user?.id);
                if (error) throw error;

                // Actualiza el estado de likes
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId ? { ...comment, likes: (comment.likes || 0) - 1 } : comment
                    )
                );

                // Actualiza el estado de likedComments
                const updatedLikedComments = new Set(likedComments);
                updatedLikedComments.delete(commentId);
                setLikedComments(updatedLikedComments); // Actualiza el estado de likedComments

                toast({ title: "Like retirado", description: "Ya no te gusta este comentario" });
            } else {
                // Agregar el like
                const { error } = await supabase
                    .from('comments_liked')
                    .insert([{ comment_id: commentId, user_id: user?.id, avatar_url: user?.user_metadata.avatar_url, username: user?.user_metadata.name }]);
                if (error) throw error;

                // Actualiza el estado de likes
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
                    )
                );

                // Actualiza el estado de likedComments
                const updatedLikedComments = new Set(likedComments);
                updatedLikedComments.add(commentId);
                setLikedComments(updatedLikedComments); // Actualiza el estado de likedComments

                toast({ title: "Like agregado", description: "Te gusta este comentario" });
            }
        } catch (error) {
            console.error("Error updating comment like:", error);
            toast({ title: "Error", description: "No se pudo actualizar el estado del like" });
        }
    };

    // Función para agregar un nuevo comentario
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([{ content: newComment, user_id: user?.id, post_id: postId, avatar_url: user?.user_metadata.avatar_url, username: user?.user_metadata.name }])
                .select()
                .single();

            if (error) throw error;

            const newCommentWithLikes = { ...data, likes: 0 }; // Inicializa likes en 0
            setComments((prev) => [...prev, newCommentWithLikes]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar un comentario
    const handleDeleteComment = async (commentId: string) => {
        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId)
                .eq('user_id', user?.id);

            if (error) throw error;

            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            const updatedLikedComments = new Set(likedComments);
            updatedLikedComments.delete(commentId);
            setLikedComments(updatedLikedComments);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="mt-6 space-y-4">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Comentarios</h4>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500"
          />
          <Button onClick={handleAddComment} disabled={!newComment.trim() || loading}>
            Publicar
          </Button>
        </div>
      
        <div className="mt-4 max-h-60 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 shadow-sm">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out border border-gray-200 dark:border-gray-600">
                <img
                  src={comment.avatar_url || '/default-avatar.png'}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{comment.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.created_at)}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <Button
                      variant="ghost"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 ${likedComments.has(comment.id) ? 'text-blue-500' : ''}`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes || 0}</span>
                    </Button>
                    {comment.user_id === user?.id && (
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Sin Comentarios</p>
          )}
        </div>
        
        {/* Estilo adicional para ocultar la barra de desplazamiento */}
        <style >{`
          .overflow-y-auto::-webkit-scrollbar {
            display: none; /* Ocultar barra de desplazamiento en navegadores WebKit */
          }
      
          .overflow-y-auto {
            -ms-overflow-style: none; /* Ocultar barra de desplazamiento en Internet Explorer y Edge */
            scrollbar-width: none; /* Ocultar barra de desplazamiento en Firefox */
          }
        `}</style>
      </div>
      
    );
};

// Formato de tiempo
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `hace ${years} año${years > 1 ? 's' : ''}`;
    if (months > 0) return `hace ${months} mes${months > 1 ? 'es' : ''}`;
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} h${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'hace unos segundos';
};

export default CommentsSection;