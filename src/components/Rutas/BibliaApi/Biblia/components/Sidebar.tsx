import  { useState } from 'react';
import { Book, ChevronRight, ChevronDown } from 'lucide-react';
import type { Book as BookType } from '../types';
import { SearchInput } from './SearchInput';

interface TestamentHeaderProps { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void;
  count: number;
}

const TestamentHeader = ({ title, isOpen, onToggle, count }: TestamentHeaderProps) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-2 rounded-lg text-sm
      bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100 transition-colors mb-2"
  >
    <span className="font-semibold text-gray-700">{title}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs px-2 py-1 rounded-full bg-gray-200/80 text-gray-600">
        {count}
      </span>
      {isOpen ? (
        <ChevronDown size={16} className="text-gray-500" />
      ) : (
        <ChevronRight size={16} className="text-gray-500" />
      )}
    </div>
  </button>
);

interface Props {
  books: BookType[];
  selectedBook: string | null;
  onSelectBook: (book: string) => void;
  onBookSearch: (keyword: string) => void;
}

export function Sidebar({ books, selectedBook, onSelectBook, onBookSearch }: Props) {
  const [showOldTestament, setShowOldTestament] = useState(true);
  const [showNewTestament, setShowNewTestament] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const oldTestament = books.filter((book) => book.testament === 'old');
  const newTestament = books.filter((book) => book.testament === 'new');

  const filteredOldTestament = oldTestament.filter(book =>
    book.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  const filteredNewTestament = newTestament.filter(book =>
    book.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onBookSearch(value);
  };

  return (
    <aside className="w-80 h-screen flex flex-col bg-white/80 backdrop-blur-md border-r border-gray-200">
      <div className=" mt-20 md:mt-auto p-4 border-b border-gray-200 bg-white/90">
        <SearchInput
          placeholder="Buscar libro..."
          onSearch={handleSearch}
          onChange={handleSearch}
          className="mb-2"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <BookSection 
          title="Antiguo Testamento" 
          books={filteredOldTestament} 
          isOpen={showOldTestament}
          onToggle={() => setShowOldTestament(!showOldTestament)}
          selectedBook={selectedBook}
          onSelectBook={onSelectBook}
        />
        <BookSection 
          title="Nuevo Testamento" 
          books={filteredNewTestament} 
          isOpen={showNewTestament}
          onToggle={() => setShowNewTestament(!showNewTestament)}
          selectedBook={selectedBook}
          onSelectBook={onSelectBook}
        />
      </div>
    </aside>
  );
}

interface BookSectionProps {
  title: string;
  books: BookType[];
  isOpen: boolean;
  onToggle: () => void;
  selectedBook: string | null;
  onSelectBook: (book: string) => void;
}

function BookSection({ title, books, isOpen, onToggle, selectedBook, onSelectBook }: BookSectionProps) {
  return (
    <div className="mb-6">
      <TestamentHeader
        title={title}
        isOpen={isOpen}
        onToggle={onToggle}
        count={books.length}
      />
      {isOpen && (
        <div className="space-y-1 transition-all duration-300">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => onSelectBook(book.name)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all duration-200
                ${
                  selectedBook === book.name
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <Book size={16} className={selectedBook === book.name ? 'text-blue-500' : 'text-gray-400'} />
                <span>{book.name}</span> 
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {book.chapters} 
                  {book.chapters === 1 ? ' capítulo' : ' capítulos'}
                </span>
                <ChevronRight size={16} className={selectedBook === book.name ? 'text-blue-500' : 'text-gray-300'} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
