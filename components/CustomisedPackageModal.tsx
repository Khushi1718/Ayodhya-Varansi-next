"use client";
import { useState } from "react";
import { DialogDescription } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface CustomisedPackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE = "/api";

const CustomisedPackageModal = ({ open, onOpenChange }: CustomisedPackageModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/custom-packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: "", email: "", phone: "", message: "" });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error submitting custom package request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseButton className="p-0 border-none bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden max-w-[92%] sm:max-w-[420px] shadow-[0_25px_50px_-12px_rgba(38,38,38,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--gold))] to-[hsl(var(--primary))]"></div>

        <div className="relative p-7 sm:p-9 pt-10">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-50/80 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-300 z-10"
          >
            <X size={16} />
          </button>

          <div className="mb-8 text-center">
            <DialogTitle className="text-gray-900 text-2xl md:text-3xl font-heading font-bold mb-2 tracking-tight">
              Customised Package
            </DialogTitle>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-gray-100"></span>
              <DialogDescription className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                Your Journey, Your Way
              </DialogDescription>
              <span className="h-px w-6 bg-gray-100"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div className="relative group">
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Full Name *" 
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-xl px-5 text-sm focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))]/5 transition-all duration-300 outline-none placeholder:text-gray-400" 
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
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-xl px-5 text-sm focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))]/5 transition-all duration-300 outline-none placeholder:text-gray-400" 
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
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-xl px-5 text-sm focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))]/5 transition-all duration-300 outline-none placeholder:text-gray-400" 
                  required 
                />
              </div>

              <div className="relative group">
                <Textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Your Requirements (e.g. destinations, preferences) *" 
                  className="min-h-[110px] bg-gray-50/50 border-gray-100 rounded-xl px-5 py-4 text-sm placeholder:text-gray-400 resize-none transition-all duration-300 outline-none focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))]/5" 
                  required 
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--gold))] text-white font-bold h-13 py-3.5 rounded-xl hover:shadow-lg hover:shadow-[hsl(var(--primary))]/25 active:scale-[0.98] transition-all duration-300 text-[13px] tracking-wide shadow-md disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomisedPackageModal;
