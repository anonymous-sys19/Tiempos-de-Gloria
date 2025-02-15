interface Props {
  chapters: number;
  selectedChapter: number | null;
  onSelectChapter: (chapter: number) => void;
}

export function ChapterSelector({ chapters, selectedChapter, onSelectChapter }: Props) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
      {Array.from({ length: chapters }, (_, i) => i + 1).map((chapter) => (
        <button
          key={chapter}
          onClick={() => onSelectChapter(chapter)}
          className={`p-2 rounded-lg ${
            selectedChapter === chapter
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {chapter}
        </button>
      ))}
    </div>
  );
}