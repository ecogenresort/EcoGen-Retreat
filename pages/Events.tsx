import React from 'react';
import { Link } from 'react-router-dom';
import RevealSection from '../components/RevealSection';
import { EVENTS_DATA } from '../constants';

const Events: React.FC = () => {
  return (
    <div className="page-view bg-sand/20 py-24 md:py-32 px-6 lg:px-20 animate-in fade-in duration-700">
       <div className="max-w-6xl mx-auto text-center mb-16 md:mb-24 mt-12">
         <RevealSection>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-forest mb-4 block font-sans">The Venue of Choice</span>
            <h2 className="italic text-4xl md:text-5xl lg:text-8xl mb-6 font-serif text-charcoal">Unforgettable Moments</h2>
            <p className="text-xl md:text-2xl font-subtitle italic text-gray-500 max-w-4xl mx-auto">
              Celebrate your special moments in a peaceful, private, and luxurious space.
            </p>
         </RevealSection>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto pb-20">
         {EVENTS_DATA.map((event, i) => (
           <RevealSection key={i} delay={i * 50}>
             <div className="bg-white p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl group flex flex-col h-full hover:shadow-2xl transition-all duration-300">
                <div className="overflow-hidden rounded-2xl mb-8 h-56">
                    <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} loading="lazy" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-2xl italic font-bold mb-4 font-serif text-charcoal">{event.title}</h3>
                <p className="text-gray-500 mb-8 flex-grow italic leading-relaxed font-subtitle">{event.description}</p>
                <Link to="/booking" className="w-full bg-forest text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold transition shadow-lg text-center block">
                  Book Now
                </Link>
             </div>
           </RevealSection>
         ))}
       </div>
    </div>
  );
};

export default Events;