"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Heart, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface VerseHighlightProps {
  reference: string
  text: string
  category: string
  explanation?: string
}

export function VerseHighlight({ reference, text, category, explanation }: VerseHighlightProps) {
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const categoryColors: Record<string, string> = {
    Salvación: "bg-red-100 text-red-800 hover:bg-red-200",
    Creación: "bg-green-100 text-green-800 hover:bg-green-200",
    "Gran Comisión": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Fe: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Amor: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    Esperanza: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${reference}: ${text}`)
    toast({
      title: "¡Copiado al portapapeles!",
      description: `${reference} ha sido copiado.`,
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-indigo-700">{reference}</h3>
          <Badge className={`text-xs ${categoryColors[category] || "bg-gray-100 text-gray-800"}`}>{category}</Badge>
        </div>
        <p className="mb-2 text-xs sm:text-sm">{text}</p>

        {explanation && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-muted-foreground flex items-center text-xs font-medium"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ocultar explicación" : "Ver explicación"}
              {expanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
            </Button>

            {expanded && (
              <div className="mt-2 text-xs text-muted-foreground bg-slate-50 p-2 rounded-md">{explanation}</div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2" onClick={handleLike}>
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2 ml-auto" onClick={handleCopy}>
            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

