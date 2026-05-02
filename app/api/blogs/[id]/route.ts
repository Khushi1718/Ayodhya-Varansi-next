import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const query: { $or: Array<Record<string, unknown>> } = { $or: [{ id }, { slug: id }] };
    if (/^[0-9a-fA-F]{24}$/.test(id)) query.$or.push({ _id: new ObjectId(id) });

    const db = await getDb();
    const blog = await db.collection("blogs").findOne(query, { projection: { _id: 0 } });
    if (!blog) return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });

    const safeBlog = {
      ...blog,
      thumbnailImage: isValidImageValue(blog.thumbnailImage)
        ? blog.thumbnailImage
        : isValidImageValue(blog.coverImage)
          ? blog.coverImage
          : DEFAULT_THUMBNAIL,
      coverImage: isValidImageValue(blog.coverImage)
        ? blog.coverImage
        : isValidImageValue(blog.thumbnailImage)
          ? blog.thumbnailImage
          : DEFAULT_COVER,
    };

    return NextResponse.json(
      { success: true, data: safeBlog },
      {
        headers: {
          // Cache individual blog posts for 5 minutes at CDN, revalidate for up to 30 min
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const existingBlog = await db.collection("blogs").findOne({ id });
    if (!existingBlog) return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });

    const safeThumbnail = isValidImageValue(body.thumbnailImage)
      ? body.thumbnailImage
      : isValidImageValue(body.coverImage)
        ? body.coverImage
        : isValidImageValue(existingBlog.thumbnailImage)
          ? existingBlog.thumbnailImage
          : DEFAULT_THUMBNAIL;
    const safeCover = isValidImageValue(body.coverImage)
      ? body.coverImage
      : isValidImageValue(body.thumbnailImage)
        ? body.thumbnailImage
        : isValidImageValue(existingBlog.coverImage)
          ? existingBlog.coverImage
          : DEFAULT_COVER;

    const updatedBlog = {
      ...existingBlog,
      ...body,
      id,
      thumbnailImage: safeThumbnail,
      coverImage: safeCover,
      updatedAt: new Date().toISOString(),
    };
    await db.collection("blogs").updateOne({ id }, { $set: updatedBlog });
    return NextResponse.json({ success: true, message: "Blog updated successfully", data: updatedBlog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection("blogs").deleteOne({ id });
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to delete blog" }, { status: 500 });
  }
}
