"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Star, Users, ShieldCheck, Headphones, BadgeCheck, Clock, HeartHandshake, Sparkles, Compass, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import heroImage    from "@/assets/varanasiHeroSection.png";
import gangaAarti   from "@/assets/gangaArtiHeroSection.png";
import ayodhyaTemple from "@/assets/ayodhya-temple.png";
import floatingDiyas from "@/assets/floating-diyas.jpg";

const slides = [
  {
    src: heroImage,
    dest: "Varanasi",
    h1: "Where Every Dawn \nIs Sacred",
    sub: "Experience the oldest living city — where the Ganga carries the prayers of a thousand generations.",
  },
  {
    src: gangaAarti,
    dest: "Ganga Aarti",
    h1: "108 Flames Light \nthe Sacred River",
    sub: "Stand at the ghats as priests perform the most mesmerising ceremony in all of India.",
  },
  {
    src: ayodhyaTemple,
    dest: "Ayodhya",
    h1: "A City Reborn in \nDivine Splendour",
    sub: "Walk the sacred land of the epics and witness the Ram Mandir in all its timeless glory.",
  },
  {
    src: floatingDiyas,
    dest: "Prayagraj",
    h1: "Three Rivers, \nOne Sacred Soul",
    sub: "The holiest confluence in Hinduism — where Ganga, Yamuna and Saraswati unite.",
  },
];

export default function HeroSection() {
  const [cur, setCur]     = useState(0);
  const [anim, setAnim]   = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setCur(i);
    setAnim(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
  }, []);

  const next = useCallback(() => goTo((cur + 1) % slides.length), [cur, goTo]);

  useEffect(() => {
    timer.current = setInterval(next, 7000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [next]);

  const s = slides[cur];

  return (
    <>
      <style>{`
        .h-slide-enter { animation: slideEnter 0.8s cubic-bezier(.22,1,.36,1) both; }
        .h-slide-enter-d1 { animation: slideEnter 0.8s 0.1s cubic-bezier(.22,1,.36,1) both; }
        .h-slide-enter-d2 { animation: slideEnter 0.8s 0.2s cubic-bezier(.22,1,.36,1) both; }
        .h-slide-enter-d3 { animation: slideEnter 0.8s 0.3s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideEnter {
          from { opacity:0; transform:translateY(25px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes zoomBg { from { transform:scale(1.1); } to { transform:scale(1); } }
        .hero-bg { animation: zoomBg 10s ease-out forwards; }
        
        .glass-form {
          background: rgba(12, 12, 12, 0.93);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05) inset;
        }
        
        .hero-input {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
          height: 48px !important;
          font-size: 14px !important;
        }
        
        .hero-input:focus {
          border-color: #E87B2C !important;
          box-shadow: 0 0 0 1px #E87B2C !important;
        }

        .hero-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }

        @media (max-width: 1024px) {
          .hero-section { height: auto !important; min-height: 100svh !important; }
          .hero-split { flex-direction: column !important; padding-top: 120px !important; text-align: center !important; }
          .hero-left { text-align: center !important; max-width: 100% !important; }
          .hero-form-container { width: 100% !important; max-width: 450px !important; margin: 30px auto 0 !important; }
        }
      `}</style>

      <section className="hero-section relative w-full h-[88svh] min-h-[720px] overflow-hidden bg-black">
        {/* Background Slider */}
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 z-0 transition-opacity duration-1000 ${i === cur ? "opacity-100" : "opacity-0"}`}>
            <Image
              src={slide.src} alt={slide.dest} fill 
              priority={i === 0}
              className={`object-cover ${i === cur ? "hero-bg" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-1" />
          </div>
        ))}

        <div className="container max-w-7xl mx-auto px-6 h-full relative z-10">
          <div className="hero-split flex items-center justify-between h-full pt-32 pb-24 gap-16">
            
            {/* Left Content */}
            <div className="hero-left flex-1 max-w-[550px]" key={`content-${cur}`}>
              {anim && (
                <>
                  <h1 className="h-slide-enter-d1 font-heading font-bold text-white text-[clamp(28px,3.5vw,48px)] leading-[1.2] mb-5 drop-shadow-2xl whitespace-pre-line tracking-normal">
                    {s.h1}
                  </h1>
                  
                  <p className="h-slide-enter-d2 text-white/75 text-sm md:text-base font-light leading-relaxed max-w-md font-body">
                    {s.sub}
                  </p>
                </>
              )}
            </div>

            {/* Right Form */}
            <div className="hero-form-container w-full max-w-[400px] shrink-0 h-slide-enter-d2">
              <div className="glass-form rounded-[32px] p-8 md:p-10 border border-white/10 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#E87B2C]/10 blur-[80px] pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="font-heading text-xl md:text-2xl text-white font-bold mb-1 tracking-tight text-center lg:text-left">Plan Your Journey</h3>
                  <p className="text-white/60 text-[10px] mb-8 font-body leading-relaxed text-center lg:text-left uppercase tracking-widest font-bold">Simple. Personal. Extraordinary.</p>
                  
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-[9px] text-white/50 uppercase tracking-[0.2em] ml-1 font-bold">Full Name</label>
                      <Input placeholder="Your Name" className="hero-input font-body bg-white/5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-white/50 uppercase tracking-[0.2em] ml-1 font-bold">Phone Number</label>
                      <Input placeholder="+91 XXXXX XXXXX" className="hero-input font-body bg-white/5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-white/50 uppercase tracking-[0.2em] ml-1 font-bold">Your Message</label>
                      <Input placeholder="E.g. Ayodhya trip for 4 people..." className="hero-input font-body bg-white/5" />
                    </div>

                    <Button className="w-full h-12 bg-[#E87B2C] hover:bg-[#d16a1b] text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(232,123,44,0.2)] flex items-center justify-center gap-2 group mt-4 border-none">
                      Get Expert Advice
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Corner Stats - Shrunk and Positioned */}
          <div className="absolute bottom-10 left-6 flex items-center gap-8 z-20 h-slide-enter-d3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <Sparkles size={14} className="text-[#E87B2C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold leading-tight">4.9</span>
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">Rating</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <HeartHandshake size={15} className="text-[#E87B2C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold leading-tight">5,000+</span>
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">Pilgrims</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <Compass size={15} className="text-[#059669]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold leading-tight">50+</span>
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">Destinations</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}