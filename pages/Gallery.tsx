import React, { useState } from 'react';
import RevealSection from '../components/RevealSection';
import Lightbox from '../components/Lightbox';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Layout pattern helper to mimic the CSS grid in original code
  const getGridClass = (index: number) => {
    // 0: span 8 (large)
    // 1: span 4 (small)
    // 2: span 4 (small)
    // 3: span 4 (small)
    // 4: span 8 (large)
    if (index === 0 || index === 4) return "md:col-span-8 md:row-span-2";
    return "md:col-span-4";
  };

  return (
    <div className="py-24 md:py-32 px-4 md:px-20 bg-white min-h-screen animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto mb-16 text-center mt-12">
        <h1 className="text-5xl md:text-8xl font-serif italic font-bold text-charcoal mb-6">Visual Journey</h1>
        <p className="text-gray-500 font-subtitle italic text-xl">A glimpse into serenity.</p>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] md:auto-rows-[350px] gap-6 md:gap-8">
        {GALLERY_IMAGES.map((src, i) => (
          <div key={i} className={`${getGridClass(i)} cursor-pointer group`} onClick={() => setSelectedImage(src)}>
            <RevealSection delay={i * 100} className="h-full w-full">
              <div className="w-full h-full overflow-hidden rounded-[2rem] md:rounded-[3rem]">
                <img 
                  src={src} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={`Gallery ${i}`} 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </RevealSection>
          </div>
        ))}
      </div>

      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default Gallery;