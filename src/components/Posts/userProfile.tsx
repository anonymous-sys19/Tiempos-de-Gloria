
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Edit, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/userAuth'
import { Layout } from "../Loyout/Loyout"
import { Post } from "./Post"
import UseUploading from "../UploadingFiles/UseUploading"
import { UserType } from "@/types/postTypes/posts"
import { useFetchPosts } from "@/hooks/PostHooks/useFetchPosts"


export default function UserProfileWithSidebar() {
  const { posts } = useFetchPosts() // Hooks From Posts
  const { user } = useAuth()
  const isAuthenticated = user?.id
  const { userId } = useParams<{ userId: string }>()
  const [nUser, setUser] = useState<UserType | null>(null)

  const navigate = useNavigate()
  useEffect(() => {
    const fetchUserMedia = async () => {
      try {
        // Consultas a ambas tablas
        const fetchImages = supabase
          .from('idectableimages')
          .select('*')
          .eq('user_id', userId);

        const fetchVideos = supabase
          .from('idectablevideos')
          .select('*')
          .eq('user_id', userId);

        // Ejecutar consultas en paralelo
        const [{ data: images, error: imagesError }, { data: videos, error: videosError }] = await Promise.all([
          fetchImages,
          fetchVideos,
        ]);

        // Manejar errores
        if (imagesError) throw imagesError;
        if (videosError) throw videosError;

        // Combinar resultados
        const combinedMedia = [
          ...(images?.map(item => ({ ...item, fileType: 'image' })) || []),
          ...(videos?.map(item => ({ ...item, fileType: 'video' })) || []),
        ];

        // Opcional: Ordenar por fecha de creación
        combinedMedia.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (combinedMedia.length > 0) {
          // Aquí puedes elegir cómo manejar los datos (por ejemplo, establecer un usuario basado en el primer resultado)
          setUser(combinedMedia[0]); // Opcional: cambiar lógica si es necesario
        } else {
          return (<div>Para ver tu perfil debes Subir almenos 1 Archivo valido</div>)
        }
      } catch (error) {
        console.error('Error al obtener los medios del usuario:', error);
      }
    };

    fetchUserMedia();
  }, [userId]);




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
                    <UseUploading />
                  )}
                  {posts.map((post) => (
                    nUser.user_id === post?.uid && (
                      // <Post key={post.id} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />
                      <Post key={post.id} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />
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
