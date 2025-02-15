import { Share2, X } from 'lucide-react';
import type { Verse } from '../types';

interface Props {
  verses: Verse[];
  selectedVerses: Set<string>;
  onVerseSelect: (verseId: string) => void;
  onShare: (verses: Verse[]) => void;
  onClearSelection: () => void;
}

export function VerseList({ verses, selectedVerses, onVerseSelect, onShare, onClearSelection }: Props) {
  const selectedVersesList = verses.filter(verse => 
    selectedVerses.has(`${verse.book}-${verse.chapter}-${verse.verse}`)
  );

  // Function to highlight Bible references in text
  const highlightReferences = (text: string) => {
    // Regex to match Bible references like [3Jn 1:15]
    const referenceRegex = /\[([\w\s]+\d+:\d+)\]/g;
    const parts = text.split(referenceRegex);
    
    return parts.map((part, index) => {
      if (part.match(referenceRegex)) {
        return (
          <span key={index} className="text-indigo-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative">
      {selectedVerses.size > 0 && (
        <div className="sticky top-0 z-10 mb-4 p-4 bg-blue-50/90 backdrop-blur-sm rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">
              {selectedVerses.size} versículo{selectedVerses.size !== 1 ? 's' : ''} seleccionado{selectedVerses.size !== 1 ? 's: ' : ''} 
              
              {/* Veo capitulo y versiculo que seleccione ejemplo: juan 1:1? */}

               { selectedVersesList.map((verse) => (
                <span className='text-gray-600 ' key={verse.id}>

                  {` ${verse.book} ${verse.chapter}:${verse.verse}, `}
                </span>
               )  ) }  
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClearSelection}
                className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <X size={16} />
                Limpiar
              </button>
              <button
                onClick={() => onShare(selectedVersesList)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Share2 size={16} />
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {verses.map((verse) => {
          const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
          const isSelected = selectedVerses.has(verseId);
          
          return (
            <div
              key={verse.id}
              id={`verse-${verse.verse}`}
              onClick={() => onVerseSelect(verseId)}
              className={`p-6 rounded-lg transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm' 
                  : 'bg-white hover:bg-gray-50 border border-gray-100'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {verse.verse}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </span>
                </div>
                {isSelected && (
                  <Share2 size={16} className="text-blue-500" />
                )}
              </div>
              <p className="text-gray-800 leading-relaxed font-serif">
                {highlightReferences(verse.text)}
              </p>
              {isSelected && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare([verse]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Share2 size={14} />
                    Compartir este versículo
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}