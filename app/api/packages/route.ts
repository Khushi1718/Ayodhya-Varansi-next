import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb, ensureIndexes } from "@/lib/db";

export async function GET() {
  await ensureIndexes();
  try {
    const db = await getDb();
    const packages = await db
      .collection("packages")
      .find(
        { $or: [{ status: "published" }, { status: { $exists: false } }] },
        {
          projection: {
            _id: 0,
            id: 1,
            slug: 1,
            title: 1,
            destination: 1,
            duration: 1,
            price: 1,
            originalPrice: 1,
            savings: 1,
            rating: 1,
            reviews: 1,
            thumbnailImage: 1,
            heroImage: 1,
            status: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      { success: true, data: packages },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
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

