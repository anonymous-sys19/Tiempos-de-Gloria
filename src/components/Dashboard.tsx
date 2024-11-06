// Components/Dashboard.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Newspaper, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Layout } from './Loyout'
import { Post } from './Post'
import BlogPage from './DayliVerse/PostDayliVerse'
import UseUploading from './UploadingFiles/UseUploading'
// Rutas y bukets
const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co'
const STORAGE_BUCKET = 'idec-public'

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

export default function Dashboard() {

  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()

  const PublicacionesComponent: React.FC = () => (
    <div className=" bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {
        posts.map((post) => (

          <Post key={post.id} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />

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
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ active, onClick, icon, label }) => (
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
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <UseUploading /> {/*Aqui renderizo el componente para subir mis elementos a supabase.... */}
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
      </div>
    </Layout>
  )
}
