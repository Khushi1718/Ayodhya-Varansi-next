"use client";

import { MessageCircle } from "lucide-react";
import { useModal } from "@/lib/ModalContext";

const FloatingEnquiryButton = () => {
  const { openEnquiry } = useModal();
  
  return (
    <button
      onClick={openEnquiry}
      style={{ right: 'auto', left: '1.5rem' }}
      className="fixed bottom-6 z-[100] w-14 h-14 rounded-full bg-[hsl(var(--primary))] text-white shadow-[0_8px_30px_rgba(232,123,44,0.3)] hover:shadow-[0_12px_40px_rgba(232,123,44,0.4)] hover:scale-105 transition-all duration-200 flex items-center justify-center"
      aria-label="Open enquiry form"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default FloatingEnquiryButton;
