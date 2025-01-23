/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; // Ajusta la ruta según tu configuración
import { PostTypes } from '@/types/postTypes/posts';


const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co';
const STORAGE_BUCKET = 'idec-public';


export const useFetchPosts = () => {
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch images and videos
      const fetchImages = supabase.from('idectableimages').select('*');
      const fetchVideos = supabase.from('idectablevideos').select('*');

      const [{ data: imageData, error: imageError }, { data: videoData, error: videoError }] = await Promise.all([
        fetchImages,
        fetchVideos,
      ]);

      if (imageError) throw imageError;
      if (videoError) throw videoError;

      // Combine and process the data
      const combinedData = [
        ...(imageData?.map(item => ({ ...item, fileType: 'image' as const })) || []),
        ...(videoData?.map(item => ({ ...item, fileType: 'video' as const })) || []),
      ];

      combinedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const processedPosts = await Promise.all(
        combinedData.map(async (item) => {
          const encodedFileName = encodeURIComponent(item.url.split('/').pop() || '');
          const url = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${item.fileType}s/${encodedFileName}`;

          // Fetch likes count
          const { data: likesData, error: likesError } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', item.id);

          if (likesError) {
            console.error('Error al obtener likes:', likesError);
          }

          return {
            ...item,
            url,
            likes: likesData?.length || 0,
            createdAt: item.created_at,
            name_Username: item.nameUser,
            avatar_url: item.avatarUrl,
            uid: item.user_id,
          };
        })
      );

      setPosts(processedPosts);
    } catch (error: any) {
      setError(error.message || 'Error desconocido');
      console.error('Error al obtener publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error };
};
