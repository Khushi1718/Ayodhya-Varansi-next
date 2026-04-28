import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection("custom_packages").deleteOne({ id });
    return NextResponse.json({ success: true, message: "Custom package deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to delete custom package" }, { status: 500 });
  }
}

