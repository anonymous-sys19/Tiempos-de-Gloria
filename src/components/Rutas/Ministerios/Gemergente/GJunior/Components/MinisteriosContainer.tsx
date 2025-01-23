import { MinisterioCard, type Publicacion } from './MinisterioCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Ministerio {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  publicaciones: Publicacion[];
}

interface MinisteriosContainerProps {
  ministeriosData: Ministerio[];
}

export function MinisteriosContainer({ ministeriosData }: MinisteriosContainerProps) {
  return (
    <ScrollArea className="h-[800px] w-full rounded-md border p-4">
      <div className="space-y-8 max-w-4xl mx-auto">
        {ministeriosData.map((ministerio) => (
          <MinisterioCard
            key={ministerio.id}
            {...ministerio}
          />
        ))}
      </div>
    </ScrollArea>
  );
}