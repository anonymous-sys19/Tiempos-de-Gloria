"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { completeBibleData } from "../data/complete-bible-data"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChapterVerseTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const allBooks = [...completeBibleData.oldTestament, ...completeBibleData.newTestament]

  const filteredBooks = allBooks.filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Buscar libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs text-sm"
        />
      </div>

      <ScrollArea className="h-[300px] sm:h-[400px]">
        <div className="min-w-[600px]">
          <Table>
            <TableCaption className="text-xs sm:text-sm">
              Libros de la Biblia con sus capítulos y versículos
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] text-xs sm:text-sm">Libro</TableHead>
                <TableHead className="text-xs sm:text-sm">Testamento</TableHead>
                <TableHead className="text-xs sm:text-sm">Categoría</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Capítulos</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Versículos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium text-xs sm:text-sm">{book.name}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {completeBibleData.oldTestament.some((b) => b.id === book.id) ? "Antiguo" : "Nuevo"}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">{book.category}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">{book.chapters}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">{book.verses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  )
}

