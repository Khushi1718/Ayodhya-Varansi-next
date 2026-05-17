import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb, ensureIndexes } from "@/lib/db";

const DEFAULT_THUMBNAIL = "https://res.cloudinary.com/dl5asi233/image/upload/v1/divine-journeys-cms/placeholder.jpg";
const DEFAULT_COVER = "https://res.cloudinary.com/dl5asi233/image/upload/v1/divine-journeys-cms/cover-placeholder.jpg";

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
  await ensureIndexes();
  try {
    const db = await getDb();
    const blogs = await db
      .collection("blogs")
      .find({ status: "published" }, {
        projection: {
          _id: 0,
          id: 1,
          slug: 1,
          title: 1,
          subtitle: 1,
          preview: 1,
          tldr: 1,
          category: 1,
          region: 1,
          author: 1,
          date: 1,
          readTime: 1,
          thumbnailImage: 1,
          status: 1,
        }
      })
      .sort({ date: -1 })
      .toArray();

    const blogCards = blogs.map((blog) => ({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle,
      preview: blog.preview || blog.subtitle,
      tldr: blog.tldr,
      category: blog.category,
      region: blog.region,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime,
      thumbnailImage: isValidImageValue(blog.thumbnailImage) ? blog.thumbnailImage : DEFAULT_THUMBNAIL,
      status: blog.status || "published",
    }));

    return NextResponse.json(
      { success: true, data: blogCards, count: blogCards.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, subtitle, tldr, seoTitle, seoDescription, faqs = [],
      recommendations = [],
      category, region, author, authorRole = "Travel Expert", 
      date, readTime = "5 min read", thumbnailImage, coverImage, 
      content, status = "published" 
    } = body;

    if (!title || !subtitle || !author || !date) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const db = await getDb();
    const existing = await db.collection("blogs").findOne({ slug: baseSlug });
    const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

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
      preview: subtitle,
      tldr,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || subtitle,
      faqs,
      recommendations,
      category: category || "Travel",
      region: region || "Braj",
      author,
      authorRole,
      date,
      readTime,
      thumbnailImage: safeThumbnail,
      coverImage: safeCover,
      content: content || "",
      status,
      createdAt: new Date().toISOString(),
    };

    await db.collection("blogs").insertOne(newBlog);

    return NextResponse.json({ success: true, message: "Blog created successfully", data: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create blog" }, { status: 500 });
  }
}
