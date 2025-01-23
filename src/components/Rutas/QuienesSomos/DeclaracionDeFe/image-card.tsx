import { Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas'
import { useRef } from 'react'

interface ImageCardProps {
  text: string
  backgroundUrl: string
  index: number
}

export function ImageCard({ text, backgroundUrl, index }: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-card-content]')
          if (clonedElement) {
            clonedElement.classList.add('!opacity-100')
          }
        }
      })
      
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/jpeg', 1.0)
      link.download = `declaration-${index + 1}.jpg`
      link.click()
    }
  }

  return (
    <div 
      ref={cardRef} 
      className="relative group aspect-[4/3] w-full max-w-[600px] mx-auto rounded-lg overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <img
        src="/logo-idec.png"
        alt="Church Logo"
        className="absolute top-4 left-4 h-8 w-auto"
        crossOrigin="anonymous"
      />
      
      <div 
        className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center"
        data-card-content
      >
        <div className="relative w-full max-w-[90%]">
          <div className="absolute -inset-1  rounded-lg transform -rotate-1" />
          <p className="relative bg-black/70 p-3 sm:p-4 text-white text-center text-xs sm:text-sm lg:text-base font-medium rounded-lg overflow-y-auto max-h-[80%]">
            {text}
          </p>
        </div>
      </div>

      
      <Button
        onClick={handleDownload}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        size="sm"
        variant="secondary"
      >
        <Download className="h-4 w-4 mr-2" />
        Descargar
      </Button>

      <img
        src="/logo-idec.png"
        alt="Church Logo"
        className="absolute bottom-4 right-4 h-8 w-auto"
        crossOrigin="anonymous"
      />
    </div>
  )
}

