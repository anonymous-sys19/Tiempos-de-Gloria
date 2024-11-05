import React, { useState } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Draggable from 'react-draggable';
import { X, Minus, Radio } from 'lucide-react';
import { useFloatingBubble } from '@/hooks/FloatingBubbleContext';

type FloatingBubbleProps = {
    component: React.ReactNode; // Componente a cargar en la ventana emergente
};

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ component }) => {
    const { isOpen, togglePopup } = useFloatingBubble(); // Usar el contexto para obtener el estado
    const [isMinimized, setIsMinimized] = useState(false); // Estado para minimizar

    const toggleMinimize = () => setIsMinimized(!isMinimized); // Alternar minimizar

    return (
        <div>
            {/* Tooltip y burbuja flotante */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="z-50 w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg fixed bottom-16 right-4 flex items-center justify-center text-white"
                            onClick={togglePopup}
                        >
                            <Radio size={24} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Música</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Ventana emergente */}
            {isOpen && (
                <Draggable handle=".popup-header">
                    <div
                        className={`fixed top-1/4 left-1/4 z-50 bg-white rounded-lg shadow-2xl overflow-hidden`}
                        style={{
                            minWidth: isMinimized ? '200px' : '300px',
                            minHeight: isMinimized ? '40px' : '200px',
                            maxWidth: '100vw',
                            maxHeight: '100vh',
                            height: isMinimized ? '40px' : 'auto', // Altura fija al minimizar
                            resize: isMinimized ? 'none' : 'both', // Permitir redimensionar solo si no está minimizado
                        }}
                    >
                        <div className="popup-header bg-purple-500 text-white p-2 flex justify-between items-center cursor-move">
                            <span className="font-bold">Música</span>
                            <div className="flex space-x-2">
                                {/* Botón minimizar */}
                                <button onClick={toggleMinimize}>
                                    <Minus size={18} className="text-white" />
                                </button>
                                {/* Botón cerrar */}
                                <button onClick={togglePopup}>
                                    <X size={18} className="text-white" />
                                </button>
                            </div>
                        </div>
                        {/* Contenido del componente con desplazamiento */}
                        <div
                            className={`transition-all duration-300 ${isMinimized ? 'hidden' : 'p-4 overflow-y-auto'}`}
                            style={{ maxHeight: isMinimized ? '0' : 'inherit' }} // Ajusta la altura para permitir el scroll
                        >
                            {component}
                        </div>
                    </div>
                </Draggable>
            )}
        </div>
    );
};

export default FloatingBubble;
