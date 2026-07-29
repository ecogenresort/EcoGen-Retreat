import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const socialLinks = [
    { Icon: Instagram, href: "https://www.instagram.com/ecogen_retreat?igsh=MXhydHQwb2VsMXRodQ==" },
    { Icon: Facebook, href: "https://www.facebook.com/share/1BT8rU7KHi/" },
    { Icon: Youtube, href: "https://youtube.com/@ecogenreatreat?si=nSwSYtJjqVNaRRxQ" }
  ];

  return (
    <footer className="bg-midnightForest text-white py-16 md:py-24 px-6 lg:px-20 font-sans border-t border-white/5">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Column 1: Brand & Layout Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center">
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="h-20 w-36 sm:h-24 sm:w-44 md:h-32 md:w-64 object-cover rounded-3xl border border-white/25 shadow-lg"
            >
              <source 
                src="https://res.cloudinary.com/dsqmjneyd/video/upload/q_auto/f_auto/v1781428477/watermark-removed-animate_this_logo_butterfly_sh_v2fsxn.mp4" 
                type="video/mp4" 
              />
              EcoGen Retreat Logo
            </video>
          </div>
          <p className="text-sm opacity-70 leading-relaxed max-w-sm">
            An exclusive, private eco-centric luxury resort in Koheda, Telangana, combining absolute comfort, pristine silence, and total privacy for your stays and celebrations.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-2 text-sm">
            <Link to="/about" className="opacity-80 hover:text-gold transition font-semibold">About Us</Link>
            <Link to="/rooms" className="opacity-80 hover:text-gold transition font-semibold">The Retreat</Link>
            <Link to="/events" className="opacity-80 hover:text-gold transition font-semibold">Experiences</Link>
            <Link to="/gallery" className="opacity-80 hover:text-gold transition font-semibold">Gallery</Link>
          </div>
        </div>

        {/* Column 2: Experiences */}
        <div className="lg:col-span-4 space-y-6">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gold block mb-2">Experiences</span>
          <ul className="space-y-4 font-sans text-sm">
            <li>
              <Link to="/booking" className="opacity-80 hover:text-gold transition block">
                Weekend Getaways
              </Link>
            </li>
            <li>
              <Link to="/booking" className="opacity-80 hover:text-gold transition block">
                Family Vacations
              </Link>
            </li>
            <li>
              <Link to="/booking" className="opacity-80 hover:text-gold transition block">
                Pool Parties & Celebrations
              </Link>
            </li>
            <li>
              <Link to="/booking" className="opacity-80 hover:text-gold transition block">
                Corporate Retreats
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="lg:col-span-4 space-y-6">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gold block mb-2">Contact</span>
          <ul className="space-y-5 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <a 
                href="https://maps.app.goo.gl/KxQXFr7JmMT9HSSf6" 
                target="_blank" 
                rel="noreferrer"
                className="opacity-80 hover:text-gold transition leading-relaxed"
              >
                Beside Anjali Film Studios, Koheda (V), R.R. District, Telangana 501513, India
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <a href="tel:+918106935999" className="opacity-80 hover:text-gold transition">+91 8106935999</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <a href="mailto:ecogen9999@gmail.com" className="opacity-80 hover:text-gold transition">ecogen9999@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar with correct tagline */}
      <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 font-sans">
            © {new Date().getFullYear()} EcoGen Retreat. All rights reserved.
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" className="text-white hover:text-gold transition-colors opacity-40 hover:opacity-100">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        
        <span className="font-serif italic text-gold text-base md:text-xl font-semibold tracking-wide drop-shadow">
          Be a Butterfly in Our Paradise
        </span>
      </div>
    </footer>
  );
};

export default Footer;
