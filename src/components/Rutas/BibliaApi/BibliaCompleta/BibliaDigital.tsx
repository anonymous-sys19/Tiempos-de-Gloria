import * as React from 'react'
import { Book, ChevronDown, Copy, Menu, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BIBLE_VERSIONS, Verse, Verses } from '@/types/bibleType/bible'
import { VerseModal } from '../ComponentsBible/VerseModal'
import { VersionSelector } from '../ComponentsBible/VersionSelector'
import { Layout } from '@/components/Loyout/Loyout'
import { booksChapters  } from '@/types/bibleType/books'
const BASE_URL_BIBLE = import.meta.env.VITE_API_BASE_URL

// const booksChapters = {
//   Génesis: 50,
//   Éxodo: 40,
//   Levítico: 27,
//   Números: 36,
//   Deuteronomio: 34,
//   Josué: 24,
//   Jueces: 21,
//   Rut: 4,
//   '1 Samuel': 31,
//   '2 Samuel': 24,
//   '1 Reyes': 22,
//   '2 Reyes': 25,
//   '1 Crónicas': 29,
//   '2 Crónicas': 36,
//   Esdras: 10,
//   Nehemías: 13,
//   Ester: 10,
//   Job: 42,
//   Salmos: 150,
//   Proverbios: 31,
//   Eclesiastés: 12,
//   Cantares: 8,
//   Isaías: 66,
//   Jeremías: 52,
//   Lamentaciones: 5,
//   Ezequiel: 48,
//   Daniel: 12,
//   Oseas: 14,
//   Joel: 3,
//   Amós: 9,
//   Abdías: 1,
//   Jonás: 4,
//   Miqueas: 7,
//   Nahúm: 3,
//   Habacuc: 3,
//   Sofonías: 3,
//   Hageo: 2,
//   Zacarías: 14,
//   Malaquías: 4,
//   Mateo: 28,
//   Marcos: 16,
//   Lucas: 24,
//   Juan: 21,
//   Hechos: 28,
//   Romanos: 16,
//   '1 Corintios': 16,
//   '2 Corintios': 13,
//   Gálatas: 6,
//   Efesios: 6,
//   Filipenses: 4,
//   Colosenses: 4,
//   '1 Tesalonicenses': 5,
//   '2 Tesalonicenses': 3,
//   '1 Timoteo': 6,
//   '2 Timoteo': 4,
//   Tito: 3,
//   Filemón: 1,
//   Hebreos: 13,
//   Santiago: 5,
//   '1 Pedro': 5,
//   '2 Pedro': 3,
//   '1 Juan': 5,
//   '2 Juan': 1,
//   '3 Juan': 1,
//   Judas: 1,
//   Apocalipsis: 22,
// } as const;



const antiguoTestamento = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel',
  '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
  'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios',
  'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones',
  'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós',
  'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc',
  'Sofonías', 'Hageo', 'Zacarías', 'Malaquías'
]

const nuevoTestamento = [
  'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos',
  'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
  'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',
  '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago',
  '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan',
  'Judas', 'Apocalipsis'
]


// function quitarTildes(nombre: string): string {
//   return nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// }
function quitarTildes(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
    .replace(/\s+/g, "-")             // Reemplazar espacios por guiones
    .toLowerCase();                   // Convertir a minúsculas si deseas uniformidad
}

async function fetchChapterContent(
  version: string,
  book: string,
  chapter: string
): Promise<Verses | null> {
  try {
    const response = await fetch(
      `${BASE_URL_BIBLE}/read/${version}/${book}/${chapter}`
    );
    const data = await response.json();
    if (Array.isArray(data.vers)) {
      return data.vers as Verses;
    }
    console.error('Formato de datos no esperado:', data);
    return null;
  } catch (error) {
    console.error('Error fetching chapter content:', error);
    return null;
  }
}

export default function BibliaDigitalComplet() {
  const [selectedVersion, setSelectedVersion] = React.useState(BIBLE_VERSIONS[0].version);
  const [selectedBook, setSelectedBook] = React.useState('');
  const [chapterRange, setChapterRange] = React.useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = React.useState('');
  const [chapterContent, setChapterContent] = React.useState<Verses | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedVerse, setSelectedVerse] = React.useState<Verse | null>(null);

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version);
    if (selectedBook && selectedChapter) {
      const content = await fetchChapterContent(version, quitarTildes(selectedBook), selectedChapter);
      setChapterContent(content);
    }
  };

  const handleBookSelect = (book: string | number | symbol) => {
    const bookStr = String(book);
    const chapters = booksChapters[bookStr as keyof typeof booksChapters];
    setChapterRange(Array.from({ length: chapters }, (_, i) => i + 1));
    setSidebarOpen(false);
    setSelectedChapter('');
    setChapterContent(null);
    setSelectedBook(bookStr);
  };

  const handleChapterSelect = async (chapter: string) => {
    setSelectedChapter(chapter);
    const content = await fetchChapterContent(selectedVersion, quitarTildes(selectedBook), chapter);
    setChapterContent(content);
  };

  const handleVerseClick = (verse: Verse) => {
    setSelectedVerse(verse);
  };

  return (
    <Layout>
      <div className="flex h-screen flex-col md:flex-row bg-gray-100">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Biblia Digital</SheetTitle>
              <SheetDescription>Selecciona un libro para comenzar</SheetDescription>
            </SheetHeader>
            <BibliaSidebar onSelectBook={handleBookSelect} />
          </SheetContent>
        </Sheet>

        <aside className="hidden w-full md:w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4 md:block">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Biblia Digital</h1>
          <BibliaSidebar onSelectBook={handleBookSelect} />
        </aside>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedBook || 'Selecciona un libro'}
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <VersionSelector
                    selectedVersion={selectedVersion}
                    onVersionChange={handleVersionChange}
                  />
                  {selectedBook && (
                    <Select onValueChange={(value) => handleChapterSelect(value)}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Selecciona un capítulo" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapterRange.map((chapter) => (
                          <SelectItem key={chapter} value={chapter.toString()}>
                            Capítulo {chapter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>

            {selectedBook && selectedChapter && Array.isArray(chapterContent) ? (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 flex items-center justify-between">
                  <span>{selectedBook} - Capítulo {selectedChapter}</span>
                  <span className="text-sm text-muted-foreground">
                    ({BIBLE_VERSIONS.find(v => v.version === selectedVersion)?.name})
                  </span>
                </h3>
                <div className="space-y-4">
                  {chapterContent.map((verse) => (
                    <div
                      key={verse.id}
                      onClick={() => handleVerseClick(verse)}
                      className="group cursor-pointer rounded-lg p-4 transition-all hover:bg-gray-50"
                    >
                      {verse.study && (
                        <div className="mb-2 text-sm font-medium text-blue-600">{verse.study}</div>
                      )}
                      <div className="flex items-start space-x-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                          {verse.number}
                        </span>
                        <p className="flex-1 text-gray-700">{verse.verse}</p>
                      </div>
                      <div className="mt-2 hidden group-hover:flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-6 text-center shadow-md">
                <Book className="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
                <p className="mt-4 text-gray-600">
                  Selecciona un libro y un capítulo para comenzar a leer.
                </p>
              </div>
            )}
          </div>
        </main>

        {selectedVerse && (
          <VerseModal
            isOpen={!!selectedVerse}
            onClose={() => setSelectedVerse(null)}
            verse={selectedVerse}
            book={selectedBook}
            chapter={selectedChapter}
            version={BIBLE_VERSIONS.find(v => v.version === selectedVersion)?.name || selectedVersion}
          />
        )}
      </div>
    </Layout>
  );
}

// BibliaSidebar and TestamentSection components remain the same
// ... (keep the existing components)

function BibliaSidebar({ onSelectBook }: { onSelectBook: (book: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredAntiguoTestamento = antiguoTestamento.filter((book) =>
    quitarTildes(book).toLowerCase().includes(quitarTildes(searchTerm).toLowerCase())
  )

  const filteredNuevoTestamento = nuevoTestamento.filter((book) =>
    quitarTildes(book).toLowerCase().includes(quitarTildes(searchTerm).toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Buscar libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <ScrollArea className="flex-1">
        <TestamentSection
          title="Antiguo Testamento"
          books={filteredAntiguoTestamento}
          onSelectBook={onSelectBook}
        />
        <TestamentSection
          title="Nuevo Testamento"
          books={filteredNuevoTestamento}
          onSelectBook={onSelectBook}
        />
      </ScrollArea>
    </div>
  )
}

function TestamentSection({ title, books, onSelectBook }: {
  title: string
  books: string[]
  onSelectBook: (book: string) => void
}) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        className="w-full justify-between font-semibold"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`section-${title}`}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} aria-hidden="true" />
      </Button>
      {isOpen && (
        <ul id={`section-${title}`} className="mt-2 space-y-1">
          {books.map((book) => (
            <li key={book}>
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => onSelectBook(book)}
              >
                {book}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
