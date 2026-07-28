import React from 'react';
import RevealSection from '../components/RevealSection';
import { img } from '../assets';

const FAQS = [
  {
    q: "What are the check-in and check-out times?",
    a: "Check-in begins at 2:00 PM, and check-out is by 11:00 AM. We can often accommodate flexible timings upon request, subject to availability."
  },
  {
    q: "Is the kitchen fully equipped?",
    a: "Yes, our modern kitchen comes with a refrigerator, stove, microwave, and essential cookware/tableware, perfect for self-catering or private chefs."
  },
  {
    q: "Can we bring outside food and drinks?",
    a: "Absolutely. You are welcome to bring your own food and beverages. We also have tie-ups with local caterers if you need assistance."
  },
  {
    q: "How many guests can stay overnight?",
    a: "Our 5-bedroom villa comfortably sleeps 10-15 guests. For larger gatherings or events during the day, please contact us for capacity details."
  },
  {
    q: "Is the swimming pool private?",
    a: "Yes, the pool is exclusively for you and your group. We ensure total privacy during your stay so you can relax completely."
  },
  {
    q: "What attractions are nearby?",
    a: "We are located just 10 minutes from Ramoji Film City and 5 minutes from Sanghi Temple. Wonderla and other spots are also a short drive away."
  }
];

const About: React.FC = () => {
  return (
    <div className="py-24 md:py-40 px-6 md:px-20 bg-[#FDFBF7] text-charcoal min-h-screen animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-32 mt-8 md:mt-12">
        <RevealSection>
          <div className="text-center space-y-8 md:space-y-10">
            <span className="text-forest uppercase tracking-[0.6em] text-sm font-black block font-sans">Our Essence</span>
            <h2 className="italic text-5xl md:text-9xl tracking-tighter font-serif text-forestDeep">About Ecogen Retreat</h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
          <RevealSection>
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl italic font-bold font-serif text-gold">Our Story</h3>
                <p className="text-xl text-gray-600 leading-relaxed font-subtitle italic">
                    Ecogen Retreat is curated to provide the perfect blend of nature, comfort, and modern hospitality. Located beside lush landscapes in Koheda, R.R. District, we offer an eco-centric stay experience that fosters relaxation and connection — whether you’re here to unwind, celebrate, or explore.
                </p>
              </div>
              <div className="space-y-6">
                 <h3 className="text-3xl md:text-4xl italic font-bold font-serif text-gold">Our Philosophy</h3>
                 <p className="text-xl text-gray-600 leading-relaxed font-subtitle italic">
                    We believe in sustainable hospitality — thoughtful spaces that elevate comfort while honouring ecological balance.
                 </p>
              </div>
              <div className="space-y-6">
                 <h3 className="text-3xl md:text-4xl italic font-bold font-serif text-gold">Our Vision</h3>
                 <p className="text-xl text-gray-600 leading-relaxed font-subtitle italic">
                    To create a harmonious retreat destination where guests can rest, rejoice, and reconnect with nature.
                 </p>
              </div>
              <div className="w-20 h-1 bg-gold"></div>
            </div>
          </RevealSection>
          <div className="lg:sticky lg:top-32">
            <RevealSection delay={200}>
              <div className="rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-gold/20">
                <img src={img.dayView} className="w-full aspect-square object-cover" alt="About Ecogen" loading="lazy" />
              </div>
            </RevealSection>
          </div>
        </div>

        {/* FAQ Section */}
        <RevealSection>
          <div className="border-t border-gray-200 pt-16 md:pt-24">
            <h3 className="text-3xl md:text-5xl italic font-bold font-serif text-charcoal text-center mb-16">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-lg text-forest mb-3 font-sans">{faq.q}</h4>
                  <p className="text-gray-600 italic font-subtitle leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
};

export default About;