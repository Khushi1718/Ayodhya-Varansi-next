"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import customTravelBg from "@/assets/premium-custom-resort.png";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:17182';

const CustomisedPackageSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/custom-packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting custom package request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="customise" className="relative py-12 md:py-16 lg:py-24 overflow-hidden mt-10">
      {/* FULL BLEED CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={customTravelBg} 
          alt="Customised Luxury Journey" 
          fill 
          className="object-cover"
          sizes="100vw"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent lg:to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* LEFT: FLOATING TYPOGRAPHY */}
        <div className="text-white max-w-xl lg:pr-8 w-full text-center lg:text-left">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-12 h-px bg-[hsl(var(--primary))]"></span>
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(var(--primary))] drop-shadow-md">
              Bespoke Travel
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-[64px] font-bold leading-[1.05] mb-6 md:mb-8 drop-shadow-xl text-white">
            Design Your<br className="hidden md:block" /> Divine Journey.
          </h2>
          <p className="text-gray-200 text-[14px] md:text-[16px] lg:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-light drop-shadow-md">
            Go beyond the ordinary. Let our specialists weave together a deeply personal, luxurious itinerary that aligns perfectly with your spiritual aspirations.
          </p>
        </div>

        {/* RIGHT: PREMIUM FORM CARD */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] p-6 md:p-8 flex flex-col relative overflow-hidden">
            
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[hsl(var(--primary))] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

            <div className="mb-6 relative z-10 text-center">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">Start Your Request</h3>
              <p className="text-[13px] text-gray-500 font-medium">Simple. Personal. Extraordinary.</p>
            </div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <Label htmlFor="custom-name" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</Label>
                  <Input 
                    id="custom-name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Your Name" 
                    className="bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 text-sm h-11 rounded-xl placeholder:text-gray-300 transition-all outline-none" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="custom-phone" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Phone Number</Label>
                  <Input 
                    id="custom-phone" 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+91 XXXXX XXXXX" 
                    className="bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 text-sm h-11 rounded-xl placeholder:text-gray-300 transition-all outline-none" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="custom-message" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Your Requirements</Label>
                  <Textarea 
                    id="custom-message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="E.g. Ayodhya & Varanasi for 5 days..." 
                    className="bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 text-sm min-h-[100px] rounded-xl placeholder:text-gray-300 transition-all outline-none resize-none p-4" 
                    required 
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading || submitted}
                    className={`w-full font-bold h-12 md:h-14 rounded-xl md:rounded-2xl transition-all text-sm shadow-lg ${
                      submitted 
                        ? "bg-green-500 text-white shadow-green-100" 
                        : "bg-[hsl(var(--primary))] text-white shadow-[hsl(var(--primary))]/20 hover:brightness-105 active:scale-[0.98]"
                    }`}
                  >
                    {loading ? "Processing..." : submitted ? "Request Sent!" : "Create My Package"}
                  </button>
                  {submitted && (
                    <p className="text-[10px] text-green-600 font-bold text-center mt-3 uppercase tracking-widest">
                      We will contact you shortly
                    </p>
                  )}
                </div>
                
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CustomisedPackageSection;
