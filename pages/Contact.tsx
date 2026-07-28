import React, { useState } from 'react';
import { MapPin, Phone, Mail, ChevronDown, Send, Loader2, Check } from 'lucide-react';
import RevealSection from '../components/RevealSection';
import { GOOGLE_SCRIPT_URL } from '../constants';

const Contact: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation State
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            // IMPORTANT: Removed no-cors to ensure delivery confirmation
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
        setIsSent(true);
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please call us.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="py-24 md:py-32 px-6 lg:px-20 text-forestDeep bg-sand/10 min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mt-12">
        {/* Info */}
        <RevealSection>
          <div className="space-y-12 md:space-y-16">
            <div>
              <h2 className="font-serif italic text-4xl md:text-7xl mb-8 md:mb-12 text-charcoal">Reach Out Directly</h2>
              <div className="space-y-8 md:space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl md:text-2xl text-charcoal mb-2 font-sans">Our Sanctuary</h4>
                    <a href="https://www.google.com/maps?cid=1257650818496697342&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed" target="_blank" rel="noreferrer" className="text-base md:text-lg text-gray-500 font-medium leading-relaxed font-sans hover:text-gold transition-colors block">
                      Beside Anjali film studios, Koheda(V),<br />R.R. District, Telangana 501513.
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl md:text-2xl text-charcoal mb-2 font-sans">Call Us</h4>
                    <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed font-sans">
                      General: +91 8106935999<br />
                      Events: +91 8106935999
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl md:text-2xl text-charcoal mb-2 font-sans">Email</h4>
                    <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed font-sans">ecogen9999@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pl-4 border-l-4 border-gold/30">
              <h3 className="font-serif italic text-2xl md:text-3xl font-bold text-charcoal mb-4">Event Bookings</h3>
              <p className="text-gray-500 font-medium leading-relaxed font-sans max-w-md text-base md:text-lg">
                Planning a wedding, corporate offsite, or a celebration? Contact our dedicated events manager for personalized packages and catering options.
              </p>
            </div>
          </div>
        </RevealSection>

        {/* Form */}
        <div className="h-fit">
          <RevealSection delay={200}>
            <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 h-full">
              {isSent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mb-6">
                    <Check className="text-forest w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif italic font-bold text-charcoal mb-4">Message Sent!</h3>
                  <p className="text-gray-500 text-lg max-w-xs mx-auto">Thank you for reaching out. Our team will contact you shortly.</p>
                  <button onClick={() => setIsSent(false)} className="mt-8 text-forest font-bold uppercase text-xs tracking-widest border-b-2 border-forest pb-1 hover:text-gold hover:border-gold transition-colors">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Full Name</label>
                      <input name="name" type="text" className="w-full bg-sand/30 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Email Address</label>
                      <input name="email" type="email" className="w-full bg-sand/30 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all" required />
                      {emailError && <div className="text-red-500 text-[10px] font-black uppercase">Invalid email format</div>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Phone Number</label>
                    <input name="phone" type="tel" className="w-full bg-sand/30 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all" required />
                    {phoneError && <div className="text-red-500 text-[10px] font-black uppercase">Must be a 10-digit Indian number</div>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Subject</label>
                    <div className="relative">
                      <select name="subject" className="w-full bg-sand/30 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all appearance-none cursor-pointer">
                        <option>General Inquiry</option>
                        <option>Wedding / Event</option>
                        <option>Corporate Retreat</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Your Message</label>
                    <textarea name="message" rows={4} className="w-full bg-sand/30 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-forest/20 outline-none font-bold text-charcoal transition-all resize-none" required></textarea>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full bg-forest text-white py-5 rounded-xl font-bold text-lg hover:bg-forestDeep transition shadow-xl flex justify-center items-center gap-2 group font-sans disabled:opacity-70">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>
              )}
            </div>
          </RevealSection>
        </div>
      </div>

      {/* Embedded Google Map Section */}
      <div className="max-w-7xl mx-auto mt-16 md:mt-24 h-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <RevealSection delay={300}>
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="space-y-1">
                <span className="text-[#607A5F] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] font-sans block">
                  Location Sanctuary
                </span>
                <h3 className="font-serif text-2xl md:text-3xl italic font-bold text-charcoal">
                  Our Location Sanctuary Map
                </h3>
              </div>
              <a 
                href="https://www.google.com/maps?cid=1257650818496697342&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-forest text-white px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-gold transition shadow-md hover:scale-102 active:scale-98 font-sans w-fit"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Open in Google Maps / Get Directions</span>
              </a>
            </div>

            {/* Live Interactive Iframe */}
            <div className="relative w-full rounded-2xl md:rounded-[2rem] overflow-hidden aspect-[16/9] min-h-[350px] shadow-inner border border-gray-100">
              <iframe
                title="EcoGen Retreat Location Map"
                src="https://maps.google.com/maps?cid=1257650818496697342&output=embed"
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
};

export default Contact;