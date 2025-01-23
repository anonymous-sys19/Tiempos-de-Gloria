import { useState } from 'react'
import { SearchModal } from './SearchModal'

export function SearchInput() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Función para manejar la búsqueda cuando se presiona Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Evita el submit si está dentro de un formulario
      handleSearch() // Ejecuta la búsqueda
    }
  }

  // Función que ejecuta la búsqueda
  const handleSearch = () => {
    if (searchTerm.trim() ) {
      console.log("Buscando:", searchTerm) // Log para pruebas
      setIsModalOpen(true) // Abre el modal
      // Aquí puedes agregar la lógica para hacer la búsqueda o llamar a la API
    }

  }

  return (
    <>
      <input
        id="search"
        name="search"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Escribe un pasaje (ej: juan 3 16) o una palabra (ej: amor)..."
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown} // Detectar Enter en el teclado
      />
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        searchTerm={searchTerm} 
      />
    </>
  )
}

