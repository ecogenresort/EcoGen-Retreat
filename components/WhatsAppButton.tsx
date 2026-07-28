import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "8106935999";
  // WhatsApp Link format: https://wa.me/918106935999 with a pre-filled welcome message
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hi%20EcoGen%20Retreat%2C%20I%20would%20like%20to%20inquire%20about%20a%20booking%20and%20availability.`;

  return (
    <div className="fixed bottom-6 left-6 z-[45] font-sans">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba56] text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all duration-300 border border-[#4be785]"
        aria-label="Chat on WhatsApp"
        id="whatsapp-button-link"
      >
        {/* Glowing concentric background wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 -z-10"></span>

        {/* Brand WhatsApp SVG Icon */}
        <svg 
          className="w-6 h-6 fill-white" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.448 4.747 1.449 5.483.002 9.944-4.461 9.947-9.948.002-2.657-1.01-5.155-2.848-6.995C16.605 1.82 14.116.8 11.474.8 5.99.8 1.53 5.263 1.527 10.75c-.001 1.795.463 3.55 1.343 5.119l-.994 3.633 3.72-.976zm12.384-5.344c-.314-.156-1.85-.913-2.137-1.018-.287-.104-.497-.156-.706.156-.21.312-.81.1.994-.994 1.25-.183.25-.365.183-.679-.068-.314-.312-1.85-.853-2.738-1.5-.156-.37-.308-.497-.678-.515-.125-.007-.27-.01-.413-.01-.144 0-.379.054-.578.273-.198.21-.758.74-.758 1.803 0 1.062.773 2.087.88 2.231.107.144 1.52 2.323 3.682 3.258.514.223.916.355 1.23.456.517.164.987.14 1.36.084.414-.06 1.85-.758 2.112-1.454.264-.695.264-1.29.186-1.413-.078-.124-.287-.196-.602-.352z"/>
        </svg>

        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[10px] font-bold tracking-widest text-[#d8ffd2] uppercase">EcoGen Inquiry</span>
          <span className="text-sm font-extrabold tracking-wide mt-0.5">Chat on WhatsApp</span>
        </div>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
