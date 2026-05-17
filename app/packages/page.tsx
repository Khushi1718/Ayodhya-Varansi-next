import { Metadata } from "next";
import { getDb } from "@/lib/db";
import PackagesContent from "./PackagesContent";
import Link from "next/link";
import Image from "next/image";



async function getPackages() {
  try {
    const db = await getDb();
    const data = await db.collection("packages").find({ $or: [{ status: "published" }, { status: { $exists: false } }] }).sort({ createdAt: -1 }).toArray();
    
    const dynamicPackages = data.map((pkg: any) => ({
      ...pkg,
      _id: pkg._id ? pkg._id.toString() : null,
      image: pkg.images?.main || pkg.image || "",
      title: pkg.title,
      destination: pkg.destination,
      duration: pkg.duration,
      durationCategory: pkg.durationCategory,
      cardKeyPoints: Array.isArray(pkg.cardKeyPoints) ? pkg.cardKeyPoints : [],
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
      rating: pkg.rating || 5.0,
      slug: pkg.slug || pkg.id
    }));
    
    return dynamicPackages;
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Tour Packages | Ayodhya, Varanasi & Kashi Pilgrimage Tours",
  description: "Explore expertly curated tour packages for Ayodhya, Varanasi, and Kashi. Book VIP darshan, heritage stays, and spiritual journeys with Experience My India.",
  keywords: ["Ayodhya tour packages", "Varanasi spiritual tours", "Kashi Vishwanath darshan", "Ram Mandir tour", "Ganga Aarti tour", "Experience My India"],
  openGraph: {
    title: "Divine Tour Packages | Experience My India",
    description: "Curated spiritual journeys across India's most sacred cities.",
    url: "https://ayodhyavaranasitourism.com/packages",
    type: "website",
    siteName: "Experience My India",
    locale: "en_IN",
    images: [{ url: "https://ayodhyavaranasitourism.com/og-packages.jpg", width: 1600, height: 900 }],
  },
  alternates: {
    canonical: "https://ayodhyavaranasitourism.com/packages",
  },
};

export default async function Page() {
  const packages = await getPackages();

  // ItemList Schema (CollectionPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Divine Tour Packages",
    "description": "Expertly curated spiritual tour packages for Ayodhya and Varanasi.",
    "numberOfItems": packages.length,
    "itemListElement": packages.map((pkg, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://ayodhyavaranasitourism.com/packages/${pkg.slug}`,
      "name": pkg.title
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── SERVER RENDERED SEO SECTION (AEO & GEO OPTIMISED) ── */}
      <section className="bg-white border-b border-gray-100 py-3 px-6 mt-20">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Tour Packages</span>
          </div>
        </div>
      </section>

      <section className="relative pt-12 pb-10 px-6 bg-[hsl(var(--cream))] border-b border-border/20">
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
            Ayodhya, Varanasi & Kashi <span className="text-primary italic">Tour Packages</span>
          </h1>
          <p className="mt-6 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the soul of India with our professionally curated pilgrimage tours. From VIP darshan at the grand <strong>Ram Mandir in Ayodhya</strong> to the mesmerising <strong>Ganga Aarti in Varanasi</strong>, every journey is a blend of divinity and comfort.
          </p>
          <p className="mt-3 text-[10px] md:text-xs text-muted-foreground font-bold tracking-[0.3em] uppercase">
            Experience My India - Rated 4.9/5 by 8,000+ Pilgrims
          </p>
        </div>
      </section>

      <PackagesContent initialPackages={packages} />
    </>
  );
}
