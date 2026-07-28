import React from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <button onClick={onClose} className="absolute top-8 right-8 text-white hover:text-gold transition p-2">
        <X className="w-10 h-10" />
      </button>
      <img 
        src={src} 
        alt="Gallery" 
        className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-xl"
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};

export default Lightbox;