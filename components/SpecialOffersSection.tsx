"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useModal } from "@/lib/ModalContext";



const fallbackOfferPackages: any[] = [];

interface SpecialOffersSectionProps {
  title?: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  packages?: any[];
}

const SpecialOffersSection = ({ 
  title = <>Exclusive <span className="italic text-[#E87B2C]">Offers</span></>,
  subtitle = "Limited Time Deals",
  centered = false,
  className = "",
  packages
}: SpecialOffersSectionProps) => {
  const { openEnquiry } = useModal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [offers, setOffers] = useState<any[]>(packages || fallbackOfferPackages);
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = offers.length;

  useEffect(() => {
    if (packages) {
      setOffers(packages);
    } else {
      // Fetch if not provided
      fetch('/api/packages')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const offerPkgs = data.data.filter((p: any) => p.isOffer);
            if (offerPkgs.length > 0) {
              setOffers(offerPkgs);
            }
          }
        })
        .catch(console.error);
    }
  }, [packages]);

  const goTo = useCallback((idx: number) => {
    const nextIdx = Math.max(0, Math.min(idx, total - 1));
    setActive(nextIdx);
    if (trackRef.current) {
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 400;
      const cardW = isSmallMobile ? 280 : (isMobile ? 300 : 360);
      const cardGap = isMobile ? 16 : 24;
      
      trackRef.current.scrollTo({
        left: nextIdx * (cardW + cardGap),
        behavior: "smooth"
      });
    }
  }, [total]);

  const next = useCallback(() => {
    setActive((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= total) {
        goTo(0);
        return 0;
      }
      goTo(nextIdx);
      return nextIdx;
    });
  }, [total, goTo]);

  const prev = () => goTo(active - 1);

  const startAutoRotate = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, 3000);
  }, [next]);

  const resetAutoRotate = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    startAutoRotate();
  }, [startAutoRotate]);

  useEffect(() => {
    startAutoRotate();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [startAutoRotate]);

  if (!offers || offers.length === 0) return null;

  return (
    <section className={`pt-32 pb-24 bg-[#fafaf8] overflow-hidden border-t border-gray-100 ${className}`}>
      <style>{`
        .ps-container { max-width: 1320px; margin: 0 auto; padding: 0 32px; position: relative; }
        @media (max-width: 768px) { .ps-container { padding: 0 20px; } }

        .ps-header { margin-bottom: 72px; }
        .ps-title { font-family: var(--font-heading); font-size: clamp(24px, 3.5vw, 48px); font-weight: 800; color: #0d0a07; }
        
        .ps-track {
          --card-w: 360px; --card-gap: 24px;
          display: flex; gap: var(--card-gap); overflow-x: auto;
          snap-type: x mandatory; scroll-behavior: smooth;
          scrollbar-width: none; -ms-overflow-style: none;
          padding-bottom: 20px;
        }
        .ps-track::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .ps-track { --card-w: 300px; --card-gap: 16px; } }
        @media (max-width: 400px) { .ps-track { --card-w: 280px; --card-gap: 16px; } }

        .ps-card {
          flex: 0 0 var(--card-w); background: #fff; border-radius: 18px;
          overflow: hidden; position: relative; border: 1px solid rgba(0,0,0,0.02);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); transition: all 0.4s ease;
          snap-align: start; display: flex; flex-direction: column;
        }
        .ps-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.1); }

        .ps-card-image { position: relative; width: 100%; height: 260px; overflow: hidden; }
        .ps-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
        .ps-card:hover .ps-card-image img { transform: scale(1.06); }
        .ps-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%); }
        
        .ps-card-tag {
          position: absolute; top: 14px; left: 14px; background: #fff; color: #1a1a1a;
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 13px; border-radius: 99px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10;
        }

        /* OFFER TAG - Replacing Rating */
        .ps-card-offer-tag {
          position: absolute; top: 14px; right: 14px; background: #00b67a; color: #fff;
          padding: 6px 12px; border-radius: 99px; display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,182,122,0.25); z-index: 10;
        }

        .ps-card-dest-badge {
          position: absolute; bottom: 16px; left: 16px; display: flex; align-items: center; gap: 5px;
          background: #fff; padding: 5px 12px; border-radius: 99px; color: #1a1a1a;
          font-size: 11px; font-weight: 700; text-transform: uppercase; border: 1px solid #fff;
        }

        .ps-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; background: #fff; }
        .ps-card-title { font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
        .ps-card-duration { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; font-weight: 500; margin-bottom: 12px; }
        
        .ps-card-highlights { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .ps-card-highlight-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555; line-height: 1.4; }
        .ps-card-highlight-dot { width: 4px; height: 4px; border-radius: 50%; background: #E87B2C; margin-top: 7px; flex-shrink: 0; }
        
        .ps-card-divider { height: 1px; background: #eee; margin: auto 0 16px; }

        .ps-card-buttons { display: flex; gap: 10px; width: 100%; }
        .ps-card-btn {
          flex: 1; padding: 10px 12px; border-radius: 8px; border: 1.5px solid;
          cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; text-decoration: none;
        }
        .ps-card-btn-primary { background: #E87B2C; border-color: #E87B2C; color: #fff; }
        .ps-card-btn-primary:hover { background: #d06b1e; transform: translateY(-1px); }
        .ps-card-btn-secondary { background: #fff; border-color: #E87B2C; color: #E87B2C; }
        .ps-card-btn-secondary:hover { background: rgba(232,123,44,0.05); transform: translateY(-1px); }

        .ps-arrow {
          width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid #e8e4dc;
          background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #333; transition: all 0.3s ease;
        }
        .ps-arrow:hover { background: #E87B2C; color: #fff; border-color: #E87B2C; box-shadow: 0 4px 12px rgba(232,123,44,0.2); }
      `}</style>

      <div className="ps-container">
        <div className={`ps-header flex flex-col ${centered ? 'items-center text-center mb-20' : 'md:flex-row md:items-end md:justify-between mb-8'}`}>
          <div className={centered ? 'flex flex-col items-center w-full' : ''}>
            <div className={`flex items-center gap-2 text-[#E87B2C] text-[10px] font-bold uppercase tracking-[0.3em] mb-2 ${centered ? 'justify-center' : ''}`}>
              <span className="w-8 h-[1px] bg-[#E87B2C]" />
              {subtitle}
              <span className="w-8 h-[1px] bg-[#E87B2C]" />
            </div>
            <h2 className={`font-heading font-extrabold tracking-tight leading-tight text-gray-900 ${centered ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-3xl md:text-4xl'}`}>
              {title}
            </h2>
            {centered && (
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E87B2C] to-transparent mt-4 opacity-30" />
            )}
          </div>
          
          {!centered && (
            <div className="flex gap-2 mt-6 md:mt-0">
              <button className="ps-arrow" onClick={() => { prev(); resetAutoRotate(); }}><ChevronLeft size={18} /></button>
              <button className="ps-arrow" onClick={() => { next(); resetAutoRotate(); }}><ChevronRight size={18} /></button>
            </div>
          )}
        </div>

        <div className="relative group/track">
          {/* SIDE NAVIGATION ARROWS (Desktop only for precision) */}
          {centered && (
            <>
              <button 
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 ps-arrow shadow-xl opacity-0 group-hover/track:opacity-100 transition-all duration-300 hidden lg:flex"
                onClick={() => { prev(); resetAutoRotate(); }}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 ps-arrow shadow-xl opacity-0 group-hover/track:opacity-100 transition-all duration-300 hidden lg:flex"
                onClick={() => { next(); resetAutoRotate(); }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div 
            ref={trackRef}
            className="ps-track"
            onMouseEnter={() => { if (timer.current) clearInterval(timer.current); }}
            onMouseLeave={startAutoRotate}
          >
            {offers.map((p) => {
              const imageSrc = p.images?.main || p.image || "https://placehold.co/800x450/f3f4f6/9ca3af?text=Offer+Package";
              return (
                <div key={p.id || p.slug} className="ps-card">
                  <div className="ps-card-image">
                    <Image src={imageSrc} alt={p.title} fill sizes="(max-width: 768px) 300px, 360px" />
                    <div className="ps-card-overlay" />
                    <span className="ps-card-tag">{p.tag}</span>
                    
                    {/* OFFER TAG */}
                    <div className="ps-card-offer-tag">
                      <Tag size={12} fill="white" />
                      {p.offerPercentage || '10% OFF'}
                    </div>

                    <div className="ps-card-dest-badge">
                      <MapPin size={12} />
                      {p.destination}
                    </div>
                  </div>

                  <div className="ps-card-body">
                    <h3 className="ps-card-title">{p.title}</h3>
                    <div className="ps-card-duration">
                      <Clock size={12} />
                      <span>{p.duration}</span>
                      <span style={{ margin: "0 4px", opacity: 0.3 }}>•</span>
                      <MapPin size={12} />
                      <span>India</span>
                    </div>

                    <div className="ps-card-highlights">
                      {p.highlights?.map((h: string) => (
                        <div key={h} className="ps-card-highlight-item">
                          <span className="ps-card-highlight-dot" />
                          {h}
                        </div>
                      ))}
                    </div>

                    <div className="ps-card-divider" />

                    <div className="ps-card-buttons">
                      <Link href={`/packages/${p.slug}`} className="ps-card-btn ps-card-btn-secondary">View Details</Link>
                      <button onClick={openEnquiry} className="ps-card-btn ps-card-btn-primary">Enquire Now</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
