
import React, { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ThumbsUp, MessageCircle, Share2, Send, MoreHorizontal, Copy, Globe, Trash2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { supabase } from '@/supabaseClient'
import { useAuth } from '@/hooks/userAuth'
import TextoConNegritaAutomatica from './NegritaComponents'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/utils/utils-format'
import { PostTypes, Comment } from '@/types/postTypes/posts'
import { AnimatePresence, motion } from 'framer-motion'
import { MediaViewer } from './ClipPost/MediaViewer'


export const Post = React.memo(({ post, onUserClick }: { post: PostTypes; onUserClick: (userId: string) => void }) => {
    const { user } = useAuth()
    const shareUrl = `${window.location.origin}/post/${post?.slug}`
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [likesCount, setLikesCount] = useState(post.likes || 0)
    const [hasLiked, setHasLiked] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [commentCount, setCommentCount] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
    const commentsEndRef = useRef<HTMLDivElement>(null)

    const renderMedia = () => {
        if (!post.url) {
            console.warn('No hay URL para el post.');
            return null; // Si no hay URL, no renderiza nada.
        }

        // Validamos explícitamente si el tipo de archivo es válido
        if (post.fileType === 'video') {
            return (
                
                    <MediaViewer post={post} />
               

            );
        } else if (post.fileType === 'image') {
            // Si el tipo es imagen o está vacío, asumimos que es imagen por defecto
            return (
                <div className="media-container">
                    <img
                        src={post.url}
                        alt="Imagen de publicación"
                        className="media-content"
                        onClick={() => (window.location.href = shareUrl)}
                    />
                </div>
            );
        } else {
            console.warn(`Tipo de archivo no reconocido: ${post.fileType}`);
            return null; // Opcional: mostrar un mensaje de error o un marcador de posición.
        }
    };




    useEffect(() => {
        const checkUserLiked = async () => {

            const { data, error } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', user?.id)
                .maybeSingle()
            if (!error && data) setHasLiked(true)
        }
        checkUserLiked()
    }, [post.id, user?.id])

    useEffect(() => {
        const fetchCommentCount = async () => {
            const { count, error } = await supabase
                .from('comments')
                .select('id', { count: 'exact' })
                .eq('post_id', post.id)

            if (error) {
                console.error("Error fetching comment count:", error)
            } else {
                setCommentCount(count || 0)
            }
        }

        fetchCommentCount()
    }, [post.id])

    useEffect(() => {
        if (showComments) {
            fetchComments()
        }
    }, [showComments, post.id])

    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [comments])

    const fetchComments = async () => {

        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true })

        if (error) {
            console.error("Error fetching comments:", error)
            return
        }

        const { data: likedCommentsData, error: likesError } = await supabase
            .from('comments_liked')
            .select('comment_id')
            .eq('user_id', user?.id)

        if (likesError) {
            console.error("Error fetching liked comments:", likesError)
            return
        }

        const likedCommentIds = new Set<string>(likedCommentsData.map(({ comment_id }) => comment_id))

        const commentsWithLikes = await Promise.all(
            (data as Comment[]).map(async (comment) => {
                const { data: likesData, error: likesError } = await supabase
                    .from('comments_liked')
                    .select('comment_id')
                    .eq('comment_id', comment.id)

                const likesCount = likesError ? 0 : likesData?.length || 0
                return { ...comment, likes: likesCount }
            })
        )

        setComments(commentsWithLikes)
        setLikedComments(likedCommentIds)
    }

    const handleLikeToggle = async () => {
        if (!user) {
            toast({ title: "Inicia sesión", description: "Necesitas iniciar sesión para dar like" })
            return
        }
        try {
            if (hasLiked) {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', post.id)
                    .eq('user_id', user.id)
                if (!error) {
                    setLikesCount((prev) => prev - 1)
                    setHasLiked(false)
                    toast({ title: "Like retirado", description: "Ya no te gusta esta publicación" })
                }
            } else {
                const { error } = await supabase
                    .from('likes')
                    .insert([{ post_id: post.id, user_id: user.id }])
                if (!error) {
                    setLikesCount((prev) => prev + 1)
                    setHasLiked(true)
                    toast({ title: "Like agregado", description: "Te gusta esta publicación" })
                }
            }
        } catch {
            toast({ title: "Error", description: "No se pudo actualizar el estado del like" })
        }
    }

    const handleShare = (platform: 'whatsapp' | 'copy') => {
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`¡Mira esta publicación! ${shareUrl}`)}`, '_blank')
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(shareUrl)
            toast({
                title: "Enlace copiado",
                description: "El enlace ha sido copiado al portapapeles.",
            })
        }
    }

    const handleLikeComment = async (commentId: string) => {
        const isLiked = likedComments.has(commentId)

        try {
            if (isLiked) {
                const { error } = await supabase
                    .from('comments_liked')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user?.id)
                if (error) throw error

                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId ? { ...comment, likes: (comment.likes || 0) - 1 } : comment
                    )
                )

                const updatedLikedComments = new Set(likedComments)
                updatedLikedComments.delete(commentId)
                setLikedComments(updatedLikedComments)

                toast({ title: "Like retirado", description: "Ya no te gusta este comentario" })
            } else {
                const { error } = await supabase
                    .from('comments_liked')
                    .insert([{ comment_id: commentId, user_id: user?.id, avatar_url: user?.user_metadata.avatar_url, username: user?.user_metadata.name }])
                if (error) throw error

                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
                    )
                )

                const updatedLikedComments = new Set(likedComments)
                updatedLikedComments.add(commentId)
                setLikedComments(updatedLikedComments)

                toast({ title: "Like agregado", description: "Te gusta este comentario" })
            }
        } catch (error) {
            console.error("Error updating comment like:", error)
            toast({ title: "Error", description: "No se pudo actualizar el estado del like" })
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([{ content: newComment, user_id: user?.id, post_id: post.id, avatar_url: user?.user_metadata.avatar_url, username: user?.user_metadata.name }])
                .select()
                .single()

            if (error) throw error

            const newCommentWithLikes = { ...data, likes: 0 }
            setComments((prev) => [...prev, newCommentWithLikes])
            setNewComment('')
            setCommentCount((prevCount) => prevCount + 1)
        } catch (error) {
            console.error("Error adding comment:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId)
                .eq('user_id', user?.id)

            if (error) throw error

            setComments((prev) => prev.filter((comment) => comment.id !== commentId))
            const updatedLikedComments = new Set(likedComments)
            updatedLikedComments.delete(commentId)
            setLikedComments(updatedLikedComments)
            setCommentCount((prevCount) => prevCount - 1)
        } catch (error) {
            console.error("Error deleting comment:", error)
        }
    }
    // const getInitials = (name: string): string => name.split(' ').map((word) => word[0]).join('').toUpperCase()
    const getInitials = (name?: string): string => {
        if (!name || typeof name !== 'string') return '??'; // Valor predeterminado
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    };




    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000) // Simula una carga de 1 segundos

        return () => clearTimeout(timer)
    }, [])


    if (loading) {
        return (

            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-[200px] mt-4" />
                    <Skeleton className="h-64 w-full mt-4" />
                </CardContent>
            </Card>

        )
    }

    if (!post) return null;

    return (
        <div className="flex justify-center items-start  bg-gray-100 p-4">
            <Card className="w-full max-w-3xl bg-white shadow-md rounded-lg">
                <CardContent className="p-4 space-y-4">
                    {/* Header del Post */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => onUserClick(post.uid)}>
                                <AvatarImage src={post.avatar_url || ''} alt={post.name_Username} />
                                <AvatarFallback>{getInitials(post.name_Username)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2
                                    className="text-lg font-semibold cursor-pointer hover:underline"
                                    onClick={() => onUserClick(post.uid)}
                                >
                                    {post.name_Username}
                                </h2>
                                <div className="flex items-center text-sm text-gray-500 space-x-1">
                                    <span>{formatDate(post.createdAt)}</span>
                                    <span>·</span>
                                    <Globe className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Editar publicación</DropdownMenuItem>
                                <DropdownMenuItem>Eliminar publicación</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Contenido del Post */}
                    <p className="text-base mb-4 text-gray-800">
                        <TextoConNegritaAutomatica>{post.description}</TextoConNegritaAutomatica>
                    </p>
                </CardContent>
                {renderMedia()}

                {/* Footer del Post */}
                <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4" />
                            <span
                                className={`${likesCount === 1 ? 'text-yellow-500' : likesCount === 0 ? 'text-blue-500' : ''
                                    }`}
                            >
                                {likesCount > 0
                                    ? `${likesCount} Me gusta${likesCount === 1 ? '' : ''}`
                                    : ''}
                            </span>
                        </div>
                        <div>
                            <span
                                className={`${commentCount === 1 ? 'text-yellow-500' : commentCount === 0 ? 'text-blue-500' : ''
                                    }`}
                            >
                                {commentCount > 0
                                    ? `${commentCount} Comentarios ${commentCount === 1 ? '' : ''}`
                                    : ''}
                            </span>
                        </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            className={`flex-1 ${hasLiked ? 'text-blue-500' : ''}`}
                            onClick={handleLikeToggle}
                        >
                            <ThumbsUp className={`mr-2 h-4 w-4 ${hasLiked ? 'fill-current text-blue-500' : ''}`} />
                            {hasLiked ? 'Te gusta' : 'Me gusta'}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" /> Comentar
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsShareDialogOpen(true)}
                        >
                            <Share2 className="mr-2 h-4 w-4" /> Compartir
                        </Button>
                    </div>
                </div>

                {/* Comentarios */}
                {showComments && (
                    <CardContent className="p-6">

                        <ScrollArea className="h-[200px] w-full pr-4">
                            <AnimatePresence>
                                {comments.map((comment) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95, rotate: 10 }}
                                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, y: -20, scale: 1.05, rotate: -10 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut",
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 25
                                        }}
                                        className="mb-6 relative transform"
                                    >
                                        <div key={comment.id} className="flex items-start space-x-2 mb-4">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={comment.avatar_url} alt={comment.username} />
                                                <AvatarFallback>{getInitials(comment.username)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-muted p-3 rounded-lg">
                                                <p
                                                    className="text-lg font-semibold cursor-pointer hover:underline"
                                                    onClick={() => onUserClick(comment.user_id)}
                                                >
                                                    {comment.username}
                                                </p>
                                                <p className="mt-1 text-gray-800">
                                                    <TextoConNegritaAutomatica>{comment.content}</TextoConNegritaAutomatica>
                                                </p>
                                                <div className="flex items-center justify-end mt-2 space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleLikeComment(comment.id)}
                                                        className={`rounded-full ${comment.likes > 0 ? 'text-blue-500' : ''}`}
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                                        <span>{comment.likes || 0}</span>
                                                    </Button>
                                                    {comment.user_id === user?.id && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-red-500 rounded-full"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollArea>
                        <CardFooter className="mt-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddComment();
                                }}
                                className="flex items-center w-full space-x-2"
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                                    <AvatarFallback>{getInitials(user?.user_metadata.name)}</AvatarFallback>
                                </Avatar>
                                <Input
                                    placeholder={`Comentar como ${user?.user_metadata.name}`}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 rounded-full bg-gray-100"
                                />
                                <Button
                                    className="rounded-full"
                                    variant="outline"
                                    type="submit"
                                    size="sm"
                                    disabled={!newComment.trim() || loading}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </CardContent>
                )}

                {/* Compartir Dialog */}
                <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Compartir publicación</DialogTitle>
                            <DialogDescription>Elige cómo deseas compartir esta publicación</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-4">
                            <Input value={shareUrl} readOnly />
                            <div className="flex space-x-2">
                                <Button className="flex-1" variant="outline" onClick={() => handleShare('copy')}>
                                    <Copy className="mr-2 h-4 w-4" /> Copiar enlace
                                </Button>
                                <Button className="flex-1" variant="outline" onClick={() => handleShare('whatsapp')}>
                                    <MessageCircle className="mr-2 h-4 w-4" /> Compartir en WhatsApp
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>

    )
})

export default Post