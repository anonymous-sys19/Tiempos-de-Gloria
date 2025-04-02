import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2, Copy } from "lucide-react";
import { toast } from "@/data/hooks/use-toast";
import { Layout } from "@/components/Loyout/Loyout";
import axios from "axios";

interface Verse {
  id: number;
  tema: string;
  rol: string;
  pasaje: string;
  descripcion: string;
  verse: string;
}

export default function PortalBiblico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null); // Estado para el verso seleccionado

  useEffect(() => {
    axios
      .get("https://api-cors-acept.onrender.com/api/verses/")
      .then((response) => setVerses(response.data))
      .catch((error) => {
        setError("Error al cargar los versos");
        console.error("Error fetching data:", error);
      });
  }, []);

  // Función para quitar tildes de un texto
  const quitarTildes = (text: string): string => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrar los eventos según el término de búsqueda ignorando tildes
  const filteredEvents = verses.filter(
    (event) =>
      quitarTildes(event.tema)
        .toLowerCase()
        .includes(quitarTildes(searchTerm).toLowerCase()) ||
      quitarTildes(event.rol)
        .toLowerCase()
        .includes(quitarTildes(searchTerm).toLowerCase())
  );

  const handleShare = (event: Verse) => {
    navigator
      .share({
        title: `${event.tema}\n ${event.pasaje}`,
        text: `${event.descripcion}\n\n${event.verse}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Compartido con éxito",
          description: "El evento bíblico ha sido compartido.",
        });
      })
      .catch((error) => {
        console.error("Error sharing:", error);
        toast({
          title: "Error al compartir",
          description: "No se pudo compartir el evento. Intente nuevamente.",
          variant: "destructive",
        });
      });
  };

  const handleCopy = (event: Verse) => {
    const textToCopy = `${event.tema}\n\n${event.pasaje}\n\n${event.descripcion}\n\n${event.verse}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copiado al portapapeles",
          description: "El contenido del evento ha sido copiado.",
        });
      })
      .catch((error) => {
        console.error("Error copying text:", error);
        toast({
          title: "Error al copiar",
          description: "No se pudo copiar el contenido. Intente nuevamente.",
          variant: "destructive",
        });
      });
  };
  <h2>{error}</h2>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">
          Línea de Tiempo Bíblica
        </h1>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="mb-6">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${event.tema}`}
                  />
                  <AvatarFallback>{event.tema[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <CardTitle>{event.tema}</CardTitle>
                  <CardDescription>{event.rol}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare(event)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Compartir</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(event)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copiar</span>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVerse(event)}
                      >
                        Ver más
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{selectedVerse?.tema}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">
                          {selectedVerse?.pasaje}
                        </p>
                        <p className="mb-4">{selectedVerse?.descripcion}</p>
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic">
                          {selectedVerse?.verse}
                        </blockquote>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{event.pasaje}</p>
                <p className="mb-4">{event.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </Layout>
  );
}
