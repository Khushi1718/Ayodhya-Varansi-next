"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/Experience_my_India.webp";

const Footer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative py-10 md:py-14 px-6 overflow-hidden select-none bg-gradient-to-br from-white via-[#fafafa] to-[#f5f5f5]">
      {/* ── Animated Background Grid ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E87B2C" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-orange-50/20 via-transparent to-transparent animate-pulse opacity-30"></div>
      </div>
      
      {/* ── Premium Mesh Gradient Background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/35 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-orange-50/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-50/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-3000"></div>
      </div>
      
      {/* ── Sacred Energy Background ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] opacity-8 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, #E87B2C 0%, transparent 70%)",
          filter: "blur(120px)",
          animation: "flame-drift 15s ease-in-out infinite alternate",
        }} 
      />
      
      <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[120%] opacity-5 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, #D4A017 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "flame-drift 20s ease-in-out infinite alternate-reverse",
        }} 
      />
      
      {/* ── Floating Light Orbs ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200/10 rounded-full filter blur-2xl animate-float opacity-60" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-amber-200/5 rounded-full filter blur-3xl animate-float opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-orange-100/8 rounded-full filter blur-2xl animate-float opacity-50" style={{animationDelay: '4s'}}></div>
      </div>

      {/* ── Golden Dust Particles ── */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "1.5px",
              height: "1.5px",
              background: i % 2 === 0 ? "#E87B2C" : "#D4A017",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: 0,
              animation: `float-particle ${Math.random() * 8 + 4}s linear infinite ${Math.random() * 5}s`,
              boxShadow: `0 0 6px ${i % 2 === 0 ? "#E87B2C40" : "#D4A01740"}`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12 mb-10 pb-10 border-b border-gray-200">
          
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <Image 
                src={logo} 
                alt="Experience My India" 
                height={38} 
                width={160}
                className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110" 
                priority
              />
            </Link>
            <p className="text-gray-600 text-[13px] leading-relaxed font-light font-body max-w-xs">
              Crafting sacred journeys to India's holiest destinations with devotion, care, and authenticity.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[13px] text-gray-900 tracking-[0.15em] uppercase font-body font-bold hover:text-[#E87B2C] transition-colors duration-300">Quick Links</h4>
            <div className="space-y-3.5">
              {[
                { label: "Home", href: "/" },
                { label: "Packages", href: "/#packages" },
                { label: "Blog", href: "/#blog" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="block text-[13px] font-medium text-gray-600 hover:text-[#E87B2C] hover:translate-x-1.5 transition-all duration-300 font-body hover:font-semibold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[13px] font-bold text-gray-900 tracking-[0.15em] uppercase font-body hover:text-[#E87B2C] transition-colors duration-300">Destinations</h4>
            <div className="space-y-3.5">
              {["Ayodhya", "Varanasi", "Prayagraj"].map((dest) => (
                <span key={dest} className="block text-[15px] font-light text-gray-700 font-body cursor-default hover:text-[#E87B2C] transition-all duration-300 hover:translate-x-1 hover:font-medium pl-2">
                  {dest}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[13px] font-bold text-gray-900 tracking-[0.15em] uppercase font-body hover:text-[#E87B2C] transition-colors duration-300">Contact</h4>
            <div className="space-y-4">
              <a href="tel:+919876543210" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E87B2C] group-hover:border-[#E87B2C] group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-orange-300/50">
                  <Phone size={14} className="text-[#E87B2C] group-hover:text-white transition-colors" /> 
                </div>
                <span className="text-[13px] text-gray-700 group-hover:text-[#E87B2C] font-medium font-body transition-all duration-300 group-hover:font-semibold">+91 98765 43210</span>
              </a>
              <a href="mailto:ayodhavaranasitourism@gmail.com" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E87B2C] group-hover:border-[#E87B2C] group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-orange-300/50">
                  <Mail size={14} className="text-[#E87B2C] group-hover:text-white transition-colors" /> 
                </div>
                <span className="text-[13px] text-gray-700 group-hover:text-[#E87B2C] font-medium font-body transition-all duration-300 group-hover:font-semibold truncate">ayodhavaranasitourism@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 font-body">
          <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">
            © 2026 EXPERIENCE MY INDIA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            {["Terms", "Privacy", "Cookies"].map((item, i) => (
              <a key={i} href="#" className="relative text-gray-600 hover:text-[#E87B2C] transition-all duration-300 tracking-[0.15em] uppercase group text-[10px] font-medium">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E87B2C] group-hover:w-full transition-all duration-500 rounded-full" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flame-drift {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.05) translate(10px, 15px); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-60px) scale(0); opacity: 0; }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) translateX(-15px);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-20px) translateX(20px);
            opacity: 0.7;
          }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes subtle-glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse {
          animation: subtle-glow 4s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;





