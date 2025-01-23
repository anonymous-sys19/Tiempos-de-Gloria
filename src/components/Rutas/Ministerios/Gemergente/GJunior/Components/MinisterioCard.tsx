import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Building2, FileText, Image as ImageIcon, Video, Heart, MessageCircle, Share2, Download, Maximize2 } from "lucide-react";

export interface Publicacion {
    id: string;
    tipo: 'pdf' | 'imagen' | 'video' | 'texto';
    titulo: string;
    contenido: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    fecha: string;
    likes: number;
    comentarios: number;
    compartidos: number;
  }
  
  interface MinisterioCardProps {
    nombre: string;
    descripcion: string;
    imagen: string;
    publicaciones: Publicacion[];
  }
  
  export function MinisterioCard({ nombre, descripcion, imagen, publicaciones }: MinisterioCardProps) {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
    const toggleLike = (publicacionId: string) => {
      const newLikedPosts = new Set(likedPosts);
      if (newLikedPosts.has(publicacionId)) {
        newLikedPosts.delete(publicacionId);
      } else {
        newLikedPosts.add(publicacionId);
      }
      setLikedPosts(newLikedPosts);
    };
  
    const renderContenido = (publicacion: Publicacion) => {
      switch (publicacion.tipo) {
        case 'imagen':
          return (
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  <img
                    src={publicacion.mediaUrl}
                    alt={publicacion.titulo}
                    className="w-full rounded-lg object-cover max-h-[300px]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <img
                  src={publicacion.mediaUrl}
                  alt={publicacion.titulo}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          );
  
        case 'video':
          return (
            <div className="relative">
              <img
                src={publicacion.thumbnailUrl}
                alt={publicacion.titulo}
                className="w-full rounded-lg object-cover max-h-[300px]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
  
        case 'pdf':
          return (
            <div className="bg-muted p-6 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium">{publicacion.titulo}</h4>
                  <p className="text-sm text-muted-foreground">Documento PDF</p>
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={imagen} alt={nombre} />
            <AvatarFallback>
              <Building2 className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{nombre}</h2>
            <p className="text-muted-foreground">{descripcion}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {publicaciones.map((publicacion) => (
              <div key={publicacion.id} className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{publicacion.titulo}</h3>
                  <p className="text-muted-foreground mb-4">{publicacion.contenido}</p>
                  {renderContenido(publicacion)}
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={likedPosts.has(publicacion.id) ? "text-red-500" : ""}
                      onClick={() => toggleLike(publicacion.id)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {publicacion.likes + (likedPosts.has(publicacion.id) ? 1 : 0)}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {publicacion.comentarios}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      {publicacion.compartidos}
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {publicacion.fecha}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }