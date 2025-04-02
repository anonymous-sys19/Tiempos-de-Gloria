import { useState, useEffect } from 'react';
import { Book, Verse, SearchResult, BibleVersion } from './types';
import { VersionSelector } from './components/VersionSelector';
import { Sidebar } from './components/Sidebar';
import { VerseSelector } from './components/VerseSelector';
import { VerseList } from './components/VerseList';
import { SearchInput } from './components/SearchInput';
import { Book as BookIcon, Search as SearchIcon, Menu, X } from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [version, setVersion] = useState<BibleVersion>("rvr1960");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [maxVerses, setMaxVerses] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar libros al montar el componente
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/${version}/books`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const booksWithTestament = data.map((book: Book) => ({
          ...book,
          testament: book.id <= 39 ? "old" : "new",
        }));
        setBooks(booksWithTestament);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Error al cargar los libros. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [version]);
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      fetchVerses();
    }
  }, [version, selectedBook, selectedChapter]);

  useEffect(() => {
    if (verses.length > 0) {
      setMaxVerses(Math.max(...verses.map((v) => v.verse)));
    }
  }, [verses]);

  // const fetchBooks = async () => {
  //   try {
  //     setError(null);
  //     const response = await fetch(`${API_URL}/${version}/books`);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     const booksWithTestament = data.map((book: Book) => ({
  //       ...book,
  //       testament: book.id <= 39 ? 'old' : 'new',
  //     }));
  //     setBooks(booksWithTestament);
  //   } catch (error) {
  //     console.error('Error fetching books:', error);
  //     setError('Error al cargar los libros. Por favor, intente más tarde.');
  //     setBooks([]);
  //   }
  // };

  const fetchVerses = async () => {
    try {
      setError(null);
      const response = await fetch(
        `${API_URL}/${version}/${selectedBook}/${selectedChapter}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVerses(data);
    } catch (error) {
      console.error("Error fetching verses:", error);
      setError("Error al cargar los versículos. Por favor, intente más tarde.");
      setVerses([]);
    }
  };

  const handleSearch = async (keyword: string) => {
    try {
      setError(null);
      setIsSearching(true);
      const response = await fetch(
        `${API_URL}/${version}/search/${encodeURIComponent(keyword)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching:", error);
      setError("Error al realizar la búsqueda. Por favor, intente más tarde.");
      setSearchResults([]);
    }
  };

  const handleBookSearch = (keyword: string) => {
    const normalizedKeyword = keyword
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const filtered = books.filter((book) =>
      book.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(normalizedKeyword)
    );
    setBooks(filtered);

    if (!keyword) {
      setBooks(books);
    }
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setSelectedVerse(null);
    setIsSearching(false);
    setSelectedVerses(new Set());
    setIsSidebarOpen(false);
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setSelectedVerse(null);
    setIsSearching(false);
    setSelectedVerses(new Set());
  };

  const handleVerseSelect = (verse: number) => {
    setSelectedVerse(verse);
  };

  const handleVerseToggle = (verseId: string) => {
    const newSelected = new Set(selectedVerses);
    if (newSelected.has(verseId)) {
      newSelected.delete(verseId);
    } else {
      newSelected.add(verseId);
    }
    setSelectedVerses(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedVerses(new Set());
  };

  const handleShare = (versesToShare: Verse[]) => {
    const text = versesToShare
      .map(
        (verse) =>
          `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`
      )
      .join("\n\n");

    if (navigator.share) {
      navigator
        .share({
          title: "Versículos Bíblicos",
          text: text,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Versículos copiados al portapapeles");
        })
        .catch(console.error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-20
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar
          books={books}
          selectedBook={selectedBook}
          onSelectBook={handleBookSelect}
          onBookSearch={handleBookSearch}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                >
                  {isSidebarOpen ? (
                    <X size={20} className="text-gray-600" />
                  ) : (
                    <Menu size={20} className="text-gray-600" />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <BookIcon className="text-blue-500" size={24} />
                  <h1 className="hidden md:flex text-xl font-bold text-gray-900">
                    Santa Biblia
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* <div className="w-48">
                  <VersionSelector version={version} onVersionChange={setVersion} />
                </div> */}
                <div className="w-auto">
                  <SearchInput
                    placeholder="Buscar en la Biblia..."
                    onSearch={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <p >Cargando libros...</p>
            </div>
          )}
          {error && (
            <div className="max-w-5xl mx-auto p-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto p-6 space-y-6">
            {isSearching ? (
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <VersionSelector
                    version={version}
                    onVersionChange={setVersion}
                  />
                  <SearchIcon className="text-blue-500" size={20} />
                  <h2 className="text-xl font-semibold hidden md:contents">
                    Resultados de búsqueda
                  </h2>
                </div>

                <VerseList
                  verses={searchResults}
                  selectedVerses={selectedVerses}
                  onVerseSelect={handleVerseToggle}
                  onShare={handleShare}
                  onClearSelection={handleClearSelection}
                />
              </div>
            ) : (
              <>
                {selectedBook && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedBook}
                      </h2>
                    </div>

                    <VerseSelector
                      chapters={
                        books.find((b) => b.name === selectedBook)?.chapters ||
                        0
                      }
                      selectedChapter={selectedChapter}
                      selectedVerse={selectedVerse}
                      maxVerses={maxVerses}
                      onSelectChapter={handleChapterSelect}
                      onSelectVerse={handleVerseSelect}
                    />

                    {selectedChapter && (
                      <>
                        <VersionSelector
                          version={version}
                          onVersionChange={setVersion}
                        />
                        <VerseList
                          verses={verses}
                          selectedVerses={selectedVerses}
                          onVerseSelect={handleVerseToggle}
                          onShare={handleShare}
                          onClearSelection={handleClearSelection}
                        />
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;