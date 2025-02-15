
import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown, Book, Bookmark } from "lucide-react"

interface Props {
  chapters: number
  selectedChapter: number | null
  selectedVerse: number | null
  maxVerses: number
  onSelectChapter: (chapter: number) => void
  onSelectVerse: (verse: number) => void
}

export function VerseSelector({
  chapters,
  selectedChapter,
  selectedVerse,
  maxVerses,
  onSelectChapter,
  onSelectVerse,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const chapterRef = useRef<HTMLDivElement>(null)
  const verseRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect()
        setIsFloating(top <= 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (selectedChapter && chapterRef.current) {
      const selectedButton = chapterRef.current.querySelector(`button:nth-child(${selectedChapter})`)
      selectedButton?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [selectedChapter])

  useEffect(() => {
    if (selectedVerse && verseRef.current) {
      const selectedButton = verseRef.current.querySelector(`button:nth-child(${selectedVerse})`)
      selectedButton?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [selectedVerse])

  const scrollToVerse = (verse: number) => {
    const element = document.getElementById(`verse-${verse}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ease-in-out ${
        isFloating ? "top-0 z-10  mb-6 transition-all duration-300" : "sticky top-0 z-10  mb-6 transition-all duration-300 rounded-3xl"
      }`}
    >
      <div
        className={`
       sticky top-0 z-10 mb-6 transition-all duration-300 
        ${isFloating ? "rounded-2xl" : "rounded-2xl"} 
        border border-blue-800 max-w-4xl mx-auto
      `}
      >
        <div className="rounded-3xl flex justify-between items-center px-6 py-4  backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-blue-500 flex items-center">
            <Book className="mr-2 h-5 w-5" />
            Navegación
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-blue-200 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-700 transform hover:scale-110"
          >
            {isExpanded ? (
              <ChevronUp size={24} className="text-blue-600" />
            ) : (
              <ChevronDown size={24} className="text-blue-600" />
            )}
          </button>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out rounded-3xl ${
            isExpanded ? "max-h-[32rem] opacity-100" : "max-h-0 hidden rounded-3xl"
          }`}
        >
          <div className="rounded-3xl p-6 bg-gray-200 bg-opacity-30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Capítulos */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-400 mb-4 flex items-center">
                  <Book className="mr-2 h-4 w-4" /> Capítulo
                </h3>
                <div
                  ref={chapterRef}
                  className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-2 futuristic-scrollbar"
                >
                  {Array.from({ length: chapters }, (_, i) => i + 1).map((chapter) => (
                    <button
                      key={chapter}
                      onClick={() => onSelectChapter(chapter)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-neon
                        ${
                          selectedChapter === chapter
                            ? "bg-blue-600 text-white shadow-neon-blue"
                            : "bg-blue-200 text-blue-700 hover:bg-blue-400"
                        }`}
                    >
                      {chapter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Versículos */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-400 mb-4 flex items-center">
                  <Bookmark className="mr-2 h-4 w-4" /> Versículo
                </h3>
                {selectedChapter ? (
                  <div
                    ref={verseRef}
                    className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-2 futuristic-scrollbar"
                  >
                    {Array.from({ length: maxVerses }, (_, i) => i + 1).map((verse) => (
                      <button
                        key={verse}
                        onClick={() => {
                          onSelectVerse(verse)
                          scrollToVerse(verse)
                        }}
                        className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-neon
                          ${
                            selectedVerse === verse
                              ? "bg-purple-600 text-white shadow-neon-purple"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-400"
                          }`}
                      >
                        {verse}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-blue-700 bg-blue-400 bg-opacity-50 rounded-lg border border-blue-600 animate-pulse">
                    Selecciona un capítulo primero
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}