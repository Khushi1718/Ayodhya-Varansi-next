import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const packages = await db.collection("custom_packages").find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch custom packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPackage = { ...body, id: uuidv4(), createdAt: new Date().toISOString(), status: "pending" };
    const db = await getDb();
    await db.collection("custom_packages").insertOne(newPackage);
    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create custom package" }, { status: 500 });
  }
}

