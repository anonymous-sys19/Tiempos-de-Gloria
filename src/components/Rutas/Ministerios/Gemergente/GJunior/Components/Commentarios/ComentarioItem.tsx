import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Reply } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Comentario, Respuesta } from '@/types/Ministerios/commentarios';
interface ComentarioItemProps {
  comentario: Comentario;
}

export function ComentarioItem({ comentario }: ComentarioItemProps) {
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);
  const [respuesta, setRespuesta] = useState('');
  const [liked, setLiked] = useState(false);

  const handleResponder = () => {
    // Aquí iría la lógica para enviar la respuesta
    console.log('Enviando respuesta:', respuesta);
    setRespuesta('');
    setRespondiendo(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comentario.usuario.avatar} />
          <AvatarFallback>{comentario.usuario.nombre[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted p-3 rounded-lg">
            <div className="font-semibold">{comentario.usuario.nombre}</div>
            <p>{comentario.contenido}</p>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className={liked ? "text-red-500" : ""}
              onClick={() => setLiked(!liked)}
            >
              <Heart className="w-4 h-4 mr-1" />
              {comentario.likes + (liked ? 1 : 0)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRespondiendo(!respondiendo)}
            >
              <Reply className="w-4 h-4 mr-1" />
              Responder
            </Button>
            <span className="text-muted-foreground">
              {format(new Date(comentario.createdAt), "d MMM yyyy 'a las' HH:mm", {
                locale: es,
              })}
            </span>
          </div>

          {respondiendo && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Escribe una respuesta..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRespondiendo(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleResponder}
                  disabled={!respuesta.trim()}
                >
                  Responder
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comentario.respuestas.length > 0 && (
        <div className="ml-11">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => setMostrarRespuestas(!mostrarRespuestas)}
          >
            {mostrarRespuestas
              ? 'Ocultar respuestas'
              : `Ver ${comentario.respuestas.length} respuestas`}
          </Button>

          {mostrarRespuestas && (
            <div className="space-y-3">
              {comentario.respuestas.map((respuesta) => (
                <RespuestaItem key={respuesta.id} respuesta={respuesta} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RespuestaItem({ respuesta }: { respuesta: Respuesta }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={respuesta.usuario.avatar} />
        <AvatarFallback>{respuesta.usuario.nombre[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="font-semibold">{respuesta.usuario.nombre}</div>
          <p>{respuesta.contenido}</p>
        </div>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className={liked ? "text-red-500" : ""}
            onClick={() => setLiked(!liked)}
          >
            <Heart className="w-4 h-4 mr-1" />
            {respuesta.likes + (liked ? 1 : 0)}
          </Button>
          <span className="text-muted-foreground">
            {format(new Date(respuesta.createdAt), "d MMM yyyy 'a las' HH:mm", {
              locale: es,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}