/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { useAuth } from '@/hooks/userAuth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Image as ImageIcon, Smile, Send } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { nanoid } from 'nanoid'

// mi interface de los post
interface Post {
    likes: number
    id: string; // Añadimos un id único
    name: string;
    url: string;
    uid: string;
    description: string;
    createdAt: string;
    avatar_url: string | null;
    name_Username: string;
    slug: string; // Añadimos un slug único para compartir
}
const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
}
// Para ver  un preview de la imgen
interface ImageFile extends File {
    preview: string
}
// mis Bukets
const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co'
const STORAGE_BUCKET = 'idec-public'


const UseUploading = () => {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [images, setImages] = useState<ImageFile[]>([])
    const [description, setDescription] = useState('')
    const [hashtags, setHashtags] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    //Aqui cargamos la imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const newFiles = Array.from(e.target.files).map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))

        setImages(prevImages => [...prevImages, ...newFiles])
    }
    // Aqui cargamos la Description 
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)

        const hashtagRegex = /#(\w+)/g
        const matches = e.target.value.match(hashtagRegex)
        if (matches) {
            setHashtags(matches.map(tag => tag.slice(1)))
        } else {
            setHashtags([])
        }
    }
    // Utilizado para Remover el archivo
    const handleRemove = (index: number) => {
        setImages(prevImages => {
            const newImages = [...prevImages]
            URL.revokeObjectURL(newImages[index].preview)
            newImages.splice(index, 1)
            return newImages
        })
    }

    // Usado para cargar y subir los Archivos a supabase.. 
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            toast({
                title: "Error",
                description: "La descripción no puede estar vacía.",
                variant: "destructive",
            });
            return;
        }

        if (images.length === 0) {
            toast({
                title: "Error",
                description: "Por favor, selecciona al menos una imagen para subir.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            let imageUrl = '';
            for (const image of images) {
                const cleanedFileName = image.name.replace(/\s/g, '_');
                const { error } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(`images/${cleanedFileName}`, image);

                if (error) {
                    toast({
                        title: "Upload Error",
                        description: `Error al subir la imagen: ${cleanedFileName}`,
                        variant: "destructive",
                    });
                    throw error;
                }

                imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/images/${cleanedFileName}`;
            }

            const slug = nanoid(10); // Genera un slug único de 10 caracteres

            const { error: imageError } = await supabase
                .from("idectableimages")
                .insert([{
                    url: imageUrl, description, hashtags: hashtags.join(','), user_id: user?.id, email: user?.email,
                    nameUser: user?.user_metadata?.name, avatarUrl: user?.user_metadata?.avatar_url, slug,
                }]) // Añadimos el slug a la base de datos
                .select()
                .single();

            if (imageError) throw imageError;

            toast({
                title: "Success",
                description: "¡Publicación creada con éxito!",
            });

            // Refresh posts
            const { data: newPost } = await supabase
                .from("idectableimages")
                .select()
                .eq('slug', slug)
                .single();
            if (newPost) {
                setPosts(prevPosts => ([{
                    id: newPost.id, name: newPost.url.split('/').pop() || '', url: newPost.url, uid: newPost.user_id,
                    description: newPost.description, createdAt: newPost.created_at, avatar_url: newPost.avatarUrl, name_Username: newPost.nameUser, slug: newPost.slug,
                    likes: 0, // Add the missing 'likes' property
                },
                ...prevPosts
                ]));
            }
            setImages([]);
            setDescription('');
            setHashtags([]);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Ocurrió un error al crear la publicación.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handlePhotoVideoClick = () => {
        fileInputRef.current?.click()
    }

    useEffect(() => {
        if (posts.length > 0) {
            console.log("Posts loaded for upload component:", posts);
        }
    }, [posts]);


    return (
        <>

            <Card className="mb-6 bg-white dark:bg-gray-800">
                <CardContent className="pt-6">
                    <form onSubmit={handleUpload}>
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                                <AvatarFallback>{user?.user_metadata.name ? getInitials(user.user_metadata.name) : 'U'}</AvatarFallback>
                            </Avatar>
                            <Textarea
                                placeholder={`¿Qué estás pensando, ${user?.user_metadata.name}?`}
                                className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 rounded-md"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </div>

                        {hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {hashtags.map((tag, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={image.preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 text-xs"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex flex-wrap justify-between items-center">
                            <div className="flex space-x-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    multiple
                                />
                                <Button
                                    type="button"

                                    className="flex-grow sm:flex-grow-0 mt-2 sm:mt-0 "
                                    onClick={handlePhotoVideoClick}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Foto/video
                                </Button>
                                <Button className="mt-2 sm:mt-0">
                                    <Smile className="mr-2 h-4 w-4" />
                                    Sentimiento/actividad
                                </Button>
                            </div>
                            <Button type="submit" className="mt-2 sm:mt-0" disabled={isUploading}>
                                <Send className="mr-2 h-4 w-4" />
                                {isUploading ? 'Publicando...' : 'Publicar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </>
    )
}



export default UseUploading
