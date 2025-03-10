import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, User, FileText, BookMarkedIcon, Info, MessageSquare, History } from "lucide-react"
import { getBookDetails } from "../data/book-details"

interface BookDetailsModalProps {
  book: {
    id: string
    name: string
    chapters: number
    verses: number
    category: string
    color: string
  }
  isOpen: boolean
  onClose: () => void
}

// Mejorar la responsividad del modal de detalles
export function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
  const bookDetails = getBookDetails(book.id)

  const categoryColors: Record<string, string> = {
    Pentateuco: "bg-blue-100 text-blue-800",
    Históricos: "bg-green-100 text-green-800",
    Poéticos: "bg-purple-100 text-purple-800",
    "Profetas Mayores": "bg-red-100 text-red-800",
    "Profetas Menores": "bg-orange-100 text-orange-800",
    Evangelios: "bg-indigo-100 text-indigo-800",
    Historia: "bg-teal-100 text-teal-800",
    "Cartas Paulinas": "bg-amber-100 text-amber-800",
    "Cartas Generales": "bg-cyan-100 text-cyan-800",
    Profecía: "bg-rose-100 text-rose-800",
  }

  const headerColor = book.color.replace("bg-", "bg-opacity-20 bg-")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6 w-[calc(100%-2rem)]">
        <div
          className={`absolute top-0 left-0 right-0 h-12 sm:h-16 ${headerColor} -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 rounded-t-lg`}
        ></div>
        <DialogHeader className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-xl sm:text-2xl">{book.name}</DialogTitle>
            <Badge className={`text-xs ${categoryColors[book.category] || "bg-gray-100 text-gray-800"}`}>
              {book.category}
            </Badge>
          </div>
          <DialogDescription className="text-xs sm:text-sm">{bookDetails.subtitle}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4 mt-2">
          <Tabs defaultValue="resumen" className="mt-2">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
              <TabsTrigger value="resumen" className="text-xs sm:text-sm">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="autor" className="text-xs sm:text-sm">
                Autor
              </TabsTrigger>
              <TabsTrigger value="estructura" className="text-xs sm:text-sm">
                Estructura
              </TabsTrigger>
              <TabsTrigger value="temas" className="text-xs sm:text-sm">
                Temas Clave
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2 p-3">
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground">Capítulos</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{book.chapters}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2 p-3">
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground">Versículos</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{book.verses}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2 p-3">
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground">Fecha</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-base sm:text-lg font-bold">{bookDetails.date}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  <h3 className="font-semibold text-base sm:text-lg">Acerca del Libro</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{bookDetails.summary}</p>
              </div>

              {bookDetails.keyVerses && bookDetails.keyVerses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookMarkedIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    <h3 className="font-semibold text-base sm:text-lg">Versículos Clave</h3>
                  </div>
                  <div className="space-y-2">
                    {bookDetails.keyVerses.map((verse, index) => (
                      <div key={index} className="p-2 sm:p-3 bg-slate-50 rounded-md">
                        <p className="text-xs sm:text-sm font-medium mb-1">{verse.reference}</p>
                        <p className="text-xs sm:text-sm italic text-muted-foreground">{verse.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="autor" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto sm:mx-0">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold">{bookDetails.author}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{bookDetails.authorRole}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  <h3 className="font-semibold text-base sm:text-lg">Contexto Histórico</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {bookDetails.historicalContext}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  <h3 className="font-semibold text-base sm:text-lg">Sobre el Autor</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{bookDetails.authorInfo}</p>
              </div>
            </TabsContent>

            <TabsContent value="estructura" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  <h3 className="font-semibold text-base sm:text-lg">Estructura del Libro</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {bookDetails.structure.map((section, index) => (
                    <Card key={index}>
                      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
                        <CardTitle className="text-xs sm:text-sm">{section.title}</CardTitle>
                        <CardDescription className="text-xs">{section.chapters}</CardDescription>
                      </CardHeader>
                      <CardContent className="py-0 px-3 sm:px-4 pb-3">
                        <p className="text-xs text-muted-foreground">{section.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="temas" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  <h3 className="font-semibold text-base sm:text-lg">Temas Principales</h3>
                </div>
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                  {bookDetails.themes.map((theme, index) => (
                    <Card key={index}>
                      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
                        <CardTitle className="text-xs sm:text-sm">{theme.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 px-3 sm:px-4 pb-3">
                        <p className="text-xs text-muted-foreground">{theme.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {bookDetails.application && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    <h3 className="font-semibold text-base sm:text-lg">Aplicación Práctica</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{bookDetails.application}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto text-xs sm:text-sm">
            Cerrar
          </Button>
          <Button className="w-full sm:w-auto text-xs sm:text-sm">Comenzar Estudio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

