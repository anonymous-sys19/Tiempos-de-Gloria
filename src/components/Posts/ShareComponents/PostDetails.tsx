/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, Download, MoreVertical } from "lucide-react";
import TextoConNegritaAutomatica from '../NegritaComponents';

export default function PostDetails({ post, setIsShareDialogOpen, setIsImageModalOpen }: any) {
    const handleSaveImage = () => {
        if (post?.url) {
            const link = document.createElement('a');
            link.href = post.url;
            link.download = `post-${post.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
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
                    <Button variant="ghost">
                        <ThumbsUp className="mr-2 h-3 w-3" /> {post.likes} Me gusta
                    </Button>
                    <Button variant="ghost">
                        <MessageCircle className="mr-2 h-3 w-3" /> {post.comments} Comentarios
                    </Button>
                    <Button variant="ghost" onClick={() => setIsShareDialogOpen(true)}>
                        <Share2 className="mr-2 h-3 w-3" /> Compartir
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
