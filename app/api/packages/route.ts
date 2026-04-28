import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const packages = await db.collection("packages").find({
      $or: [{ status: "published" }, { status: { $exists: false } }],
    }).toArray();
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const pkgData = await request.json();
    const slug = pkgData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newPackage = {
      ...pkgData,
      id: uuidv4(),
      slug,
      status: pkgData.status || "published",
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    await db.collection("packages").insertOne(newPackage);
    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create package" }, { status: 500 });
  }
}

