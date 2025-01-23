import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Download, Maximize2 } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Publicacion } from '@/types/Ministerios/MinisType';
import { ComentariosSeccion } from './Commentarios/ComentariosSeccion';
import { ComentarioItem } from './Commentarios/ComentarioItem';

interface PublicacionCardProps {
  publicacion: Publicacion;
}

export function PublicacionCard({ publicacion }: PublicacionCardProps) {
  const [liked, setLiked] = useState(false);

  const renderContenido = () => {
    switch (publicacion.tipo) {
      case 'imagen':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative group cursor-pointer">
                <img
                  src={publicacion.mediaUrl}
                  alt={publicacion.titulo}
                  className="w-full rounded-lg object-cover max-h-[500px]"
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
          <video
            controls
            className="w-full rounded-lg"
            poster={publicacion.thumbnailUrl}
          >
            <source src={publicacion.mediaUrl} type="video" />
            Tu navegador no soporta el elemento de video.
          </video>
        );

      case 'pdf':
        return (
          <div className="bg-muted p-6 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">{publicacion.titulo}</h4>
                <p className="text-sm text-muted-foreground">
                  Documento PDF
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" asChild>
              <a href={publicacion.mediaUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4" />
              </a>
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-xl font-semibold">{publicacion.titulo}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(publicacion.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{publicacion.descripcion}</p>
        {renderContenido()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={liked ? "text-red-500" : ""}
            onClick={() => setLiked(!liked)}
          >
            <Heart className="w-4 h-4 mr-2" />
            {publicacion.likes + (liked ? 1 : 0)}
          </Button>
          <Button variant="ghost" size="sm" onClick={ () => {
             <ComentariosSeccion publicacionId={publicacion.id} />
          }} >
            <MessageCircle className="w-4 h-4 mr-2" />
            {publicacion.comentarios}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            {publicacion.compartidos}
          </Button>
        </div>
      </CardFooter>
      
    </Card>
  );
}