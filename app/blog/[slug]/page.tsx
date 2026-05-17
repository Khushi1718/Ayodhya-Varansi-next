import { Metadata } from "next";
import { getDb } from "@/lib/db";
import BlogDetailContent from "./BlogDetailContent";
import { notFound } from "next/navigation";

async function getBlog(slug: string) {
  try {
    const db = await getDb();
    const blog = await db.collection("blogs").findOne({ slug }, { projection: { _id: 0 } });
    return blog;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

async function getRelatedBlogs(slug: string) {
  try {
    const db = await getDb();
    const related = await db.collection("blogs").aggregate([
      { $match: { slug: { $ne: slug } } },
      { $sample: { size: 4 } },
      { $project: { _id: 0 } }
    ]).toArray();
    return related;
  } catch (error) {
    console.error("Failed to fetch related blogs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return { title: "Blog Not Found" };

  // SOP: Max 60 chars for title, Max 155 for description
  const seoTitle = blog.seoTitle || `${blog.title.slice(0, 50)} | Experience My India`;
  const seoDesc = blog.seoDescription || `${blog.content.replace(/<[^>]*>/g, "").slice(0, 150)}...`;

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://ayodhyavaranasitourism.com/blog/${slug}`,
      siteName: "Experience My India",
      images: [{ url: blog.coverImage, width: 1200, height: 630 }],
      locale: "en_IN",
      type: "article",
    },
    alternates: {
      canonical: `https://ayodhyavaranasitourism.com/blog/${slug}`,
    },
    robots: "index, follow",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(slug);

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": blog.coverImage,
    "author": {
      "@type": "Person",
      "name": blog.author || "Gurudutt",
      "jobTitle": "Founder",
      "worksFor": {
        "@type": "Organization",
        "name": "Experience My India"
      },
      "description": "Born and raised in Braj Bhoomi. Guiding pilgrims through Mathura Vrindavan since 2014. Founder of Experience My India."
    },
    "publisher": {
      "@type": "Organization",
      "name": "Experience My India",
      "url": "https://ayodhyavaranasitourism.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ayodhyavaranasitourism.com/logo.webp",
        "width": 200,
        "height": 60
      }
    },
    "datePublished": blog.date || new Date().toISOString(),
    "dateModified": blog.updatedAt || blog.date || new Date().toISOString(),
    "description": blog.seoDescription || blog.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ayodhyavaranasitourism.com/blog/${slug}`
    }
  };

  // FAQ Schema (if blog has FAQs)
  const faqSchema = blog.faqs && blog.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Blog",
        "item": "https://ayodhyavaranasitourism.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://ayodhyavaranasitourism.com/blog/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogDetailContent blog={blog} relatedBlogs={relatedBlogs} />
    </>
  );
}
