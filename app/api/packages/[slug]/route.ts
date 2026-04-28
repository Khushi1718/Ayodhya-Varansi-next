import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const query: { $or: Array<Record<string, unknown>> } = { $or: [{ id: slug }, { slug }] };
    if (/^[0-9a-fA-F]{24}$/.test(slug)) query.$or.push({ _id: new ObjectId(slug) });

    const db = await getDb();
    const pkg = await db.collection("packages").findOne(query);
    if (!pkg) return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: pkg });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch package" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = await getDb();
    const query: { $or: Array<Record<string, unknown>> } = { $or: [{ id: slug }] };
    if (/^[0-9a-fA-F]{24}$/.test(slug)) query.$or.push({ _id: new ObjectId(slug) });

    const existing = await db.collection("packages").findOne(query);
    if (!existing) return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });

    const body = await request.json();
    const { _id, createdAt, ...updateData } = body;
    const updated = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
    delete (updated as Record<string, unknown>)._id;

    const updateQuery = existing.id ? { id: existing.id } : { _id: existing._id };
    await db.collection("packages").updateOne(updateQuery, { $set: updated });

    return NextResponse.json({ success: true, data: updated, message: "Package updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const query: { $or: Array<Record<string, unknown>> } = { $or: [{ id: slug }] };
    if (/^[0-9a-fA-F]{24}$/.test(slug)) query.$or.push({ _id: new ObjectId(slug) });

    const db = await getDb();
    await db.collection("packages").deleteOne(query);
    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to delete package" }, { status: 500 });
  }
}
