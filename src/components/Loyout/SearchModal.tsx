/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Card, CardContent } from "@/components/ui/card"
import { Share2, X, Copy, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas'

interface Verse {
    study: string
    verse: string
    number: number
    id: number
}

interface BibleData {
    testament?: string
    name?: string
    chapter?: number
    vers?: Verse[]
    verse?: string
    number?: number
    id?: number
}

interface SearchResult {
    study: string,
    verse: string
    book: string
    chapter: number
    number: number
    id: number
}

const BASE_URL_BIBLE = "https://bible-api.deno.dev/api"

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
    searchTerm: string
}

export function SearchModal({ isOpen, onClose, searchTerm }: SearchModalProps) {
    const [results, setResults] = useState<(Verse | SearchResult)[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentReference, setCurrentReference] = useState('')
    const [selectedVerse, setSelectedVerse] = useState<Verse | SearchResult | null>(null)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const imageRef = useRef(null)

    useEffect(() => {
        if (searchTerm) {
            handleSearch(searchTerm)
        }
    }, [searchTerm])

    const handleSearch = async (input: string) => {
        setLoading(true)
        setError('')

        try {
            const referencePattern = /^[a-zA-Z]+\s+\d+(\s+\d+)?$/
            const isReference = referencePattern.test(input.trim())

            if (isReference) {
                const parts = input.trim().split(' ')
                const [book, chapter, verse] = parts
                let url = `${BASE_URL_BIBLE}/read/nvi/${book}/${chapter}`
                if (verse) url += `/${verse}`

                const response = await axios.get<BibleData>(url)
                setResults(response.data.vers || [])
                setCurrentReference(`${response.data.name} ${response.data.chapter}`)
            } else {
                const response = await axios.get(`${BASE_URL_BIBLE}/read/nvi/search`, {
                    params: { q: input, take: 10, page: 1 }
                })
                setResults(response.data.data)
                setCurrentReference(`Resultados para "${input}"`)
            }
        } catch (err) {
            setError('No se encontraron resultados. Intenta con otra búsqueda.')
        } finally {
            setLoading(false)
        }
    }

    const handleVerseClick = (verse: Verse | SearchResult) => {
        setSelectedVerse(verse)
        setIsImageModalOpen(true)
    }

    const renderVerse = (item: Verse | SearchResult) => {
        if ('book' in item) {
            return (
                <div key={item.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVerseClick(item)}>
                    <div className="font-semibold text-gray-600 mb-1">
                        {item.book} {item.chapter}:{item.number}
                    </div>
                    <div className="text-gray-800">{item.verse}</div>
                </div>
            )
        } else {
            return (
                <div key={item.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVerseClick(item)}>
                    <div className="font-semibold text-gray-600 mb-1">
                        Versículo {item.number} {item.study}
                    </div>
                    <div className="text-gray-800">{item.verse}</div>
                </div>
            )
        }
    }

    const handleCopyText = () => {
        if (selectedVerse) {
            const textToCopy = `${'book' in selectedVerse ? `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.number}` : `Versículo ${selectedVerse.number}`}\n\n${selectedVerse.verse}`
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Texto copiado al portapapeles'))
                .catch(err => console.error('Error al copiar texto: ', err))
        }
    }

    const handleShareImage = async () => {
        if (imageRef.current) {
            try {
                const canvas = await html2canvas(imageRef.current)
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'verse.png', { type: 'image/png' })
                        if (navigator.share) {
                            navigator.share({
                                files: [file],
                                title: 'Versículo Compartido',
                                text: 'Mira este versículo de la Biblia'
                            }).then(() => console.log('Compartido con éxito'))
                                .catch((error) => console.log('Error al compartir', error))
                        } else {
                            alert('La función de compartir no está disponible en este dispositivo')
                        }
                    }
                })
            } catch (error) {
                console.error('Error al generar la imagen:', error)
            }
        }
    }

    const handleDownloadImage = async () => {
        if (imageRef.current) {
            try {
                const canvas = await html2canvas(imageRef.current)
                const dataUrl = canvas.toDataURL('image/png')
                const link = document.createElement('a')
                link.href = dataUrl
                link.download = 'verse.png'
                link.click()
            } catch (error) {
                console.error('Error al descargar la imagen:', error)
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end mb-4">
                    <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </Button>
                </div>
                <Card className="border-none shadow-lg">
                    <CardContent>
                        {loading && <div className="text-center text-gray-500">Buscando...</div>}

                        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

                        {!loading && !error && results.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                    {currentReference}
                                </h2>
                                <div className="space-y-2">
                                    {results.map(renderVerse)}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {isImageModalOpen && selectedVerse && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div ref={imageRef} className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-blue-800">
                                    {'book' in selectedVerse ? `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.number}` : `Versículo ${selectedVerse.number}`}
                                </h2>
                                <p className="text-lg text-blue-900 mb-4">{selectedVerse.verse}</p>
                                <div className="text-sm text-blue-700 text-right">NVI{`: ` + selectedVerse.study} </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button onClick={handleCopyText} className="flex items-center gap-2">
                                    <Copy size={18} /> Copiar
                                </Button>
                                <Button onClick={handleShareImage} className="flex items-center gap-2">
                                    <Share2 size={18} /> Compartir
                                </Button>
                                <Button onClick={handleDownloadImage} className="flex items-center gap-2">
                                    <Download size={18} /> Descargar
                                </Button>
                            </div>
                            <Button onClick={() => setIsImageModalOpen(false)} className="mt-4 w-full">
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}