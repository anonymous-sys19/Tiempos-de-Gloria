/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Edit, MoreHorizontal,  MessageCircle} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/userAuth'

import { Layout } from "./Loyout"
import { Post } from "./Post"
const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co'
const STORAGE_BUCKET = 'idec-public'

interface User {
  user_id: string
  avatarUrl: string
  email: string
  nameUser: string
}

// Interfaces
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



export default function UserProfileWithSidebar() {
  const { user } = useAuth()
  const isAuthenticated = user?.email
  const { userId } = useParams<{ userId: string }>()
  const [nUser, setUser] = useState<User | null>(null)

  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: users, error: usersError } = await supabase
          .from('idectableimages')
          .select('*')
          .eq('user_id', userId)

        if (users && users.length > 0) {
          setUser(users[0])
        } else {
          console.log('Usuario no encontrado')
        }

        if (usersError) {
          console.error('Error fetching users:', usersError)
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error)
      }
    }

    fetchUser()
  }, [userId])

  const fetchImages = async () => {
    try {
      const { data: fileData, error: fileError } = await supabase.storage.from('idec-public').list('images/')

      if (fileError) {
        throw fileError
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
      })
      )

      const filteredImages = images.filter((image): image is Post => image !== null);
      setPosts(filteredImages)
      // 

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
    } catch (error: any) {
      console.error('Error al obtener la lista de imágenes:', error.message)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // 
  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`)
  }
  return (
    <Layout>
      <>
        {nUser && (
          <div className="max-w-4xl mx-auto bg-gray-100">
            <div className="relative">
              <img
                src="https://wallpapercave.com/wp/wp12250646.jpg"
                alt="Portada"
                className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover"
              />
              <Button variant="secondary" className="absolute bottom-4 right-4 text-xs sm:text-sm">
                <Camera className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Editar foto de portada
              </Button>
            </div>
            <div className="bg-white shadow">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-end sm:space-x-5 py-6">
                  <div className="relative flex -mt-16">
                    <img
                      src={nUser.avatarUrl}
                      alt="Foto de perfil"
                      className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white"
                    />
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                    <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{nUser.nameUser}</h1>
                    </div>
                    <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <Button className="text-xs sm:text-sm">
                        <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Editar perfil
                      </Button>
                      <Button variant="secondary" className="text-xs sm:text-sm">
                        <MoreHorizontal className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Más
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">{nUser.nameUser}</h1>
                </div>
              </div>
            </div>
            <Tabs defaultValue="publicaciones" className="w-full">
              <TabsList className="bg-white border-b overflow-x-auto flex-nowrap">
                <TabsTrigger value="publicaciones" className="text-xs sm:text-sm">Publicaciones</TabsTrigger>
                <TabsTrigger value="informacion" className="text-xs sm:text-sm">Información</TabsTrigger>
                <TabsTrigger value="amigos" className="text-xs sm:text-sm">Amigos</TabsTrigger>
                <TabsTrigger value="fotos" className="text-xs sm:text-sm">Fotos</TabsTrigger>
              </TabsList>
              <TabsContent value="publicaciones" className="mt-6">
                <div className="max-w-2xl mx-auto space-y-6 px-4 sm:px-6">
                  {nUser.email === isAuthenticated && (
                    <Card className="mb-6">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                            <AvatarFallback>{user?.user_metadata.name ? getInitials(user.user_metadata.name) : 'U'}</AvatarFallback>
                          </Avatar>
                          <Input placeholder={`¿Qué estás pensando, ${user?.user_metadata.name}?`} className="flex-1" />
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap justify-between gap-2">
                          <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
                            <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Publicación
                          </Button>
                          <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
                            <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Foto/video
                          </Button>
                          <Button variant="ghost" className="flex-grow sm:flex-grow-0 text-xs sm:text-sm">
                            <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Sentimiento/actividad
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {posts.map((post) => (
                    nUser.user_id === post?.uid && (
                      <Post key={post.name} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />
                    )
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="informacion">
                {/* Add content for Information tab */}
              </TabsContent>
              <TabsContent value="amigos">
                {/* Add content for Friends tab */}
              </TabsContent>
              <TabsContent value="fotos">
                {/* Add content for Photos tab */}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </>
    </Layout>
  )
}
