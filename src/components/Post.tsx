
import React, { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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



interface Post {
    id: string
    name: string
    url: string
    uid: string
    description: string
    createdAt: string
    avatar_url: string | null
    name_Username: string
    slug: string
    likes: number
}

interface Comment {
    id: string
    content: string
    user_id: string
    post_id: string
    created_at: string
    likes: number
    avatar_url: string
    username: string
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `hace ${years} año${years > 1 ? 's' : ''}`
    if (months > 0) return `hace ${months} mes${months > 1 ? 'es' : ''}`
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} h${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'hace unos segundos'
}

export const Post = React.memo(({ post, onUserClick }: { post: Post; onUserClick: (userId: string) => void }) => {
    const { user } = useAuth()
    const shareUrl = `${window.location.origin}/post/${post?.slug}`
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [likesCount, setLikesCount] = useState(post.likes || 0)
    const [hasLiked, setHasLiked] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [commentCount, setCommentCount] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
    const commentsEndRef = useRef<HTMLDivElement>(null)

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
    const getInitials = (name: string): string => name.split(' ').map((word) => word[0]).join('').toUpperCase()


    return (
        <>

            <Card className="w-full max-w-2xl mx-auto mt-2 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 cursor-pointer" onClick={() => onUserClick(post.uid)}>
                            <AvatarImage src={post.avatar_url || ''} alt={post.name_Username} />
                            <AvatarFallback>{getInitials(post.name_Username)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => onUserClick(post.uid)}>
                                {post.name_Username}
                            </h2>
                            <p className="text-sm text-muted-foreground flex items-center space-x-1">
                                <span>{formatDate(post.createdAt)}</span>
                                <Globe className="w-3 h-3" />
                                <span>Público</span>
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Más opciones</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='bg-slate-900'>
                            <DropdownMenuItem>Editar publicación</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar publicación</DropdownMenuItem>
                            <DropdownMenuItem>Reportar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent>
                    <p className="text-base mb-4">
                        <TextoConNegritaAutomatica>{post.description}</TextoConNegritaAutomatica>
                    </p>
                    {post.url && (
                        <img
                            src={post.url}
                            alt="Publicación"
                            className="w-full h-auto rounded-lg object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                            onClick={() => window.location.href = shareUrl}
                        />
                    )}
                </CardContent>
                <CardContent className="flex flex-col space-y-4 p-2 bg-transparent">
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4" />

                            <span className={likesCount === 1 ? 'text-yellow-500' : likesCount === 0 ? 'text-blue-500' : ''}>
                                {likesCount > 0
                                    ? `${likesCount} Me gusta${likesCount === 1 ? ' - Primer Like' : ''}`
                                    : "Sé el primero en dar Me gusta"}
                            </span>


                        </div>
                        <div>
                            <span className={likesCount === 1 ? 'text-yellow-500' : commentCount === 0 ? 'text-blue-500' : ''}>
                                {commentCount > 0
                                    ? `${commentCount} Comentarios ${commentCount === 1 ? ' - Primer Comentario' : ''}`
                                    : "Sé el primero en Comentar"}
                            </span>

                        </div>
                    </div>
                    <Separator />
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            className={`flex-1 bg-transparent ${hasLiked ? 'text-blue-500' : ''}`}
                            onClick={handleLikeToggle}
                        >
                            <ThumbsUp className={`mr-2 h-4 w-4 ${hasLiked ? 'fill-current text-blue-500' : ''}`} />
                            {hasLiked ? 'Te gusta' : 'Me gusta'}
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowComments(!showComments)}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Comentar
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsShareDialogOpen(true)}>
                            <Share2 className="mr-2 h-4 w-4" /> Compartir
                        </Button>
                    </CardFooter>
                    {showComments && (
                        <>
                            <Card className=' dark:bg-gray-900'>
                                <ScrollArea className="h-[200px] w-full pr-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="flex items-start space-x-2 mb-4">
                                            <Avatar className="w-8 h-8" onClick={() => onUserClick(post.uid)} >
                                                <AvatarImage src={comment.avatar_url} alt={comment.username} />
                                                <AvatarFallback>{getInitials(comment.username)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-muted p-3 rounded-lg">
                                                <p className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => onUserClick(post.uid)}>{comment.username}</p>
                                                <p className="mt-1">
                                                    <TextoConNegritaAutomatica>

                                                        {comment.content}
                                                    </TextoConNegritaAutomatica>
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
                                                            variant="ghost"
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
                                    ))}
                                    <div ref={commentsEndRef} />
                                </ScrollArea>
                                <form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }} className="flex items-center space-x-2 pt-4">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                                        <AvatarFallback>{getInitials(user?.user_metadata.name)}</AvatarFallback>
                                    </Avatar>
                                    <Input
                                        placeholder={`Comentar como ${user?.user_metadata.name}`}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="flex-1 dark:bg-gray-900"
                                    />
                                    <Button className='' variant='outline' type="submit" size="sm" disabled={!newComment.trim() || loading}>
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Enviar comentario</span>
                                    </Button>
                                </form>
                            </Card>
                        </>
                    )}
                </CardContent>

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
        </>
    )
})

export default Post