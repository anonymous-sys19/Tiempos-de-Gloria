// FloatingBubbleContext.tsx
import React, { createContext, useContext, useState } from 'react';

type FloatingBubbleContextType = {
  isOpen: boolean;
  togglePopup: () => void;
};

const FloatingBubbleContext = createContext<FloatingBubbleContextType | undefined>(undefined);

export const FloatingBubbleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePopup = () => setIsOpen(prev => !prev);

  return (
    <FloatingBubbleContext.Provider value={{ isOpen, togglePopup }}>
      {children}
    </FloatingBubbleContext.Provider>
  );
};

export const useFloatingBubble = () => {
  const context = useContext(FloatingBubbleContext);
  if (!context) {
    throw new Error('useFloatingBubble must be used within a FloatingBubbleProvider');
  }
  return context;
};
