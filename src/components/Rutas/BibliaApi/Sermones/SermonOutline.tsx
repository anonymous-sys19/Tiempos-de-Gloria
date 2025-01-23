import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SermonType } from '@/types/postTypes/sermon';

interface SermonOutlineProps {
  sermon: SermonType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SermonOutline({ sermon, isOpen, onOpenChange }: SermonOutlineProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800">
            {sermon.tema}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {sermon.pasaje}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 pr-4 max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Introducción</h3>
              <p className="text-gray-700 mb-2">{sermon.bosquejo.introduccion.texto}</p>
              <p className="text-gray-600 text-sm italic">{sermon.bosquejo.introduccion.contexto}</p>
            </div>

            <Separator className="my-6" />

            {sermon.bosquejo.puntos.map((punto, index) => (
              <div key={index} className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-800">
                  {index + 1}. {punto.titulo}
                </h4>
                <p className="text-gray-600 italic text-sm">{punto.contexto}</p>
                <div className="space-y-3 ml-6">
                  {punto.subpuntos.map((subpunto, subIndex) => (
                    <div key={subIndex} className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                      <p className="text-gray-800 font-medium mb-1">{subpunto.texto}</p>
                      <p className="text-gray-600 text-sm italic">{subpunto.contexto}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Separator className="my-6" />

            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Conclusión</h3>
              <p className="text-gray-700 mb-2">{sermon.bosquejo.conclusion.texto}</p>
              <p className="text-gray-600 text-sm italic">{sermon.bosquejo.conclusion.contexto}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}