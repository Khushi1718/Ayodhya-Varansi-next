"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface EnquireNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE = "/api";

const EnquireNowModal = ({ open, onOpenChange }: EnquireNowModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: "", phone: "" });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-none bg-white rounded-[24px] overflow-hidden max-w-[92%] sm:max-w-[450px] shadow-2xl">
        {/* Orange Header */}
        <div className="bg-[#FF6B00] p-6 md:p-8 relative">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 hover:scale-110 transition-transform z-10"
          >
            <X size={20} />
          </button>
          
          <DialogTitle className="text-white text-2xl md:text-3xl font-bold mb-2">
            Get Free Consultation
          </DialogTitle>
          <DialogDescription className="text-white/90 text-sm md:text-base font-medium">
            Share your details. Our team will contact you shortly.
          </DialogDescription>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium text-gray-500 ml-1">
                Full Name *
              </Label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="h-12 bg-white border-gray-200 rounded-xl px-4 text-sm focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium text-gray-500 ml-1">
                Phone Number *
              </Label>
              <Input 
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                className="h-12 bg-white border-gray-200 rounded-xl px-4 text-sm focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#FF6B00] text-white font-bold h-12 rounded-full hover:brightness-105 active:scale-[0.98] transition-all text-xs sm:text-sm shadow-lg shadow-[#FF6B00]/20"
              >
                {loading ? "Connecting..." : "Connect with Expert"}
              </button>
              
              <a 
                href="https://wa.me/91XXXXXXXXXX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#00D95F] text-white font-bold h-12 rounded-full flex items-center justify-center hover:brightness-105 active:scale-[0.98] transition-all text-xs sm:text-sm shadow-lg shadow-[#00D95F]/20"
              >
                Chat on WhatsApp
              </a>
            </div>

            <p className="text-[11px] text-gray-400 text-center font-medium mt-4">
              By submitting, you agree to be contacted via call or WhatsApp.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnquireNowModal;
