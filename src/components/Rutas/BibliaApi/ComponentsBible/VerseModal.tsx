import * as React from 'react';
import { Copy, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Verse } from '@/types/bibleType/bible';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: Verse;
  book: string;
  chapter: string;
  version: string;
}

export function VerseModal({ isOpen, onClose, verse, book, chapter, version }: VerseModalProps) {
  const { toast } = useToast();
  const verseRef = React.useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const text = `${book} ${chapter}:${verse.number} (${version})\n${verse.verse}`;
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: "El versículo ha sido copiado exitosamente.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${book} ${chapter}:${verse.number} (${version})`,
          text: `${verse.verse}\n\n${book} ${chapter}:${verse.number} (${version})`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{book} {chapter}:{verse.number}</span>
            <span className="text-sm text-muted-foreground">({version})</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div
            ref={verseRef}
            className="relative rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center shadow-sm"
          >
            {verse.study && (
              <div className="mb-3 text-sm font-medium text-blue-600">{verse.study}</div>
            )}
            <p className="text-lg text-gray-800">{verse.verse}</p>
            <div className="mt-2 text-sm font-medium text-gray-600">
              {book} {chapter}:{verse.number}
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}