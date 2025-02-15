

import React, { useRef, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/hooks/userAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, Send, Video } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';
import { SUPABASE_URL, STORAGE_BUCKET, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from '@/lib/constants';
import { MediaFile } from '@/types/postTypes/media';
import { validateFile, getInitials } from '@/utils/file-helpers';
import UploadForm from './UploadMusic';

const UseUploading = () => {
    const { user } = useAuth();
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isVideoUpload: boolean) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const validFiles: MediaFile[] = [];
        
        for (const file of files) {
            const validation = validateFile(file);
            
            if (!validation.isValid) {
                toast({
                    title: "Error",
                    description: validation.message,
                    variant: "destructive",
                });
                continue;
            }

            // Verificar si el tipo de archivo coincide con el botón presionado
            if (validation.isVideo !== isVideoUpload) {
                toast({
                    title: "Error",
                    description: `Por favor, use el botón correcto para subir ${isVideoUpload ? 'videos' : 'imágenes'}`,
                    variant: "destructive",
                });
                continue;
            }

            validFiles.push(Object.assign(file, {
                preview: URL.createObjectURL(file),
                isVideo: validation.isVideo
            }));
        }

        setMediaFiles(prev => [...prev, ...validFiles]);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        const hashtagRegex = /#(\w+)/g;
        const matches = e.target.value.match(hashtagRegex);
        setHashtags(matches ? matches.map(tag => tag.slice(1)) : []);
    };

    const handleRemove = (index: number) => {
        setMediaFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

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

        if (mediaFiles.length === 0) {
            toast({
                title: "Error",
                description: "Por favor, selecciona archivos para subir.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            for (const file of mediaFiles) {
                const cleanedFileName = file.name.replace(/\s/g, '_');
                const folder = file.isVideo ? 'videos' : 'images';
                const tableName = file.isVideo ? 'idectablevideos' : 'idectableimages';
                
                // Subir archivo al bucket
                const { error: uploadError } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(`${folder}/${cleanedFileName}`, file);

                if (uploadError) throw uploadError;

                const url = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${folder}/${cleanedFileName}`;
                const slug = nanoid(10);

                // Insertar en la tabla correspondiente
                const { error: insertError } = await supabase
                    .from(tableName)
                    .insert({
                        url,
                        description,
                        hashtags: hashtags.join(','),
                        user_id: user?.id,
                        email: user?.email,
                        slug,
                    });

                if (insertError) throw insertError;
            }

            toast({
                title: "Success",
                description: "¡Contenido subido con éxito!",
            });

            // Limpiar el formulario
            setMediaFiles([]);
            setDescription('');
            setHashtags([]);

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Ocurrió un error al subir el contenido.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
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

                    {mediaFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {mediaFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    {file.isVideo ? (
                                        <video 
                                            src={file.preview} 
                                            className="w-full h-24 object-cover rounded" 
                                            controls
                                        />
                                    ) : (
                                        <img 
                                            src={file.preview} 
                                            alt={`Preview ${index}`} 
                                            className="w-full h-24 object-cover rounded" 
                                        />
                                    )}
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
                                className="hidden"
                                onChange={(e) => handleFileChange(e, false)}
                                accept={ALLOWED_IMAGE_TYPES.join(',')}
                                multiple
                            />
                            <input
                                ref={videoInputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, true)}
                                accept={ALLOWED_VIDEO_TYPES.join(',')}
                                multiple
                            />
                            <Button
                                type="button"
                                className="flex-grow sm:flex-grow-0 mt-2 sm:mt-0"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Fotos
                            </Button>
                            <Button
                                type="button"
                                className="flex-grow sm:flex-grow-0 mt-2 sm:mt-0"
                                onClick={() => videoInputRef.current?.click()}
                            >
                                <Video className="mr-2 h-4 w-4" />
                                Videos
                            </Button>
                            <UploadForm/>
                        </div>
                        <Button 
                            type="submit" 
                            className="mt-2 sm:mt-0" 
                            disabled={isUploading}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {isUploading ? 'Publicando...' : 'Publicar'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default UseUploading;