import { SermonType } from "@/data/types/postTypes/sermon";
import { SermonCard } from "./SermonCard";

interface SermonListProps {
  sermones: SermonType[];
  onViewOutline: (id: string) => void;
}

export function SermonList({ sermones, onViewOutline }: SermonListProps) {
  if (sermones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">
          No se encontraron sermones que coincidan con tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <>
      {sermones.map((sermon) => (
        <SermonCard
          key={sermon.id}
          sermon={sermon}
          onViewOutline={() => onViewOutline(sermon.id)}
        />
      ))}
    </>
  );
}
