"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MapPin, Clock, Star, Check, X, Calendar, Users, Shield, 
  ChevronDown, ArrowRight, FileText, Share2, Image as ImageIcon,
  ChevronLeft, ChevronRight, Phone, Mail, Award, ThumbsUp, Sparkles
} from "lucide-react";

import CustomisedPackageModal from "@/components/CustomisedPackageModal";
import EnquireNowModal from "@/components/EnquireNowModal";

// Import images for the Bento Gallery
import mainHeroImg from "@/assets/ram haweli 💘🥹.jpg";
import subImg1 from "@/assets/ayodhya Ram Lalla murti photo.jpg";
import subImg2 from "@/assets/Cyberian birds on prayagraj.jpg";
import subImg3 from "@/assets/ -8.jpg";
import subImg4 from "@/assets/ -11.jpg";

const API_BASE = "/api";

// DUMMY DATA FOR TEMPLATE
const dummyPackage = {
  title: "Divine Ayodhya & Kashi Pilgrimage",
  destination: "Ayodhya & Varanasi",
  duration: "5 Days / 4 Nights",
  rating: 4.9,
  reviews: 128,
  price: "₹18,500",
  originalPrice: "₹24,000",
  savings: "₹5,500",
  about: "Embark on a deeply moving spiritual journey through two of India's most sacred cities. This curated experience takes you from the birthplace of Lord Rama in Ayodhya to the eternal ghats of Varanasi. Witness the spectacular Ganga Aarti, enjoy VIP darshan at key temples, and find peace with expert local guides who understand the true essence of these holy sites.",
  highlights: [
    "VIP Darshan at Ram Mandir, Ayodhya",
    "Private boat ride during the mesmerizing Ganga Aarti",
    "Exclusive Kashi Vishwanath Temple corridor tour",
    "Premium Heritage Hotel stays",
    "Chauffeur-driven AC vehicle for all transfers"
  ],
  itinerary: [
    {
      day: "Day 1",
      title: "Arrival in Ayodhya & Evening Aarti",
      desc: "Upon arrival in Ayodhya, our representative will greet you and transfer you to your premium hotel. In the evening, witness the divine Saryu River Aarti, a deeply peaceful experience to begin your pilgrimage."
    },
    {
      day: "Day 2",
      title: "Ram Mandir Darshan & Travel to Varanasi",
      desc: "Early morning VIP access to the grand Ram Mandir. After breakfast, we drive to Varanasi (approx 4 hours). Check into your heritage property by the ghats."
    },
    {
      day: "Day 3",
      title: "Subah-e-Banaras & Temple Trails",
      desc: "Start before dawn with a boat ride on the Ganges. Visit Kashi Vishwanath, Annapurna Temple, and Kaal Bhairav. Evening is reserved for the world-famous Ganga Aarti at Dashashwamedh Ghat."
    },
    {
      day: "Day 4",
      title: "Sarnath Excursion",
      desc: "A short drive to Sarnath, where Lord Buddha gave his first sermon. Explore the ancient ruins, Dhamek Stupa, and the museum. Return to Varanasi for leisure time or silk shopping."
    },
    {
      day: "Day 5",
      title: "Departure",
      desc: "After a final morning walk along the peaceful ghats and breakfast, transfer to Varanasi Airport/Railway Station with divine memories."
    }
  ],
  included: [
    "4 Nights premium accommodation",
    "Daily buffet breakfast",
    "Private AC vehicle for all transfers and sightseeing",
    "Expert English/Hindi speaking local guide",
    "VIP Darshan arrangements",
    "Private boat ride in Varanasi"
  ],
  excluded: [
    "Flight / Train tickets",
    "Lunch and Dinner",
    "Personal expenses",
    "Camera fees at monuments"
  ],
  faq: [
    {
      q: "Is the VIP Darshan guaranteed?",
      a: "Yes, our team pre-arranges the VIP access passes to ensure you have a smooth and uncrowded darshan experience."
    },
    {
      q: "Are the hotels wheelchair accessible?",
      a: "We handpick premium properties. If you have specific accessibility needs, please let us know so we can ensure the perfect room assignment."
    },
    {
      q: "What is the best time to book this package?",
      a: "Varanasi and Ayodhya are beautiful year-round, but October to March offers the most pleasant weather for exploring."
    }
  ],
  reviewStats: {
    average: 4.8,
    total: 128,
    distribution: [
      { stars: 5, percentage: 78 },
      { stars: 4, percentage: 22 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 }
    ]
  },
  testimonials: [
    {
      name: "Aaryan Dwivedi",
      location: "India",
      rating: 5,
      text: "Five days across Mathura, Vrindavan, Ayodhya, and Kashi felt spiritually powerful. The journey moved smoothly from Krishna's birthplace to Lord Ram's Ayodhya.",
      avatar: "A"
    },
    {
      name: "Gayathri Subramaniam",
      location: "India",
      rating: 5,
      text: "The itinerary balanced temple visits and rest thoughtfully. Early darshan in Vrindavan and the evening Ganga Aarti in Kashi were highlights of our tour.",
      avatar: "G"
    },
    {
      name: "Rahul Sharma",
      location: "Delhi",
      rating: 5,
      text: "Excellent arrangements. The VIP darshan at Ram Mandir was seamless and the hotel choices were truly premium. Highly recommended for families.",
      avatar: "R"
    },
    {
      name: "Priya Patel",
      location: "Gujarat",
      rating: 5,
      text: "A truly divine experience. The boat ride in Varanasi during Aarti was magical. Everything was handled with great care and professionalism.",
      avatar: "P"
    },
    {
      name: "Sanjay Gupta",
      location: "Mumbai",
      rating: 5,
      text: "The best pilgrimage experience I've had. The attention to detail in the itinerary and the quality of the guides made it very special.",
      avatar: "S"
    },
    {
      name: "Meera Iyer",
      location: "Chennai",
      rating: 5,
      text: "Everything was perfectly coordinated. From the airport pickup to the temple visits, we didn't have to worry about a thing. Truly premium.",
      avatar: "M"
    },
    {
      name: "Vikram Singh",
      location: "Punjab",
      rating: 5,
      text: "Highly professional service. The hotels were top-notch and the VIP access made a huge difference in our spiritual journey.",
      avatar: "V"
    }
  ]
};

export default function PackageTemplate() {
  const params = useParams();
  const [pkg, setPkg] = useState<any>(dummyPackage);
  const [openDay, setOpenDay] = useState(0);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [customiseOpen, setCustomiseOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch package from CMS
  useEffect(() => {
    if (params?.slug && params.slug !== 'template') {
      fetchPackage(params.slug as string);
    }
  }, [params?.slug]);

  const fetchPackage = async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE}/packages/${slug}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      if (data.success && data.data) {
        const cmsData = data.data;
        setPkg({
          ...dummyPackage,
          ...cmsData,
          highlights: cmsData.highlights || dummyPackage.highlights,
          itinerary: cmsData.itinerary || dummyPackage.itinerary,
          included: cmsData.inclusions || cmsData.included || dummyPackage.included,
          excluded: cmsData.exclusions || cmsData.excluded || dummyPackage.excluded,
          faq: cmsData.faqs || cmsData.faq || dummyPackage.faq,
        });
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      setPkg(dummyPackage);
    }
  };

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

  return (
    <main className="min-h-screen bg-[#fafaf8] pb-0">
      
      {/* ── HEADER TITLE ── */}
      <section className="pt-24 md:pt-28 pb-10 px-6 bg-white">
        <div className="container mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-widest">
             <Link href="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
             <span>/</span>
             <Link href="/packages" className="hover:text-[hsl(var(--primary))] transition-colors">Packages</Link>
             <span>/</span>
             <span className="text-gray-900 truncate max-w-[150px] sm:max-w-none">{pkg.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-4xl">
              <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-1 text-gray-900">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{pkg.rating}</span> 
                </div>
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {pkg.destination}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> {pkg.duration}</span>
              </div>
            </div>
            
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-sm font-bold text-gray-600 shadow-sm shrink-0">
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
              <Image src={mainHeroImg} alt="Main View" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                 <p className="text-[10px] font-bold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">Experience My India Exclusive</p>
                 <h3 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 shadow-sm leading-tight">{pkg.title}</h3>
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-medium border border-white/20">
                   Save {pkg.savings} • VIP Darshan • Premium Stays
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
            </form>
         </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section className="py-10 md:py-16 px-6 border-t border-gray-200/60 bg-white">
        <div className="container mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[65%] space-y-16">
            
            {/* Overview */}
            <div className="space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">About the Journey</h2>
              <p className="text-gray-600 leading-relaxed text-[15px] md:text-base">
                {pkg.about}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.highlights.map((h: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-[#fafaf8] p-4 rounded-xl border border-gray-100 transition-colors">
                    <Check size={16} className="text-[hsl(var(--primary))] shrink-0" strokeWidth={3} />
                    <span className="text-gray-700 font-semibold text-sm md:text-base">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
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
                        <div className="px-6 pb-8 pt-0 md:pl-20">
                          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                            <p className="text-gray-600 leading-relaxed text-[15px] md:text-base">{day.desc}</p>
                            <div className="mt-4 flex flex-wrap gap-4">
                               <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                  <MapPin size={12} className="text-orange-300" /> Sightseeing included
                               </div>
                               <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                  <Check size={12} className="text-green-400" /> Breakfast included
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Book With Us - Balanced */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
               <div className="relative z-10">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Why book with Divine Journeys?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                     {[
                        { icon: Shield, title: "Verified Local Experts", desc: "Our guides are native to the sacred cities, providing deep local insights." },
                        { icon: Award, title: "Handpicked Premium Stays", desc: "We personally vet every hotel to ensure luxury and authentic hospitality." },
                        { icon: Users, title: "Small Group Experience", desc: "Intimate journeys with personalized attention and no overcrowding." },
                        { icon: Check, title: "No Hidden Costs", desc: "Transparency is our core value. What you see is exactly what you pay." }
                     ].map((item, idx) => (
                        <div key={idx} className="flex gap-5">
                           <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center border border-white/5">
                              <item.icon className="text-orange-400" size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#fafaf8] rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -z-0" />
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                     <Check size={16} strokeWidth={3} />
                  </div>
                  What's Included
                </h3>
                <ul className="space-y-4 relative z-10">
                  {pkg.included.map((item: string, i: number) => (
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
                  What's Excluded
                </h3>
                <ul className="space-y-4 relative z-10">
                  {pkg.excluded.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {pkg.faq.map((f: any, i: number) => (
                  <div key={i} className="bg-[#fafaf8] border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">{f.q}</h4>
                    <p className="text-gray-600 text-[15px] leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
               <div className="text-center">
                  <div className="w-12 h-12 bg-orange-50 text-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-3">
                     <Shield size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Secure Booking</p>
               </div>
               <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Award size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Certified Guides</p>
               </div>
               <div className="text-center">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Star size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Premium Hotels</p>
               </div>
               <div className="text-center">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                     <ThumbsUp size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">24/7 Support</p>
               </div>
            </div>

          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <div className="hidden lg:block w-full lg:w-[35%] relative">
            <div className="sticky top-28 space-y-6">
              {/* Price Card - Redesigned to be more compact */}
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Package</span>
                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Save {pkg.savings}</span>
                 </div>
                 <button onClick={() => setEnquireOpen(true)} className="w-full bg-[hsl(var(--primary))] text-white font-bold h-12 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all text-sm shadow-lg shadow-orange-100">
                   Check Price & Availability
                 </button>
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
      </section>

      {/* ── REVIEWS SECTION (PLAY STORE STYLE) ── */}
      <section className="py-20 px-6 bg-[#fffcf9]">
         <div className="container mx-auto">
            <div className="mb-12">
               <h2 className="font-heading text-2xl md:text-5xl font-bold text-gray-900 text-center md:text-left">Guest Experiences</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
               {/* Left: Rating Stats */}
               <div className="w-full lg:w-[350px] bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-orange-600 mb-6 uppercase tracking-wider">Guest Reviews</h3>
                  <div className="flex items-center gap-6 mb-8">
                     <span className="text-6xl font-bold text-gray-900 tracking-tighter">{pkg.reviewStats.average}</span>
                     <div>
                        <div className="flex gap-1 mb-1">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} size={18} className="text-orange-500 fill-orange-500" />
                           ))}
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Based on {pkg.reviewStats.total}+ reviews</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     {pkg.reviewStats.distribution.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                           <span className="text-xs font-bold text-gray-600 w-2">{item.stars}</span>
                           <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                 className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                                 style={{ width: `${item.percentage}%` }}
                              />
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 w-6">{item.percentage}%</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="w-full relative">
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    onPointerDown={handleUserInteraction}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar px-2 touch-pan-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                     {pkg.testimonials.map((t: any, i: number) => (
                        <div 
                          key={i} 
                          className="snap-start w-[280px] min-w-[280px] sm:w-[320px] sm:min-w-[320px] md:w-[400px] md:min-w-[400px] bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex-shrink-0 flex flex-col group relative"
                        >
                           <div className="absolute top-8 right-8 text-orange-500/5 group-hover:text-orange-500/10 transition-colors">
                              <ThumbsUp size={80} strokeWidth={1} />
                           </div>
                           
                           <div className="flex items-center justify-between mb-8 relative z-10">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-bold text-xl shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    {t.avatar}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{t.location}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[#00b67a] font-bold text-sm bg-[#00b67a]/10 px-4 py-1.5 rounded-full ring-1 ring-[#00b67a]/20">
                                 ★ {t.rating}
                              </div>
                           </div>

                           <div className="relative z-10">
                              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-6 font-medium italic">
                                 "{t.text}"
                              </p>
                              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm hover:text-[hsl(var(--primary))] transition-colors cursor-pointer group/read">
                                 <span>Read Full Story</span>
                                 <ArrowRight size={14} className="group-hover/read:translate-x-1 transition-transform" />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  {/* Carousel Controls */}
                  <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
                     <div className="flex gap-3">
                        <button onClick={prevTestimonial} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 text-gray-400 shadow-sm hover:shadow-xl hover:shadow-orange-200">
                           <ChevronLeft size={22} />
                        </button>
                        <button onClick={nextTestimonial} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 text-gray-400 shadow-sm hover:shadow-xl hover:shadow-orange-200">
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
               </div>
            </div>
         </div>
      </section>

      <EnquireNowModal open={enquireOpen} onOpenChange={setEnquireOpen} />
      <CustomisedPackageModal open={customiseOpen} onOpenChange={setCustomiseOpen} />
    </main>
  );
}
