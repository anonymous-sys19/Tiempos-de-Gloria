import type { Book } from '../types';

interface Props {
  books: Book[];
  selectedBook: string | null;
  onSelectBook: (book: string) => void;
}

export function BookList({ books, selectedBook, onSelectBook }: Props) {
  const oldTestament = books.filter((book) => book.testament === 'old');
  const newTestament = books.filter((book) => book.testament === 'new');

  const BookSection = ({ title, books }: { title: string; books: Book[] }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => onSelectBook(book.name)}
            className={`p-2 rounded-lg text-sm ${
              selectedBook === book.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <div>{book.name}</div>
            <div className="text-xs opacity-75">{book.chapters} capítulos</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <BookSection title="Antiguo Testamento" books={oldTestament} />
      <BookSection title="Nuevo Testamento" books={newTestament} />
    </div>
  );
}