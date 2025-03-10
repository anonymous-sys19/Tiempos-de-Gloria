import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Book, Bookmark, BookOpen } from "lucide-react"
import { useState } from "react"
import { BookDetailsModal } from "./book-details-modal"

interface BookCardProps {
  book: {
    id: string
    name: string
    chapters: number
    verses: number
    category: string
    color: string
  }
}

// Mejorar la responsividad de las tarjetas de libros
export function BookCard({ book }: BookCardProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const categoryColors: Record<string, string> = {
    Pentateuco: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Históricos: "bg-green-100 text-green-800 hover:bg-green-200",
    Poéticos: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "Profetas Mayores": "bg-red-100 text-red-800 hover:bg-red-200",
    "Profetas Menores": "bg-orange-100 text-orange-800 hover:bg-orange-200",
    Evangelios: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    Historia: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    "Cartas Paulinas": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "Cartas Generales": "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    Profecía: "bg-rose-100 text-rose-800 hover:bg-rose-200",
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        <div className={`h-2 ${book.color}`}></div>
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">{book.name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 -mr-1"
              onClick={() => setBookmarked(!bookmarked)}
              aria-label={bookmarked ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${bookmarked ? "fill-indigo-600 text-indigo-600" : ""}`} />
            </Button>
          </div>
          <Badge className={`text-xs ${categoryColors[book.category] || "bg-gray-100 text-gray-800"}`}>
            {book.category}
          </Badge>
        </CardHeader>
        <CardContent className="pb-2 px-3 sm:px-4 flex-grow">
          <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span>{book.chapters} capítulos</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span>{book.verses} versículos</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          <Button
            variant="outline"
            className="w-full text-xs sm:text-sm h-8 sm:h-9"
            onClick={() => setShowDetails(true)}
          >
            Detalles
          </Button>
        </CardFooter>
      </Card>

      <BookDetailsModal book={book} isOpen={showDetails} onClose={() => setShowDetails(false)} />
    </>
  )
}

