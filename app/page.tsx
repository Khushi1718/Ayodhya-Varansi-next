import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Divine Journeys | Ayodhya & Varanasi Pilgrimage Tours",
  description: "Experience the soul of India with curated spiritual journeys to Ayodhya, Varanasi, and Prayagraj. VIP Darshan, expert guides, and luxury stays.",
  keywords: ["Ayodhya Tourism", "Varanasi Tour Packages", "Kashi Vishwanath Darshan", "Ram Mandir Ayodhya", "Spiritual Tours India"],
  openGraph: {
    title: "Divine Journeys | Ayodhya & Varanasi Pilgrimage Tours",
    description: "Experience the soul of India with curated spiritual journeys to Ayodhya and Varanasi.",
    type: "website",
  },
};

// Dynamically import sections below the fold — SSR optional, lazy on client
const PackagesSection = dynamic(() => import("@/components/PackagesSection"), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center bg-muted/20 animate-pulse" />,
});
const InfoBannerStrip = dynamic(() => import("@/components/InfoBannerStrip"), {
  loading: () => <div className="min-h-[400px] bg-muted/10 animate-pulse" />,
});
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  loading: () => <div className="min-h-[300px] bg-muted/10 animate-pulse" />,
});
const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  loading: () => <div className="min-h-[400px] bg-muted/10 animate-pulse" />,
});
const CustomisedPackageSection = dynamic(() => import("@/components/CustomisedPackageSection"), {
  loading: () => <div className="min-h-[400px] bg-muted/10 animate-pulse" />,
});
const SpecialOffersSection = dynamic(() => import("@/components/SpecialOffersSection"), {
  loading: () => <div className="min-h-[400px] bg-muted/10 animate-pulse" />,
});
const OfferBanner = dynamic(() => import("@/components/OfferBanner"), {
  loading: () => <div className="min-h-[200px] bg-muted/10 animate-pulse" />,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <PackagesSection />
      <InfoBannerStrip />
      <TestimonialsSection />
      <AboutSection />
      <SpecialOffersSection className="pt-12 md:pt-16" />
      <OfferBanner />
      <CustomisedPackageSection />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
