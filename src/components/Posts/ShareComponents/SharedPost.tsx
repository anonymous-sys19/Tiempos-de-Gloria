// import  { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { supabase } from '@/supabaseClient'
// import { Card, CardContent } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
// import { Layout } from '../../Loyout/Loyout'
// import TextoConNegritaAutomatica from '../NegritaComponents'
// import { ThumbsUp, MessageCircle, Share2, Copy, MoreVertical, Download } from 'lucide-react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Helmet } from "react-helmet"

// interface SharedPost {
//     id: string;
//     url: string;
//     description: string;
//     created_at: string;
//     avatarUrl: string | null;
//     nameUser: string;
//     slug: string;
//     likes: number;
//     comments: number;
// }

// export default function SharedPost() {
//     const { slug } = useParams<{ slug: string }>()
//     const [post, setPost] = useState<SharedPost | null>(null)
//     const [isLoading, setIsLoading] = useState(true)
//     const navigate = useNavigate()
//     const { toast } = useToast()
//     const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
//     const [isImageModalOpen, setIsImageModalOpen] = useState(false)

//     useEffect(() => {
//         const fetchPost = async () => {
//             if (!slug) {
//                 toast({
//                     title: "Error",
//                     description: "No se pudo encontrar la publicación.",
//                     variant: "destructive",
//                 })
//                 navigate('/')
//                 return
//             }

//             setIsLoading(true)
//             const { data, error } = await supabase
//                 .from("idectableimages")
//                 .select('*')
//                 .eq('slug', slug)
//                 .single()

//             if (error) {
//                 console.error('Error fetching post:', error)
//                 toast({
//                     title: "Error",
//                     description: "No se pudo cargar la publicación.",
//                     variant: "destructive",
//                 })
//                 navigate('/')
//             } else if (data) {
//                 setPost({
//                     ...data,
//                     likes: data.likes || 10,
//                     comments: data.comments || 2,
//                 } as SharedPost)
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "La publicación no existe.",
//                     variant: "destructive",
//                 })
//                 navigate('/')
//             }
//             setIsLoading(false)
//         }

//         fetchPost()
//     }, [slug, navigate, toast])

//     const shareUrl = `${window.location.origin}/post/${post?.slug}`

//     const handleShare = (platform: 'whatsapp' | 'copy') => {
//         if (platform === 'whatsapp') {
//             window.open(`https://wa.me/?text=${encodeURIComponent(`¡Mira esta publicación! ${shareUrl}`)}`, '_blank')
//         } else if (platform === 'copy') {
//             navigator.clipboard.writeText(shareUrl)
//             toast({
//                 title: "Enlace copiado",
//                 description: "El enlace ha sido copiado al portapapeles.",
//             })
//         }
//     }

//     const handleSaveImage = () => {
//         if (post?.url) {
//             const link = document.createElement('a')
//             link.href = post.url
//             link.download = `post-${post.id}.jpg`
//             document.body.appendChild(link)
//             link.click()
//             document.body.removeChild(link)
//         }
//     }

//     if (isLoading) {
//         return (
//             <Layout>
//                 <Card className='max-w-2xl mx-auto'>
//                     <CardContent className="pt-6">
//                         <div className="flex space-x-3">
//                             <Skeleton className="h-12 w-12 rounded-full" />
//                             <div className="space-y-2">
//                                 <Skeleton className="h-4 w-[200px]" />
//                                 <Skeleton className="h-4 w-[150px]" />
//                             </div>
//                         </div>
//                         <Skeleton className="h-4 w-full mt-4" />
//                         <Skeleton className="h-4 w-full mt-2" />
//                         <Skeleton className="h-4 w-2/3 mt-2" />
//                         <Skeleton className="h-64 w-full mt-4" />
//                     </CardContent>
//                 </Card>
//             </Layout>
//         )
//     }

//     if (!post) {
//         return null
//     }

//     return (
//         <Layout>
//             <Helmet>
//                 <title>{post.nameUser}'s Post</title>
//                 <meta property="og:title" content={post.description.slice(0, 60)} />
//                 <meta property="og:description" content={post.description} />
//                 <meta property="og:image" content={post.url || 'URL_IMAGE_DEFAULT'} />
//                 <meta property="og:url" content={shareUrl} />
//                 <meta property="twitter:title" content={post.description.slice(0, 60)} />
//                 <meta property="twitter:description" content={post.description} />
//                 <meta property="twitter:image" content={post.url || 'URL_IMAGE_DEFAULT'} />
//                 <meta property="twitter:card" content="summary_large_image" />
//             </Helmet>

//             <Card className='max-w-2xl mx-auto'>
//                 <CardContent className="pt-6">
//                     <div className="flex justify-between items-start">
//                         <div className="flex space-x-3">
//                             <Avatar>
//                                 <AvatarImage src={post.avatarUrl || ''} alt={post.nameUser} />
//                                 <AvatarFallback>{post.nameUser.charAt(0)}</AvatarFallback>
//                             </Avatar>
//                             <div>
//                                 <h3 className="font-semibold">{post.nameUser}</h3>
//                                 <p className="text-xs sm:text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
//                             </div>
//                         </div>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="sm">
//                                     <MoreVertical className="h-4 w-4" />
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent>
//                                 <DropdownMenuItem onClick={handleSaveImage}>
//                                     <Download className="mr-2 h-4 w-4" />
//                                     Guardar imagen
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                     <p className="mt-4 text-sm text-gray-700">
//                         <TextoConNegritaAutomatica>{post.description}</TextoConNegritaAutomatica>
//                     </p>
//                     {post.url && (
//                         <img
//                             src={post.url}
//                             alt="Publicación"
//                             className="mt-4 rounded-lg w-full cursor-pointer"
//                             onClick={() => setIsImageModalOpen(true)}
//                         />
//                     )}
//                     <div className="mt-4 flex flex-wrap gap-2 text-gray-400">
//                         <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
//                             <ThumbsUp className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> {post.likes} Me gusta
//                         </Button>
//                         <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
//                             <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> {post.comments} Comentarios
//                         </Button>
//                         <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm" onClick={() => setIsShareDialogOpen(true)}>
//                             <Share2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Compartir
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Compartir publicación</DialogTitle>
//                         <DialogDescription>
//                             Elige cómo deseas compartir esta publicación
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="flex flex-col space-y-2">
//                         <Input value={shareUrl} readOnly />
//                         <div className="flex space-x-2">
//                             <Button onClick={() => handleShare('copy')}> <Copy />Copiar enlace</Button>
//                             <Button onClick={() => handleShare('whatsapp')}><MessageCircle />Compartir en WhatsApp</Button>
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>

//             <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
//                 <DialogContent className="max-w-4xl w-full p-0">
//                     <img
//                         src={post.url}
//                         alt="Publicación"
//                         className="w-full h-auto"
//                     />
//                 </DialogContent>
//             </Dialog>
//         </Layout>
//     )
// }

import { useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal, Send } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout } from '../../Loyout/Loyout';
import { Helmet } from "react-helmet";
import { useFetchPost } from "./useFetchPost";

export default function SharedPost() {
    const { slug } = useParams<{ slug: string }>();
    const {
        post,
        isLoading,
        comments,
        user,
        newComment,
        setNewComment,
        isShareDialogOpen,
        setIsShareDialogOpen,
        shareUrl,
        handleLike,
        handleComment,
        handleShare,
        hasLiked,
    } = useFetchPost(slug);

    if (isLoading) {
        return (
            <Layout>
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="p-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-4 w-[200px] mt-4" />
                        <Skeleton className="h-64 w-full mt-4" />
                    </CardContent>
                </Card>
            </Layout>
        );
    }

    if (!post) return null;

    return (
        <Layout>
            <Helmet>
                <title>{post.nameUser}'s Post</title>
                <meta property="og:title" content={post.description.slice(0, 60)} />
                <meta property="og:description" content={post.description} />
                <meta property="og:image" content={post.url || 'URL_IMAGE_DEFAULT'} />
                <meta property="og:url" content={shareUrl} />
            </Helmet>

            <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
                <Card className="w-full max-w-3xl">
                    <CardContent className="p-0">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={post.avatarUrl} alt={post.nameUser} />
                                        <AvatarFallback>{post.nameUser[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-lg font-semibold cursor-pointer hover:underline">{post.nameUser}</h2>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>
                                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
                                            </span>
                                            <span className="mx-1">·</span>
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
                            <p className="mt-2 text-gray-700">{post.description}</p>
                        </div>
                        <img src={post.url} alt="Post content" className="w-full" />
                        <div className="p-4">
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>{post.likes} Me gusta</span>
                                <span>{post.comments} comentarios</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between">
                                <Button variant="ghost" className="flex-1" onClick={handleLike}>
                                    <ThumbsUp className={`mr-2 h-5 w-5 ${hasLiked ? 'text-blue-600 fill-current' : ''}`} />
                                    Me gusta
                                </Button>
                                <Button variant="ghost" className="flex-1">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Comentar
                                </Button>
                                <Button variant="ghost" className="flex-1" onClick={() => setIsShareDialogOpen(true)}>
                                    <Share2 className="mr-2 h-5 w-5" />
                                    Compartir
                                </Button>
                            </div>
                            <Separator className="my-2" />
                        </div>
                        <ScrollArea className="h-[300px]">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex items-start space-x-3 p-4">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={comment.avatarUrl} alt={comment.nameUser} />
                                        <AvatarFallback>{comment.nameUser[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="bg-gray-100 rounded-2xl p-3">
                                            <p className="font-semibold">{comment.nameUser}</p>
                                            <p>{comment.content}</p>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500 flex space-x-3">
                                            <button className="font-semibold">Me gusta</button>
                                            <button className="font-semibold">Responder</button>
                                            <span>
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <form onSubmit={handleComment} className="flex items-center w-full space-x-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                                <AvatarFallback>{user?.user_metadata.name[0]}</AvatarFallback>
                            </Avatar>
                            <Input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="flex-1 rounded-full bg-gray-100"
                            />
                            <Button type="submit" size="sm" className="rounded-full">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>

                <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Compartir publicación</DialogTitle>
                            <DialogDescription>
                                Elige cómo deseas compartir esta publicación
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-2">
                            <Input value={shareUrl} readOnly />
                            <div className="flex space-x-2">
                                <Button onClick={() => handleShare('copy')}>Copiar enlace</Button>
                                <Button onClick={() => handleShare('whatsapp')}>Compartir en WhatsApp</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
