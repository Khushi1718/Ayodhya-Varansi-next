"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useModal } from "@/lib/ModalContext";

import ayodhyaTemple from "@/assets/ayodhya-temple.png";
import boatGanges from "@/assets/boat-ganges.jpg";
import gangaAarti from "@/assets/ganga-aarti.jpg";

const offers = [
  {
    id: 1,
    badge: "Monsoon Special",
    title: "Monsoon Pilgrimage: Flat 15% Off",
    subtitle: "Sacred journeys in the lush, divine rain.",
    image: gangaAarti,
    overlay: "from-blue-950/95 via-blue-900/60 to-transparent",
    badgeBg: "bg-blue-600",
    accentColor: "#3b82f6"
  },
  {
    id: 2,
    badge: "Senior Citizen",
    title: "Elders' Divine Journey: Extra 10% Off",
    subtitle: "Comfort-first circuits for our respected elders.",
    image: ayodhyaTemple,
    overlay: "from-orange-950/95 via-orange-900/60 to-transparent",
    badgeBg: "bg-orange-600",
    accentColor: "#ea580c"
  },
  {
    id: 3,
    badge: "Group Savings",
    title: "Group Pilgrimage: Save up to 20%",
    subtitle: "Special savings for families and spiritual groups.",
    image: boatGanges,
    overlay: "from-emerald-950/95 via-emerald-900/60 to-transparent",
    badgeBg: "bg-emerald-700",
    accentColor: "#047857"
  }
];

const OfferBanner = () => {
  const { openEnquiry } = useModal();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const prev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + offers.length) % offers.length);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const handleManual = (fn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    fn();
    startTimer();
  };

  const activeOffer = offers[current];

  return (
    <div className="relative w-full overflow-hidden my-10">
      <div className="container mx-auto px-4 md:px-6">
        <div 
          className="relative w-full min-h-[220px] md:min-h-[250px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 group"
        >
          {/* Cinematic Background */}
          <div className="absolute inset-0 transition-all duration-700 ease-in-out">
            <Image 
              src={activeOffer.image} 
              alt={activeOffer.title}
              fill
              className={`object-cover transition-transform duration-1000 ${isTransitioning ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}`}
            />
            {/* Rich Dynamic Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${activeOffer.overlay} transition-colors duration-700`} />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>

          {/* Interactive Content Wrapper */}
          <div 
            className={`relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-10 md:px-16 h-full transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${activeOffer.badgeBg} text-white mb-5 shadow-[0_4px_15px_rgba(0,0,0,0.2)]`}>
                <Sparkles size={12} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">{activeOffer.badge}</span>
              </div>
              
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-2xl">
                {activeOffer.title}
              </h2>
              <p className="text-white/70 text-sm md:text-base font-medium tracking-wide italic">
                {activeOffer.subtitle}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full" />
              <button 
                onClick={openEnquiry}
                className="relative px-12 py-4 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group shrink-0"
              >
                Enquire for Offer
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-primary" />
              </button>
            </div>
          </div>

          {/* Premium Navigation Controls */}
          <button 
            onClick={() => handleManual(prev)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all z-20 border border-white/10 opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => handleManual(next)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all z-20 border border-white/10 opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>

          {/* Luxury Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 md:left-16 -translate-x-1/2 md:translate-x-0 flex gap-2 z-20">
            {offers.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManual(() => setCurrent(i))}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-12 bg-white shadow-[0_0_15px_white]' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
