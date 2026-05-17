import { Metadata } from "next";
import { getDb } from "@/lib/db";
import BlogContent from "./BlogContent";

async function getBlogs() {
  try {
    const db = await getDb();
    const blogs = await db.collection("blogs")
      .find({ status: "published" }, { projection: { _id: 0 } })
      .sort({ date: -1 })
      .toArray();
    return blogs;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "The Journal | Experience My India Spiritual Blog",
  description: "Read the latest spiritual travel guides, temple stories, and pilgrimage tips for Ayodhya, Varanasi, and across India. Expertly curated by local guides.",
  keywords: ["India travel blog", "Ayodhya guide", "Varanasi stories", "spiritual travel tips", "pilgrimage journal"],
  openGraph: {
    title: "The Journal | Experience My India Spiritual Blog",
    description: "Spiritual travel guides and temple stories from across India.",
    url: "https://ayodhyavaranasitourism.com/blog",
    type: "website",
    siteName: "Experience My India",
    locale: "en_IN",
    images: [{ url: "https://ayodhyavaranasitourism.com/og-blog.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://ayodhyavaranasitourism.com/blog",
  },
  robots: "index, follow",
};

export default async function Page() {
  const blogs = await getBlogs();

  return <BlogContent blogs={blogs} />;
}
