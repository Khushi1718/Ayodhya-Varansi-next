import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const enquiries = await db.collection("enquiries").find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEnquiry = { ...body, id: uuidv4(), createdAt: new Date().toISOString(), status: "pending" };
    const db = await getDb();
    await db.collection("enquiries").insertOne(newEnquiry);
    return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create enquiry" }, { status: 500 });
  }
}

