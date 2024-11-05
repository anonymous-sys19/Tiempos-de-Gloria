/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useUploadForm.ts
import { useState } from 'react'
import { supabase } from '@/supabaseClient'
import { nanoid } from 'nanoid'
import { toast } from "@/hooks/use-toast"

const SUPABASE_URL = 'https://janbrtgwtomzffqqcmfo.supabase.co'
const STORAGE_BUCKET = 'idec-public'

interface ImageFile extends File {
  preview: string
}

interface UseUploadFormProps {
  userId: string;
  email: string;
  userName: string;
  avatarUrl: string | null;
}

export function useUploadForm({ userId, email, userName, avatarUrl }: UseUploadFormProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [description, setDescription] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleImageChange = (newFiles: FileList | null) => {
    if (!newFiles) return

    const files = Array.from(newFiles).map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }) as ImageFile)

    setImages(prevImages => [...prevImages, ...files])
  }

  const handleDescriptionChange = (desc: string) => {
    setDescription(desc)
    const hashtagRegex = /#(\w+)/g
    const matches = desc.match(hashtagRegex)
    setHashtags(matches ? matches.map(tag => tag.slice(1)) : [])
  }

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!description.trim() || images.length === 0) {
      toast({
        title: "Error",
        description: !description.trim() ? "La descripción no puede estar vacía." : "Por favor, selecciona al menos una imagen para subir.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = await Promise.all(images.map(async (image) => {
        const cleanedFileName = image.name.replace(/\s/g, '_');
        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(`images/${cleanedFileName}`, image)
        if (error) throw error;
        return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/images/${cleanedFileName}`
      }))

      const slug = nanoid(10)
      const { error: insertError } = await supabase
        .from("idectableimages")
        .insert([
          {
            url: uploadedUrls[0],  // Assuming only one image URL is stored here
            description,
            hashtags: hashtags.join(','),
            user_id: userId,
            email,
            nameUser: userName,
            avatarUrl,
            slug,
          }
        ])
        .select()
        .single()
      if (insertError) throw insertError

      toast({
        title: "Success",
        description: "¡Publicación creada con éxito!",
      })

      setImages([])
      setDescription('')
      setHashtags([])

      return slug  // Return slug or any identifier to fetch new posts
    } catch (error) {
      console.error("Upload Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la publicación.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false)
    }
  }

  return {
    images,
    description,
    hashtags,
    isUploading,
    handleImageChange,
    handleDescriptionChange,
    handleRemoveImage,
    handleUpload,
  }
}
