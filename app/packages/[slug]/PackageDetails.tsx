"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  MapPin, Clock, Star, Check, X, Calendar, Shield, 
  ChevronDown, Share2, Phone, Award, ThumbsUp, Info, CheckCircle, ChevronLeft, ChevronRight,
  RotateCcw, Ban, CreditCard, Bus, Hotel, Coffee, Flag
} from "lucide-react";

import CustomisedPackageModal from "@/components/CustomisedPackageModal";
import EnquireNowModal from "@/components/EnquireNowModal";

// Import images for the Bento Gallery
import mainHeroImg from "@/assets/ram haweli 💘🥹.jpg";
import subImg1 from "@/assets/ayodhya Ram Lalla murti photo.jpg";
import subImg2 from "@/assets/Cyberian birds on prayagraj.jpg";
import subImg3 from "@/assets/ -8.jpg";
import subImg4 from "@/assets/ -11.jpg";



export default function PackageTemplate({ initialPkg }: { initialPkg: Record<string, unknown> }) {
  const [pkg, setPkg] = useState<Record<string, unknown> | any>(initialPkg as Record<string, unknown> | any);
  const [openDay, setOpenDay] = useState(0);
  const [openFaq, setOpenFaq] = useState<number>(-1);
  const [openPolicy, setOpenPolicy] = useState<number>(0);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [customiseOpen, setCustomiseOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Synchronize state if initialPkg changes (e.g. on navigation)
  useEffect(() => {
    if (initialPkg) {
      setPkg(initialPkg);
    }
  }, [initialPkg]);

  // Debug: log package payload to help trace CMS field shapes (remove in production)
  useEffect(() => {
    if (!pkg) return;
    try {
      // Lightweight logs for developer inspection
      // eslint-disable-next-line no-console
      console.log('[pkg debug] pkg:', pkg);
      // eslint-disable-next-line no-console
      console.log('[pkg debug] highlights:', pkg.highlights || pkg.keyFeatures || pkg.features || pkg.included);
      // eslint-disable-next-line no-console
      console.log('[pkg debug] route/journeyRoute:', pkg.route || pkg.journeyRoute || pkg.itinerary);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('pkg debug logging error', e);
    }
  }, [pkg]);

  // Auto-slide testimonials (Native Scroll)
  useEffect(() => {
    if (!isAutoScrolling) return;

    timerRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 20;
        
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 320 : 400;
          scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoScrolling]);

  const handleUserInteraction = () => {
    setIsAutoScrolling(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Resume after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 320 : 400;
      const index = Math.round(scrollLeft / (cardWidth + 24));
      setActiveTestimonial(index);
    }
  };

  const nextTestimonial = () => {
    handleUserInteraction();
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 320 : 400;
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
    }
  };

  const prevTestimonial = () => {
    handleUserInteraction();
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 320 : 400;
      scrollRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: pkg.title,
      text: pkg.about,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // --- Derive benefits & route data from CMS (support object or array shapes) ---
  const cmsBenefitsRaw = pkg?.benefits || pkg?.includedBenefits || pkg?.features || [];
  const derivedBenefits = {
    transferIncluded: false,
    stayIncluded: false,
    breakfastIncluded: false,
    sightseeingIncluded: false,
  } as Record<string, boolean>;

  if (Array.isArray(cmsBenefitsRaw)) {
    cmsBenefitsRaw.forEach((b: string) => {
      const s = String(b || "").toLowerCase();
      if (s.includes("transfer")) derivedBenefits.transferIncluded = true;
      if (s.includes("stay")) derivedBenefits.stayIncluded = true;
      if (s.includes("breakfast")) derivedBenefits.breakfastIncluded = true;
      if (s.includes("sightseeing") || s.includes("sight")) derivedBenefits.sightseeingIncluded = true;
    });
  } else if (cmsBenefitsRaw && typeof cmsBenefitsRaw === "object") {
    // allow boolean flags from CMS
    derivedBenefits.transferIncluded = !!cmsBenefitsRaw.transferIncluded;
    derivedBenefits.stayIncluded = !!cmsBenefitsRaw.stayIncluded;
    derivedBenefits.breakfastIncluded = !!cmsBenefitsRaw.breakfastIncluded;
    derivedBenefits.sightseeingIncluded = !!cmsBenefitsRaw.sightseeingIncluded;
  }

  // Route data: support { overview, departure, arrival, stops: [] } or legacy shapes
  const cmsRoute = pkg?.route || pkg?.journeyRoute || null;
  const route = cmsRoute || (pkg.itinerary && (pkg.itinerary as any).length > 0 ? {
    overview: undefined,
    departure: ((pkg.itinerary as any)[0]?.title as string) || ((pkg.itinerary as any)[0]?.day as string) || "",
    stops: (pkg.itinerary as any).slice(0, 3).map((d: any, i: number) => ({ title: (d.title as string) || (d.day as string) || `Stop ${i+1}`, desc: d.desc })),
    arrival: ((pkg.itinerary as any)[(pkg.itinerary as any).length - 1]?.title as string) || "",
  } : null);

  // Derive a safe overview string preferring CMS-provided overview, then departure->arrival without accidental duplicates
  // Prefer explicit CMS `from` / `to` fields (support multiple common keys)
  const getFirst = (obj: any, keys: string[]) => {
    if (!obj) return undefined;
    for (const k of keys) {
      const v = obj[k];
      if (v && typeof v === 'string' && v.trim()) return v.trim();
      if (v && typeof v === 'object') {
        // common shape: { name: 'City' }
        if (typeof v.name === 'string' && v.name.trim()) return v.name.trim();
        if (typeof v.title === 'string' && v.title.trim()) return v.title.trim();
      }
    }
    return undefined;
  };

  // Recursively search an object (depth-limited) for any of the candidate keys
  const deepGetFirst = (obj: any, keys: string[], depth = 3): string | undefined => {
    if (!obj || depth <= 0) return undefined;
    if (typeof obj === 'string') return obj.trim() || undefined;
    if (typeof obj !== 'object') return undefined;

    for (const k of keys) {
      if (k in obj) {
        const v = obj[k];
        if (typeof v === 'string' && v.trim()) return v.trim();
        if (typeof v === 'object') {
          if (typeof v.name === 'string' && v.name.trim()) return v.name.trim();
          if (typeof v.title === 'string' && v.title.trim()) return v.title.trim();
        }
      }
    }

    // search nested objects/arrays
    for (const val of Object.values(obj)) {
      if (val && typeof val === 'object') {
        const found = deepGetFirst(val, keys, depth - 1);
        if (found) return found;
      }
    }
    return undefined;
  };

  const cmsFrom = deepGetFirst(cmsRoute, ['from', 'source', 'origin', 'fromLocation', 'from_city', 'start']);
  const cmsTo = deepGetFirst(cmsRoute, ['to', 'destination', 'dest', 'toLocation', 'to_city', 'end']);
  const pkgFrom = deepGetFirst(pkg, ['from', 'origin', 'source', 'fromLocation', 'from_city']);
  const pkgTo = deepGetFirst(pkg, ['to', 'destination', 'dest', 'toLocation', 'to_city']);
  const cmsOverview = (cmsRoute && (cmsRoute.overview as string)) || undefined;
  const routeDeparture = (route && (route.departure as string)) || pkgFrom || "";
  const routeArrival = (route && (route.arrival as string)) || pkgTo || "";

  let overview = "";
  if (cmsFrom && cmsTo) overview = `${cmsFrom} → ${cmsTo}`;
  else if (pkgFrom && pkgTo) overview = `${pkgFrom} → ${pkgTo}`;
  else if (routeDeparture && routeArrival) overview = `${routeDeparture} → ${routeArrival}`;
  else if (cmsOverview) overview = cmsOverview;
  else {
    if (routeDeparture) overview = routeDeparture;
    else if (routeArrival) overview = routeArrival;
  }

  // Helper to extract a sensible from/to pair for a stop object or title string
  const extractFromTo = (stop: any) => {
    if (!stop) return { from: undefined, to: undefined };

    // If stop is a simple string, try to split common separators
    const title = typeof stop === 'string' ? stop : (stop.title || stop.name || '');

    const splitTitle = (s: string) => {
      if (!s) return null;
      // Common separators: ' - ', ' to ', '→', '–'
      const seps = ['→', ' - ', ' – ', ' to ', '–', '-'];
      for (const sep of seps) {
        if (s.includes(sep)) {
          const parts = s.split(sep).map((p) => p.trim()).filter(Boolean);
          if (parts.length >= 2) return { from: parts[0], to: parts.slice(1).join(' ')};
        }
      }
      return null;
    };

    if (typeof stop === 'object') {
      const titleFrom = typeof stop.title === 'string' ? stop.title.trim() : '';
      const descTo = typeof stop.desc === 'string' ? stop.desc.trim() : '';
      if (titleFrom && descTo) return { from: titleFrom, to: descTo };
    }

    // Prefer explicit fields on the stop object
    const fromField = deepGetFirst(stop, ['from', 'source', 'origin', 'start', 'fromLocation', 'from_city', 'departure']);
    const toField = deepGetFirst(stop, ['to', 'destination', 'dest', 'end', 'toLocation', 'to_city', 'arrival']);
    if (fromField || toField) return { from: fromField, to: toField };

    // Try parsing title
    const parsed = splitTitle(String(title || ''));
    if (parsed) return parsed;

    // Fallback to title as 'from'
    return { from: title || undefined, to: undefined };
  };

  return (
    <main className="min-h-screen bg-[#fafaf8] pb-0">
      
      {/* ── HEADER DETAILS ── */}
      <section className="pb-10 px-6 bg-white">
        <div className="container mx-auto">
          {/* Breadcrumbs removed from here, now in page.tsx */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-1 text-gray-900">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{pkg.rating}</span> 
                </div>
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {pkg.destination}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> {pkg.duration}</span>
              </div>
            </div>
            
            <button 
              onClick={handleShare} 
              aria-label="Share this tour package"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-200 transition-all text-sm font-bold text-gray-700 shadow-md hover:shadow-lg shrink-0 hover:text-orange-600"
            >
               <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </section>

      {/* ── BENTO PHOTO GALLERY ── */}
      <section className="px-6 pb-8 md:pb-12 bg-[#fafaf8]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[65vh] md:min-h-[550px]">
            {/* Main Image - Left half */}
            <div className="col-span-1 md:col-span-7 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-[24px] h-[350px] md:h-full">
              <Image src={mainHeroImg} alt={`${pkg.title} - Main View - Experience My India`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                 <p className="text-[10px] font-bold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">Experience My India Exclusive</p>
                 <h3 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 shadow-sm leading-tight">{pkg.title}</h3>
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-medium border border-white/20">
                   VIP Darshan • Premium Stays
                 </div>
              </div>
            </div>
            
            {/* Mobile Image Grid - Cleaned up */}
            <div className="col-span-1 md:col-span-5 md:row-span-2 grid grid-cols-2 gap-3 md:gap-4 h-[180px] md:h-full">
               <div className="relative group cursor-pointer overflow-hidden rounded-[24px]">
                 <Image src={subImg1} alt="Destinations" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
               </div>
               <div className="relative group cursor-pointer overflow-hidden rounded-[24px]">
                 <Image src={subImg2} alt="Luxury Stays" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
               </div>
               <div className="relative group cursor-pointer overflow-hidden rounded-[24px] hidden md:block">
                 <Image src={subImg3} alt="Experiences" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               </div>
               <div className="relative group cursor-pointer overflow-hidden rounded-[24px] hidden md:block">
                 <Image src={subImg4} alt="Hidden Gems" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE QUICK ENQUIRY FORM ── */}
      <section className="md:hidden px-6 pb-12 bg-[#fafaf8]">
         <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 ring-4 ring-orange-50/50">
            <div className="mb-6">
               <h3 className="font-heading text-2xl font-bold text-gray-900 mb-1">Quick Enquiry</h3>
               <p className="text-gray-500 text-xs">Get a personalised quote in minutes.</p>
            </div>
            <form className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Full Name" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm outline-none focus:border-primary/30" />
                  <input type="tel" placeholder="Phone" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm outline-none focus:border-primary/30" />
               </div>
               <input type="email" placeholder="Email Address" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm outline-none focus:border-primary/30" />
               <button className="w-full h-12 bg-[hsl(var(--primary))] text-white font-bold rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-all">
                  Send My Request
               </button>
               <a 
                 href={`https://wa.me/917302265809?text=${encodeURIComponent(`I want to book ${pkg.title}. My travel dates are [dates]. Group size: [number]. From: [city].`)}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white font-bold rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all mt-3"
               >
                  <Phone size={18} /> Book via WhatsApp
               </a>
            </form>
         </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section className="py-10 md:py-16 px-6 border-t border-gray-200/60 bg-white">
        <div className="container mx-auto">
          
          {/* Quick Navigation (TOC) */}
          <nav className="mb-12 pb-6 border-b border-gray-100 overflow-x-auto">
             <div className="flex items-center gap-4 md:gap-8 min-w-max">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Quick Navigation:</span>
                {[
                   { label: "Overview", id: "overview" },
                   { label: "Itinerary", id: "day-by-day-itinerary" },
                   { label: "Inclusions", id: "whats-included" },
                   { label: "Reviews", id: "customer-reviews" },
                   { label: "FAQ", id: "faq" }
                ].map((link) => (
                   <a 
                     key={link.id} 
                     href={`#${link.id}`} 
                     className="text-xs font-bold text-gray-600 hover:text-[hsl(var(--primary))] transition-colors uppercase tracking-widest"
                   >
                      {link.label}
                   </a>
                ))}
             </div>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[65%] space-y-16">

            {/* Inline Benefits (CMS-driven) — Lucide icons, shown before About — ONLY CHECKED ITEMS */}
            {(() => {
              const benefitIcons: Record<string, any> = {
                transferIncluded: Bus,
                stayIncluded: Hotel,
                breakfastIncluded: Coffee,
                sightseeingIncluded: MapPin
              };
              const benefitLabels: Record<string, string> = {
                transferIncluded: 'Transfer Included',
                stayIncluded: 'Stay Included',
                breakfastIncluded: 'Breakfast Included',
                sightseeingIncluded: 'Sightseeing Included'
              };
              
              const checkedBenefits = Object.keys(derivedBenefits)
                .filter(key => derivedBenefits[key as string])
                .map(key => ({ key, label: benefitLabels[key], Icon: benefitIcons[key] }));
              
              if (checkedBenefits.length === 0) return null;
              
              return (
                <div className="mb-6">
                  <div className="flex items-center gap-6 border-b pb-4 flex-wrap">
                    {checkedBenefits.map(({ key, label, Icon }) => (
                      <div key={key} className="flex items-center gap-2 text-sm text-orange-600">
                        <Icon size={20} className="shrink-0" />
                        <div className="font-medium">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Route Overview pill (CMS-driven) — minimal design matching reference */}
            {route && (
              <div className="mb-8 space-y-3">
                {/* Journey Route Heading */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-orange-400 rounded-full"></div>
                  <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Journey Route</span>
                </div>



                {/* Route Toggle Button - prominent, theme-colored like reference */}
                <button
                  onClick={() => setRouteOpen(!routeOpen)}
                  aria-expanded={routeOpen}
                  className="w-full flex items-center justify-between gap-4 px-8 py-5 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-200 text-left"
                >
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-orange-100">Route overview</div>
                    <div className="mt-1 text-lg font-bold leading-tight">{overview}</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <ChevronDown className={`transition-transform duration-300 ${routeOpen ? 'rotate-180' : ''} text-white`} size={18} />
                  </div>
                </button>

                {/* Expanded Route Timeline */}
                {routeOpen && (
                  <div className="mt-3 p-3 rounded-2xl border border-orange-100/70 bg-gradient-to-b from-orange-50/35 via-white to-white shadow-sm" style={{ boxShadow: '0 8px 24px rgba(15,23,42,0.035)' }}>
                    <div className="space-y-3 text-sm">
                      {/* Departure */}
                      <div className="flex gap-4 items-start">
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                            <MapPin size={16} />
                          </div>
                          {(route.stops && route.stops.length > 0) && <div className="w-px h-6 bg-orange-100 my-1" />}
                        </div>
                          <div className="py-0.5">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Departure</div>
                          <div className="font-semibold text-gray-900 text-sm">{(route && route.departure) || pkgFrom || 'Departure'}</div>
                        </div>
                      </div>

                      {/* Stops */}
                      {route.stops && route.stops.map((stop: any, idx: number) => {
                        const { from: stopFrom, to: stopTo } = extractFromTo(stop);
                        const display = stopFrom && stopTo ? `${stopFrom} → ${stopTo}` : stopFrom || stop.title || `Stop ${idx + 1}`;
                        return (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="flex flex-col items-center mt-1">
                              <div className="w-8 h-8 rounded-full border border-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 text-sm font-semibold bg-white transition-colors hover:bg-[hsl(var(--primary))] hover:text-white">
                                {idx + 1}
                              </div>
                              {idx < (route.stops as any).length - 1 && <div className="w-px h-6 bg-orange-100 my-1" />}
                            </div>
                            <div className="py-0.5">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stop {idx + 1}</div>
                              <div className="font-semibold text-gray-900 text-sm">{display}</div>
                            </div>
                        </div>
                        );
                      })}

                      {/* Arrival */}
                      <div className="flex gap-4 items-start">
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center flex-shrink-0">
                            <Flag size={16} />
                          </div>
                        </div>
                        <div className="py-0.5">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Final Arrival</div>
                          <div className="font-semibold text-gray-900 text-sm">{(route && route.arrival) || pkgTo || 'Arrival'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Package Overview Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-orange-400 rounded-full"></div>
                <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Package Overview</span>
              </div>

            </div>
            
            {/* Overview */}
            <div id="overview" className="space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">About the Journey</h2>

              {/* About Box with Orangish Background */}
              <div className="p-6 rounded-2xl border-2 border-orange-100 bg-orange-40">
                {/* About — render as rich HTML if from Quill, else plain text */}
                {pkg.about && pkg.about.includes('<') ? (
                  <div
                    className="text-gray-700 leading-relaxed text-[15px] md:text-base [&_p]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-800 [&_a]:text-orange-600 [&_a]:underline break-words"
                    dangerouslySetInnerHTML={{ __html: pkg.about }}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-[15px] md:text-base break-words">{pkg.about}</p>
                )}
              </div>

              {/* Highlights — filter empty Quill output */}
              {(() => {
                const items = (pkg.highlights || []).filter((h: string) =>
                  h && h.trim() && h !== '<p><br></p>' && h !== '<p></p>'
                );
                if (items.length === 0) return null;
                return (
                  <div className="mt-10 mb-6">
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      Key Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {items.map((h: string, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-orange-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.08)] transition-all duration-300 relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 min-w-0">
                            {h.includes('<') ? (
                              <div
                                className="text-gray-700 text-[14.5px] leading-relaxed [&_p]:mb-3 last:[&_p]:mb-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-900 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-900 break-words"
                                dangerouslySetInnerHTML={{ __html: h }}
                              />
                            ) : (
                              <p className="text-gray-700 text-[14.5px] leading-relaxed break-words">{h}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Removed duplicated benefits/route block (moved earlier) */}

            {/* Itinerary */}
            <div id="day-by-day-itinerary">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                 <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Calendar size={24} className="text-[hsl(var(--primary))]" /> Itinerary
                 </h2>
                 <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100 self-start">
                    <Clock size={14} /> {pkg.duration}
                 </div>
              </div>
              
              <div className="space-y-4 relative before:absolute before:left-[31px] before:top-10 before:bottom-10 before:w-0.5 before:bg-orange-100 before:hidden md:before:block">
                {pkg.itinerary.map((day: any, i: number) => (
                  <div key={i} className={`group relative border rounded-[24px] overflow-hidden bg-white transition-all duration-300 ${openDay === i ? 'border-orange-200 shadow-xl shadow-orange-50/50' : 'border-gray-100 shadow-sm'}`}>
                    <button 
                      onClick={() => setOpenDay(openDay === i ? -1 : i)}
                      className="w-full text-left px-6 py-6 flex items-center justify-between hover:bg-orange-50/10 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${openDay === i ? 'bg-[hsl(var(--primary))] text-white ring-4 ring-orange-100' : 'bg-white text-gray-400 border-2 border-gray-100 group-hover:border-orange-200'}`}>
                           {i + 1}
                        </div>
                        <div className="shrink-0 w-20 md:hidden">
                           <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${openDay === i ? 'bg-[hsl(var(--primary))] text-white' : 'bg-gray-100 text-gray-500'}`}>
                              <span>Day</span>
                              <span>{i + 1}</span>
                           </div>
                        </div>
                        <h3 className={`font-bold text-gray-900 text-base md:text-xl font-heading transition-colors ${openDay === i ? 'text-[hsl(var(--primary))]' : ''}`}>{day.title}</h3>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openDay === i ? 'bg-orange-100 text-[hsl(var(--primary))]' : 'bg-gray-50 text-gray-300'}`}>
                         <ChevronDown className={`transition-transform duration-300 ${openDay === i ? "rotate-180" : ""}`} size={18} />
                      </div>
                    </button>
                    
                    <div className={`grid transition-all duration-300 ease-in-out ${openDay === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="px-6 pb-8 pt-0 md:pl-20 space-y-6">
                          {/* Unified Itinerary Description Card */}
                          <div className={`p-6 bg-white rounded-2xl border ${day.details ? 'border-orange-100/50' : 'border-gray-100/50'} space-y-6`}>
                            {day.desc && (
                              <p className="text-gray-700 leading-relaxed text-[15px] md:text-base break-words font-medium">{day.desc}</p>
                            )}

                            {day.details && (
                              <div className="space-y-4">
                                <style>{`
                                  .itinerary-details h1 { font-size: 1.875rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
                                  .itinerary-details h2 { font-size: 1.5rem; font-weight: bold; margin-top: 0.875rem; margin-bottom: 0.5rem; color: #111827; }
                                  .itinerary-details h3 { font-size: 1.25rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.5rem; color: #111827; }
                                  .itinerary-details h4 { font-size: 1.125rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.5rem; color: #111827; }
                                  .itinerary-details p { color: #4b5563; line-height: 1.6; margin-bottom: 1rem; }
                                  .itinerary-details strong { font-weight: 600; color: #1f2937; }
                                  .itinerary-details em { font-style: italic; }
                                  .itinerary-details ol, .itinerary-details ul { margin-left: 1.5rem; margin-bottom: 1rem; }
                                  .itinerary-details li { margin-bottom: 0.5rem; color: #4b5563; }
                                  .itinerary-details ol { list-style-type: decimal; }
                                  .itinerary-details ul { list-style-type: disc; }
                                  .itinerary-pill-tag {
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                    width: 100%;
                                    margin: 16px 0;
                                    padding: 14px 20px;
                                    background-color: #fffbf7;
                                    border-left: 4px solid #f97316;
                                    border-top: 1px solid #ffedd5;
                                    border-right: 1px solid #ffedd5;
                                    border-bottom: 1px solid #ffedd5;
                                    border-radius: 12px;
                                    color: #4b5563;
                                    font-size: 14px;
                                    line-height: 1.5;
                                    font-weight: 500;
                                    cursor: default;
                                    user-select: none;
                                    white-space: normal;
                                  }
                                  .itinerary-pill-tag::before {
                                    content: '';
                                    display: block;
                                    width: 8px;
                                    height: 8px;
                                    background-color: #f97316;
                                    border-radius: 9999px;
                                    flex-shrink: 0;
                                  }
                                  .itinerary-pill-tag strong {
                                    font-weight: 700;
                                    color: #1f2937;
                                  }
                                  .itinerary-pill-tag em {
                                    font-style: italic;
                                  }
                                `}</style>
                                <div className="itinerary-details text-gray-700 break-words max-h-[350px] overflow-y-auto pr-4 custom-scrollbar" dangerouslySetInnerHTML={{ __html: day.details }} />
                              </div>
                            )}

                            {/* Standard Day Inclusions */}
                            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 font-sans">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <MapPin size={12} className="text-orange-300" /> Sightseeing included
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <Check size={12} className="text-green-400" /> Breakfast included
                              </div>
                            </div>
                          </div>

                          {/* Activity / Location Tags — matching the reference image */}
                          {day.tags && (day.tags as any).filter((t: any) => (t.title as string)?.trim()).length > 0 && (
                            <div className="p-6 bg-[#fbf8f1] rounded-2xl space-y-6">
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-4">Places Covered</h4>
                                <div className="space-y-3">
                                  {(day.tags as any).filter((t: any) => (t.title as string)?.trim()).map((tag: any, tagIdx: number) => (
                                    <div
                                          key={tagIdx}
                                          className="bg-white rounded-2xl py-5 px-6 flex items-center gap-4 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5"
                                        >
                                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-orange-400 rounded-l-2xl"></div>
                                          <span className="w-3.5 h-3.5 rounded-full bg-orange-400 shrink-0 opacity-90 ml-1 border border-white shadow-sm" />
                                          <span className="font-semibold text-gray-900 text-lg leading-snug">{tag.title}</span>
                                        </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Detailed Notes (only when content exists) */}
                              {(day.tags as any).some((t: any) => (t.content as string) && (t.content as string).trim() && (t.content as string) !== '<p><br></p>') && (
                                <div className="space-y-5 pt-4 mt-2 border-t border-orange-100/50 max-h-64 overflow-y-auto pr-3 custom-scrollbar">
                                  {(day.tags as any).filter((t: any) => (t.title as string)?.trim()).map((tag: any, tagIdx: number) => (
                                    (tag.content as string) && (tag.content as string).trim() && (tag.content as string) !== '<p><br></p>' ? (
                                      <div key={tagIdx}>
                                        <h5 className="font-bold text-gray-900 text-base mb-2">{tag.title} Experience</h5>
                                        <p className="text-gray-700 text-sm leading-relaxed break-words">{tag.content}</p>
                                      </div>
                                    ) : null
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div id="whats-included" className="bg-[#fafaf8] rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -z-0" />
                <h2 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                     <Check size={16} strokeWidth={3} />
                  </div>
                  What&apos;s Included
                </h2>
                <ul className="space-y-4 relative z-10">
                  {(pkg.included as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#fafaf8] rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -z-0" />
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                     <X size={16} strokeWidth={3} />
                  </div>
                  What&apos;s Excluded
                </h3>
                <ul className="space-y-4 relative z-10">
                  {(pkg.excluded as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>



          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <div id="tour-cost" className="hidden lg:block w-full lg:w-[35%] relative">
            <div className="sticky top-28 space-y-6">
              {/* Price Card - Redesigned to be more compact */}
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                 <div className="mb-4">
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tour Package</h2>
                 </div>
                 <button onClick={() => setEnquireOpen(true)} className="w-full bg-[hsl(var(--primary))] text-white font-bold h-12 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all text-sm shadow-lg shadow-orange-100">
                   Check Price & Availability
                 </button>
                 
                 <a 
                   href={`https://wa.me/917302265809?text=${encodeURIComponent(`I want to book ${pkg.title}. My travel dates are [dates]. Group size: [number]. From: [city].`)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold h-12 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all text-sm shadow-lg shadow-green-100 mt-3"
                 >
                   <Phone size={18} /> Book via WhatsApp
                 </a>
                 <p className="text-[10px] text-gray-400 text-center mt-3 font-medium italic">Best price guaranteed for direct bookings</p>
              </div>

              {/* Sidebar Form - Compacted */}
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
                <div className="text-left mb-6">
                  <h3 className="font-heading text-xl text-gray-900 mb-1 font-bold tracking-tight">Plan Your Trip</h3>
                  <p className="text-gray-500 text-[11px] font-medium leading-tight">
                    Customise your journey with our experts.
                  </p>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="pkg-name" className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                    <input id="pkg-name" type="text" placeholder="John Doe" className="w-full h-11 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg px-4 text-sm shadow-sm placeholder:text-gray-400 transition-all outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="pkg-phone" className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                    <input id="pkg-phone" type="tel" placeholder="+91 XXXXX XXXXX" className="w-full h-11 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg px-4 text-sm shadow-sm placeholder:text-gray-400 transition-all outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="pkg-email" className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                    <input id="pkg-email" type="email" placeholder="you@example.com" className="w-full h-11 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg px-4 text-sm shadow-sm placeholder:text-gray-400 transition-all outline-none" required />
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white font-bold h-11 rounded-lg hover:bg-gray-800 transition-all text-xs mt-1 shadow-sm">
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ── KNOW BEFORE YOU GO ── */}
      <section className="py-12 px-6 bg-yellow-50/50 relative overflow-hidden border-t border-yellow-200/40">
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-yellow-300/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-5 left-0 w-96 h-96 bg-orange-200/8 rounded-full blur-3xl opacity-25 -ml-48"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-white border border-orange-200 shadow-sm flex items-center justify-center text-orange-500">
               <Info size={24} />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">Know Before You Go</h2>
          </div>
          
          <div className="bg-orange-50/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-orange-200/60 shadow-sm space-y-3 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-orange-200/15 rounded-full blur-2xl -mr-40 -mt-20 opacity-40"></div>
             <div className="absolute bottom-5 left-1/3 w-72 h-72 bg-orange-300/12 rounded-full blur-3xl -ml-40 opacity-35"></div>
             {(() => {
                 // Detect real CMS content — filter out empty Quill output
                 const isQuillEmpty = (s: string) => !s || !s.trim() || s === '<p><br></p>' || s === '<p></p>';
                 const cmsItems = (pkg.knowBeforeYouGo || []).filter((t: string) => !isQuillEmpty(t));
                 const items: string[] = cmsItems.length > 0 ? cmsItems : [
                    "Early morning is the best time for darshan at all major temples. The Mangala Aarti is especially serene and helps you avoid the long queues that build up later in the day. We recommend planning your day to start before sunrise.",
                    "Weekdays are generally far less crowded than weekends. Major festivals and special religious dates draw the heaviest rush, so if you are seeking a calmer experience, plan your visit during off-peak dates.",
                    "Carry only essential items and prasad inside the temples. Leave all luggage and large bags in your cab or hotel. Dress modestly in comfortable cotton clothing and carry socks, as you will be walking barefoot on marble floors for extended periods.",
                    "No photography is allowed inside the inner sanctum of most major temples. Please respect the rules and maintain the sanctity of the premises. If travelling with children or elderly, keep them close as the temple complexes can get very crowded.",
                    "Our local expert guides will assist you with navigating the narrow lanes and managing VIP darshan passes where applicable. However, a certain amount of walking is unavoidable in these ancient cities, so comfortable footwear is a must."
                 ];
                 return items.map((text: string, idx: number) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-orange-100 flex gap-3 items-start shadow-sm relative z-10 hover:shadow-md transition-shadow">
                       <div className="w-8 h-8 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm mt-0.5">
                          {idx + 1}
                       </div>
                       {text.includes('<') ? (
                          <div
                            className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed pt-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-800 flex-1 min-w-0 break-words"
                            dangerouslySetInnerHTML={{ __html: text }}
                          />
                       ) : (
                          <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed pt-1 flex-1 min-w-0 break-words">{text}</p>
                       )}
                    </div>
                 ));
              })()}
          </div>
        </div>
      </section>

      {/* ── WHY BOOK WITH US (PREMIUM CARDS) ── */}
      <section className="py-12 px-6 bg-white relative">
         <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
               <h2 className="font-heading text-2xl md:text-4xl font-bold text-gray-900 mb-2">Why Pilgrims Choose Us</h2>
               <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">Experience the most spiritual journey with our premium, handpicked services.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               
               <div className="bg-[#fffcf9] rounded-2xl p-6 border border-[#f0e3ce] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-500 group-hover:bg-orange-500 group-hover:text-white">
                     <Shield size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">100% Secure Booking</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">Your payments are fully protected with absolute transparency and no hidden costs.</p>
               </div>
               
               <div className="bg-[#f0f7ff] rounded-2xl p-6 border border-[#d6e8ff] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-500 group-hover:bg-blue-500 group-hover:text-white">
                     <Award size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">Certified Local Guides</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">Native guides providing deep local insights and authentic historical knowledge.</p>
               </div>
               
               <div className="bg-[#f2fbf5] rounded-2xl p-6 border border-[#d3eedb] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-500 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-500 group-hover:bg-green-500 group-hover:text-white">
                     <Star size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">Handpicked Stays</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">Personally vetted hotels ensuring luxury, cleanliness, and authentic hospitality.</p>
               </div>
               
               <div className="bg-[#f9f5ff] rounded-2xl p-6 border border-[#eaddff] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-500 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-500 group-hover:bg-purple-500 group-hover:text-white">
                     <ThumbsUp size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">24/7 Dedicated Support</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">Available around the clock to assist you from booking through your return home.</p>
               </div>

            </div>
         </div>
      </section>

      {/* ── FAQS ── */}
      <section className="py-20 px-6 bg-[#fafaf8] relative overflow-hidden">
         <div className="absolute top-1/4 -left-32 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
         <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {(pkg.faq as any[]).map((f: any, i: number) => (
                <div key={i} className={`group border rounded-[24px] overflow-hidden bg-white transition-all duration-300 ${openFaq === i ? 'border-orange-200 shadow-xl shadow-orange-50/50' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-orange-50/10 transition-colors"
                  >
                    <h4 className={`font-bold text-lg transition-colors pr-4 ${openFaq === i ? 'text-[hsl(var(--primary))]' : 'text-gray-900'}`}>{f.q}</h4>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-orange-100 text-[hsl(var(--primary))]' : 'bg-gray-50 text-gray-300'}`}>
                       <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} size={18} />
                    </div>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-gray-600 text-[15px] leading-relaxed">{f.a as string}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* ── REVIEWS SECTION (PLAY STORE STYLE) ── */}
      <section id="customer-reviews" className="py-12 px-6 bg-[#fdf9f5]">
         <div className="container mx-auto">
            <div className="mb-8">
               <h2 className="font-heading text-2xl md:text-5xl font-bold text-gray-900 text-center md:text-left">What Our Pilgrims Say</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
               {/* Left: Rating Stats */}
               {pkg.testimonials && pkg.testimonials.length > 0 && (() => {
                  const displayRating = pkg.rating || 5;
                  const displayReviewCount = pkg.reviews || pkg.testimonials.length;
                  return (
                    <div
                      className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-center"
                      style={{
                        width: "min(100%, 326px)",
                        minWidth: "min(100%, 326px)",
                        maxWidth: 326,
                        flex: "0 0 auto",
                      }}
                    >
                      <h3 className="text-sm font-bold text-orange-600 mb-5 uppercase tracking-wider text-center md:text-left">Guest Reviews</h3>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <span className="text-5xl font-bold text-gray-900 tracking-tighter">{displayRating}</span>
                          <div className="text-center md:text-left">
                            <div className="flex justify-center md:justify-start gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} className={i < Math.round(parseFloat(displayRating as string)) ? "text-orange-500 fill-orange-500" : "text-gray-300"} />
                              ))}
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Based on {displayReviewCount} reviews</p>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                              <Check size={18} strokeWidth={3} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 font-bold">100% Verified Guests</p>
                              <p className="text-[11px] text-gray-500">Real pilgrims only</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                              <ThumbsUp size={18} strokeWidth={3} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 font-bold">Highly Recommended</p>
                              <p className="text-[11px] text-gray-500">Exceptional service</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
               })()}
               {(!pkg.testimonials || pkg.testimonials.length === 0) && (
                 <div
                   className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-center text-center md:text-left"
                   style={{
                     width: "min(100%, 326px)",
                     minWidth: "min(100%, 326px)",
                     maxWidth: 326,
                     flex: "0 0 auto",
                   }}
                 >
                    <h3 className="text-sm font-bold text-orange-600 mb-6 uppercase tracking-wider">Guest Reviews</h3>
                    <p className="text-gray-500 text-sm">No reviews yet</p>
                 </div>
               )}

               <div className="w-full relative min-w-0">
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    onPointerDown={handleUserInteraction}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 hide-scrollbar px-2 overscroll-x-contain"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                     {pkg.testimonials && pkg.testimonials.length > 0 ? (
                        (pkg.testimonials as any[]).map((t: any, i: number) => (
                          <div 
                            key={i} 
                            className="snap-start w-[280px] min-w-[280px] sm:w-[320px] sm:min-w-[320px] md:w-[400px] md:min-w-[400px] bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex-shrink-0 flex flex-col group relative"
                          >
                            <div className="absolute top-5 right-5 text-orange-500/5 group-hover:text-orange-500/10 transition-colors">
                              <ThumbsUp size={50} strokeWidth={1} />
                            </div>
                            
                            <div className="flex items-center justify-between mb-6 relative z-10">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                  {t.avatar || 'G'}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Verified Guest</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-orange-600 font-bold text-sm bg-orange-50 px-4 py-1.5 rounded-full ring-1 ring-orange-200">
                                ★ {t.rating || 5}
                              </div>
                            </div>

                            <div className="relative z-10">
                              <style>{`
                                .testimonial-review h1 { font-size: 1.25rem; font-weight: bold; margin: 0.5rem 0; color: #111827; }
                                .testimonial-review h2 { font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0; color: #111827; }
                                .testimonial-review h3 { font-size: 1rem; font-weight: bold; margin: 0.5rem 0; color: #111827; }
                                .testimonial-review p { color: #4b5563; line-height: 1.6; margin: 0; }
                                .testimonial-review strong { font-weight: 600; color: #1f2937; }
                                .testimonial-review em { font-style: italic; }
                                .testimonial-review ul, .testimonial-review ol { margin-left: 1.5rem; margin: 0.5rem 0; }
                                .testimonial-review li { margin-bottom: 0.25rem; }
                              `}</style>
                              <div className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-0 font-medium italic break-words min-w-0">
                                &quot;
                                {(t.review as string) && (t.review as string).includes('<') ? (
                                  <div className="testimonial-review break-words inline" dangerouslySetInnerHTML={{ __html: t.review }} />
                                ) : (
                                  <span className="break-words">{t.review || ''}</span>
                                )}
                                &quot;
                              </div>
                            </div>
                          </div>
                        ))
                     ) : (
                        <div className="w-full text-center py-12">
                          <p className="text-gray-500 text-base">No testimonials available yet</p>
                        </div>
                     )}
                  </div>
                  
                  {/* Carousel Controls */}
                  {pkg.testimonials && pkg.testimonials.length > 1 && (
                  <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
                     <div className="flex gap-3">
                        <button 
                          onClick={prevTestimonial} 
                          aria-label="Previous testimonial"
                          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 text-gray-400 shadow-sm hover:shadow-xl hover:shadow-orange-200"
                        >
                           <ChevronLeft size={22} />
                        </button>
                        <button 
                          onClick={nextTestimonial} 
                          aria-label="Next testimonial"
                          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 text-gray-400 shadow-sm hover:shadow-xl hover:shadow-orange-200"
                        >
                           <ChevronRight size={22} />
                        </button>
                     </div>
                     
                     {/* Progress Dots */}
                     <div className="flex gap-2">
                        {pkg.testimonials.map((_: unknown, i: number) => (
                           <button 
                             key={i}
                             onClick={() => {
                               if (scrollRef.current) {
                                 const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 320 : 400;
                                 scrollRef.current.scrollTo({ left: i * (cardWidth + 24), behavior: 'smooth' });
                               }
                             }}
                             className={`h-1.5 rounded-full transition-all duration-500 ${activeTestimonial === i ? 'w-8 bg-orange-500 shadow-lg shadow-orange-200' : 'w-2 bg-gray-200'}`}
                             aria-label={`Go to testimonial ${i + 1}`}
                           />
                        ))}
                     </div>
                  </div>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* ── GROUND TRUTH SECTION ── */}
      <section className="py-12 px-6 bg-gradient-to-b from-[#fdf9f5] via-[#faf7f2] to-[#f5f2ed] relative overflow-hidden border-t border-gray-200/40">
        <div className="absolute top-20 right-0 w-96 h-96 bg-white/40 rounded-full blur-2xl opacity-20 -mr-48"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-orange-300/5 rounded-full blur-3xl opacity-30 -ml-40"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg flex items-center justify-center text-white flex-shrink-0">
              <Info size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">Ayodhya & Varanasi — Ground Truth</h2>
              <p className="text-gray-600 text-xs md:text-sm">What travel guides don't tell you before you arrive</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {(() => {
              const isQuillEmpty = (s: string) => !s || !s.trim() || s === '<p><br></p>' || s === '<p></p>';
              const cmsItems = (pkg.groundTruth || []).filter((g: any) => g.title && g.title.trim());
              const items = cmsItems.length > 0 ? cmsItems : [
                { title: "Ram Mandir Closures & Timing", description: "Inner sanctum sometimes closes during afternoon prayers. VIP darshan passes bypass main queues that stretch 2-3 hours, especially weekends and festivals." },
                { title: "Varanasi Ghat Timing & Reality", description: "Arrive 30-45 min early for good Aarti viewing spots. Morning 'Subah-e-Banaras' boat rides (4:30-6:30 AM) offer peaceful experience with fewer crowds." },
                { title: "Physical Demands & Walking", description: "Significant walking on narrow, uneven lanes with steep stairs. Comfortable, broken-in footwear is essential. Inform us of mobility issues in advance for alternative routes." },
                { title: "Temple Photography & Protocols", description: "Photography forbidden inside sanctums. Shoulders and knees must be covered. Barefoot walking on marble floors mandatory—socks help. Women sometimes redirected during ceremonies." },
                { title: "Crowd Patterns & Best Times", description: "Early mornings (5-7 AM) are most peaceful. Weekdays less crowded than weekends. Avoid full moon nights and festival dates. October-November: ideal weather and manageable crowds." },
                { title: "Health & Hygiene", description: "Carry bottled water. Street food high-risk; we provide vetted meals. Never drink Ganga water. Pack insect repellent. Medications and first-aid supplies essential." },
                { title: "Additional Costs Not Always Included", description: "Temple donations (₹11-501 per temple), boat tips (₹100-300), guide gratuities, and shop purchases are personal. These add authenticity but are optional." },
                { title: "Weather & Packing", description: "Winter: Light layers (10-30°C). Summer: Extreme heat (40°C+), sunscreen essential. Monsoon: Humid, umbrella helpful. Pack: walking shoes, modest clothing, sunglasses, towel, medications." }
              ];
              return items.map((item: any, idx: number) => (
              <div key={idx} className="group bg-white/85 backdrop-blur-sm rounded-xl p-5 border border-orange-300/40 hover:border-orange-400/60 shadow-sm hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {typeof item === 'string' ? (
                      <p className="text-gray-700 text-sm leading-relaxed break-words">{item}</p>
                    ) : (
                      <>
                        <h4 className="font-heading text-base font-bold text-gray-900 mb-1.5 leading-tight group-hover:text-orange-700 transition-colors">
                          {item.title}
                        </h4>
                        <style>{`
                          .ground-truth-description h1 { font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0; color: #111827; }
                          .ground-truth-description h2 { font-size: 1rem; font-weight: bold; margin: 0.5rem 0; color: #111827; }
                          .ground-truth-description h3 { font-size: 0.95rem; font-weight: bold; margin: 0.5rem 0; color: #111827; }
                          .ground-truth-description p { color: #4b5563; line-height: 1.6; margin: 0; }
                          .ground-truth-description strong { font-weight: 600; color: #1f2937; }
                          .ground-truth-description em { font-style: italic; }
                          .ground-truth-description ul, .ground-truth-description ol { margin-left: 1.5rem; margin: 0.5rem 0; }
                          .ground-truth-description li { margin-bottom: 0.25rem; }
                        `}</style>
                        <div className="ground-truth-description text-gray-700 text-sm leading-relaxed break-words">
                          {item.description && item.description.includes('<') ? (
                            <div className="break-words" dangerouslySetInnerHTML={{ __html: item.description }} />
                          ) : (
                            <p className="break-words">{item.description}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              ));
            })()}
          </div>

          <div className="mt-8 p-5 bg-white/70 backdrop-blur-md rounded-xl border-2 border-orange-300/50 shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
              <span className="font-bold text-orange-700">💡 Pro Tip:</span> Our local guides know all these nuances intimately. They'll navigate crowds, optimize timing, handle protocols, and share stories textbooks miss.
            </p>
          </div>
        </div>
      </section>

      {/* ── POLICIES ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
         <div className="container mx-auto max-w-4xl">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-gray-900 mb-2 text-center">Policies & Important Information</h2>
            <p className="text-gray-600 mb-10 text-[15px] text-center">Please review the following policies carefully before confirming your Mathura-Vrindavan yatra.</p>
            <div className="space-y-4">
              {[
                {
                  icon: RotateCcw,
                  title: "Refund",
                  content: "Processing Time: Approved refunds will be processed within 7 to 10 working days via the original payment method. Force Majeure: If a tour is cancelled by Ayoredesigndhya Varanasi Guide due to unforeseen circumstances (extreme weather, government restrictions, or vehicle breakdown), a 100% refund or an alternative date will be offered. Unused Services: No refunds will be provided for any part of the sightseeing missed by the guest due to late arrival or personal choice during the tour."
                },
                {
                  icon: Ban,
                  title: "Cancel",
                  content: "We understand that travel plans can change. Our cancellation slabs are as follows: 48 Hours or More before the tour: Full Refund of the advance amount (minus a small 5% processing fee/bank charges). 24 to 48 Hours before the tour: 50% of the advance amount will be refunded. Less than 24 Hours or No Show: No refund will be provided as the vehicle and driver are already blocked for your service. Peak Dates: For bookings during major festivals like Holi, Janmashtami, or Radha Ashtami, all advance payments are Non-Refundable due to extreme demand."
                },
                {
                  icon: CreditCard,
                  title: "Payment",
                  content: "To provide competitive local pricing while maintaining high service standards, we follow a split-payment structure: Advance Deposit: A 50% advance payment of the total package cost is required to process the booking. Balance Amount: The remaining balance must be paid to the coordinator or driver upon arrival or at the start of the tour. Mode of Payment: We accept UPI (Google Pay, PhonePe, Paytm), Bank Transfers, and Cash. Exclusions: Please note that E-Rickshaw charges (for narrow lanes near Banke Bihari Temple), Guide fees, and Temple donations are typically not included in the package and should be paid directly in cash."
                },
                {
                  icon: CheckCircle,
                  title: "Confirmation",
                  content: "We want to ensure your spot is secured so you don't miss the divine Darshan timings. Booking Confirmation: A booking is considered \"Confirmed\" only after the receipt of the initial advance payment. Voucher Issuance: Once the payment is verified, we will issue a Digital Confirmation Voucher via WhatsApp/Email containing your driver details, vehicle number, and reporting time. Reporting Time: For Same Day Tours, guests are expected to report at the designated pickup point (Hotel/Railway Station) at the scheduled time. A maximum waiting period of 30 minutes is allowed, after which the tour may be treated as a \"No Show.\""
                }
              ].map((policy, i) => (
                <div key={i} className={`group border rounded-[24px] overflow-hidden transition-all duration-300 ${openPolicy === i ? 'border-[#ffd485] bg-[#fffdf5]' : 'border-gray-100 bg-white shadow-sm hover:border-gray-200'}`}>
                  <button 
                    onClick={() => setOpenPolicy(openPolicy === i ? -1 : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between transition-colors hover:bg-orange-50/30"
                  >
                    <div className="flex items-center gap-4">
                      <policy.icon className="text-orange-500" size={20} />
                      <h4 className="font-bold text-lg text-gray-900">{policy.title}</h4>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-orange-400">
                       <ChevronDown className={`transition-transform duration-300 ${openPolicy === i ? "rotate-180" : ""}`} size={18} />
                    </div>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openPolicy === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-1">
                        <hr className="border-t border-[#f0e3ce] mb-5" />
                        <p className="text-gray-600 text-[15px] leading-relaxed">{policy.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      <EnquireNowModal open={enquireOpen} onOpenChange={setEnquireOpen} />
      <CustomisedPackageModal open={customiseOpen} onOpenChange={setCustomiseOpen} />
    </main>
  );
}
