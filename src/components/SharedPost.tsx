import  { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Layout } from './Loyout'
import TextoConNegritaAutomatica from './NegritaComponents'
import { ThumbsUp, MessageCircle, Share2, Copy, MoreVertical, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Helmet } from "react-helmet"

interface SharedPost {
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

export default function SharedPost() {
    const { slug } = useParams<{ slug: string }>()
    const [post, setPost] = useState<SharedPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) {
                toast({
                    title: "Error",
                    description: "No se pudo encontrar la publicación.",
                    variant: "destructive",
                })
                navigate('/')
                return
            }

            setIsLoading(true)
            const { data, error } = await supabase
                .from("idectableimages")
                .select('*')
                .eq('slug', slug)
                .single()

            if (error) {
                console.error('Error fetching post:', error)
                toast({
                    title: "Error",
                    description: "No se pudo cargar la publicación.",
                    variant: "destructive",
                })
                navigate('/')
            } else if (data) {
                setPost({
                    ...data,
                    likes: data.likes || 10,
                    comments: data.comments || 2,
                } as SharedPost)
            } else {
                toast({
                    title: "Error",
                    description: "La publicación no existe.",
                    variant: "destructive",
                })
                navigate('/')
            }
            setIsLoading(false)
        }

        fetchPost()
    }, [slug, navigate, toast])

    const shareUrl = `${window.location.origin}/post/${post?.slug}`

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

    const handleSaveImage = () => {
        if (post?.url) {
            const link = document.createElement('a')
            link.href = post.url
            link.download = `post-${post.id}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (isLoading) {
        return (
            <Layout>
                <Card className='max-w-2xl mx-auto'>
                    <CardContent className="pt-6">
                        <div className="flex space-x-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                        <Skeleton className="h-64 w-full mt-4" />
                    </CardContent>
                </Card>
            </Layout>
        )
    }

    if (!post) {
        return null
    }

    return (
        <Layout>
            <Helmet>
                <title>{post.nameUser}'s Post</title>
                <meta property="og:title" content={post.description.slice(0, 60)} />
                <meta property="og:description" content={post.description} />
                <meta property="og:image" content={post.url || 'URL_IMAGE_DEFAULT'} />
                <meta property="og:url" content={shareUrl} />
                <meta property="twitter:title" content={post.description.slice(0, 60)} />
                <meta property="twitter:description" content={post.description} />
                <meta property="twitter:image" content={post.url || 'URL_IMAGE_DEFAULT'} />
                <meta property="twitter:card" content="summary_large_image" />
            </Helmet>

            <Card className='max-w-2xl mx-auto'>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                        <div className="flex space-x-3">
                            <Avatar>
                                <AvatarImage src={post.avatarUrl || ''} alt={post.nameUser} />
                                <AvatarFallback>{post.nameUser.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{post.nameUser}</h3>
                                <p className="text-xs sm:text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleSaveImage}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Guardar imagen
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="mt-4 text-sm text-gray-700">
                        <TextoConNegritaAutomatica>{post.description}</TextoConNegritaAutomatica>
                    </p>
                    {post.url && (
                        <img
                            src={post.url}
                            alt="Publicación"
                            className="mt-4 rounded-lg w-full cursor-pointer"
                            onClick={() => setIsImageModalOpen(true)}
                        />
                    )}
                    <div className="mt-4 flex flex-wrap gap-2 text-gray-400">
                        <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
                            <ThumbsUp className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> {post.likes} Me gusta
                        </Button>
                        <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
                            <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> {post.comments} Comentarios
                        </Button>
                        <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm" onClick={() => setIsShareDialogOpen(true)}>
                            <Share2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Compartir
                        </Button>
                    </div>
                </CardContent>
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
                            <Button onClick={() => handleShare('copy')}> <Copy />Copiar enlace</Button>
                            <Button onClick={() => handleShare('whatsapp')}><MessageCircle />Compartir en WhatsApp</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogContent className="max-w-4xl w-full p-0">
                    <img
                        src={post.url}
                        alt="Publicación"
                        className="w-full h-auto"
                    />
                </DialogContent>
            </Dialog>
        </Layout>
    )
}