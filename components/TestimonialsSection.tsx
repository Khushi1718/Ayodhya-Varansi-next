"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Award } from "lucide-react";

import varanasiImg from "@/assets/ghat.jpg";
import ayodhyaImg from "@/assets/Ayodhya🚩.jpg";
import prayagrajImg from "@/assets/prayagraj.jpg";
import spiritualImg from "@/assets/temple-prayer.jpg";

const reviews = [
  {
    name: "Amit Agarwala",
    date: "27 Jul 2024",
    initials: "AA",
    rating: 5,
    text: "Our recent trip to Varanasi and Ayodhya arranged through Divine Journeys was nothing short of spectacular. From start to finish, the team ensured our spiritual journey was seamless, taking care of VIP darshans and luxury stays perfectly.",
    images: [varanasiImg, ayodhyaImg, spiritualImg]
  },
  {
    name: "Priya Sharma",
    date: "14 Aug 2024",
    initials: "PS",
    rating: 5,
    text: "The Kumbh Mela experience in Prayagraj was life-changing. The dedicated guide and the premium tents provided by Divine Journeys made us feel incredibly comfortable amidst the millions of pilgrims. Highly recommended!",
    images: [prayagrajImg, spiritualImg, varanasiImg]
  },
  {
    name: "Rahul Verma",
    date: "02 Sep 2024",
    initials: "RV",
    rating: 5,
    text: "I was initially worried about taking my elderly parents to the ghats, but the team arranged everything flawlessly. The private boat for the Ganga Aarti was the highlight of our trip. Absolutely breathtaking and very safe.",
    images: [varanasiImg, prayagrajImg, ayodhyaImg]
  },
  {
    name: "Sneha Patel",
    date: "15 Oct 2024",
    initials: "SP",
    rating: 5,
    text: "A truly divine experience! The local guides knew exactly where to go and at what time to avoid crowds. The heritage hotel they booked for us was right on the ghats, offering stunning sunrise views.",
    images: [ayodhyaImg, spiritualImg, prayagrajImg]
  }
];

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  /* ── auto-scroll logic ── */
  const startAutoScroll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        
        if (isAtEnd) {
          // Loop back to start
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll to next card
          scrollRight();
        }
      }
    }, 3000); // 3 seconds - auto scroll with loop back
  }, []);

  const resetAutoScroll = useCallback(() => {
    startAutoScroll();
  }, [startAutoScroll]);

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoScrolling, startAutoScroll]);

  const handleUserInteraction = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    resetAutoScroll();
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">
        
        {/* LEFT SIDE - TRUST BANNER */}
        <div className="w-full lg:w-[35%] flex flex-col justify-center text-center lg:text-left flex-shrink-0 pt-4">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 text-yellow-500 font-bold text-sm tracking-widest uppercase">
            <Award size={22} />
            <span className="text-gray-900">Awarded Best Spiritual Tours</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8 text-center lg:text-left">
            The Travel & Tourism Annual Conclave Awards
          </h2>
          
          <div className="hidden md:flex flex-col sm:flex-row items-center lg:items-start gap-8 justify-center lg:justify-start border-t border-b border-gray-100 py-8 w-full max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#ff5722] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                ★
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-[15px]">10,000+ Reviews</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Read Stories</p>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-gray-200 text-gray-900 rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
                <span className="text-blue-500">G</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-[15px]">4.9 ★ Rated</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">By 5K+ Travellers</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-4">
            <button onClick={() => { scrollLeft(); handleUserInteraction(); }} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => { scrollRight(); handleUserInteraction(); }} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - SLIDING TESTIMONIALS */}
        <div className="w-full lg:w-[65%] relative">
          {/* Fading edge gradients for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((r, i) => (
              <div 
                key={i} 
                className="snap-start w-[320px] min-w-[320px] md:w-[360px] md:min-w-[360px] bg-white border border-gray-100 rounded-2xl p-6 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex-shrink-0 transition-transform hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {r.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{r.name}</h4>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">On: {r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#00b67a] font-bold text-sm bg-[#00b67a]/10 px-2.5 py-1 rounded-md">
                    ★ {r.rating}
                  </div>
                </div>

                <p className="text-gray-600 text-[13.5px] leading-relaxed mb-6 flex-grow whitespace-normal">
                  {r.text} <span className="font-bold cursor-pointer hover:underline text-gray-900">Read More</span>
                </p>

                <div className="flex gap-3">
                  {r.images.map((img, idx) => (
                    <div key={idx} className="relative w-[72px] h-[72px] md:w-20 md:h-20 rounded-[14px] overflow-hidden shadow-sm group cursor-pointer">
                      <Image src={img} alt="Trip image" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="80px" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

      </div>
    </section>
  );
}