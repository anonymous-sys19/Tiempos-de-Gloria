// import { useState, useRef } from 'react';
// import { supabase } from '@/supabaseClient';
// import { useToast } from "@/hooks/use-toast";

// interface ImageFile extends File {
//   preview: string;
// }

// const UseImageUpload = (userId: string | undefined) => {
//   const [images, setImages] = useState<ImageFile[]>([]);
//   const [description, setDescription] = useState('');
//   const [hashtags, setHashtags] = useState<string[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const newFiles = Array.from(e.target.files).map(file => Object.assign(file, {
//       preview: URL.createObjectURL(file)
//     }));

//     setImages(prevImages => [...prevImages, ...newFiles]);
//   };

//   const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setDescription(e.target.value);

//     const hashtagRegex = /#(\w+)/g;
//     const matches = e.target.value.match(hashtagRegex);
//     if (matches) {
//       setHashtags(matches.map(tag => tag.slice(1)));
//     } else {
//       setHashtags([]);
//     }
//   };

//   const handleRemove = (index: number) => {
//     setImages(prevImages => {
//       const newImages = [...prevImages];
//       URL.revokeObjectURL(newImages[index].preview);
//       newImages.splice(index, 1);
//       return newImages;
//     });
//   };

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (images.length === 0 && !description.trim()) {
//       toast({
//         title: "Error",
//         description: "Please add a description or select at least one image to upload.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsUploading(true);

//     try {
//       let imageUrl = '';
//       if (images.length > 0) {
//         for (const image of images) {
//           const cleanedFileName = image.name.replace(/\s/g, '_');
//           const { data, error } = await supabase.storage
//             .from('idec-public')
//             .upload(`images/${cleanedFileName}`, image);

//           if (error) throw error;

//           imageUrl = data.path;
//         }
//       }

//       const { error: imageError } = await supabase
//         .from("idectableimages")
//         .insert([
//           {
//             url: imageUrl,
//             description,
//             hashtags: hashtags.join(','),
//             user_id: userId,
//             // Asegúrate de que estos campos existan en tu objeto user
//             email: userId ? userId : null,
//             nameUser: userId ? userId : null,
//             avatarUrl: userId ? userId : null,
//           }
//         ]);

//       if (imageError) throw imageError;

//       toast({
//         title: "Success",
//         description: "Post created successfully!",
//       });

//       // Limpiar los estados después de la carga
//       setImages([]);
//       setDescription('');
//       setHashtags([]);
//     } catch (error) {
//       console.error('Error en la carga:', error);
//       toast({
//         title: "Error",
//         description: "An error occurred while creating the post.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handlePhotoVideoClick = () => {
//     fileInputRef.current?.click();
//   };

//   return {
//     images,
//     description,
//     hashtags,
//     isUploading,
//     fileInputRef,
//     handleImageChange,
//     handleDescriptionChange,
//     handleRemove,
//     handleUpload,
//     handlePhotoVideoClick,
//   };
// };

// export default UseImageUpload;


import { useState, useRef } from 'react';
import { supabase } from '@/supabaseClient';
import { useToast } from "@/hooks/use-toast";

interface MediaFile extends File {
  preview: string;
  type: 'image' | 'video';
}

const UseMediaUpload = (userId: string | undefined) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map(file => {
      const fileType: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
        type: fileType
      });
    });

    setMediaFiles(prevFiles => [...prevFiles, ...newFiles as MediaFile[]]);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);

    const hashtagRegex = /#(\w+)/g;
    const matches = e.target.value.match(hashtagRegex);
    if (matches) {
      setHashtags(matches.map(tag => tag.slice(1)));
    } else {
      setHashtags([]);
    }
  };

  const handleRemove = (index: number) => {
    setMediaFiles(prevFiles => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaFiles.length === 0 && !description.trim()) {
      toast({
        title: "Error",
        description: "Please add a description or select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadedPaths: { imageUrls: string[], videoUrls: string[] } = {
        imageUrls: [],
        videoUrls: []
      };

      for (const file of mediaFiles) {
        const cleanedFileName = file.name.replace(/\s/g, '_');
        const storageBucket = file.type === 'video' ? 'idecVideos' : 'idec-public';
        const { data, error } = await supabase.storage
          .from(storageBucket)
          .upload(`${file.type}s/${cleanedFileName}`, file);

        if (error) throw error;

        if (file.type === 'image') {
          uploadedPaths.imageUrls.push(data.path);
        } else {
          uploadedPaths.videoUrls.push(data.path);
        }
      }

      const { error: insertError } = await supabase
        .from("idectablemedia")
        .insert([{
          imageUrls: uploadedPaths.imageUrls.join(','),
          videoUrls: uploadedPaths.videoUrls.join(','),
          description,
          hashtags: hashtags.join(','),
          user_id: userId,
          email: userId ? userId : null,
          nameUser: userId ? userId : null,
          avatarUrl: userId ? userId : null,
        }]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      setMediaFiles([]);
      setDescription('');
      setHashtags([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "An error occurred while creating the post.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoVideoClick = () => {
    fileInputRef.current?.click();
  };

  return {
    mediaFiles,
    description,
    hashtags,
    isUploading,
    fileInputRef,
    handleMediaChange,
    handleDescriptionChange,
    handleRemove,
    handleUpload,
    handlePhotoVideoClick,
  };
};

export default UseMediaUpload;
