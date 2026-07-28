import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Layout, ChefHat, Sparkles, Check } from 'lucide-react';
import RevealSection from '../components/RevealSection';
import { img } from '../assets';

const Rooms: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [img.bedroomSlide1, img.bedroomSlide2, img.bedroomSlide3];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={img.bedroom2} className="absolute inset-0 w-full h-full object-cover" alt="Rooms Header" loading="eager" />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center text-white z-10">
          <RevealSection>
            <p className="text-xs uppercase tracking-[0.5em] font-black mb-4 font-sans">Home / Rooms & Stay</p>
            <h1 className="text-5xl md:text-9xl font-bold italic leading-tight font-serif">Make Room <br className="hidden md:block" /> for Luxury</h1>
          </RevealSection>
        </div>
      </div>

      <div className="py-16 md:py-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-20 md:space-y-32">
        <RevealSection>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-serif italic text-4xl md:text-7xl mb-6 md:mb-10 text-charcoal">Accommodations Designed for Unplugging.</h2>
            <p className="text-xl md:text-2xl text-gray-500 italic leading-relaxed font-subtitle">
                Stay Cosy:<br/>The details that make Ecogen feel like home. Designed for those seeking a weekend getaway or nature holiday.
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <RevealSection>
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-3xl md:text-4xl italic font-bold text-forest font-serif">5 Premium Bedrooms</h3>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed italic font-subtitle">
                    Spacious rooms with luxurious bedding, clean interiors, and modern amenities for a restful stay.
                </p>
                <div className="pt-8 md:pt-12">
                    <h4 className="text-2xl font-bold mb-6 text-charcoal flex items-center gap-2"><Sparkles className="text-gold w-6 h-6" /> Stay Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 italic font-subtitle text-base md:text-lg">
                        <li className="flex items-center gap-2"><Check className="text-gold w-5 h-5" /> Comfortable bedding</li>
                        <li className="flex items-center gap-2"><Check className="text-gold w-5 h-5" /> Scenic greenery views</li>
                        <li className="flex items-center gap-2"><Check className="text-gold w-5 h-5" /> Personalized services</li>
                        <li className="flex items-center gap-2"><Check className="text-gold w-5 h-5" /> Premium amenities</li>
                        <li className="flex items-center gap-2"><Check className="text-gold w-5 h-5" /> Peaceful ambience</li>
                    </ul>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 border-t pt-8 md:pt-12">
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold flex items-center gap-3"><Layout className="text-gold" /> Spacious Hall</h4>
                  <p className="text-lg text-gray-500 italic">Large, comfortable hall ideal for gathering or meetings.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold flex items-center gap-3"><ChefHat className="text-gold" /> Kitchen</h4>
                  <p className="text-lg text-gray-500 italic">Neat and modern with all cooking essentials and dining area.</p>
                </div>
              </div>
            </div>
          </RevealSection>
          
          <RevealSection delay={200}>
            <div className="relative group rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-sand overflow-hidden aspect-[4/3]">
              <img src={images[currentSlide]} className="w-full h-full object-cover transition-all duration-500" alt="Room Slide" loading="lazy" />
              
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-forest p-3 rounded-full backdrop-blur shadow-lg transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-forest p-3 rounded-full backdrop-blur shadow-lg transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <span key={i} className={`w-3 h-3 rounded-full shadow-lg transition-all ${i === currentSlide ? 'bg-white scale-110' : 'bg-white/50'}`}></span>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <RevealSection>
            <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden h-[300px] lg:h-[500px] relative group shadow-2xl border-4 border-sand">
              <img src={img.dayView} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Day View" loading="lazy" />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest text-forest font-sans">Day View</div>
            </div>
          </RevealSection>
          <RevealSection delay={200}>
            <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden h-[300px] lg:h-[500px] relative group shadow-2xl border-4 border-forest/10">
              <img src={img.nightView} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Night View" loading="lazy" />
              <div className="absolute bottom-6 left-6 bg-forest/90 backdrop-blur px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest text-white font-sans">Night Ambience</div>
            </div>
          </RevealSection>
        </div>

        <RevealSection>
          <div className="bg-white p-8 md:p-16 rounded-[3rem] text-center border border-gray-100 shadow-sm">
            <h3 className="text-3xl md:text-4xl italic font-bold mb-6 font-serif text-charcoal">Private Swimming Pool</h3>
            <p className="text-xl md:text-2xl text-gray-500 max-w-4xl mx-auto italic font-subtitle mb-8 md:mb-12">
              Dive into luxury. Our crystal-clear private pool is perfect for relaxing swims or lively pool parties.
            </p>
            <img src={img.privatePool} className="w-full h-[300px] md:h-[600px] object-cover rounded-[2rem] md:rounded-[3rem] shadow-xl" alt="Private Swimming Pool" loading="lazy" />
          </div>
        </RevealSection>

        <RevealSection>
          <div className="bg-ivory p-8 md:p-16 rounded-[3rem] text-center border border-gray-100">
            <h3 className="text-3xl md:text-4xl italic font-bold mb-6 font-serif">Lawn & Garden</h3>
            <p className="text-xl md:text-2xl text-gray-500 max-w-4xl mx-auto italic font-subtitle mb-8 md:mb-12">
              A refreshing open lawn surrounded by greenery, ideal for events and photoshoots.
            </p>
            <img src={img.openLawn} className="w-full h-[300px] md:h-[600px] object-cover rounded-[2rem] md:rounded-[3rem] shadow-xl" alt="Lush Garden" loading="lazy" />
          </div>
        </RevealSection>
      </div>
    </div>
  );
};

export default Rooms;
