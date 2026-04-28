import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const blogsCount = await db.collection("blogs").countDocuments();
    return NextResponse.json({
      success: true,
      message: "API is running",
      database: "connected",
      blogsCount,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

