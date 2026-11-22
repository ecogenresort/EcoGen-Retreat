import React, { useState } from 'react';
import { MapPin, Instagram, Navigation, Landmark, Clapperboard, Route as RouteIcon, Milestone, Expand } from 'lucide-react';
import RevealSection from '../components/RevealSection';
import Lightbox from '../components/Lightbox';

/* ------------------------------------------------------------------ */
/*  Verified references supplied by the property owner                 */
/* ------------------------------------------------------------------ */
const INSTAGRAM_URL = 'https://www.instagram.com/ecogen_celestia/';
const MAPS_URL = 'https://share.google/gqRM1GV2LNzJKjs5Q';
// Place ID of the "ECOGEN CELESTIA" Google Maps listing the share link above points to
const MAP_EMBED_URL = 'https://maps.google.com/maps?cid=11841758983618011697&z=13&output=embed';

const NEARBY = [
  { name: 'Sanghi Temple', km: 3, Icon: Landmark },
  { name: 'Ramoji Film City', km: 4, Icon: Clapperboard },
  { name: 'ORR Exit No. 11', km: 4, Icon: Milestone },
  { name: 'Vijayawada Highway (NH-9)', km: 4, Icon: RouteIcon },
];

/* ------------------------------------------------------------------ */
/*  Property photography (public/assets/images/celestia)               */
/* ------------------------------------------------------------------ */
const base = '/assets/images/celestia';
type Photo = { id: string; alt: string; portrait?: boolean };
const sm = (id: string) => `${base}/celestia-${id}-1280.jpg`;
const lg = (id: string) => `${base}/celestia-${id}-2560.jpg`;
const srcSet = (id: string) => `${sm(id)} 1280w, ${lg(id)} 2560w`;

const HERO: Photo = { id: '09330', alt: 'EcoGen Celestia glass facade and entrance' };
const SIGNAGE: Photo = { id: '09331', alt: 'EcoGen Celestia signage on the building' };
const FACADE_TALL: Photo = { id: '09329', alt: 'EcoGen Celestia building front elevation', portrait: true };

const EXTERIOR: Photo[] = [
  { id: '09328', alt: 'Landscaped entrance pathway of EcoGen Celestia' },
  { id: '09326', alt: 'EcoGen Celestia building side view' },
  { id: '09325', alt: 'EcoGen Celestia building corner view', portrait: true },
  { id: '09327', alt: 'EcoGen Celestia facade with trees' },
  { id: '09333', alt: 'Lawn and greenery outside EcoGen Celestia' },
  { id: '09334', alt: 'Balconies of EcoGen Celestia', portrait: true },
];

const RECEPTION: Photo[] = [
  { id: '09341', alt: 'EcoGen Celestia reception' },
  { id: '09338', alt: 'Illuminated EcoGen logo at reception' },
  { id: '09339', alt: 'Reception desk and seating' },
  { id: '09332', alt: 'Glass entrance of EcoGen Celestia' },
  { id: '09335', alt: 'Entrance lobby' },
  { id: '09336', alt: 'Entrance with Buddha statue and plants' },
];

const ROOMS: Photo[] = [
  { id: '09374', alt: 'Bedroom with double bed and wall art' },
  { id: '09348', alt: 'Bedroom with upholstered headboard' },
  { id: '09360', alt: 'Bedroom with wardrobe and window blind' },
  { id: '09363', alt: 'Bedroom interior', portrait: true },
  { id: '09362', alt: 'Bedroom with framed artwork' },
  { id: '09365', alt: 'Bedroom with wardrobe' },
  { id: '09351', alt: 'Wall-mounted television unit in a room' },
  { id: '09369', alt: 'Bedroom with arched wall art' },
  { id: '09354', alt: 'Bedroom view towards the door' },
  { id: '09378', alt: 'Bedroom with ceiling fan and wall art' },
  { id: '09345', alt: 'Bedroom with wardrobe and dressing mirror' },
  { id: '09350', alt: 'Bedroom with window blind and wall art' },
];

const AMENITY_SPACES: Photo[] = [
  { id: '09346', alt: 'Corridor with glass balcony railing' },
  { id: '09372', alt: 'Corridor outside the rooms' },
  { id: '09356', alt: 'Bathroom', portrait: true },
  { id: '09358', alt: 'Bathroom fittings' },
  { id: '09359', alt: 'Wash basin' },
  { id: '09379', alt: 'Ganesha idol' },
  { id: '09324', alt: 'Buddha statue at the entrance garden' },
];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
const SectionHeading: React.FC<{ eyebrow: string; title: string; align?: 'left' | 'center'; light?: boolean }> = ({
  eyebrow,
  title,
  align = 'center',
  light = false,
}) => (
  <div className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl`}>
    <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.35em] font-sans block mb-3 ${light ? 'text-gold' : 'text-sage'}`}>
      {eyebrow}
    </span>
    <h2 className={`font-serif text-3xl md:text-5xl lg:text-6xl leading-tight ${light ? 'text-white' : 'text-charcoal'}`}>{title}</h2>
    <div className={`h-[2px] w-16 bg-gold mt-5 ${align === 'center' ? 'mx-auto' : ''}`} />
  </div>
);

const PhotoTile: React.FC<{ photo: Photo; className?: string; onOpen: (src: string) => void; sizes?: string }> = ({
  photo,
  className = '',
  onOpen,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}) => (
  <button
    type="button"
    onClick={() => onOpen(lg(photo.id))}
    aria-label={`View larger: ${photo.alt}`}
    className={`group relative block w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-sand shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/60 ${className}`}
  >
    <img
      src={sm(photo.id)}
      srcSet={srcSet(photo.id)}
      sizes={sizes}
      alt={photo.alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
    />
    <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <span className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-forest flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-md">
      <Expand className="w-4 h-4" />
    </span>
  </button>
);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const Celestia: React.FC = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const featuredRoom = ROOMS[activeRoom];

  return (
    <div className="animate-in fade-in duration-700 bg-ivory">
      {/* ============================== HERO ============================== */}
      <section className="relative min-h-[88vh] md:min-h-screen flex items-end overflow-hidden">
        <img
          src={lg(HERO.id)}
          srcSet={srcSet(HERO.id)}
          sizes="100vw"
          alt={HERO.alt}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnightForest/95 via-midnightForest/45 to-black/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-20 pb-16 md:pb-24 pt-40">
          <RevealSection>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black mb-5 font-sans text-gold">
              Home / EcoGen Celestia
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] font-serif text-white">
              EcoGen
              <br />
              Celestia
            </h1>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-forest transition shadow-2xl"
              >
                <MapPin className="w-4 h-4" /> View Location
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/60 text-white px-8 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-forest transition backdrop-blur-sm"
              >
                <Instagram className="w-4 h-4" /> @ecogen_celestia
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ======================= NEARBY STRIP ======================= */}
      <section className="relative z-20 -mt-10 md:-mt-14 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto bg-gray-100 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-2 lg:grid-cols-4 gap-px">
          {NEARBY.map(({ name, km, Icon }) => (
            <div key={name} className="bg-white p-6 md:p-8 flex flex-col gap-3">
              <Icon className="w-6 h-6 text-gold" />
              <div className="font-serif text-4xl md:text-5xl text-forest leading-none">
                {km}
                <span className="text-lg md:text-xl ml-1 font-sans font-bold text-sage">KM</span>
              </div>
              <p className="font-sans text-xs md:text-sm font-semibold text-charcoal/80 uppercase tracking-wider leading-snug">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================= SIGNATURE / INTRO ======================= */}
      <section className="py-20 md:py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <RevealSection className="lg:col-span-7">
            <div className="grid grid-cols-5 gap-4 md:gap-6">
              <PhotoTile photo={SIGNAGE} onOpen={setLightbox} className="col-span-3 aspect-[3/2] self-end" sizes="(min-width: 1024px) 35vw, 60vw" />
              <PhotoTile photo={FACADE_TALL} onOpen={setLightbox} className="col-span-2 row-span-2 h-full min-h-[240px]" sizes="(min-width: 1024px) 25vw, 40vw" />
              <PhotoTile photo={EXTERIOR[0]} onOpen={setLightbox} className="col-span-3 aspect-[3/2]" sizes="(min-width: 1024px) 35vw, 60vw" />
            </div>
          </RevealSection>
          <RevealSection className="lg:col-span-5" delay={150}>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] font-sans block mb-3 text-sage">
              The Property
            </span>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight text-charcoal">
              Welcome to <span className="text-forest">EcoGen Celestia</span>
            </h2>
            <div className="h-[2px] w-16 bg-gold mt-6 mb-8" />
            <p className="font-subtitle text-lg md:text-xl text-gray-600 leading-relaxed">
              Explore the building, reception, rooms and surroundings of EcoGen Celestia — photographed on site.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider hover:bg-gold transition shadow-md"
              >
                <Instagram className="w-4 h-4" /> Follow on Instagram
              </a>
              <a
                href="#celestia-location"
                className="inline-flex items-center gap-2 border border-forest/30 text-forest px-6 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider hover:bg-forest hover:text-white transition"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('celestia-location')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Navigation className="w-4 h-4" /> Location & Map
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ============================ EXTERIOR ============================ */}
      <section className="py-20 md:py-28 px-6 lg:px-20 bg-sand/60">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionHeading eyebrow="Exterior" title="The Building" />
          </RevealSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <RevealSection className="col-span-2 md:col-span-2 md:row-span-2">
              <PhotoTile photo={EXTERIOR[1]} onOpen={setLightbox} className="aspect-[3/2] md:aspect-auto md:h-full md:min-h-[520px]" sizes="(min-width: 768px) 50vw, 100vw" />
            </RevealSection>
            <RevealSection delay={100}>
              <PhotoTile photo={EXTERIOR[2]} onOpen={setLightbox} className="aspect-[2/3]" sizes="(min-width: 768px) 25vw, 50vw" />
            </RevealSection>
            <RevealSection delay={200}>
              <PhotoTile photo={EXTERIOR[5]} onOpen={setLightbox} className="aspect-[2/3]" sizes="(min-width: 768px) 25vw, 50vw" />
            </RevealSection>
            <RevealSection className="col-span-2" delay={100}>
              <PhotoTile photo={EXTERIOR[3]} onOpen={setLightbox} className="aspect-[3/2] md:aspect-[2/1]" sizes="(min-width: 768px) 50vw, 100vw" />
            </RevealSection>
          </div>
          <RevealSection className="mt-4 md:mt-6">
            <PhotoTile photo={EXTERIOR[4]} onOpen={setLightbox} className="aspect-[3/2] md:aspect-[21/9]" sizes="100vw" />
          </RevealSection>
        </div>
      </section>

      {/* ============================ RECEPTION ============================ */}
      <section className="py-20 md:py-28 px-6 lg:px-20 bg-forestDeep">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionHeading eyebrow="Arrival" title="Entrance & Reception" light />
          </RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <RevealSection className="lg:col-span-2">
              <PhotoTile photo={RECEPTION[0]} onOpen={setLightbox} className="aspect-[3/2]" sizes="(min-width: 1024px) 66vw, 100vw" />
            </RevealSection>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              <RevealSection delay={100}>
                <PhotoTile photo={RECEPTION[1]} onOpen={setLightbox} className="aspect-[3/2]" sizes="(min-width: 1024px) 33vw, 50vw" />
              </RevealSection>
              <RevealSection delay={200}>
                <PhotoTile photo={RECEPTION[2]} onOpen={setLightbox} className="aspect-[3/2]" sizes="(min-width: 1024px) 33vw, 50vw" />
              </RevealSection>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            {RECEPTION.slice(3).map((p, i) => (
              <RevealSection key={p.id} delay={i * 100}>
                <PhotoTile photo={p} onOpen={setLightbox} className="aspect-[3/2]" />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== ROOMS ============================== */}
      <section className="py-20 md:py-28 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionHeading eyebrow="Stay" title="The Rooms" />
          </RevealSection>

          <RevealSection>
            <button
              type="button"
              onClick={() => setLightbox(lg(featuredRoom.id))}
              aria-label={`View larger: ${featuredRoom.alt}`}
              className="group relative block w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-sand bg-charcoal aspect-[3/2] md:aspect-[16/9]"
            >
              <img
                key={featuredRoom.id}
                src={lg(featuredRoom.id)}
                srcSet={srcSet(featuredRoom.id)}
                sizes="(min-width: 1280px) 1280px, 100vw"
                alt={featuredRoom.alt}
                className={`absolute inset-0 w-full h-full animate-in fade-in duration-500 ${featuredRoom.portrait ? 'object-contain' : 'object-cover'}`}
              />
              <span className="absolute bottom-5 right-5 md:bottom-8 md:right-8 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-forest font-sans">
                {activeRoom + 1} / {ROOMS.length}
              </span>
            </button>
          </RevealSection>

          <div className="mt-5 md:mt-6 flex gap-3 md:gap-4 overflow-x-auto pb-3 snap-x [scrollbar-width:thin]">
            {ROOMS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveRoom(i)}
                aria-label={`Show ${p.alt}`}
                aria-pressed={i === activeRoom}
                className={`relative shrink-0 snap-start w-28 sm:w-36 md:w-44 aspect-[3/2] rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 ${
                  i === activeRoom ? 'ring-4 ring-gold opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={sm(p.id)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CORRIDORS & DETAILS ======================= */}
      <section className="py-20 md:py-28 px-6 lg:px-20 bg-sand/60">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionHeading eyebrow="Details" title="Corridors, Bathrooms & Décor" />
          </RevealSection>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 [&>*]:mb-4 md:[&>*]:mb-6">
            {AMENITY_SPACES.map((p, i) => (
              <RevealSection key={p.id} delay={(i % 3) * 100} className="break-inside-avoid">
                <PhotoTile photo={p} onOpen={setLightbox} className={p.portrait ? 'aspect-[2/3]' : 'aspect-[3/2]'} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= LOCATION ============================= */}
      <section id="celestia-location" className="py-20 md:py-28 px-4 sm:px-6 lg:px-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionHeading eyebrow="Location" title="Find EcoGen Celestia" />
          </RevealSection>

          <RevealSection>
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100/80 grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
              {/* Map */}
              <div className="lg:col-span-3 relative w-full rounded-2xl md:rounded-[2rem] overflow-hidden aspect-[4/3] lg:aspect-auto min-h-[320px] lg:min-h-[480px] shadow-inner border border-gray-100">
                <iframe
                  title="EcoGen Celestia location map"
                  src={MAP_EMBED_URL}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Landmarks */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="flex items-center gap-3 mb-6 px-1">
                  <span className="w-11 h-11 rounded-full bg-forest text-white flex items-center justify-center shadow-md shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-serif text-xl md:text-2xl text-charcoal leading-tight">EcoGen Celestia</p>
                    <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-sage font-bold">Nearby landmarks</p>
                  </div>
                </div>

                <ol className="relative ml-5 border-l-2 border-dashed border-gold/50 space-y-5 flex-grow">
                  {NEARBY.map(({ name, km, Icon }) => (
                    <li key={name} className="relative pl-7">
                      <span className="absolute -left-[13px] top-3 w-6 h-6 rounded-full bg-ivory border-2 border-gold flex items-center justify-center">
                        <Icon className="w-3 h-3 text-forest" />
                      </span>
                      <div className="flex items-center justify-between gap-4 bg-ivory rounded-2xl px-5 py-4 border border-gray-100">
                        <span className="font-sans text-sm md:text-base font-semibold text-charcoal">{name}</span>
                        <span className="font-sans text-sm md:text-base font-black text-forest whitespace-nowrap">{km} KM</span>
                      </div>
                    </li>
                  ))}
                </ol>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 bg-forest text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-gold transition shadow-md font-sans"
                >
                  <Navigation className="w-4 h-4" /> Open in Google Maps / Get Directions
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ============================ INSTAGRAM ============================ */}
      <section className="relative overflow-hidden">
        <img
          src={lg('09338')}
          srcSet={srcSet('09338')}
          sizes="100vw"
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-midnightForest/85" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <RevealSection>
            <Instagram className="w-10 h-10 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">Follow EcoGen Celestia</h2>
            <p className="font-sans text-gold tracking-[0.2em] uppercase text-sm font-bold mt-4">@ecogen_celestia</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center justify-center gap-2 bg-white text-forest px-10 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition shadow-2xl"
            >
              <Instagram className="w-4 h-4" /> Visit Instagram
            </a>
          </RevealSection>
        </div>
      </section>

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
};

export default Celestia;
