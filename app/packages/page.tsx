"use client";

import { useState } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingEnquiryButton from "@/components/FloatingEnquiryButton";
import CustomisedPackageModal from "@/components/CustomisedPackageModal";
import { useModal } from "@/lib/ModalContext";
import Image from "next/image";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Clock, MapPin, Star, SlidersHorizontal, ChevronLeft, ChevronRight, Users, Award, Loader } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useRef } from "react";
import Link from "next/link";

import ayodhyaTemple from "@/assets/ayodhya-temple.png";
import boatGanges from "@/assets/boat-ganges.jpg";
import diyaPrayer from "@/assets/diya-prayer.jpg";
import gangaAarti from "@/assets/ganga-aarti.jpg";
import heroVaranasi from "@/assets/hero-varanasi.jpg";
import varansiStreets from "@/assets/varanasi-streets.jpg";

const allPackages = [
  { image: ayodhyaTemple, title: "Ayodhya Divine Darshan", destination: "Ayodhya", duration: "3 Days / 2 Nights", durationCategory: "2-3", highlights: ["Ram Mandir VIP Darshan", "Saryu River Aarti", "Temple Heritage Walk"], rating: 4.9 },
  { image: boatGanges, title: "Varanasi Soul Journey", destination: "Varanasi", duration: "4 Days / 3 Nights", durationCategory: "4-5", highlights: ["Sunrise Boat Ride", "Ganga Aarti Experience", "Ancient Temple Trail"], rating: 4.8 },
  { image: diyaPrayer, title: "Complete Spiritual Circuit", destination: "Ayodhya + Varanasi", duration: "7 Days / 6 Nights", durationCategory: "6+", highlights: ["Ayodhya + Varanasi + Prayagraj", "All Rituals Included", "Premium Stay"], rating: 5.0 },
  { image: gangaAarti, title: "Ganga Aarti Special", destination: "Varanasi", duration: "2 Days / 1 Night", durationCategory: "2-3", highlights: ["Evening Ganga Aarti", "Morning Boat Ride", "Kashi Vishwanath Temple"], rating: 4.7 },
  { image: heroVaranasi, title: "Varanasi Heritage Retreat", destination: "Varanasi", duration: "5 Days / 4 Nights", durationCategory: "4-5", highlights: ["Sarnath Excursion", "Silk Weaving Tour", "Subah-e-Banaras"], rating: 4.9 },
  { image: varansiStreets, title: "Ayodhya & Kashi Pilgrimage", destination: "Ayodhya + Varanasi", duration: "6 Days / 5 Nights", durationCategory: "6+", highlights: ["Ram Mandir Darshan", "Ganga Aarti", "Hanuman Garhi + Sarnath"], rating: 4.8 },
];

const destinations = ["Ayodhya", "Varanasi", "Ayodhya + Varanasi"];
const durations = [
  { label: "2–3 Days", value: "2-3" },
  { label: "4–5 Days", value: "4-5" },
  { label: "6+ Days", value: "6+" },
];

const StatCard = ({ label, value, suffix, decimals, delay }: { label: string; value: number; suffix: string; decimals: number; delay: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const { ref, isVisible } = useScrollAnimation(0.3);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2200;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplayValue(value); clearInterval(timer); }
      else setDisplayValue(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex flex-col items-center justify-center text-center px-6 py-6 sm:py-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div
        className="font-heading font-extrabold tracking-tighter leading-none mb-2"
        style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          background: 'linear-gradient(135deg, #f97316 0%, #fb923c 40%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 15px rgba(249,115,22,0.2))',
        }}
      >
        {decimals === 0 ? Math.floor(displayValue).toLocaleString() : displayValue.toFixed(1)}{suffix}
      </div>
      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
};

const Packages = () => {
  const [packages, setPackages] = useState<any[]>(allPackages);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [customisedModalOpen, setCustomisedModalOpen] = useState(false);
  const { openEnquiry } = useModal();
  const { ref, isVisible } = useScrollAnimation(0.05);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const API_BASE = "/api";
      const response = await fetch(`${API_BASE}/packages`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // Map dynamic packages to match the local UI format
        const dynamicPackages = data.data.map((pkg: any) => ({
          ...pkg,
          image: pkg.images?.main || ayodhyaTemple, // Use fallback if no image
          title: pkg.title,
          destination: pkg.destination,
          duration: pkg.duration,
          durationCategory: pkg.durationCategory,
          highlights: pkg.highlights || [],
          rating: pkg.rating || 5.0,
          slug: pkg.slug
        }));
        
        // Merge: Dynamic first, then static
        setPackages([...dynamicPackages, ...allPackages]);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = packages.filter((pkg) => {
    if (selectedDestination && pkg.destination !== selectedDestination) return false;
    if (selectedDuration && pkg.durationCategory !== selectedDuration) return false;
    return true;
  });

  const clearFilters = () => { setSelectedDestination(null); setSelectedDuration(null); };
  const hasFilters = selectedDestination || selectedDuration;

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h4 className="font-heading text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Destination</h4>
        <div className="space-y-2">
          {destinations.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDestination(selectedDestination === d ? null : d)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedDestination === d
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Duration</h4>
        <div className="space-y-2">
          {durations.map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDuration(selectedDuration === d.value ? null : d.value)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedDuration === d.value
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Special Request</h4>
        <button
          onClick={() => { setCustomisedModalOpen(true); setMobileFiltersOpen(false); }}
          className="w-full px-3 py-2.5 rounded-lg bg-[hsl(var(--primary))]  text-sm font-medium bg-primary/10 text-white border border-primary/20 hover:bg-primary/15 transition-all duration-200"
        >
          Customised Package
        </button>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full py-2.5 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-all duration-200">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FloatingParticles />

      {/* Breadcrumb Bar */}
      <section className="bg-white border-b border-gray-100 py-3 px-6 mt-20">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Packages</span>
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative pt-12 pb-10 px-6 overflow-hidden bg-[hsl(var(--cream))] border-b border-border/20">
        {/* Subtle Background Landmark Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-20 opacity-[0.02] pointer-events-none select-none flex items-end justify-around gap-10 px-10">
           <div className="w-16 h-32 bg-foreground rounded-t-full" />
           <div className="w-12 h-24 bg-foreground rounded-t-full" />
           <div className="w-20 h-40 bg-foreground rounded-t-full" />
           <div className="w-10 h-16 bg-foreground rounded-t-full" />
           <div className="w-16 h-32 bg-foreground rounded-t-full" />
        </div>

        {/* Floating Images Container - Hidden on mobile/tablet */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {/* Left Side Staggered Grid */}
          <div className="absolute left-[2%] xl:left-[5%] top-1/2 -translate-y-1/2 flex gap-3 pointer-events-auto scale-90 xl:scale-95">
            <div className="flex flex-col gap-3 mt-8">
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={ayodhyaTemple} alt="Ayodhya" className="object-cover w-full h-full" />
               </div>
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={boatGanges} alt="Varanasi" className="object-cover w-full h-full" />
               </div>
            </div>
            <div className="flex flex-col gap-3 -mt-6">
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={diyaPrayer} alt="Prayer" className="object-cover w-full h-full" />
               </div>
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={gangaAarti} alt="Ganga" className="object-cover w-full h-full" />
               </div>
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={heroVaranasi} alt="Varanasi" className="object-cover w-full h-full" />
               </div>
            </div>
          </div>

          {/* Right Side Staggered Grid */}
          <div className="absolute right-[2%] xl:right-[5%] top-1/2 -translate-y-1/2 flex gap-3 pointer-events-auto scale-90 xl:scale-95">
            <div className="flex flex-col gap-3 -mt-6">
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={boatGanges} alt="Varanasi" className="object-cover w-full h-full" />
               </div>
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={diyaPrayer} alt="Prayer" className="object-cover w-full h-full scale-125" />
               </div>
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={gangaAarti} alt="Ganga" className="object-cover w-full h-full" />
               </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={heroVaranasi} alt="Varanasi" className="object-cover w-full h-full" />
               </div>
               <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-500">
                 <Image src={varansiStreets} alt="Varanasi Streets" className="object-cover w-full h-full" />
               </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-2xl px-4">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Your Tour, Perfectly <span className="text-primary drop-shadow-sm italic">Personalised!</span>
              </h1>
              <p className="mt-3 text-[10px] md:text-xs text-muted-foreground font-bold tracking-[0.3em] uppercase">
                Explore Expertly Curated Multi-Day Tours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6" ref={ref}>
        <div className="container mx-auto flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 btn-outline-divine text-xs py-2.5 px-5 self-start mb-4"
          >
            <SlidersHorizontal size={14} />
            {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          </button>

          <aside className={`lg:w-64 shrink-0 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
            <div className="lg:sticky lg:top-28 bg-background rounded-xl p-5 border border-border shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
              <h3 className="font-heading text-base font-bold text-foreground mb-5 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" />
                Filters
              </h3>
              {filterPanel}
            </div>
          </aside>

          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Experiences...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-xl border border-border">
                <p className="font-heading text-xl text-foreground mb-2">No packages found</p>
                <p className="text-muted-foreground text-sm">Discover divine journeys tailored for your soul</p>
                <button onClick={clearFilters} className="btn-divine text-xs py-2.5 px-5 mt-4">Clear Filters</button>
              </div>
            ) : (
              <div
                className="overflow-y-auto pr-1 custom-scrollbar"
                style={{ maxHeight: '880px' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
                {filtered.map((pkg, i) => (
                  <div
                    key={pkg.title}
                    className={`bg-background rounded-xl overflow-hidden border  border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >

                    <Link href={`/packages/${pkg.slug || 'divine-ayodhya-kashi-pilgrimage'}`} className="block relative h-48 overflow-hidden">
                      <Image 
                        src={pkg.image} 
                        alt={pkg.title} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 bg-[hsl(var(--primary-foreground))] rounded-full flex items-center gap-1 border border-border">
                        <Star size={12} className="text-primary fill-primary text-[hsl(var(--primary))]" />
                        <span className="text-xs font-semibold text-foreground">{pkg.rating}</span>
                      </div>
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-900 shadow-sm border border-white/20 uppercase tracking-wider">
                        {pkg.destination}
                      </div>
                    </Link>
                    <div className="p-5 space-y-3">
                      <Link href={`/packages/${pkg.slug || 'divine-ayodhya-kashi-pilgrimage'}`} className="block hover:text-primary transition-colors">
                        <h3 className="font-heading text-lg font-bold text-foreground">{pkg.title}</h3>
                      </Link>
                      <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1"><Clock size={13} /> {pkg.duration}</span>
                        <span className="flex items-center gap-1"><MapPin size={13} /> India</span>
                      </div>
                      <ul className="space-y-1.5">
                        {pkg.highlights.map((h: string) => (
                          <li key={h} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Link href={`/packages/${pkg.slug || 'template'}`} className="btn-outline-divine text-xs py-2 px-4 flex-1 text-center flex items-center justify-center">View Details</Link>
                        <button onClick={openEnquiry} className="btn-divine text-xs py-2 px-4 flex-1">Enquire Now</button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Stats Strip */}
      <section className="relative py-14 px-6 overflow-hidden bg-[#111] border-y border-gray-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-0 w-80 h-full bg-primary/5 blur-[100px]" />
          <div className="absolute right-1/4 bottom-0 w-80 h-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-0">
            {[
              { label: "Travelers Served", value: 15000, suffix: "+", decimals: 0 },
              { label: "Expert Guides", value: 120, suffix: "+", decimals: 0 },
              { label: "Sacred Destinations", value: 45, suffix: "+", decimals: 0 },
              { label: "Average Rating", value: 4.9, suffix: "★", decimals: 1 },
            ].map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                {i > 0 && <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/8" />}
                <StatCard {...stat} delay={i * 120} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World-Class Testimonials — Dual Mode: Snap Scroll (Mobile) + Infinite Marquee (Desktop) */}
      <section className="py-16 md:py-20 bg-[hsl(var(--cream))] overflow-hidden">
        {/* Header */}
        <div className="container mx-auto px-6 mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[hsl(var(--primary))] text-[10px] font-extrabold uppercase tracking-[0.35em] mb-2">Verified Guest Reviews</p>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Trusted by <span className="text-[hsl(var(--primary))] italic">8,000+</span> travelers
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-100 shadow-sm self-start sm:self-auto shrink-0">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-[hsl(var(--primary))] fill-[hsl(var(--primary))]" />)}
              </div>
              <span className="text-xs font-bold text-gray-700">4.9 avg rating</span>
            </div>
          </div>
        </div>

        {/* MOBILE: Snap-scroll cards with peek effect */}
        <div className="md:hidden px-4">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { name: "Ananya K.", location: "Mumbai", text: "Every temple visit felt deeply personal. No crowds, just pure spiritual peace.", rating: 5 },
              { name: "Vikram M.", location: "Delhi", text: "Heritage stays were magnificent and our guide was an absolute wealth of knowledge.", rating: 5 },
              { name: "Dr. Sameer G.", location: "Bangalore", text: "VIP darshans handled with incredible grace. I'm already booking my next trip.", rating: 5 },
              { name: "Meera D.", location: "Pune", text: "As a solo traveler, I felt completely safe and deeply moved throughout.", rating: 5 },
              { name: "Rohan V.", location: "Jaipur", text: "Seamless transition from Ayodhya to Varanasi. Everything was pure perfection.", rating: 5 },
              { name: "Sunita R.", location: "Chennai", text: "The Ganga Aarti boat ride was life-changing. Worth every single rupee.", rating: 5 },
            ].map((t, i) => (
              <div
                key={i}
                className="snap-start flex-shrink-0 w-[80vw] max-w-[300px] bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.07)] flex flex-col"
              >
                {/* Big quote mark */}
                <div className="text-5xl font-serif text-primary/15 leading-none mb-2 select-none">"</div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={11} className="text-[hsl(var(--primary))] fill-[hsl(var(--primary))]" />
                  ))}
                </div>
                <p className="text-gray-700 text-[14px] leading-relaxed font-medium flex-grow mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">{t.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Scroll hint spacer */}
            <div className="w-4 shrink-0" />
          </div>
          {/* Scroll hint dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${i === 0 ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* DESKTOP: Infinite Marquee */}
        <div className="hidden md:block relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[hsl(var(--cream))] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[hsl(var(--cream))] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-5 marquee-track">
            {[
              { name: "Ananya K.", location: "Mumbai", text: "Every temple visit felt deeply personal. No crowds, pure peace.", rating: 5 },
              { name: "Vikram M.", location: "Delhi", text: "Heritage stays were magnificent. Our guide was exceptional.", rating: 5 },
              { name: "Dr. Sameer G.", location: "Bangalore", text: "VIP darshans handled with grace. Booking again soon.", rating: 5 },
              { name: "Meera D.", location: "Pune", text: "As a solo traveler, I felt completely safe and deeply moved.", rating: 5 },
              { name: "Rohan V.", location: "Jaipur", text: "Seamless transition from Ayodhya to Varanasi. Perfection.", rating: 5 },
              { name: "Sunita R.", location: "Chennai", text: "Boat ride at Ganga Aarti was life-changing. Worth every rupee.", rating: 5 },
              { name: "Arjun P.", location: "Hyderabad", text: "The team anticipated every need. Truly first-class service.", rating: 5 },
              { name: "Kavya S.", location: "Kolkata", text: "Ram Mandir darshan was flawlessly arranged. Unforgettable.", rating: 5 },
              { name: "Ananya K.", location: "Mumbai", text: "Every temple visit felt deeply personal. No crowds, pure peace.", rating: 5 },
              { name: "Vikram M.", location: "Delhi", text: "Heritage stays were magnificent. Our guide was exceptional.", rating: 5 },
              { name: "Dr. Sameer G.", location: "Bangalore", text: "VIP darshans handled with grace. Booking again soon.", rating: 5 },
              { name: "Meera D.", location: "Pune", text: "As a solo traveler, I felt completely safe and deeply moved.", rating: 5 },
              { name: "Rohan V.", location: "Jaipur", text: "Seamless transition from Ayodhya to Varanasi. Perfection.", rating: 5 },
              { name: "Sunita R.", location: "Chennai", text: "Boat ride at Ganga Aarti was life-changing. Worth every rupee.", rating: 5 },
              { name: "Arjun P.", location: "Hyderabad", text: "The team anticipated every need. Truly first-class service.", rating: 5 },
              { name: "Kavya S.", location: "Kolkata", text: "Ram Mandir darshan was flawlessly arranged. Unforgettable.", rating: 5 },
            ].map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[320px] bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_28px_rgba(255,107,0,0.1)] hover:border-orange-100 transition-all duration-300"
              >
                <div className="text-4xl font-serif text-primary/15 leading-none mb-1 select-none">"</div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={11} className="text-[hsl(var(--primary))] fill-[hsl(var(--primary))]" />
                  ))}
                </div>
                <p className="text-gray-700 text-[13.5px] leading-relaxed font-medium mb-5">{t.text}</p>
                <div className="flex items-center gap-2.5 pt-4 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[11px] font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{t.name}</p>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .marquee-track {
            animation: marquee-scroll 38s linear infinite;
            width: max-content;
            padding: 0.5rem 2rem 1.5rem;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Premium FAQ Section — On-Theme Light Design */}
      <section className="relative overflow-hidden bg-white py-24 px-6">
        {/* Decorative large background text */}
        <div className="absolute top-0 right-0 text-[20rem] font-heading font-extrabold text-primary/[0.03] leading-none select-none pointer-events-none translate-x-1/4 -translate-y-1/4">?</div>

        {/* Soft cream gradient blob */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-orange-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* Left sticky panel — warm & premium */}
            <div className="lg:w-[36%] lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Common Questions</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                Everything you <br />need to <span className="text-primary italic">know</span>
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-xs">
                Planning your sacred journey? Our experts are available every day to guide you — personally.
              </p>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="inline-flex items-center gap-3 bg-primary text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-orange-200/50 self-start"
                >
                  <span>✦</span> Talk to an Expert
                </a>
                <p className="text-[11px] text-gray-400 font-medium ml-1">Mon – Sun · 9 AM to 9 PM</p>
              </div>

            </div>

            {/* Right FAQ list — clean, airy, on-theme */}
            <div className="lg:w-[64%] divide-y divide-gray-100">
              {[
                { q: "What's included in the package?", a: "Our packages are all-inclusive — premium accommodation, private AC transfers, all daily meals, VIP darshan passes, and a dedicated local guide who knows every corner of the sacred city." },
                { q: "Can we fully customise the itinerary?", a: "Yes, every journey is yours to shape. Add extra days, request specific pujas, detour to Prayagraj or Mathura, or upgrade to a heritage riverside haveli. We craft it around you." },
                { q: "Is it comfortable for senior citizens?", a: "Absolutely. We design with elders in mind — minimal walking options, wheelchair-accessible vehicles, priority seating at temples, and a pace that lets you soak in the divinity without any rush." },
                { q: "How does booking work?", a: "Select your package, submit a quick enquiry, and one of our experts calls you within 2 hours. We finalize your itinerary together and confirm with a small deposit. It's that simple." },
                { q: "Are there any hidden charges?", a: "None, ever. We believe radical transparency is non-negotiable. Your final quote covers everything listed — no airport surcharges, no tip obligations, no surprise fees at checkout." },
              ].map((faq, i) => (
                <details key={i} className="group py-7 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <summary className="flex items-start justify-between gap-6 select-none">
                    <div className="flex items-start gap-4">
                      <span
                        className="text-[11px] font-extrabold tabular-nums mt-1 shrink-0 w-6 text-primary/40"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >0{i + 1}</span>
                      <h3 className="font-heading text-[17px] md:text-xl font-bold text-gray-800 group-open:text-primary transition-colors duration-300 leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center mt-0.5 group-open:border-primary group-open:bg-primary group-open:text-white transition-all duration-300 text-gray-400">
                      <span className="text-base leading-none font-bold transition-all duration-300 group-open:rotate-45 inline-block">+</span>
                    </div>
                  </summary>
                  <p className="mt-4 ml-10 text-gray-500 text-sm md:text-[15px] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FloatingEnquiryButton />
      <CustomisedPackageModal open={customisedModalOpen} onOpenChange={setCustomisedModalOpen} />
    </div>
  );
};

export default Packages;
