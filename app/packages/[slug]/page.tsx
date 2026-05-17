import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import PackageDetails from "./PackageDetails";

// DUMMY DATA FOR TEMPLATE MERGING (matches client component)
const dummyPackage = {
  title: "Divine Ayodhya & Kashi Pilgrimage",
  destination: "Ayodhya & Varanasi",
  duration: "5 Days / 4 Nights",
  rating: 4.9,
  reviews: 128,
  price: "₹18,500",
  originalPrice: "₹24,000",
  savings: "₹5,500",
  about: "Embark on a deeply moving spiritual journey through two of India's most sacred cities. This curated experience takes you from the birthplace of Lord Rama in Ayodhya to the eternal ghats of Varanasi. Witness the spectacular Ganga Aarti, enjoy VIP darshan at key temples, and find peace with expert local guides who understand the true essence of these holy sites.",
  highlights: [
    "VIP Darshan at Ram Mandir, Ayodhya",
    "Private boat ride during the mesmerizing Ganga Aarti",
    "Exclusive Kashi Vishwanath Temple corridor tour",
    "Premium Heritage Hotel stays",
    "Chauffeur-driven AC vehicle for all transfers"
  ],
  itinerary: [
    {
      day: "Day 1",
      title: "Arrival in Ayodhya & Evening Aarti",
      desc: "Upon arrival in Ayodhya, our representative will greet you and transfer you to your premium hotel. In the evening, witness the divine Saryu River Aarti, a deeply peaceful experience to begin your pilgrimage."
    },
    {
      day: "Day 2",
      title: "Ram Mandir Darshan & Travel to Varanasi",
      desc: "Early morning VIP access to the grand Ram Mandir. After breakfast, we drive to Varanasi (approx 4 hours). Check into your heritage property by the ghats."
    },
    {
      day: "Day 3",
      title: "Subah-e-Banaras & Temple Trails",
      desc: "Start before dawn with a boat ride on the Ganges. Visit Kashi Vishwanath, Annapurna Temple, and Kaal Bhairav. Evening is reserved for the world-famous Ganga Aarti at Dashashwamedh Ghat."
    },
    {
      day: "Day 4",
      title: "Sarnath Excursion",
      desc: "A short drive to Sarnath, where Lord Buddha gave his first sermon. Explore the ancient ruins, Dhamek Stupa, and the museum. Return to Varanasi for leisure time or silk shopping."
    },
    {
      day: "Day 5",
      title: "Departure",
      desc: "After a final morning walk along the peaceful ghats and breakfast, transfer to Varanasi Airport/Railway Station with divine memories."
    }
  ],
  included: [
    "4 Nights premium accommodation",
    "Daily buffet breakfast",
    "Private AC vehicle for all transfers and sightseeing",
    "Expert English/Hindi speaking local guide",
    "VIP Darshan arrangements",
    "Private boat ride in Varanasi"
  ],
  excluded: [
    "Flight / Train tickets",
    "Lunch and Dinner",
    "Personal expenses",
    "Camera fees at monuments"
  ],
  faq: [
    {
      q: "Is the VIP Darshan guaranteed?",
      a: "Yes, our team pre-arranges the VIP access passes to ensure you have a smooth and uncrowded darshan experience."
    },
    {
      q: "Are the hotels wheelchair accessible?",
      a: "We handpick premium properties. If you have specific accessibility needs, please let us know so we can ensure the perfect room assignment."
    },
    {
      q: "What is the best time to book this package?",
      a: "Varanasi and Ayodhya are beautiful year-round, but October to March offers the most pleasant weather for exploring."
    }
  ],
  reviewStats: {
    average: 4.8,
    total: 128,
    distribution: [
      { stars: 5, percentage: 78 },
      { stars: 4, percentage: 22 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 }
    ]
  },
  testimonials: [
    {
      name: "Aaryan Dwivedi",
      location: "India",
      rating: 5,
      text: "Five days across Mathura, Vrindavan, Ayodhya, and Kashi felt spiritually powerful. The journey moved smoothly from Krishna's birthplace to Lord Ram's Ayodhya.",
      avatar: "A"
    },
    {
      name: "Gayathri Subramaniam",
      location: "India",
      rating: 5,
      text: "The itinerary balanced temple visits and rest thoughtfully. Early darshan in Vrindavan and the evening Ganga Aarti in Kashi were highlights of our tour.",
      avatar: "G"
    },
    {
      name: "Rahul Sharma",
      location: "Delhi",
      rating: 5,
      text: "Excellent arrangements. The VIP darshan at Ram Mandir was seamless and the hotel choices were truly premium. Highly recommended for families.",
      avatar: "R"
    }
  ]
};

async function getPackage(slug: string) {
  if (slug === "template") return dummyPackage;

  try {
    const db = await getDb();
    const query: { $or: Array<Record<string, unknown>> } = { $or: [{ id: slug }, { slug }] };
    if (/^[0-9a-fA-F]{24}$/.test(slug)) query.$or.push({ _id: new ObjectId(slug) });

    const pkg = await db.collection("packages").findOne(query);
    if (!pkg) return null;

    // Merge with dummy data for complete structure
    return {
      ...dummyPackage,
      ...pkg,
      _id: pkg._id ? pkg._id.toString() : null,
      highlights: pkg.highlights || dummyPackage.highlights,
      itinerary: pkg.itinerary || dummyPackage.itinerary,
      included: pkg.inclusions || pkg.included || dummyPackage.included,
      excluded: pkg.exclusions || pkg.excluded || dummyPackage.excluded,
      faq: pkg.faqs || pkg.faq || dummyPackage.faq,
    };
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) return { title: "Package Not Found" };

  const title = `${pkg.title} | Divine Journeys`;
  
  // Strict SOP formula: [Price] · [Rating] · WhatsApp · 2 City Names
  const numericPrice = pkg.price ? pkg.price.replace(/[^\d]/g, "") : "0";
  const whatsapp = "+91-7302265809"; // From SOP Image 2
  const description = `₹${numericPrice} · ${pkg.rating}★ · WhatsApp: ${whatsapp} · Explore ${pkg.destination}. ${pkg.about.substring(0, 60)}...`;

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 155),
    openGraph: {
      title,
      description,
      url: `https://ayodhyavaranasitourism.com/packages/${slug}`,
      type: "website",
      siteName: "Experience My India",
      locale: "en_IN",
      images: [
        {
          url: "https://ayodhyavaranasitourism.com/og-image.jpg", // Placeholder
          width: 1600,
          height: 900,
          alt: pkg.title,
        },
      ],
    },
    alternates: {
      canonical: `https://ayodhyavaranasitourism.com/packages/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) notFound();

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "name": `${pkg.duration} ${pkg.destination} Tour Package`,
        "description": pkg.about.substring(0, 150),
        "inLanguage": "en",
        "touristType": ["Pilgrims", "Families", "Senior Citizens"],
        "provider": {
          "@type": "TravelAgency",
          "name": "Experience My India",
          "url": "https://ayodhyavaranasitourism.com",
          "telephone": "+91-7302265809"
        }
      },
      {
        "@type": "Product",
        "name": `${pkg.duration} ${pkg.destination} Tour Package`,
        "description": pkg.about.substring(0, 150),
        "brand": {
          "@type": "Brand",
          "name": "Experience My India"
        },
        "offers": {
          "@type": "Offer",
          "price": pkg.price ? pkg.price.replace(/[^\d]/g, "") : "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "priceValidUntil": "2026-12-31",
          "url": `https://ayodhyavaranasitourism.com/packages/${slug}`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": pkg.rating || "4.9",
          "reviewCount": pkg.reviews || "128",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": pkg.testimonials.slice(0, 3).map((t: any) => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": t.rating
          },
          "author": {
            "@type": "Person",
            "name": t.name
          },
          "reviewBody": t.text
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": pkg.faq.map((f: any) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      },
      {
        "@type": "LocalBusiness",
        "name": "Experience My India",
        "url": "https://ayodhyavaranasitourism.com",
        "telephone": "+91-7302265809",
        "priceRange": "₹₹",
        "image": "https://ayodhyavaranasitourism.com/logo.webp",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Mathura Vrindavan Road",
          "addressLocality": "Mathura",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "281001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "27.4924",
          "longitude": "77.6737"
        },
        "openingHours": "Mo-Su 00:00-23:59",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-7302265809",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "Organization",
        "name": "Experience My India",
        "url": "https://ayodhyavaranasitourism.com",
        "logo": "https://ayodhyavaranasitourism.com/logo.webp",
        "sameAs": [
          "https://www.instagram.com/experiencemyindia",
          "https://www.youtube.com/channel/experiencemyindia",
          "https://www.facebook.com/experiencemyindia"
        ],
        "knowsAbout": [
          "Ayodhya Ram Mandir VIP Darshan",
          "Kashi Vishwanath Temple Tours",
          "Varanasi Ganga Aarti Boat Rides",
          "Mathura Vrindavan Pilgrimage",
          "Prayagraj Kumbh Mela Packages",
          "Heritage Tours of Uttar Pradesh",
          "Spiritual Tourism in India"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://ayodhyavaranasitourism.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tour Packages",
            "item": "https://ayodhyavaranasitourism.com/packages"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": pkg.title
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── HEADER TITLE (SERVER RENDERED FOR STATIC HTML) ── */}
      <section className="pt-24 md:pt-28 pb-4 px-6 bg-white border-b border-gray-50">
        <div className="container mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-widest">
             <Link href="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
             <span>/</span>
             <Link href="/packages" className="hover:text-[hsl(var(--primary))] transition-colors">Tour Packages</Link>
             <span>/</span>
             <span className="text-gray-900 truncate max-w-[150px] sm:max-w-none">{pkg.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight max-w-4xl">
              {pkg.title}
            </h1>
          </div>
        </div>
      </section>

      <PackageDetails initialPkg={pkg} />
    </>
  );
}
