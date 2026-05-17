"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface EnquireNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE = "/api";

const EnquireNowModal = ({ open, onOpenChange }: EnquireNowModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
        setFormData({ name: "", email: "", phone: "" });
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
      <DialogContent hideCloseButton className="p-0 border-none bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden max-w-[92%] sm:max-w-[400px] shadow-[0_25px_50px_-12px_rgba(232,123,44,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF6B00] via-[#E87B2C] to-[#FBB03B]"></div>
        
        <div className="relative p-7 sm:p-9 pt-10">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-50/80 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-300 z-10"
          >
            <X size={16} />
          </button>
          
          <div className="mb-8 text-center">
            <DialogTitle className="text-gray-900 text-2xl md:text-3xl font-heading font-bold mb-2 tracking-tight">
              Enquire Now
            </DialogTitle>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-gray-100"></span>
              <DialogDescription className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                Personalised Pilgrimage
              </DialogDescription>
              <span className="h-px w-6 bg-gray-100"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div className="space-y-4">
              <div className="relative group">
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name *"
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-xl px-5 text-sm focus:bg-white focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all duration-300 outline-none placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="relative group">
                <Input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-xl px-5 text-sm focus:bg-white focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all duration-300 outline-none placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="relative group">
                <Input 
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number *"
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-xl px-5 text-sm focus:bg-white focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all duration-300 outline-none placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#FF6B00] to-[#E87B2C] text-white font-bold h-13 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/25 active:scale-[0.98] transition-all duration-300 text-[13px] tracking-wide w-full shadow-md"
              >
                {loading ? "Connecting..." : "Connect with an Expert"}
              </button>
              
              <a 
                href="https://wa.me/91XXXXXXXXXX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border-2 border-[#25D366] text-[#25D366] font-bold h-13 rounded-xl flex items-center justify-center hover:bg-[#25D366] hover:text-white active:scale-[0.98] transition-all duration-300 text-[13px] tracking-wide w-full group"
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="transition-transform group-hover:scale-110">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </span>
              </a>
            </div>

            <p className="text-[10px] text-gray-400 text-center font-medium mt-4">
              By submitting, you agree to be contacted via call or WhatsApp.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnquireNowModal;
