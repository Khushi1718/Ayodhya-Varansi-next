"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BookNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookNowModal = ({ open, onOpenChange }: BookNowModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Book Now Form Submitted:", formData);
    setFormData({ name: "", phone: "", message: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92%] sm:max-w-[400px] p-6 md:p-8 border-none bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden">
        <div className="text-center mb-6">
          <DialogTitle className="font-heading text-2xl md:text-3xl text-gray-900 mb-2 font-bold tracking-tight">
            Book Your Journey
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-[13px] font-medium leading-relaxed px-2">
            Secure your spot on a sacred pilgrimage today.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="book-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
              Full Name
            </Label>
            <Input
              id="book-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="h-11 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 rounded-xl px-4 text-sm transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="book-phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
              Phone Number
            </Label>
            <Input
              id="book-phone"
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
            <Label htmlFor="book-message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
              Preferred Date/Details
            </Label>
            <Textarea
              id="book-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="E.g. Ayodhya trip in December..."
              className="min-h-[100px] bg-gray-50/50 border-gray-100 focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 resize-none transition-all outline-none"
              required
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[hsl(var(--primary))] text-white font-bold h-12 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all text-sm shadow-lg shadow-[hsl(var(--primary))]/20"
            >
              Confirm Interest
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookNowModal;
