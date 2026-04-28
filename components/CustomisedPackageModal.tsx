"use client";
import { useState } from "react";
import { DialogDescription } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomisedPackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '') + '/api';

const CustomisedPackageModal = ({ open, onOpenChange }: CustomisedPackageModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await fetch(`${BACKEND_URL}/custom-packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: "", phone: "", message: "" });
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
      <DialogContent className="w-[92%] sm:max-w-[400px] p-6 md:p-8 border-none bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden">
        <div className="text-center mb-6">
          <DialogTitle className="font-heading text-2xl md:text-3xl text-gray-900 mb-2 font-bold tracking-tight">
            Tailor Your Experience
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-[13px] font-medium leading-relaxed px-2">
            Share your preferences and we'll craft a bespoke itinerary for you.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="custom-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
              Full Name
            </Label>
            <Input 
              id="custom-name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Your Name" 
              className="h-11 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 rounded-xl px-4 text-sm transition-all outline-none" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="custom-phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
              Phone Number
            </Label>
            <Input 
              id="custom-phone" 
              name="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={handleInputChange} 
              placeholder="+91 XXXXX XXXXX" 
              className="h-11 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 rounded-xl px-4 text-sm transition-all outline-none" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="custom-message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
              Your Requirements
            </Label>
            <Textarea 
              id="custom-message" 
              name="message" 
              value={formData.message} 
              onChange={handleInputChange} 
              placeholder="Tell us about your dream journey..." 
              className="min-h-[100px] bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 resize-none transition-all outline-none" 
              required 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[hsl(var(--primary))] text-white font-bold h-12 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all text-sm shadow-lg shadow-[hsl(var(--primary))]/20 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomisedPackageModal;
