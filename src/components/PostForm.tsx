// Components/ImageUploadCard.tsx
import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Image as ImageIcon, Smile, Send } from 'lucide-react'

interface ImageUploadCardProps {
  user: {
    avatar_url: string | null
    name: string
  } | null
  description: string
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  hashtags: string[]
  images: Array<{ preview: string }>
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onUpload: (e: React.FormEvent) => Promise<void>
  isUploading: boolean
}

export function ImageUploadCard({
  user,
  description,
  onDescriptionChange,
  hashtags,
  images,
  onImageChange,
  onRemoveImage,
  onUpload,
  isUploading,
}: ImageUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoVideoClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={onUpload}>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder={`¿Qué estás pensando, ${user?.name || 'usuario'}?`}
              className="flex-1"
              value={description}
              onChange={onDescriptionChange}
            />
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {hashtags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
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
                    onClick={() => onRemoveImage(index)}
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
                className="hidden"
                onChange={onImageChange}
                accept="image/*"
                multiple
              />
              <Button
                type="button"
                variant="ghost"
                onClick={handlePhotoVideoClick}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Foto/video
              </Button>
              <Button variant="ghost">
                <Smile className="mr-2 h-4 w-4" />
                Sentimiento/actividad
              </Button>
            </div>
            <Button type="submit" disabled={isUploading}>
              <Send className="mr-2 h-4 w-4" />
              {isUploading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
