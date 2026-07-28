import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/rooms';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;
  
  const navClass = isTransparent 
    ? 'bg-transparent text-white py-4 md:py-6' 
    : 'bg-white/95 backdrop-blur-xl text-forest shadow-md py-3 md:py-4';
    
  const linkClass = isTransparent
    ? 'text-white hover:text-gold'
    : 'text-forest hover:text-gold';

  const logoClass = isTransparent ? 'text-white' : 'text-forest';
  
  const buttonClass = isTransparent 
    ? 'bg-white text-forest hover:bg-gold hover:text-white' 
    : 'bg-forest text-white hover:bg-gold';

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'The Retreat', path: '/rooms' },
    { name: 'Experiences', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav id="nav-header" className={`fixed w-full z-50 px-4 sm:px-6 lg:px-16 transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1) ${navClass}`}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <Link id="nav-logo" to="/" className="flex items-center group">
            <video 
              autoPlay
              loop
              muted
              playsInline
              className={`object-cover rounded-2xl md:rounded-3xl border border-white/20 shadow-lg group-hover:scale-105 transition-all duration-750 ${
                scrolled ? 'h-10 w-20 sm:h-12 sm:w-24 md:h-14 md:w-28 lg:h-16 lg:w-32' : 'h-12 w-24 sm:h-14 sm:w-28 md:h-16 md:w-32 lg:h-20 lg:w-40 xl:h-24 xl:w-48'
              }`}
            >
              <source 
                src="https://res.cloudinary.com/dsqmjneyd/video/upload/q_auto/f_auto/v1781428477/watermark-removed-animate_this_logo_butterfly_sh_v2fsxn.mp4" 
                type="video/mp4" 
              />
              EcoGen Retreat Logo
            </video>
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-[13px] font-extrabold uppercase tracking-[0.2em] transition-all opacity-90 hover:opacity-100 ${linkClass}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/booking" 
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-2xl ${buttonClass}`}
            >
              Book Your Stay
            </Link>
          </div>

          <button 
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <Menu className={`w-7 h-7 ${isTransparent ? 'text-white' : 'text-forest'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[60] flex flex-col p-6 sm:p-8 overflow-y-auto transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <div className="flex justify-between items-center mb-8 shrink-0">
          <Link to="/" onClick={toggleMenu} className="flex items-center">
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="h-14 w-28 sm:h-18 sm:w-36 object-cover rounded-2xl border border-forest/10 shadow-md"
            >
              <source 
                src="https://res.cloudinary.com/dsqmjneyd/video/upload/q_auto/f_auto/v1781428477/watermark-removed-animate_this_logo_butterfly_sh_v2fsxn.mp4" 
                type="video/mp4" 
              />
              EcoGen Retreat Logo
            </video>
          </Link>
          <button 
            onClick={toggleMenu} 
            className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forestDeep transition-all shadow-xl hover:scale-105 hover:rotate-90 group active:scale-95"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="flex flex-col space-y-5 sm:space-y-6 text-xl sm:text-2xl font-serif italic font-bold text-charcoal py-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              onClick={toggleMenu}
              className="hover:text-gold transition-colors block py-1.5 border-b border-gray-100/50"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-8 shrink-0">
          <Link 
            to="/booking"
            onClick={toggleMenu}
            className="block w-full bg-forest text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm sm:text-base shadow-xl hover:bg-forestDeep transition-colors text-center active:scale-[0.99]"
          >
            Book Your Stay
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;