"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight, Star, Loader } from "lucide-react";
import { useModal } from "@/lib/ModalContext";

import pkgAyodhya       from "@/assets/pkg-ayodhya.png";
import pkgVaranasi      from "@/assets/pkg-varanasi.png";
import pkgPrayagraj     from "@/assets/pkg-prayagraj.png";
import pkgSarnath       from "@/assets/pkg-sarnath.png";
import pkgCircuit       from "@/assets/pkg-circuit.png";
import pkgGangesSunrise from "@/assets/pkg-ganges-sunrise.png";

const fallbackPackages: any[] = [];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ----------------------------------------------------------------/* ── MEMOIZED CARD FOR PERFORMANCE ── */
const PackageCard = React.memo(({ p, i, active, onEnquire }: { p: any, i: number, active: number, onEnquire: () => void }) => {
  return (
    <div className={`ps-card ${i === active ? "active" : ""}`}>
      {/* image */}
      <div className="ps-card-image">
        <Image
          src={p.image}
          alt={p.destination}
          fill
          sizes="(max-width: 768px) 300px, 360px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className="ps-card-overlay" />
        <span className="ps-card-tag">{p.tag}</span>
        <div className="ps-card-rating">
          <Star size={11} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          <span>{p.rating}</span>
          <span style={{ color: "#aaa", fontWeight: 400 }}>({p.reviews})</span>
        </div>
        <div className="ps-card-dest-badge">
          <MapPin size={12} />
          {p.destination}
        </div>
      </div>

      {/* body */}
      <div className="ps-card-body">
        <h3 className="ps-card-title">{p.title}</h3>
        
        <div className="ps-card-duration">
          <Clock size={12} />
          <span>{p.duration}</span>
          <span style={{ margin: "0 4px", opacity: 0.3 }}>•</span>
          <MapPin size={12} />
          <span>India</span>
        </div>

        {p.highlights && p.highlights.length > 0 && (
          <>
            <div className="ps-card-highlights">
              {p.highlights.slice(0, 3).map((h: string) => (
                <div key={h} className="ps-card-highlight-item">
                  <span className="ps-card-highlight-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "hsl(var(--primary))", marginTop: 7 }} />
                  {h}
                </div>
              ))}
            </div>
            <div className="ps-card-divider" />
          </>
        )}

        <div className="ps-card-buttons" style={{ marginTop: 'auto' }}>
          <Link 
            href={`/packages/${p.slug || p.id}`}
            className="ps-card-btn ps-card-btn-secondary"
          >
            View Details
          </Link>
          <button
            className="ps-card-btn ps-card-btn-primary"
            onClick={onEnquire}
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
});

PackageCard.displayName = "PackageCard";

const PackagesSection = () => {
  const { openEnquiry } = useModal();
  const trackRef    = useRef<HTMLDivElement>(null);
  const [packages, setPackages] = useState<any[]>(fallbackPackages);
  const [loading, setLoading] = useState(true);
  const [active, setActive]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart   = useRef(0);
  const timer       = useRef<ReturnType<typeof setInterval> | null>(null);
  const [total, setTotal] = useState(fallbackPackages.length);

  // Fetch packages from CMS on mount
  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        const API_BASE = "/api";
        const response = await fetch(`${API_BASE}/packages`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const cmsPackages = data.data.map((pkg: any) => ({
            id: pkg.id || pkg._id,
            image: pkg.images?.main || pkg.image || pkgAyodhya,
            destination: pkg.destination || 'Destination',
            tag: pkg.destination || 'Pilgrimage',
            title: pkg.title || 'Package Title',
            duration: pkg.duration || '3 Days · 2 Nights',
            highlights: Array.isArray(pkg.highlights) && pkg.highlights.length > 0 ? pkg.highlights.slice(0, 3) : [],
            places: pkg.highlights || [],
            rating: pkg.rating || 4.8,
            reviews: pkg.reviews || 100,
            accent: '#c27b4a',
            slug: pkg.slug || pkg.id || pkg._id,
            isOffer: pkg.isOffer || false,
          }));
          const normalPackages = cmsPackages.filter((p: any) => !p.isOffer).slice(0, 5);
          if (normalPackages.length > 0) {
            setPackages(normalPackages);
            setTotal(normalPackages.length);
          } else {
            setPackages(fallbackPackages);
            setTotal(fallbackPackages.length);
          }
        } else {
          setPackages(fallbackPackages);
          setTotal(fallbackPackages.length);
        }
      } catch (error) {
        console.error('Failed to fetch packages from CMS:', error);
        setPackages(fallbackPackages);
        setTotal(fallbackPackages.length);
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesData();
  }, []);

  /* ── navigation ── */
  const goTo = useCallback((idx: number) => {
    const nextIdx = Math.max(0, Math.min(idx, total - 1));
    setActive(nextIdx);
    if (trackRef.current) {
      // Dynamic width calculation based on CSS variables or screen width
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

  const prev = () => goTo(active - 1);
  const next = useCallback(() => {
    goTo(active + 1);
  }, [active, goTo]);

  /* ── auto-rotation ── */
  const startAutoRotate = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setActive((prev) => {
        const nextIdx = prev + 1;
        if (nextIdx >= total) {
          goTo(0); // Loop back to start
          return 0;
        }
        goTo(nextIdx);
        return nextIdx;
      });
    }, 4000);
  }, [total, goTo]);

  const resetAutoRotate = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    startAutoRotate();
  }, [startAutoRotate]);

  /* ── initialize auto-rotation ── */
  useEffect(() => {
    startAutoRotate();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [startAutoRotate]);

  /* ── sync scroll to active state ── */
  const handleScroll = () => {
    if (!trackRef.current || dragging) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const cardW = 360; 
    const cardGap = 24;
    const index = Math.round(scrollLeft / (cardW + cardGap));
    if (index !== active && index >= 0 && index < total) {
      setActive(index);
    }
  };

  /* ── keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        next();
        resetAutoRotate();
      }
      if (e.key === "ArrowLeft") {
        prev();
        resetAutoRotate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, total, next, resetAutoRotate]);

  /* ── drag / touch ── */
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    setDragging(true);
    dragStart.current = e.clientX;
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - dragStart.current;
    setDragOffset(delta);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const finalDelta = e.clientX - dragStart.current;
    if (finalDelta < -100) {
      next();
      resetAutoRotate();
    }
    else if (finalDelta > 100) {
      prev();
      resetAutoRotate();
    }
    setDragOffset(0);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  /* ── wheel scroll ── */
  const lastScrollTime = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 500) return; 
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) > 20) {
      if (e.deltaX > 20 || e.deltaY > 20) {
        next();
        resetAutoRotate();
        lastScrollTime.current = now;
      }
      else if (e.deltaX < -20 || e.deltaY < -20) {
        prev();
        resetAutoRotate();
        lastScrollTime.current = now;
      }
    }
  };

  if (!packages || packages.length === 0) return null;

  const pkg = packages[active];

  return (
    <section id="packages" className="ps-section">
      <style>{`
        /* ---- layout ---- */
        .ps-section { 
          background: linear-gradient(135deg, #fafaf8 0%, #f5f3f0 100%);
          padding: 90px 0 110px; position: relative;
        }
        .ps-section::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(232, 123, 44, 0.03) 0%, transparent 70%);
        }
        .ps-container { max-width: 1320px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; }
        
        @media (max-width: 768px) {
          .ps-section { padding: 60px 0 80px; }
          .ps-container { padding: 0 20px; }
        }

        /* ---- section heading ---- */
        .ps-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 56px; flex-wrap: wrap; gap: 32px;
        }
        .ps-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: hsl(var(--primary)); margin-bottom: 12px;
        }
        .ps-eyebrow-line { width: 24px; height: 2px; background: hsl(var(--primary)); border-radius: 99px; }
        .ps-title {
          font-family: var(--font-heading); font-size: clamp(32px, 4vw, 48px);
          font-weight: 800; color: #0d0a07; line-height: 1.1; margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .ps-subtitle {
          font-size: 15px; color: #555; font-weight: 400; max-width: 520px; line-height: 1.7;
        }

        @media (max-width: 768px) {
          .ps-header { flex-direction: column; align-items: flex-start; margin-bottom: 40px; gap: 20px; }
          .ps-header-controls { align-self: flex-end; }
        }

        /* ---- grid layout ---- */
        .ps-grid-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          margin-bottom: 48px; align-items: stretch;
        }
        @media (max-width: 992px) {
          .ps-grid-layout { grid-template-columns: 1fr; gap: 32px; }
        }

        /* ---- card track ---- */
        .ps-track {
          --card-w: 360px;
          --card-gap: 24px;
          display: flex; gap: var(--card-gap); 
          overflow-x: auto;
          snap-type: x mandatory;
          scroll-behavior: smooth;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding-bottom: 30px;
        }
        .ps-track::-webkit-scrollbar { display: none; }
        .ps-track:active { cursor: grabbing; }

        @media (max-width: 768px) {
          .ps-track { --card-w: 300px; --card-gap: 16px; }
        }
        @media (max-width: 400px) {
          .ps-track { --card-w: 280px; --card-gap: 16px; }
        }

        /* ---- card ---- */
        .ps-card {
          flex: 0 0 var(--card-w); background: #fff; border-radius: 18px;
          overflow: hidden; position: relative;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          border: 1px solid rgba(0,0,0,0.02);
          snap-align: start;
          display: flex; flex-direction: column;
        }
        .ps-card.active {
          box-shadow: 0 20px 64px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.06);
          transform: scale(1.02);
        }
        .ps-card:hover { 
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);
        }

        /* card image */
        .ps-card-image {
          position: relative; width: 100%; height: 260px; overflow: hidden;
        }
        .ps-card-image img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .ps-card:hover .ps-card-image img { transform: scale(1.06); }
        .ps-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 100%);
        }
        .ps-card-tag {
          position: absolute; top: 14px; left: 14px;
          background: #fff;
          color: #1a1a1a; font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 13px; border-radius: 99px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10;
        }
        .ps-card-rating {
          position: absolute; top: 14px; right: 14px;
          background: rgba(255,255,255,0.97); backdrop-filter: blur(8px);
          padding: 6px 12px; border-radius: 99px;
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 700; color: #1a1a1a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .ps-card-dest-badge {
          position: absolute; bottom: 16px; left: 16px;
          display: flex; align-items: center; gap: 5px;
          background: #fff;
          padding: 5px 12px; border-radius: 99px;
          color: #1a1a1a; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(0,0,0,0.18);
          border: 1px solid #fff;
        }

        /* ---- card body ---- */
        .ps-card-body { 
          padding: 20px; 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          background: #fff;
        }
        @media (max-width: 768px) {
          .ps-card-body { padding: 18px; }
        }
        .ps-card-title {
          font-family: var(--font-heading); font-size: 18px; font-weight: 700;
          color: #1a1a1a; margin-bottom: 6px; line-height: 1.3;
        }
        .ps-card-duration {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #666; font-weight: 500; margin-bottom: 12px;
        }
        .ps-card-places {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;
        }
        .ps-card-place-pill {
          font-size: 11px; font-weight: 600; color: #555;
          background: #f3f3f0; border-radius: 6px; padding: 5px 11px;
        }
        .ps-card-divider { height: 1px; background: #eee; margin: 16px 0 14px; }
        .ps-card-highlights { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
        .ps-card-highlight-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; color: #444; font-weight: 400; line-height: 1.4;
        }

        /* buttons row */
        .ps-card-buttons {
          display: flex; gap: 10px; width: 100%; margin-top: auto;
        }
        .ps-card-btn {
          flex: 1; padding: 10px 12px; border-radius: 8px; border: 1.5px solid;
          cursor: pointer; font-size: 13px; font-weight: 600;
          transition: all 0.25s ease; display: flex; align-items: center;
          justify-content: center; gap: 6px; text-decoration: none;
        }
        .ps-card-btn-primary {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary));
          color: #fff;
        }
        .ps-card-btn-primary:hover {
          background: hsl(var(--primary) / 0.9);
          transform: translateY(-1px);
        }
        .ps-card-btn-secondary {
          background: #fff; border-color: hsl(var(--primary)); color: hsl(var(--primary));
        }
        .ps-card-btn-secondary:hover {
          background: hsl(var(--primary) / 0.05);
          transform: translateY(-1px);
        }

        /* ---- nav arrows ---- */
        .ps-arrow {
          width: 50px; height: 50px; border-radius: 50%; border: 2px solid #e8e4dc;
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #333; flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1); 
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .ps-arrow:hover:not(:disabled) { 
          background: hsl(var(--primary)); 
          color: #fff; 
          border-color: hsl(var(--primary)); 
          box-shadow: 0 6px 24px hsl(var(--primary) / 0.35);
          transform: scale(1.05);
        }
        .ps-arrow:disabled { opacity: 0.3; cursor: not-allowed; }

        @media (max-width: 768px) {
          .ps-arrow { width: 44px; height: 44px; border-width: 1.5px; }
        }

        /* ---- dots ---- */
        .ps-dot {
          width: 8px; height: 8px; border-radius: 99px; border: none; padding: 0;
          background: #d9d3cc; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1); flex-shrink: 0;
        }
        .ps-dot:hover { background: #c5bdb2; }
        .ps-dot.active { 
          width: 32px; 
          background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.4);
        }

        /* ---- view all link ---- */
        .ps-view-all {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 600; color: white;
          text-decoration: none;
          transition: all 0.3s ease; 
          padding: 10px 20px;
          background: hsl(var(--primary));
          border-radius: 8px;
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.3);
          border: none;
        }
        .ps-view-all:hover { 
          background: hsl(var(--primary) / 0.9);
          box-shadow: 0 4px 16px hsl(var(--primary) / 0.4);
          transform: translateY(-2px);
        }

        /* ---- large preview panel ---- */
        .ps-preview {
          border-radius: 18px; overflow: hidden; position: relative;
          height: 100%; min-height: 480px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.02);
        }
        .ps-preview-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .ps-preview-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 60%);
        }
        .ps-preview-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 32px; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
        }

        @media (max-width: 768px) {
          .ps-preview { min-height: 400px; }
          .ps-preview-info { padding: 24px; }
        }

        /* ---- list items (right panel) ---- */
        .ps-list-item {
          all: unset; display: flex; align-items: center; gap: 16px;
          border-radius: 12px; padding: 14px 16px; cursor: pointer;
          transition: all 0.25s ease; width: 100%; text-align: left;
          border: 1.5px solid transparent;
        }
        .ps-list-item:hover {
          background: #fafaf8;
        }
        .ps-list-item.active {
          background: #fff; border-color: #e8e4dc;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
      `}</style>

      <div className="ps-container">

        {/* ── HEADER ── */}
        <div className="ps-header">
          <div>
            <div className="ps-eyebrow">
              <span className="ps-eyebrow-line" />
              Curated Journeys
            </div>
            <h2 className="ps-title">
              Handpicked Packages
            </h2>
            <p className="ps-subtitle">
              Every itinerary is crafted by local experts who know these sacred lands intimately — so you travel with confidence and depth.
            </p>
          </div>

          {/* nav controls */}
          <div className="ps-header-controls" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button className="ps-arrow" onClick={() => { prev(); resetAutoRotate(); }} disabled={active === 0} aria-label="Previous package">
              <ChevronLeft size={20} />
            </button>
            <button className="ps-arrow" onClick={() => { next(); resetAutoRotate(); }} disabled={active === total - 1} aria-label="Next package">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ── MAIN LAYOUT: featured + cards ── */}
        <div className="ps-grid-layout">

          {/* LEFT — featured image */}
          <Link 
            href="/packages/divine-ayodhya-kashi-pilgrimage" 
            className="ps-preview group/preview" 
            key={`preview-${active}`}
            style={{ display: "block", textDecoration: "none" }}
          >
            <Image
              src={pkg.image}
              alt={pkg.destination}
              fill
              sizes="(max-width: 992px) 100vw, 50vw"
              style={{ objectFit: "cover", transition: "all 0.6s ease" }}
              className="group-hover/preview:scale-105"
              loading="lazy"
            />
            <div className="ps-preview-overlay" />
            <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.05, pointerEvents: "none", background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e87b2c' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
              <span style={{
                background: "#fff",
                color: "#1a1a1a", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "6px 14px", borderRadius: 99,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>{pkg.tag}</span>
            </div>
            <div className="ps-preview-info">
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                {pkg.destination}
              </p>
              <h3 style={{ 
                fontFamily: "var(--font-heading)", fontSize: "clamp(20px,2vw,26px)", 
                fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.25,
                transition: "color 0.3s ease"
              }} className="group-hover/preview:text-primary">
                {pkg.title}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                  <Clock size={13} /> {pkg.duration}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 99, padding: "4px 10px" }}>
                  <Star size={12} style={{ color: "#FBBF24", fill: "#FBBF24" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{pkg.rating}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>({pkg.reviews})</span>
                </span>
              </div>
            </div>
          </Link>

          {/* RIGHT — scrollable cards */}
          <div style={{ overflow: "hidden", borderRadius: 20 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: "100%",
                cursor: "default",
              }}
            >
              {packages.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { setActive(i); goTo(i); resetAutoRotate(); }}
                  className={`ps-list-item ${i === active ? "active" : ""}`}
                >
                  {/* thumbnail */}
                  <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                    <Image
                      src={p.image}
                      alt={p.destination}
                      fill
                      sizes="72px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {/* info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: p.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
                      {p.destination}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888" }}>
                        <Clock size={11} /> {p.duration}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#888" }}>
                        <Star size={11} style={{ color: "#FBBF24", fill: "#FBBF24" }} /> {p.rating}
                      </span>
                    </div>
                  </div>
                  {/* active indicator */}
                  <div style={{
                    width: 3, alignSelf: "stretch", borderRadius: 99, flexShrink: 0,
                    background: i === active ? `${p.accent}` : "transparent",
                    transition: "background 0.25s ease",
                  }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL SLIDER — full card row ── */}
        <div style={{ position: "relative" }}>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="ps-track"
          >
            {packages.map((p, i) => (
              <PackageCard 
                key={p.id} 
                p={p} 
                i={i} 
                active={active} 
                onEnquire={openEnquiry} 
              />
            ))}
          </div>
        </div>

        {/* ── FOOTER ROW: dots + view all ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, flexWrap: "wrap", gap: 16 }}>
          {/* dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {packages.map((_, i) => (
              <button
                key={i}
                className={`ps-dot ${i === active ? "active" : ""}`}
                onClick={() => { goTo(i); resetAutoRotate(); }}
                aria-label={`Go to package ${i + 1}`}
              />
            ))}
          </div>

          <Link href="/packages" className="ps-view-all">
            View All Packages
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
