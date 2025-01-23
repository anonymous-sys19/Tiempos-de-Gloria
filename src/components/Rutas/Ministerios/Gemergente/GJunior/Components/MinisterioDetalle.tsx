import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicacionCard } from './PublicacionCard';
import type { Publicacion, Ministerio } from '@/types/Ministerios/MinisType';
import { obtenerMinisterioPorSlug, obtenerPublicacionesMinisterio } from '@/lib/supabase-client';

interface MinisterioDetalleProps {
  slug: string;
}

export function MinisterioDetalle({ slug }: MinisterioDetalleProps) {
  const [ministerio, setMinisterio] = useState<Ministerio | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const ministerioData = await obtenerMinisterioPorSlug(slug);
        if (!ministerioData) {
          setError('Ministerio no encontrado');
          return;
        }
        
        setMinisterio(ministerioData);
        const publicacionesData = await obtenerPublicacionesMinisterio(ministerioData.id);
        setPublicaciones(publicacionesData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [slug]);

  if (cargando) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error || !ministerio) {
    return (
      <div className="text-center p-8 text-red-500">
        {error || 'No se encontró el ministerio'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{ministerio.nombre}</h1>
        <p className="text-muted-foreground mt-2">{ministerio.descripcion}</p>
      </div>
      
      <ScrollArea className="h-[800px]">
        <div className="space-y-6">
          {publicaciones.map((publicacion) => (
            <PublicacionCard
              key={publicacion.id}
              publicacion={publicacion}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}