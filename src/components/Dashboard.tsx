// Components/Dashboard.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Newspaper, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
<<<<<<< HEAD

import React, { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Image as ImageIcon, Smile, Send } from 'lucide-react'
import { useAuth } from "@/hooks/userAuth"
=======
import React, { useEffect, useState } from 'react'
>>>>>>> beta
import { supabase } from '@/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Layout } from './Loyout'
import { Post } from './Post'
import BlogPage from './DayliVerse/PostDayliVerse'
<<<<<<< HEAD
// import CombinedPosts from './Posts/PostsAll'
import { useToast } from "@/hooks/use-toast"
import { nanoid } from 'nanoid'


const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co'
const STORAGE_BUCKET = 'idec-public'




// Auxiliary functions (unchanged)
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
}

// Interfaces
=======
import UseUploading from './UploadingFiles/UseUploading'
// Rutas y bukets
const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co'
const STORAGE_BUCKET = 'idec-public'

>>>>>>> beta
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

<<<<<<< HEAD
interface ImageFile extends File {
  preview: string
}
// Main component updated with responsive design and upload functionality
export default function Dashboard() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<ImageFile[]>([])
  const [description, setDescription] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  // Componentes de contenido
=======
export default function Dashboard() {

  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()

>>>>>>> beta
  const PublicacionesComponent: React.FC = () => (
    <div className=" bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {
        posts.map((post) => (
<<<<<<< HEAD
          <>
            <Post key={post.name} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />
          </>
=======

          <Post key={post.id} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />

>>>>>>> beta
        ))
      }

    </div>
  );

  const PostDayliVerseComponent: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg ">
      <BlogPage />
    </div>
  );

  type MenuOption = 'publicaciones' | 'dayliverse';

  const MenuButton: React.FC<{
<<<<<<< HEAD
    active: boolean ;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ active, onClick, icon, label}) => (
=======
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ active, onClick, icon, label }) => (
>>>>>>> beta
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out",
        active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight className={cn("ml-auto transition-transform", active && "transform rotate-90")} />
    </button>
<<<<<<< HEAD
    
=======

>>>>>>> beta
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: fileData, error: fileError } = await supabase.storage.from(STORAGE_BUCKET).list('images/');
        if (fileError) {
          throw fileError;
        }

        const images = await Promise.all(fileData.map(async (file) => {
          if (file.name === '.emptyFolderPlaceholder') {
            return null; // Omitir este archivo
          }

          const encodedFileName = encodeURIComponent(file.name);
          const url = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/images/${encodedFileName}`;
          try {
            const { data: imageData, error: imageError } = await supabase
              .from('idectableimages')
              .select()
              .eq('url', url)
              .maybeSingle();
            if (imageError) throw imageError;

            // Verificación adicional para evitar el error
            if (!imageData) {
              console.warn(`No se encontró datos para la imagen: ${file.name}`);
              return null; // Retorna null si no hay datos
            }

            // Asegúrate de que imageData tenga un id
            if (!imageData.id) {
              console.error(`La imagen no tiene un ID: ${imageData}`);
              return null; // Retorna null si no hay ID
            }

            return {
              name: file.name,
              url: url,
              uid: imageData.user_id,
              description: imageData.description,
              createdAt: imageData.created_at,
              avatar_url: imageData.avatarUrl,
              name_Username: imageData.nameUser,
              slug: imageData.slug,
              id: imageData.id, // Asegúrate de incluir el ID aquí
              likes: imageData.like,
            };
          } catch (error) {
            console.error('Error al procesar la imagen:', error);
            return null;
          }
        }));

        const filteredImages = images.filter((image): image is Post => image !== null);

        // Aquí debes obtener los likes de cada publicación
        const postsWithLikes = await Promise.all(filteredImages.map(async (post) => {
          const { data: likesData, error: likesError } = await supabase
            .from('likes')
            .select() // Cambia aquí
            .eq('post_id', post?.id);


          if (likesError) {
            console.error('Error al obtener likes:', likesError);
            return {
              ...post,
              likes: 0,
            };
          }

          return {
            ...post,
            likes: likesData ? Number(likesData.length) : 0, // Cambia aquí
          };
        }));

        setPosts(postsWithLikes as Post[]);
      } catch (error) {
        console.error('Error al obtener la lista de imágenes:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`)
  }

<<<<<<< HEAD
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const newFiles = Array.from(e.target.files).map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))

    setImages(prevImages => [...prevImages, ...newFiles])
  }

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

  const handleRemove = (index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }


  // ... (resto del código)

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


=======
>>>>>>> beta
  const [activeMenu, setActiveMenu] = useState<MenuOption>('publicaciones');

  const renderContent = () => {
    switch (activeMenu) {
      case 'publicaciones':
        return <PublicacionesComponent />;
      case 'dayliverse':
        return <PostDayliVerseComponent />;
      default:
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">Selecciona una opción del menú para ver el contenido</p>
          </div>
        );
    }
  };
<<<<<<< HEAD

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
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



=======
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <UseUploading /> {/*Aqui renderizo el componente para subir mis elementos a supabase.... */}
>>>>>>> beta
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col">
            <div className="flex space-x-2 mb-4">
              <MenuButton
                active={activeMenu === 'publicaciones'}
                onClick={() => setActiveMenu('publicaciones')}
                icon={<FileText className="w-5 h-5" />}
                label="Publicaciones"
              />
              <MenuButton
                active={activeMenu === 'dayliverse'}
                onClick={() => setActiveMenu('dayliverse')}
                icon={<Newspaper className="w-5 h-5" />}
                label="Post DayliVerse"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenu || 'empty'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
<<<<<<< HEAD




      </div>
      
=======
      </div>
>>>>>>> beta
    </Layout>
  )
}
