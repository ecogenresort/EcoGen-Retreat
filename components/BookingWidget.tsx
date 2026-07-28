import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Calendar, Star, Loader2, AlertCircle } from 'lucide-react';
import { GuestData, BookingStage } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

interface BookingWidgetProps {
  className?: string;
}

const PRICE_PER_NIGHT = 15000;
const SERVICE_FEE = 2500;

const BookingWidget: React.FC<BookingWidgetProps> = ({ className = "" }) => {
  const [stage, setStage] = useState<BookingStage>('dates');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<GuestData>({
    name: '',
    phone: '',
    email: '',
    req: '',
    guests: 2
  });
  
  // Validation states
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (data.booked) {
        setBookedDates(data.booked);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatDate(selectedDate);
    const isBooked = bookedDates.includes(dateStr);
    
    let isInteractable = !isBooked;
    
    // Allow checkout on booked dates if valid range
    if (isBooked && checkIn && !checkOut && selectedDate > checkIn) {
        let obstructed = false;
        let temp = new Date(checkIn);
        temp.setDate(temp.getDate() + 1);
        while(temp < selectedDate) {
            const tStr = formatDate(temp);
            if(bookedDates.includes(tStr)) { obstructed = true; break; }
            temp.setDate(temp.getDate() + 1);
        }
        if (!obstructed) isInteractable = true;
    }

    if (!isInteractable && isBooked) return;
    if (selectedDate < today) return;

    if (!checkIn || (checkIn && checkOut)) {
      if(isBooked) return; 
      setCheckIn(selectedDate);
      setCheckOut(null);
    } else if (selectedDate > checkIn) {
       let obstructed = false;
       let temp = new Date(checkIn);
       temp.setDate(temp.getDate() + 1);
       while(temp < selectedDate) {
           const tStr = formatDate(temp);
           if(bookedDates.includes(tStr)) { obstructed = true; break; }
           temp.setDate(temp.getDate() + 1);
       }
       
       if(!obstructed) {
         setCheckOut(selectedDate);
         setShowCalendar(false);
       } else {
         alert("Selected range includes booked dates.");
       }
    } else {
      if(!isBooked) setCheckIn(selectedDate);
    }
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (checkIn && date.getTime() === checkIn.getTime()) || (checkOut && date.getTime() === checkOut.getTime());
  };

  const isDateInRange = (day: number) => {
    if (!checkIn || !checkOut) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date > checkIn && date < checkOut;
  };

  const isDatePast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      setShowCalendar(true);
      return;
    }
    setStage('details');
  };
  
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

  const handleConfirmBooking = async () => {
    const isEmailValid = validateEmail(guestData.email);
    const isPhoneValid = validatePhone(guestData.phone);
    setErrorMessage(null);
    
    setEmailError(!isEmailValid);
    setPhoneError(!isPhoneValid);

    if (!guestData.name || !isEmailValid || !isPhoneValid) {
      return;
    }
    
    setIsProcessing(true);
    
    const formattedCheckIn = checkIn ? formatDate(checkIn) : '';
    const formattedCheckOut = checkOut ? formatDate(checkOut) : '';
    
    const payload = {
        action: 'booking',
        name: guestData.name,
        phone: guestData.phone,
        email: guestData.email,
        req: guestData.req,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests: guestData.guests
    };
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            // IMPORTANT: 'no-cors' removed so we can get the response
            headers: { 'Content-Type': 'text/plain' }, 
            body: JSON.stringify(payload)
        });

        // If your script URL redirects (typical for Google Apps Script), 'fetch' handles it.
        const result = await response.json();
        
        if (result.status === 'success') {
            // Optimistically block dates
            if (checkIn && checkOut) {
                let temp = new Date(checkIn);
                const newBooked = [...bookedDates];
                while(temp < checkOut) {
                    const s = formatDate(temp);
                    if(!newBooked.includes(s)) newBooked.push(s);
                    temp.setDate(temp.getDate() + 1);
                }
                setBookedDates(newBooked);
            }
            setStage('confirmed');
        } else {
            setErrorMessage("Booking failed. Please try again or contact us directly.");
        }
    } catch (e) {
        console.error(e);
        // Fallback: If CORS fails but request went through (rare with text/plain),
        // we might show success, but let's show error to be safe or ask to call.
        setErrorMessage("Connection error. If this persists, please call us to book.");
    } finally {
        setIsProcessing(false);
    }
  };

  const downloadItinerary = () => {
    if (!checkIn || !checkOut) return;
    const content = `
ECOGEN RETREAT - BOOKING ITINERARY
----------------------------------
Guest Name: ${guestData.name}
Phone: ${guestData.phone}
Check-In Date: ${checkIn.toLocaleDateString()}
Check-Out Date: ${checkOut.toLocaleDateString()}
Total Guests: ${guestData.guests}
Special Requirements: ${guestData.req || 'None'}

Thank you for choosing EcoGen. We look forward to hosting you.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EcoGen_Itinerary_${guestData.name.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  const nights = (checkIn && checkOut) ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalCost = (nights * PRICE_PER_NIGHT) + SERVICE_FEE;

  // --- RENDER STAGES ---

  if (stage === 'confirmed') {
    return (
      <div className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden p-6 md:p-12 text-center animate-in fade-in zoom-in duration-500 ${className}`}>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Check className="text-forest w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h3 className="font-serif text-2xl md:text-4xl italic font-bold text-charcoal mb-6 md:mb-8">Booking Request Sent!</h3>
        
        <div className="bg-sand/20 p-5 md:p-8 rounded-[2rem] text-left border border-forest/10 space-y-4 mb-8">
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 font-sans">Stay Summary</p>
          <div className="flex justify-between font-bold text-forest text-xs md:text-base"><span>Name:</span><span>{guestData.name}</span></div>
          <div className="flex justify-between font-bold text-forest text-xs md:text-base"><span>Dates:</span><span>{checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}</span></div>
        </div>
        
        <div className="flex flex-col gap-4">
          <button onClick={downloadItinerary} className="w-full bg-gold text-white py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:brightness-110 transition shadow-xl">
            Download Itinerary
          </button>
        </div>
        <button onClick={() => { setStage('dates'); setCheckIn(null); setCheckOut(null); }} className="text-[10px] font-black uppercase text-gray-400 underline font-sans mt-6">
          Book Another Stay
        </button>
      </div>
    );
  }

  if (stage === 'details') {
    return (
      <div className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden ${className}`}>
        <div className="p-6 md:p-10 border-b border-gray-100 bg-ivory">
          <button onClick={() => setStage('dates')} className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 mb-2 hover:text-forest transition-colors">
            <ChevronLeft className="w-3 h-3" /> Back
          </button>
          <h3 className="font-serif text-2xl md:text-4xl italic font-bold text-charcoal">Primary Details</h3>
        </div>
        <div className="p-5 md:p-8 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errorMessage}
            </div>
          )}
          
          <div className="bg-sand/30 p-4 rounded-xl flex justify-between items-center text-sm font-bold text-charcoal mb-4 border border-sand">
            <div>
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Dates</span>
              {checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Total</span>
              ₹{totalCost.toLocaleString()}
            </div>
          </div>

          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full border border-gray-200 p-3 md:p-4 rounded-xl outline-none font-semibold focus:border-forest focus:ring-4 focus:ring-forest/5 transition-all bg-white"
            value={guestData.name}
            onChange={(e) => setGuestData({...guestData, name: e.target.value})}
          />
          <div>
            <input 
              type="tel" 
              placeholder="Mobile Number" 
              className="w-full border border-gray-200 p-3 md:p-4 rounded-xl outline-none font-semibold focus:border-forest focus:ring-4 focus:ring-forest/5 transition-all bg-white"
              value={guestData.phone}
              onChange={(e) => setGuestData({...guestData, phone: e.target.value})}
            />
            {phoneError && <div className="text-red-500 text-[10px] font-black uppercase mt-1">Invalid Indian number</div>}
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full border border-gray-200 p-3 md:p-4 rounded-xl outline-none font-semibold focus:border-forest focus:ring-4 focus:ring-forest/5 transition-all bg-white"
              value={guestData.email}
              onChange={(e) => setGuestData({...guestData, email: e.target.value})}
            />
            {emailError && <div className="text-red-500 text-[10px] font-black uppercase mt-1">Invalid email format</div>}
          </div>
          <textarea 
            placeholder="Special requirements?" 
            rows={3} 
            className="w-full border border-gray-200 p-3 md:p-4 rounded-xl outline-none font-semibold focus:border-forest focus:ring-4 focus:ring-forest/5 transition-all bg-white resize-none"
            value={guestData.req}
            onChange={(e) => setGuestData({...guestData, req: e.target.value})}
          ></textarea>
          
          <button 
            onClick={handleConfirmBooking} 
            disabled={isProcessing}
            className="w-full bg-forest text-white py-5 md:py-6 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:bg-gold transition font-sans flex justify-center items-center gap-2"
          >
            {isProcessing ? <Loader2 className="animate-spin w-5 h-5"/> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    );
  }

  // ... (Calendar UI Logic - Keeping the original beautiful layout)
  
  return (
    <div className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden ${className}`}>
      <div className="p-5 sm:p-6 md:p-10 border-b border-gray-100 bg-ivory">
        <h3 className="font-serif text-2xl md:text-4xl italic font-bold text-charcoal">Book Your Stay</h3>
        <div className="flex items-center gap-2 mt-2 md:mt-3 font-sans">
          <Star className="w-4 h-4 text-forest fill-current" />
          <span className="font-bold text-charcoal text-sm">5.0</span>
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2">"Magical Retreat"</span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-left">
        <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          <button onClick={() => setShowCalendar(!showCalendar)} className="bg-white p-3 sm:p-4 md:p-6 text-center hover:bg-sand/30 transition active:bg-gray-50">
            <span className="block text-[9px] font-black uppercase text-gray-300 tracking-widest mb-1 font-sans">In</span>
            <span className="font-bold text-sm sm:text-base md:text-lg text-charcoal">{checkIn ? checkIn.toLocaleDateString() : 'Add Date'}</span>
          </button>
          <button onClick={() => setShowCalendar(!showCalendar)} className="bg-white p-3 sm:p-4 md:p-6 text-center border-l border-gray-200 hover:bg-sand/30 transition active:bg-gray-50">
            <span className="block text-[9px] font-black uppercase text-gray-300 tracking-widest mb-1 font-sans">Out</span>
            <span className="font-bold text-sm sm:text-base md:text-lg text-charcoal">{checkOut ? checkOut.toLocaleDateString() : 'Add Date'}</span>
          </button>
        </div>

        {showCalendar && (
          <div className="border border-gray-100 rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 bg-white shadow-inner animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full active:scale-90 transition-transform" aria-label="Previous Month"><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-serif font-bold italic text-sm sm:text-base md:text-lg">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full active:scale-90 transition-transform" aria-label="Next Month"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-2">
              {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] font-black text-gray-300 uppercase">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const isSelected = isDateSelected(day);
                const inRange = isDateInRange(day);
                const isPast = isDatePast(day);
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const dateStr = formatDate(date);
                const isBooked = bookedDates.includes(dateStr);
                
                let isCheckoutAllowed = false;
                if(isBooked && checkIn && !checkOut && date > checkIn) {
                    let obstructed = false;
                    let temp = new Date(checkIn);
                    temp.setDate(temp.getDate() + 1);
                    while(temp < date) {
                        const tStr = formatDate(temp);
                        if(bookedDates.includes(tStr)) { obstructed = true; break; }
                        temp.setDate(temp.getDate() + 1);
                    }
                    if(!obstructed) isCheckoutAllowed = true;
                }

                return (
                  <button
                    key={day}
                    disabled={isPast || (isBooked && !isCheckoutAllowed)}
                    onClick={() => handleDateClick(day)}
                    className={`calendar-day aspect-square flex items-center justify-center text-xs md:text-sm font-bold rounded-full transition-all relative z-10 p-0 sm:p-1
                      ${isPast ? 'text-gray-200 cursor-not-allowed past opacity-35' : 'hover:bg-sand active:scale-95'}
                      ${isBooked ? `booked ${isCheckoutAllowed ? 'checkout-allowed' : 'opacity-40 line-through'}` : ''}
                      ${isSelected ? 'bg-forest text-white shadow-lg z-20 hover:bg-forest selected' : ''}
                      ${inRange ? 'bg-sand rounded-none text-forest in-range' : ''}
                      ${checkIn?.getDate() === day && checkOut ? 'rounded-r-none range-start' : ''}
                      ${checkOut?.getDate() === day ? 'rounded-l-none range-end' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {nights > 0 && (
          <div className="bg-sand/20 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-3 font-sans animate-in fade-in">
            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest"><span>\u20B9{PRICE_PER_NIGHT.toLocaleString()} x {nights} Nights</span><span>\u20B9{(nights * PRICE_PER_NIGHT).toLocaleString()}</span></div>
            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest"><span>Service Fee</span><span>\u20B9{SERVICE_FEE.toLocaleString()}</span></div>
            <div className="flex justify-between text-xl md:text-3xl font-serif font-bold text-forest pt-4 md:pt-6 border-t border-forest/10 italic"><span>Total</span><span>\u20B9{totalCost.toLocaleString()}</span></div>
          </div>
        )}

        <div className="bg-white border border-gray-100 p-4 md:p-6 rounded-3xl flex flex-col gap-2 shadow-sm font-sans">
          <span className="block text-[9px] font-black uppercase text-gray-300 tracking-widest font-sans">Occupancy</span>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              placeholder="0" 
              min="1" 
              max="15" 
              className="w-full text-lg md:text-xl font-bold text-charcoal bg-sand/20 px-4 md:px-6 py-3 md:py-4 rounded-xl focus:ring-2 focus:ring-forest/20 outline-none"
              value={guestData.guests}
              onChange={(e) => setGuestData({ ...guestData, guests: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <button onClick={handleCheckAvailability} className="w-full bg-forest text-white py-5 md:py-6 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:bg-gold transition font-sans">
          Check Availability
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;