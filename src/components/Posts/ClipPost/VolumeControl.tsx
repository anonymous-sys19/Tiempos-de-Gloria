import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VolumeControl({ isMuted, onToggleMute }: VolumeControlProps) {
  return (
    <button
      className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onToggleMute();
      }}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}