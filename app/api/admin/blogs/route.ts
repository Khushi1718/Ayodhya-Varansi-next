import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const blogs = await db.collection("blogs").find().toArray();
    return NextResponse.json({ success: true, data: blogs, count: blogs.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch admin blogs" }, { status: 500 });
  }
}

