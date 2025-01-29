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

  const generateFileUrl = (fileName: string, fileType: 'image' | 'video') => {
    const encodedFileName = encodeURIComponent(fileName);
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${fileType}s/${encodedFileName}`;
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch images and videos in parallel
      const fetchImages = supabase
        .from('idectableimages')
        .select(`*,
    profiles!idectableimages_user_id_fkey (
      id,
      display_name,
      avatar_url,
      portada_url
    )`);

      const fetchVideos = supabase
        .from('idectablevideos')
        .select(`*,
          profiles(
            id,
            display_name,
            avatar_url,
            portada_url
          )`);

      const [{ data: imageData, error: imageError }, { data: videoData, error: videoError }] = await Promise.all([
        fetchImages,
        fetchVideos,
      ]);

      if (imageError) throw imageError;
      if (videoError) throw videoError;

      // Combine and process posts
      const combinedData = [
        ...(imageData?.map((item) => ({
          ...item,
          fileType: 'image' as const,
          url: generateFileUrl(item.url.split('/').pop() || '', 'image'),
        })) || []),
        ...(videoData?.map((item) => ({
          ...item,
          fileType: 'video' as const,
          url: generateFileUrl(item.url.split('/').pop() || '', 'video'),
        })) || []),
      ];

      combinedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Map posts and fetch likes count
      const processedPosts = await Promise.all(
        combinedData.map(async (item) => {
          const { data: likesData, error: likesError } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', item.id);

          if (likesError) console.error('Error fetching likes:', likesError);

          return {
            id: item.id, // Si tienes un campo "content"
            url: item.url,
            fileType: item.fileType,
            description: item.description || '',
            createdAt: item.created_at,
            likes: likesData?.length || 0,
            slug: item.slug || '',
            profile: {
              id: item.profiles.id,
              display_name: item.profiles.display_name,
              avatar_url: item.profiles.avatar_url,
              portada_url: item.profiles.portada_url,
            },
          };
        })
      );

      setPosts(processedPosts);
    } catch (error: any) {
      setError(error.message || 'Error desconocido');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return { posts, loading, error, refetch: fetchPosts };
}