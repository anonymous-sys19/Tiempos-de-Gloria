import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ComentarioItem } from './ComentarioItem';
import { comentariosMock } from '../../data/comentaiosMock';
import type { Comentario } from '@/types/Ministerios/commentarios';

interface ComentariosSeccionProps {
  publicacionId: string;
}

export function ComentariosSeccion({ publicacionId }: ComentariosSeccionProps) {
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState<Comentario[]>(
    comentariosMock[publicacionId] || []
  );

  const handleComentar = () => {
    if (!comentario.trim()) return;

    const nuevoComentario: Comentario = {
      id: Date.now().toString(),
      publicacionId,
      usuarioId: 'usuario-actual',
      usuario: {
        nombre: 'Usuario Actual',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      },
      contenido: comentario,
      createdAt: new Date().toISOString(),
      likes: 0,
      respuestas: [],
    };

    setComentarios([nuevoComentario, ...comentarios]);
    setComentario('');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Textarea
          placeholder="Escribe un comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleComentar}
            disabled={!comentario.trim()}
          >
            Comentar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {comentarios.map((comentario) => (
          <ComentarioItem
            key={comentario.id}
            comentario={comentario}
          />
        ))}
      </div>
    </div>
  );
}