import { Book, Hash, Share2, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { SermonType } from '@/types/postTypes/sermon';

interface SermonCardProps {
  sermon: SermonType;
  onViewOutline: () => void;
}

export function SermonCard({ sermon, onViewOutline }: SermonCardProps) {
  return (
    <Card className="mb-8 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-blue-800 tracking-tight">{sermon.tema}</CardTitle>
        <CardDescription className="flex items-center text-gray-600 text-lg">
          <Book className="mr-2" size={20} />
          {sermon.pasaje}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-lg leading-relaxed">{sermon.contenido}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {sermon.hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-blue-200"
            >
              <Hash size={14} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            onClick={onViewOutline}
          >
            <MessageCircle className="mr-2" size={18} />
            Ver Bosquejo
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          >
            <Share2 className="mr-2" size={18} />
            Compartir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}