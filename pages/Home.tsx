import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Waves, Flame, Trees, ChefHat, Sparkles, Check, 
  MapPin, Phone, Mail, Send, Loader2, ChevronRight, ChevronLeft,
  Users, PartyPopper, Briefcase, Trophy, Hotel, CalendarDays,
  Target, Zap, FlameKindling, ShieldAlert, CheckCircle2, ChevronDown
} from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import Lightbox from '../components/Lightbox';
import { GOOGLE_SCRIPT_URL } from '../constants';
import { img } from '../assets';
import { logLeadToSupabase } from '../lib/syncToSupabase';

const attractions = [
  {
    title: "Sanghi Temple",
    time: "5 Mins Drive",
    image: img.sanghiTemple
  },
  {
    title: "Ramoji Film City",
    time: "10 Mins Drive",
    image: img.ramojiFilmCity
  },
  {
    title: "Wonderla Park",
    time: "15 Mins Drive",
    image: img.wonderla
  },
  {
    title: "Anjali Film Studio",
    time: "Beside",
    image: img.hero
  },
  {
    title: "Hyderabad Studio",
    time: "Opposite",
    image: img.hyderabadStudio
  },
  {
    title: "Koheda Gutta",
    time: "5 Mins Drive",
    image: img.kohedaGutta
  },
  {
    title: "Hanuman Temple View Point",
    time: "8 Mins Drive",
    image: img.hanumanViewpoint
  },
  {
    title: "Pedda Amberpet ORR Exit",
    time: "8 Mins Drive",
    image: img.peddaAmberpetOrr
  },
  {
    title: "Bonguluru ORR Exit",
    time: "8 Mins Drive",
    image: img.bonguluruOrr
  },
  {
    title: "L. B. Nagar Circle",
    time: "20 Mins Drive",
    image: img.lbNagar
  }
];

const Home: React.FC = () => {
  // Gallery and Dynamic States
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Day/Night preview mode toggle
  const [isDay, setIsDay] = useState(true);

  // Form states
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    
    setEmailError(!isEmailValid);
    setPhoneError(!isPhoneValid);

    if (!isEmailValid || !isPhoneValid) return;

    setIsLoading(true);

    const payload = {
        action: 'contact',
        name,
        email,
        phone,
        subject,
        message
    };

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.status === 'success') {
            logLeadToSupabase({ name, email, phone, subject, message, source: 'home-contact-form' });
            setIsSent(true);
        } else {
            alert("Something went wrong. Please call us directly.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please call us directly.");
    } finally {
        setIsLoading(false);
    }
  };

  // Experiences List (Vajra's Service Layout Adaption)
  const EXPERIENCES = [
    {
      id: "weekend",
      title: "Weekend Getaways",
      description: "Escape the city and reconnect with nature. Stretches of serene mornings, clean breezes, and unmatched isolation.",
      image: img.hero,
      icon: Trees,
    },
    {
      id: "family",
      title: "Family Vacations",
      description: "Private spaces designed for memorable family moments. Safe, sprawling lawns for kids and cozy fire camps for storytelling.",
      image: img.familyLawn,
      icon: Users,
    },
    {
      id: "events",
      title: "Celebrations & Events",
      description: "Birthdays, pool parties, intimate weddings, and special events. Transform your milestone days in custom resort setups.",
      image: img.wedding,
      icon: PartyPopper,
    },
    {
      id: "corporate",
      title: "Corporate Retreats",
      description: "Team bonding, alignment, and leadership offsites in a peaceful, focused container that ignites collaboration.",
      image: img.corporateRetreat,
      icon: Briefcase,
    }
  ];

  // Why Choose EcoGen (Vajra's Trust-Building Cards)
  const WHY_CHOOSE = [
    {
      title: "Exclusive Private Property",
      description: "One single booking locks down the entire retreat. You never share amenities, lawns, or pools with strangers.",
      icon: Hotel,
    },
    {
      title: "Private Swimming Pool",
      description: "Dive together in complete solitude. Well-maintained pool with fresh water filtration, completely shaded for sun-safe comfort.",
      icon: Waves,
    },
    {
      title: "Event Ready Spaces",
      description: "Equipped with power backups, large lawns, acoustic freedom, and custom caterer tie-ups for perfect celebrations.",
      icon: PartyPopper,
    },
    {
      title: "Nature & Comfort Combined",
      description: "Surrounded by lush fields, our villa boasts high-speed Wi-Fi, elegant air-conditioned suites, and full hospitality support.",
      icon: Sparkles,
    },
    {
      title: "Multi-Day Stay Experience",
      description: "Designed carefully for longer stays. Walk, meditate, cook in the grand kitchen, and wake up to birds, not traffic.",
      icon: CalendarDays,
    },
    {
      title: "Premium Guest Experience",
      description: "Enjoy tailored hospitality. Our premium caretaker team ensures seamless linen setups, local kitchen assist, and total cleanliness.",
      icon: Trophy,
    }
  ];

  // The Retreat highlights
  const RETREAT_HIGHLIGHTS = [
    "One Exclusive Luxury Villa",
    "Full Gated Property Access",
    "Private Filtered Pool",
    "Expansive Green Lawn",
    "Open Hearth Fire Camp",
    "Indoor Sports & Board Games",
    "Spacious Indoor Event Hall",
    "Scenic Night Lighting Ambience"
  ];

  // Gallery items with Category Mapping
  const GALLERY_GRID = [
    { src: img.bedroom2, category: "Bedroom" },
    { src: img.dayView, category: "Night Ambience" },
    { src: img.nightView, category: "Fire Camp" },
    { src: img.privatePool, category: "Private Pool" },
    { src: img.bedroom1, category: "Bedroom" },
    { src: img.openLawn, category: "Open Lawn" },
    { src: img.wedding, category: "Event Hall" },
    { src: img.pool, category: "Private Pool" },
    { src: img.familyLawn, category: "Open Lawn" },
    { src: img.eventHall, category: "Event Hall" },
    { src: img.bedroomSlide2, category: "Bedroom" },
    { src: img.hero, category: "Night Ambience" }
  ];

  const CATEGORIES = ['All', 'Private Pool', 'Open Lawn', 'Bedroom', 'Fire Camp', 'Event Hall', 'Night Ambience'];

  const filteredGallery = activeCategory === 'All' 
    ? GALLERY_GRID 
    : GALLERY_GRID.filter(img => img.category === activeCategory);

  // Testimonials matching Vajra sequencing
  const TESTIMONIALS = [
    {
      topic: "Privacy",
      quote: "One booking locked the entire retreat! It was ours alone. Absolute privacy, absolute silence, with just field birds for company. Worth every rupee.",
      author: "Sneha G.",
      role: "Weekend Guest"
    },
    {
      topic: "Pool Experience",
      quote: "The swimming pool is extremely clean and fully private. Spend late evenings splashing around without feeling awkward about random resort guests.",
      author: "Aditya K.",
      role: "Family Gathering"
    },
    {
      topic: "Family Gatherings",
      quote: "Five spacious rooms perfectly fit our extended family. The open kitchen and vast green lawns allowed grandmother to sit peacefully under trees.",
      author: "Mr. Verma",
      role: "Family Reunion"
    },
    {
      topic: "Night Ambience",
      quote: "The night lighting is spectacular. Sitting around the fire camp, looking up at the sky with excellent warm estate lights on the pool was magical.",
      author: "Pranav K.",
      role: "Birthday Celebration"
    },
    {
      topic: "Event Celebrations",
      quote: "Coordinating our wedding celebrations was a dream. The property is spacious, right beside Anjali Film Studio, very convenient yet pristine.",
      author: "Ananya R.",
      role: "Bridal Party"
    },
    {
      topic: "Corporate Retreats",
      quote: "Ideal container for planning our scaling goals. Highly focused, high-speed Wi-Fi, and excellent breakout spaces under the canopy.",
      author: "Karthik J.",
      role: "Align Head, TechCorp"
    }
  ];

  // Testimonial slideshow states and handlers
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const [swiperTouchStart, setSwiperTouchStart] = useState<number | null>(null);
  const [swiperTouchEnd, setSwiperTouchEnd] = useState<number | null>(null);

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwiperTouchEnd(null);
    setSwiperTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setSwiperTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!swiperTouchStart || !swiperTouchEnd) return;
    const distance = swiperTouchStart - swiperTouchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNextTestimonial();
    } else if (distance < -minSwipeDistance) {
      handlePrevTestimonial();
    }
  };

  useEffect(() => {
    if (isTestimonialHovered) return;
    const timer = setInterval(() => {
      handleNextTestimonial();
    }, 5000);
    return () => clearInterval(timer);
  }, [isTestimonialHovered, currentTestimonial]);

  return (
    <div className="bg-[#FAF8F2] text-[#222222] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 lg:px-16 overflow-hidden">
        {/* Background imagery */}
        <div className="absolute inset-0 z-0">
          <img 
            src={img.hero} 
            className="w-full h-full object-cover ken-burns" 
            alt="Private Pool and Eco Luxury Oasis"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 lg:bg-gradient-to-r lg:from-black/75 lg:via-black/30 lg:to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20 items-center">
          {/* Hero left content */}
          <div className="xl:col-span-7 flex flex-col justify-center text-center xl:text-left text-white space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5">
                <span className="inline-block px-5 py-2.5 rounded-full bg-forest/40 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase font-sans">
                  The Ultimate Private Eco-Luxury Resort
                </span>
                <a 
                  href="tel:+918106935999" 
                  className="flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-white text-zinc-950 font-black font-sans transition-all active:scale-[0.98] group shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_rgba(255,255,255,0.6)] hover:bg-zinc-100 border-2 border-white/40 ring-4 ring-white/20 animate-pulse-ring-glow text-base sm:text-lg md:text-xl lg:text-2xl"
                  title="Call for direct reservations"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-950 animate-phone-ring group-hover:scale-115 transition-transform shrink-0" /> 
                  <span className="tracking-widest font-mono font-bold leading-none">+91 8106935999</span>
                </a>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white tracking-tight leading-[1.05] font-bold">
                Where Nature <br /> Meets Comfort
              </h1>

              <p className="font-sans text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl mx-auto xl:mx-0 leading-relaxed">
                An exclusive private eco-retreat in Koheda, Telangana. Designed for peaceful multi-day stays, celebrations, and meaningful escapes where you enjoy absolute privacy.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start font-sans pt-4">
                  <Link 
                    to="/booking" 
                    className="bg-forest text-white border border-forest px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gold hover:border-gold transition shadow-xl"
                  >
                    Book Your Stay
                  </Link>
                  <a 
                    href="#the-retreat" 
                    className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-forest transition shadow-xl"
                  >
                    Explore The Retreat
                  </a>
                </div>
                <div className="flex items-center justify-center xl:justify-start gap-2.5 font-sans text-xs text-white/80 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span>Direct Reservations / Inquiry: <a href="tel:+918106935999" className="text-gold font-extrabold hover:underline transition-all tracking-wider">+91 8106935999</a></span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero right container: Booking Engine */}
          <div className="xl:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <BookingWidget className="shadow-2xl border border-white/15 backdrop-blur-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION (Vajra's exact layout: Content Left, Image Right) */}
      <section id="about" className="py-20 lg:py-32 bg-[#FAF8F2] border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Content Left */}
            <div className="lg:col-span-6 space-y-8">
              <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
                About EcoGen Retreat
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#222222] font-bold leading-tight">
                Your Exclusive Private Sanctuary
              </h2>
              <div className="w-20 h-1 bg-gold"></div>
              
              <p className="font-sans text-gray-600 text-base md:text-lg leading-relaxed">
                EcoGen Retreat is a private single-room eco-luxury resort located in Koheda, Telangana. Guests enjoy exclusive access to the entire property, creating a unique experience that combines comfort, privacy, and nature. It is crafted meticulously for family gatherings, weekend getaways, and pristine celebrations.
              </p>

              {/* Focus list matching Vajra */}
              <ul className="space-y-4 pt-4">
                {[
                  { text: "Exclusive Property Access", desc: "No stranger crosstalk. Enjoy full authority over the entire villa and fields." },
                  { text: "Complete Privacy", desc: "Enclosed with luxury fencing beside Anjali Film Studios with personal, quiet, natural spaces." },
                  { text: "Nature-Inspired Experience", desc: "Wander around expansive gardens, fresh lawns, and under dynamic night skies." },
                  { text: "Premium Hospitality", desc: "Trained caretakers assist dynamically with housekeeping, linen, and local arrangements." },
                  { text: "Multi-Day Stay Experience", desc: "Complete with an indoor elegant event hall, dining kitchen, and endless board games." }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    viewport={{ once: true }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-forest" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-800 text-base font-sans">{item.text}</span>
                      <span className="text-sm text-gray-500">{item.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Image Right */}
            <div className="lg:col-span-6">
              <motion.div 
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-gold/15"
              >
                <img 
                  src={img.dayView} 
                  alt="Exclusive Villa Front and Landscaped Pool"
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-forest font-sans">
                  Telangana's Resort Jewel
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. EXPERIENCES SECTION (Vajra's exact card-based service layout) */}
      <section id="experiences" className="py-20 lg:py-32 bg-[#F3EFE6]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16 text-center">
          <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
            Curated Stays
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#222222] font-bold mt-4 mb-16">
            Experiences At EcoGen Retreat
          </h2>

          {/* Cards Based Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {EXPERIENCES.map((exp, i) => {
              const IconComp = exp.icon;
              return (
                <motion.div 
                  key={exp.id}
                  viewport={{ once: true }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-lg group flex flex-col h-full hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative overflow-hidden h-52">
                    <img 
                      src={exp.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={exp.title} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-full text-forest shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow text-left space-y-4">
                    <h3 className="text-xl md:text-2xl font-serif text-charcoal font-bold">{exp.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-sans flex-grow italic">
                      "{exp.description}"
                    </p>
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link to="/booking" className="text-forest text-xs font-black uppercase tracking-widest hover:text-gold transition flex items-center gap-1">
                        Reserve Experience <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Day/Night Landscape Transformation Toggle */}
      <section className="py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16 text-center">
          <span className="text-forest uppercase tracking-[0.4em] text-xs font-black font-sans mb-3 block">DYNAMIC LANDSCAPES</span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-charcoal mb-4">Day to Night Transformation</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-10 text-sm md:text-base">Experience the dual energy of our land. Serene open fields in daylight, cozy glowing ambiance for celebrations around fire camp after dusk.</p>
          
          <div 
            className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group cursor-pointer h-[350px] md:h-[600px] max-w-6xl mx-auto border border-gray-100"
            onClick={() => setIsDay(!isDay)}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={isDay ? "day" : "night"}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.3 }}
                transition={{ duration: 0.8 }}
                src={isDay ? img.dayView : img.nightView} 
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out" 
                alt="Day Night Resort Landscape"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-full text-white font-extrabold uppercase tracking-widest border border-white/40 shadow-lg animate-pulse text-xs md:text-sm">
                Tap to Toggle Night View
              </div>
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-left pointer-events-none drop-shadow-md">
              <span className="font-sans font-bold text-xs uppercase tracking-widest block mb-1">Visual Preview</span>
              <h3 className="text-2xl md:text-4xl font-serif italic">{isDay ? "Serene Sunlit Days" : "Immersive Glowing Nights"}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE ECOGEN RETREAT (Vajra's exact trust-building section, 6 Columns or Grid) */}
      <section className="py-20 lg:py-32 bg-[#FAF8F2] border-t border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
              Designed For Perfection
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal font-bold">
              Why Choose EcoGen Retreat
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto mt-4"></div>
          </div>

          {/* 6 Grid points representing Vajra's Trust points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {WHY_CHOOSE.map((item, i) => {
              const IconComp = item.icon;
              return (
                <motion.div 
                  key={i}
                  viewport={{ once: true }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[#F3EFE6]/50 p-8 md:p-10 rounded-[2rem] border border-gray-150/40 hover:bg-[#F3EFE6] transition-all duration-300 space-y-6"
                >
                  <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center font-bold shadow-md">
                    <IconComp className="w-5 h-5 text-gold" />
                  </div>
                  
                  <div className="space-y-3 text-left">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-charcoal">{item.title}</h3>
                    <p className="text-gray-600 text-sm tracking-tight leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. THE RETREAT SECTION (Vajra's list of highlights / layout) */}
      <section id="the-retreat" className="py-20 lg:py-32 bg-[#F3EFE6]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Highlight left checklist */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
                The Estate Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#222222]">
                Your Private Nature Escape
              </h2>
              <div className="w-16 h-1 bg-gold"></div>
              
              <p className="font-sans text-gray-500 text-sm md:text-base leading-relaxed">
                Our property is carefully planned to give you complete freedom. A cozy 5-bedroom villa setup with fully integrated modern kitchen elements, massive lawns, pool, and entertainment areas for multiple group layouts.
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {RETREAT_HIGHLIGHTS.map((hl, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-gray-700 text-xs md:text-sm font-bold font-sans">{hl}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link 
                  to="/rooms" 
                  className="inline-flex items-center gap-3 bg-forest text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold transition shadow-xl"
                >
                  View Property Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Cinematic collage display on Right */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                <img 
                  src={img.privatePool} 
                  alt="Resort Pool" 
                  className="rounded-[2rem] shadow-xl w-full object-cover h-64 md:h-80 hover:scale-[1.02] transition"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src={img.bedroom1} 
                  alt="Interior Bed Suite" 
                  className="rounded-[2rem] shadow-xl w-full object-cover h-40 md:h-52 hover:scale-[1.02] transition"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                <img 
                  src={img.openLawn} 
                  alt="Resort Lawn and Garden" 
                  className="rounded-[2rem] shadow-xl w-full object-cover h-40 md:h-52 hover:scale-[1.02] transition"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src={img.eventHall} 
                  alt="Dining Hall Space" 
                  className="rounded-[2rem] shadow-xl w-full object-cover h-64 md:h-80 hover:scale-[1.02] transition"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEARBY ATTRACTIONS SECTION */}
      <section id="attractions" className="py-20 lg:py-32 bg-[#FAF8F2] border-t border-b border-gray-150/40">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans block">
              Explore the Vicinity
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal font-bold leading-tight">
              Nearby Attractions
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto mt-4"></div>
            <p className="font-sans text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              EcoGen Retreat offers pristine, fully private stays with excellent proximity to local historic temples, renowned film studios, nature scenic viewpoints, and convenient transit exits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {attractions.map((attraction, i) => (
              <motion.div
                key={i}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 5) * 0.1, duration: 0.6 }}
                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <div className="relative overflow-hidden aspect-[4/3] w-full bg-[#faf8f2]">
                  <img
                    src={attraction.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={attraction.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-forest text-[11px] font-sans font-bold shadow-md flex items-center gap-1 border border-forest/5">
                    <MapPin className="w-3 h-3 text-gold" />
                    <span>{attraction.time}</span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-center bg-white text-left">
                  <h3 className="text-base md:text-lg font-serif text-charcoal font-bold leading-snug">
                    {attraction.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY SECTION (Vajra's Showcase Grid layout) */}
      <section id="gallery" className="py-20 lg:py-32 bg-[#FAF8F2]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16 text-center">
          <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
            Visual Proof
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#222222] font-bold mt-4 mb-8">
            The Gallery
          </h2>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${
                  activeCategory === cat 
                    ? 'bg-forest text-white font-sans' 
                    : 'bg-[#F3EFE6] text-[#222222] hover:bg-forest/10 font-sans'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filtered Grid with Lightbox support */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((img, idx) => (
                <motion.div
                  layout
                  viewport={{ once: true }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={img.src}
                  onClick={() => setSelectedImage(img.src)}
                  className="relative group overflow-hidden rounded-[2rem] aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition border border-gray-100"
                >
                  <img 
                    src={img.src} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={`Resort ${img.category}`} 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-left">
                      <span className="text-white/65 text-[10px] uppercase font-bold tracking-widest block">EcoGen Oasis</span>
                      <span className="text-white font-serif italic text-lg leading-tight block">{img.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION (Vajra's Sequential Testimonials) */}
      <section className="py-20 lg:py-32 bg-[#F3EFE6] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24 space-y-4">
            <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
              Client Praises
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal font-bold">
              Guest Experiences
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto mt-4"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Card & Slide Container */}
            <div className="flex items-center justify-between gap-4 md:gap-8">
              
              {/* Prev Button (Desktop only) */}
              <button 
                onClick={handlePrevTestimonial}
                className="hidden md:flex w-14 h-14 rounded-full bg-white text-forest border border-gray-100 hover:border-gold hover:text-gold active:scale-95 items-center justify-center shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Card */}
              <div 
                onMouseEnter={() => setIsTestimonialHovered(true)}
                onMouseLeave={() => setIsTestimonialHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full bg-white p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-2xl relative border border-gray-100/50 overflow-hidden active:cursor-grabbing cursor-grab"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="relative flex flex-col justify-between min-h-[220px]"
                  >
                    {/* Background Quote Mark Decor */}
                    <div className="absolute -top-10 -left-6 text-gold/10 font-serif text-9xl pointer-events-none select-none">“</div>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex gap-1.5 justify-center text-gold">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="fill-current w-5 h-5" />
                        ))}
                      </div>
                      
                      <p className="text-charcoal text-center text-base sm:text-lg md:text-xl font-serif italic font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm px-2">
                        “{TESTIMONIALS[currentTestimonial].quote}”
                      </p>
                      
                      <div className="text-center pt-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#F3EFE6] text-forest font-bold text-[10px] tracking-wider uppercase font-sans mb-3">
                          {TESTIMONIALS[currentTestimonial].topic} Focus
                        </span>
                        <div className="block mt-1">
                          <span className="block font-sans font-extrabold text-gray-800 text-sm uppercase tracking-wider">
                            {TESTIMONIALS[currentTestimonial].author}
                          </span>
                          <span className="text-xs text-gray-400 font-sans">
                            {TESTIMONIALS[currentTestimonial].role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button (Desktop only) */}
              <button 
                onClick={handleNextTestimonial}
                className="hidden md:flex w-14 h-14 rounded-full bg-white text-forest border border-gray-100 hover:border-gold hover:text-gold active:scale-95 items-center justify-center shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

            </div>

            {/* Mobile / Tablet Control Row (prev + dots + next) */}
            <div className="flex md:hidden items-center justify-between mt-8 max-w-[280px] mx-auto px-4">
              <button 
                onClick={handlePrevTestimonial}
                className="w-11 h-11 rounded-full bg-white text-forest border border-gray-100 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentTestimonial === idx ? 'bg-forest w-5' : 'bg-forest/20 w-2 hover:bg-forest/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNextTestimonial}
                className="w-11 h-11 rounded-full bg-white text-forest border border-gray-100 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Dots only */}
            <div className="hidden md:flex justify-center items-center gap-2 mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentTestimonial === idx ? 'bg-forest w-6' : 'bg-forest/20 w-2 hover:bg-forest/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOOKING CTA SECTION (Replacing Vajra's conversion/quote section) */}
      <section className="relative py-28 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={img.nightView} 
            className="w-full h-full object-cover" 
            alt="Intimate night fires camp"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-forestDeep/85"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 text-white">
          <span className="text-gold text-xs font-black uppercase tracking-[0.4em] font-sans">
            Reserve Your Exclusive Paradise
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold leading-tight">
            Escape The City. Embrace Nature. <br /> Stay Longer. Feel Calmer.
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed text-sm md:text-lg font-sans">
            Enjoy full property setup, swimming pool, open garden bonfire, beautiful event hall, and clean room packages. Connect with your friends, family, or team in serenity.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              to="/booking" 
              className="w-full sm:w-auto bg-white text-forest hover:bg-gold hover:text-zinc-950 font-sans font-bold px-10 py-5 rounded-full text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-[0.98] text-center"
            >
              Book Your Stay
            </Link>
            <a 
              href="tel:+918106935999" 
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gold text-zinc-950 font-black font-sans transition-all active:scale-[0.98] group shadow-[0_0_25px_rgba(200,178,125,0.5)] border border-gold/40 animate-pulse-ring-glow text-xs uppercase tracking-widest text-center"
            >
              <Phone className="w-4 h-4 text-zinc-950 animate-phone-ring group-hover:scale-110 transition-transform shrink-0" />
              <span>Call +91 8106935999</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION (Get In Touch - Info Left, Form Right) */}
      <section id="contact" className="py-20 lg:py-32 bg-[#FAF8F2]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            
            {/* Contact Info - Left */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
              <div className="space-y-6">
                <span className="text-[#607A5F] text-xs font-black uppercase tracking-[0.4em] font-sans">
                  Connect With Us
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal font-bold leading-tight">
                  Get In Touch
                </h2>
                <div className="w-16 h-1 bg-gold"></div>
                <p className="font-sans text-gray-500 text-sm md:text-base leading-relaxed">
                  We're situated a convenient yet peaceful distance outside Hyderabad city. Share your event parameters or planned dates so we can customize your private luxury getaway.
                </p>
              </div>

              {/* Information Cards */}
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-800 text-sm uppercase tracking-wider font-sans mb-1">Address</span>
                    <a href="https://maps.app.goo.gl/KxQXFr7JmMT9HSSf6" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-forest transition text-sm">
                      Beside Anjali Film Studios, Koheda (V),<br />R.R. District, Telangana 501513, India
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-800 text-sm uppercase tracking-wider font-sans mb-1">Phone</span>
                    <a href="tel:+918106935999" className="text-gray-500 hover:text-forest transition text-sm">
                      +91 8106935999
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-800 text-sm uppercase tracking-wider font-sans mb-1">Email</span>
                    <a href="mailto:ecogen999@gmail.com" className="text-gray-500 hover:text-forest transition text-sm block">
                      ecogen999@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#F3EFE6] p-6 rounded-3xl border border-gray-150 text-left">
                <h3 className="font-serif font-bold text-charcoal text-lg mb-2">Plan Your Visit</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  The estate is completely private. If you wish to survey the event space beforehand, please contact our manager on call to schedule a private property visit.
                </p>
              </div>
            </div>

            {/* Form Right */}
            <div className="lg:col-span-7">
              <motion.div 
                viewport={{ once: true }}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 flex flex-col justify-center h-full"
              >
                {isSent ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="text-forest w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">Details Received!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed font-sans">
                      Thank you for contacting EcoGen Retreat. Our resort manager will check date parameters and reach out to you within the hours.
                    </p>
                    <button 
                      onClick={() => setIsSent(false)}
                      className="text-forest text-xs font-black uppercase tracking-widest underline hover:text-gold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="home-contact-name" className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Full Name</label>
                        <input id="home-contact-name" name="name" type="text" autoComplete="name" className="w-full bg-[#FAF8F2] border border-gray-150 rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="home-contact-email" className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Email Address</label>
                        <input id="home-contact-email" name="email" type="email" autoComplete="email" className="w-full bg-[#FAF8F2] border border-gray-150 rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all text-sm" required />
                        {emailError && <div className="text-red-500 text-[10px] font-black uppercase font-sans">Invalid email format</div>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="home-contact-phone" className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Phone Number</label>
                      <input id="home-contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="10 Digits Mobile" className="w-full bg-[#FAF8F2] border border-gray-150 rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all text-sm" required />
                      {phoneError && <div className="text-red-500 text-[10px] font-black uppercase font-sans">Must be a 10-digit Indian number</div>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="home-contact-subject" className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Subject</label>
                      <div className="relative">
                        <select id="home-contact-subject" name="subject" autoComplete="off" className="w-full bg-[#FAF8F2] border border-gray-150 rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all cursor-pointer text-sm appearance-none">
                          <option>Weekend Getaway Reservation</option>
                          <option>Private Birthday Pool Party</option>
                          <option>Elegant Wedding Reception</option>
                          <option>Unplugged Team Offsite</option>
                          <option>Pre-Wedding Photoshoot</option>
                          <option>Other Inquiries</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="home-contact-message" className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Your Message / Event Details</label>
                      <textarea id="home-contact-message" name="message" rows={4} autoComplete="off" placeholder="Number of guests, tentative dates, catering preferences..." className="w-full bg-[#FAF8F2] border border-gray-150 rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all resize-none text-sm" required></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-forest text-white py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-forestDeep transition shadow-xl flex justify-center items-center gap-2 font-sans"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Plan Your Visit <Send className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Component for Gallery Zoom */}
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />

    </div>
  );
};

export default Home;
