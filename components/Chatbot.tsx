import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Minimize2, User, Phone, CheckCircle, Check,
  Loader2, Sparkles, AlertTriangle, Wifi, ShieldCheck, Home,
  RotateCcw, IndianRupee, Waves, Calendar, PhoneCall, Mail, ClipboardList
} from 'lucide-react';
import { GOOGLE_SCRIPT_URL } from '../constants';
import { logBookingToSupabase, logLeadToSupabase } from '../lib/syncToSupabase';
import { downloadItineraryPdf } from '../lib/generateItineraryPdf';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
  isBookingWidget?: boolean;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type LeadStep = 'none' | 'name' | 'phone' | 'subject' | 'email' | 'message';

const FAQ_DATA = [
  {
    keys: ["pricing", "price", "cost", "tariff", "rates", "rate", "rupee", "rupees"],
    ans: "The listing tariff for EcoGen Retreat is 15,000 rupees per night for exclusive hire of the entire property (hosting up to 15 guests). There is also a standard one-time service charge of ₹2,500 per booking."
  },
  {
    keys: ["wifi", "internet", "wi-fi", "connection", "net"],
    ans: "Yes! High-speed Wi-Fi internet is fully available throughout the physical villa boundaries and the outdoor lawn/gardens."
  },
  {
    keys: ["room", "rooms", "bedroom", "bedrooms", "bed", "beds", "ac", "air"],
    ans: "EcoGen Retreat features 5 premium, fully air-conditioned (AC) luxury bedrooms inside, each with attached washrooms, comfortable modern linens, and serene private garden/rural views."
  },
  {
    keys: ["food", "kitchen", "cook", "chef", "catering", "eat", "meals", "fridge", "microwave"],
    ans: "We feature a modern, fully equipped kitchen with a refrigerator, microwave, gas stove, and essential cookware for complete self-catering. We can also provide premium local catering partner menus for private gatherings on request!"
  },
  {
    keys: ["pool", "swimming", "swim", "water"],
    ans: "Yes! A pristine private outdoor swimming pool is situated inside the boundary for the exclusive use of you and your guests."
  },
  {
    keys: ["location", "where", "address", "map", "direction", "directions", "koheda", "telangana"],
    ans: "Our retreat is located in Koheda Village, R.R. District, Telangana, 501513, right beside Anjali Film Studios. You can easily view our exact location on the interactive Google Map inside our Contact page!"
  },
  {
    keys: ["capacity", "guests", "limit", "people", "gatherings", "party", "parties", "wedding", "weddings"],
    ans: "The villa accommodates 10-15 guests for comfortable overnight lodging. For day-long backyard events, celebrations, photo shoots, and weddings, the scenic outdoor lawn accommodates much larger group capacities."
  },
  {
    keys: ["checkin", "checkout", "check-in", "check-out", "time", "times", "hours"],
    ans: "Standard check-in begins at 12:00 PM and check-out is by 10:00 AM. Early arrivals or delayed departures can be coordinated based on booking availability."
  },
  {
    keys: ["pet", "pets", "dog", "dogs", "cat", "animals"],
    ans: "Yes! We are proud to be pet-friendly. Please mention your pets' arrival details during booking so we can coordinate cleanly."
  },
  {
    keys: ["attractions", "attraction", "visit", "around", "nearby", "ramoji", "sanghi", "wonderla", "temple", "point", "gutta", "studio", "studios"],
    ans: "We are ideally situated near excellent regional landmarks: Sanghi Temple (5 mins), Ramoji Film City (10 mins), Wonderla Amusement Park (15 mins), Anjali Film Studio (Beside), and Koheda Gutta (5 mins)."
  },
  {
    keys: ["contact", "phone", "mobile", "number", "call", "inquiry", "inquiries", "whatsapp"],
    ans: "You can call us directly or inquire via WhatsApp at +91 8106935999. Our team is available to assist you with active reservation inquiries."
  },
  {
    keys: ["power", "electricity", "backup", "generator", "light", "lights"],
    ans: "We feature full diesel-generator and power backup facilities to ensure absolute safety, seamless cooling, and continuous celebration lighting!"
  }
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessages: Message[] = [
    { 
      id: 1, 
      type: 'bot', 
      text: "Welcome to EcoGen Retreat! I'm here to help you plan your stay. What would you like to know?",
      options: ["📅 Book via Chat", "Retreat Location", "Nearby Attractions"] 
    }
  ];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [leadStep, setLeadStep] = useState<LeadStep>('none');
  const [leadData, setLeadData] = useState<LeadData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Chat-exclusive booking fields
  const [chatInDate, setChatInDate] = useState("");
  const [chatOutDate, setChatOutDate] = useState("");
  const [chatGuests, setChatGuests] = useState(2);
  const [chatName, setChatName] = useState("");
  const [chatPhone, setChatPhone] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const [chatRemarks, setChatRemarks] = useState("");
  const [isChatBookingSubmitted, setIsChatBookingSubmitted] = useState(false);
  const [chatBookingLoading, setChatBookingLoading] = useState(false);
  const [chatBookingError, setChatBookingError] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const calcChatNights = (inD: string, outD: string) => {
    if (!inD || !outD) return 0;
    const d1 = new Date(inD);
    const d2 = new Date(outD);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasError(false);
  };

  const handleRefresh = () => {
    setMessages(initialMessages);
    setLeadStep('none');
    setLeadData({ name: '', email: '', phone: '', subject: '', message: '' });
    setHasError(false);
    setIsSending(false);
    
    // Clear chat booking fields
    setChatInDate("");
    setChatOutDate("");
    setChatGuests(2);
    setChatName("");
    setChatPhone("");
    setChatEmail("");
    setChatRemarks("");
    setIsChatBookingSubmitted(false);
    setChatBookingLoading(false);
    setChatBookingError("");
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setHasError(false);

    setTimeout(() => {
      processResponse(text);
    }, 500);
  };

  const processResponse = async (input: string) => {
    const cleanInput = input.toLowerCase().trim();

    // 1. Check for reset commands
    if (cleanInput === 'cancel' || cleanInput === 'stop' || cleanInput === 'reset') {
      handleRefresh();
      addBotMessage("Chat reset. How can I help you?", ["Retreat Location", "Nearby Attractions"]);
      return;
    }

    // 2. Handle Lead Capture Flow
    if (leadStep !== 'none') {
      switch (leadStep) {
        case 'name':
          setLeadData(prev => ({ ...prev, name: input }));
          setLeadStep('phone');
          addBotMessage("Thank you! Please share your 10-digit mobile number.");
          break;
        case 'phone':
          const phoneDigits = input.replace(/\D/g, '');
          if (phoneDigits.length < 10) {
            addBotMessage("Please enter a valid 10-digit phone number.");
          } else {
            setLeadData(prev => ({ ...prev, phone: input }));
            setLeadStep('subject');
            addBotMessage("What brings you to EcoGen today?", ["Weekend Stay", "Wedding / Event", "Corporate Retreat", "Other"]);
          }
          break;
        case 'subject':
          setLeadData(prev => ({ ...prev, subject: input }));
          setLeadStep('email');
          addBotMessage("Got it! To send you the details, please provide your Email Address.");
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
            addBotMessage("That doesn't look like a valid email. Please try again.");
          } else {
            setLeadData(prev => ({ ...prev, email: input }));
            setLeadStep('message');
            addBotMessage("Lastly, please type any specific message or requirements you have.");
          }
          break;
        case 'message':
          const finalLead = { ...leadData, message: input };
          setLeadData(finalLead);
          setLeadStep('none');
          await submitLead(finalLead);
          break;
      }
      return;
    }

    // 3. Check for specific triggers (fixed collision check)
    const isCallbackRequest = 
      cleanInput.includes("callback") || 
      cleanInput.includes("call back") || 
      cleanInput === "request call back" ||
      (cleanInput.includes("call") && (cleanInput.includes("me") || cleanInput.includes("team") || cleanInput.includes("back")));

    if (isCallbackRequest) {
      setLeadStep('name');
      addBotMessage("I'll have our team reach out to you. First, what is your Full Name?");
      return;
    }

    // 4. Check for booking triggers
    if (cleanInput.includes("book") || cleanInput.includes("reserve") || cleanInput.includes("availability") || cleanInput.includes("stay") || cleanInput.includes("calendar")) {
       addBotMessage("Would you like to book your stay directly inside this chat window? Or would you prefer to visit our full booking page?", ["📅 Book via Chat", "View full Booking Page"]);
       return;
    }

    // 5. Check FAQ Keywords with key array matching
    let foundAnswer = null;
    for (const item of FAQ_DATA) {
      const match = item.keys.some(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        return regex.test(cleanInput) || (key.length > 3 && cleanInput.includes(key));
      });
      if (match) {
        foundAnswer = item.ans;
        break;
      }
    }

    if (foundAnswer) {
      addBotMessage(foundAnswer, ["📅 Book via Chat", "Retreat Location", "Nearby Attractions"]);
      return;
    }

    // 6. Fallback
    addBotMessage("I'm still learning! Feel free to ask me about our location, nearby attractions, guest capacity, kitchen space, check-in details, and more.", ["📅 Book via Chat", "Retreat Location", "Nearby Attractions"]);
  };

  const addBotMessage = (text: string, options?: string[], isBookingWidget?: boolean) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text, options, isBookingWidget }]);
  };

  const handleOptionClick = (option: string) => {
    if (option === "View full Booking Page" || option === "Book Now") {
      window.location.hash = "#/booking";
      setIsOpen(false);
      return;
    }
    if (option === "📅 Book via Chat") {
      setIsChatBookingSubmitted(false);
      setChatBookingError("");
      addBotMessage("Direct Concierge Booking Center loaded! Fill in your details below to submit your reservation request.", undefined, true);
      return;
    }
    handleSend(option);
  };

  const getOptionIcon = (option: string) => {
    const opt = option.toLowerCase();
    if (opt.includes('pricing')) return <IndianRupee className="w-3.5 h-3.5" />;
    if (opt.includes('amenities')) return <Waves className="w-3.5 h-3.5" />;
    if (opt.includes('availability') || opt.includes('book') || opt.includes('date')) return <Calendar className="w-3.5 h-3.5" />;
    if (opt.includes('call back')) return <PhoneCall className="w-3.5 h-3.5" />;
    if (opt.includes('stay')) return <Home className="w-3.5 h-3.5" />;
    if (opt.includes('event') || opt.includes('wedding')) return <Sparkles className="w-3.5 h-3.5" />;
    if (opt.includes('retreat')) return <ClipboardList className="w-3.5 h-3.5" />;
    if (opt.includes('other')) return <Mail className="w-3.5 h-3.5" />;
    return <ClipboardList className="w-3.5 h-3.5" />;
  };

  const submitLead = async (data: LeadData) => {
    setIsSending(true);
    setHasError(false);
    
    try {
      const payload = {
        action: 'contact',
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message + "\n\n(Lead captured via Chatbot)"
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || result.status !== 'success') throw new Error(result.message || 'Failed');

      logLeadToSupabase({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        source: 'chatbot-lead',
      });

      addBotMessage("✅ Excellent! Your details have been submitted. Our team will contact you shortly.");
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Is there anything else I can assist you with today?", options: ["Retreat Location", "Nearby Attractions"] }]);
    } catch (error) {
      setHasError(true);
      addBotMessage("⚠️ System is currently busy. Please call us directly at +91 8106935999 for immediate assistance.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        aria-label="Open Chat"
        className={`fixed bottom-6 right-6 z-[60] bg-forest text-white p-4 sm:p-5 rounded-full shadow-2xl hover:bg-gold transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse border-2 border-white"></span>
      </button>

      <div 
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60] w-full sm:w-[400px] bg-white sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 origin-bottom-right flex flex-col border-t sm:border border-gray-100 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`} 
        style={{ height: window.innerWidth < 640 ? '100%' : '700px', maxHeight: '100dvh' }}
      >
        <div className="bg-forest p-5 flex justify-between items-center text-white relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest via-[#1e2f26] to-midnightForest"></div>
          <div className="relative flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <Sparkles className="w-6 h-6 text-gold" />
             </div>
             <div>
                <h3 className="font-bold font-serif text-xl tracking-wide">EcoGen Concierge</h3>
                <p className="text-[9px] uppercase tracking-widest opacity-80 flex items-center gap-1.5 font-black">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span> Online
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <button onClick={handleRefresh} title="Refresh Chat" className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <RotateCcw className="w-5 h-5 opacity-80" />
            </button>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              {window.innerWidth < 640 ? <X className="w-7 h-7" /> : <Minimize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-5 bg-sand/10 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-300`}>
                <div className={`max-w-[88%] p-4 rounded-3xl shadow-sm text-[15px] leading-relaxed font-medium ${
                  msg.type === 'user' ? 'bg-forest text-white rounded-tr-none' : 'bg-white text-charcoal border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>

              {msg.isBookingWidget && (
                <div className="w-full bg-white border border-gray-200/80 rounded-[2rem] p-5 shadow-lg text-charcoal text-left font-sans animate-in zoom-in-95 duration-200">
                  {isChatBookingSubmitted ? (
                    <div className="text-center p-3">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 animate-bounce">
                        <Check className="w-7 h-7" />
                      </div>
                      <h4 className="font-serif italic font-bold text-xl text-charcoal mb-2">Request Received!</h4>
                      <p className="text-xs text-gray-500 mb-5 leading-relaxed">Your reservation request has been registered. Our team will verify and block dates.</p>
                      
                      <div className="bg-sand/30 p-4 rounded-2xl text-left text-xs space-y-2 border border-gray-100 mb-5">
                        <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-2">Inquiry Summary</p>
                        <div className="flex justify-between font-semibold"><span>Name:</span><span>{chatName}</span></div>
                        <div className="flex justify-between font-semibold"><span>Dates:</span><span>{chatInDate} to {chatOutDate}</span></div>
                        <div className="flex justify-between font-semibold"><span>Guests:</span><span>{chatGuests} Guests</span></div>
                      </div>

                      <div className="space-y-2.5">
                        <button 
                          onClick={() => {
                            downloadItineraryPdf({
                              documentTitle: 'Concierge Reservation Inquiry',
                              guestName: chatName,
                              phone: chatPhone,
                              email: chatEmail,
                              checkIn: chatInDate,
                              checkOut: chatOutDate,
                              guests: chatGuests,
                              requirements: chatRemarks,
                              footerNote: 'Please present this to the host. Thank you for choosing EcoGen Retreat.',
                              filenamePrefix: 'EcoGen_Chat_Inquiry',
                            });
                          }}
                          className="w-full bg-gold text-zinc-950 font-sans font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition shadow-md"
                        >
                          Download Chat Itinerary
                        </button>
                        <a 
                          href={`https://wa.me/918106935999?text=${encodeURIComponent("Hello! I just submitted an inquiry via Chatbot for " + chatName + ". Please confirm availability.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-500 text-white font-sans font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-md"
                        >
                          💬 WhatsApp Host to Confirm
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest font-sans flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold" /> Chat Booking Request
                        </span>
                      </div>

                      {chatBookingError && (
                        <div className="text-red-600 bg-red-50 text-[11px] p-2.5 rounded-lg border border-red-100 font-bold flex items-center gap-2 animate-pulse">
                          <AlertTriangle className="w-4 h-4 shrink-0" /> {chatBookingError}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1 font-sans">Check-In</label>
                          <input
                            type="date"
                            className="w-full text-xs font-bold text-charcoal bg-sand/20 px-3 py-2.5 rounded-xl border border-transparent focus:border-gold/30 focus:bg-white outline-none font-sans"
                            value={chatInDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setChatInDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1 font-sans">Check-Out</label>
                          <input
                            type="date"
                            className="w-full text-xs font-bold text-charcoal bg-sand/20 px-3 py-2.5 rounded-xl border border-transparent focus:border-gold/30 focus:bg-white outline-none font-sans"
                            value={chatOutDate}
                            min={chatInDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setChatOutDate(e.target.value)}
                          />
                        </div>
                      </div>
                      {chatInDate && chatOutDate && calcChatNights(chatInDate, chatOutDate) > 0 && (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {calcChatNights(chatInDate, chatOutDate)} Night{calcChatNights(chatInDate, chatOutDate) > 1 ? 's' : ''}
                        </p>
                      )}

                      <div className="space-y-1">
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1 font-sans">Number of Guests</label>
                        <select 
                          className="w-full text-xs font-bold text-charcoal bg-sand/20 px-3 py-2.5 rounded-xl border border-transparent focus:border-gold/30 focus:bg-white outline-none appearance-none cursor-pointer font-sans"
                          value={chatGuests}
                          onChange={(e) => setChatGuests(Number(e.target.value))}
                        >
                          {Array.from({ length: 15 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <span className="block text-[9px] font-black uppercase text-gray-400 tracking-widest font-sans mb-1">Guest Communication</span>
                        <input 
                          type="text" 
                          placeholder="Your Full Name" 
                          className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded-xl outline-none font-semibold focus:border-forest"
                          value={chatName}
                          onChange={(e) => setChatName(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2.5">
                          <input 
                            type="tel" 
                            placeholder="Mobile No." 
                            className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded-xl outline-none font-semibold focus:border-forest"
                            value={chatPhone}
                            onChange={(e) => setChatPhone(e.target.value)}
                          />
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded-xl outline-none font-semibold focus:border-forest"
                            value={chatEmail}
                            onChange={(e) => setChatEmail(e.target.value)}
                          />
                        </div>
                        <textarea 
                          placeholder="Special requirements (food catering, bonfire setup)?" 
                          rows={2}
                          className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded-xl outline-none font-semibold focus:border-forest resize-none"
                          value={chatRemarks}
                          onChange={(e) => setChatRemarks(e.target.value)}
                        />
                      </div>

                      <button 
                        onClick={async () => {
                          if (!chatInDate || !chatOutDate) {
                            setChatBookingError("Please select check-in and check-out dates");
                            return;
                          }
                          if (calcChatNights(chatInDate, chatOutDate) <= 0) {
                            setChatBookingError("Check-out must be after check-in");
                            return;
                          }
                          if (!chatName.trim()) {
                            setChatBookingError("Please enter your name");
                            return;
                          }
                          if (!/^[6-9]\d{9}$/.test(chatPhone.replace(/\D/g, ''))) {
                            setChatBookingError("Enter a valid 10-digit mobile number");
                            return;
                          }
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chatEmail)) {
                            setChatBookingError("Please enter a valid email address");
                            return;
                          }

                          setChatBookingLoading(true);
                          setChatBookingError("");

                          const payload = {
                            action: 'booking',
                            name: chatName,
                            phone: chatPhone,
                            email: chatEmail,
                            checkIn: chatInDate,
                            checkOut: chatOutDate,
                            guests: chatGuests,
                            req: chatRemarks
                          };

                          try {
                            const response = await fetch(GOOGLE_SCRIPT_URL, {
                              method: 'POST',
                              headers: { 'Content-Type': 'text/plain' },
                              body: JSON.stringify(payload)
                            });
                            const result = await response.json();
                            if (result.status === 'success') {
                              logBookingToSupabase({
                                name: chatName,
                                phone: chatPhone,
                                email: chatEmail,
                                checkIn: chatInDate,
                                checkOut: chatOutDate,
                                guests: chatGuests,
                                requirements: chatRemarks,
                                source: 'chatbot-booking-widget',
                              });
                              setIsChatBookingSubmitted(true);
                              setTimeout(() => {
                                setMessages(prev => [...prev, { id: Date.now() + 10, type: 'bot', text: `🎉 Direct booking request received for ${chatName}! I've generated an itinerary below that you can keep. Feel free to contact our host to expedite approval.` }]);
                              }, 300);
                            } else {
                              setChatBookingError(result.message || "Process failed. Please dial +91 8106935999 directly.");
                            }
                          } catch (e) {
                            console.error(e);
                            setChatBookingError("Check connection. You can still WhatsApp our host directly above!");
                          } finally {
                            setChatBookingLoading(false);
                          }
                        }}
                        disabled={chatBookingLoading}
                        className="w-full bg-forest text-gold py-3.5 rounded-full font-serif italic font-bold text-sm tracking-wide hover:bg-gold hover:text-zinc-950 transition duration-300 shadow-md flex items-center justify-center gap-2"
                      >
                        {chatBookingLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Querying system...
                          </>
                        ) : (
                          "Request Direct Booking"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {messages.length > 0 && messages[messages.length - 1].options && (
            <div className="flex flex-wrap gap-2.5 mt-2 animate-in fade-in slide-in-from-left-2 duration-500">
              {messages[messages.length - 1].options!.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleOptionClick(opt)}
                  className="bg-white border border-forest/10 text-forest font-bold text-[11px] uppercase tracking-wider px-5 py-3 rounded-2xl hover:bg-gold hover:text-white hover:border-gold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {getOptionIcon(opt)}
                  {opt}
                </button>
              ))}
            </div>
          )}
          {isSending && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 flex items-center gap-3 text-xs font-bold text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" /> Submitting...
               </div>
            </div>
          )}
          {hasError && (
             <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-xs font-bold">
               <AlertTriangle className="w-4 h-4" /> Connection issue. Please call +91 8106935999.
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-5 bg-white border-t border-gray-100 pb-10 sm:pb-5 shrink-0">
           <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3 relative">
             <input 
               type="text" 
               className="flex-grow bg-sand/30 border border-transparent rounded-2xl px-6 py-4 focus:border-gold/30 focus:bg-white focus:ring-4 focus:ring-gold/5 outline-none text-charcoal font-semibold placeholder:text-gray-400 transition-all text-[15px]"
               placeholder={
                 leadStep === 'name' ? "Enter Full Name..." : 
                 leadStep === 'phone' ? "Enter Phone Number..." :
                 leadStep === 'subject' ? "Choose Interest..." :
                 leadStep === 'email' ? "Enter Email Address..." :
                 leadStep === 'message' ? "Type your message..." :
                 "Type your question..."
               }
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               disabled={isSending}
             />
             <button type="submit" disabled={!inputText.trim() || isSending} className="w-14 h-14 bg-forest text-white rounded-2xl flex items-center justify-center hover:bg-gold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
               <Send className="w-6 h-6 ml-0.5" />
             </button>
           </form>
           <div className="text-center mt-4">
             <span className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-black">Powered by EcoGen Concierge</span>
           </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;