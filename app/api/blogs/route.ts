import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";

const DEFAULT_THUMBNAIL = "https://via.placeholder.com/500x300?text=Divine+Journeys";
const DEFAULT_COVER = "https://via.placeholder.com/1200x600?text=Divine+Journeys";

function isValidImageValue(value: unknown) {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("data:image/")) return true;
  if (v.startsWith("http://") || v.startsWith("https://")) return true;
  if (v.startsWith("/")) return true;
  return false;
}

export async function GET() {
  try {
    const db = await getDb();
    const blogs = await db.collection("blogs").find({ status: "published" }).toArray();
    const blogCards = blogs.map((blog) => ({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle,
      preview: blog.preview,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      thumbnailImage: isValidImageValue(blog.thumbnailImage) ? blog.thumbnailImage : DEFAULT_THUMBNAIL,
      status: blog.status || "published",
    }));
    return NextResponse.json({ success: true, data: blogCards, count: blogCards.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, preview, category, author, authorRole = "Travel Expert", date, readTime = "5 min read", thumbnailImage, coverImage, content, tags = [], quotes = [], additionalImages = [], status = "published" } = body;

    if (!title || !subtitle || !author || !date) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const safeThumbnail = isValidImageValue(thumbnailImage)
      ? thumbnailImage
      : isValidImageValue(coverImage)
        ? coverImage
        : DEFAULT_THUMBNAIL;
    const safeCover = isValidImageValue(coverImage)
      ? coverImage
      : isValidImageValue(thumbnailImage)
        ? thumbnailImage
        : DEFAULT_COVER;

    const newBlog = {
      id: uuidv4(),
      slug,
      title,
      subtitle,
      preview: preview || subtitle,
      category: category || "Travel",
      author,
      authorRole,
      date,
      readTime,
      thumbnailImage: safeThumbnail,
      coverImage: safeCover,
      content: content || "",
      tags,
      quotes,
      additionalImages,
      status,
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    await db.collection("blogs").insertOne(newBlog);

    return NextResponse.json({ success: true, message: "Blog created successfully", data: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create blog" }, { status: 500 });
  }
}
