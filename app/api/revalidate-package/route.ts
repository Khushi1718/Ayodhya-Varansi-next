import { NextRequest, NextResponse } from 'next/server';

// This endpoint is called by the backend when a package is updated
// It will revalidate the package page in Next.js ISR cache

export async function POST(request: NextRequest) {
  try {
    const { slug, secret } = await request.json();

    // Verify the secret token (should be set in env)
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'slug is required' },
        { status: 400 }
      );
    }

    // Revalidate both the package page and the API route
    await Promise.all([
      revalidatePath(`/packages/${slug}`),
      revalidatePath(`/api/packages/${slug}`),
    ]);

    console.log(`✅ Revalidated package: ${slug}`);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      slug,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

// Helper function to revalidate paths
async function revalidatePath(path: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    if (!baseUrl) return;
    const response = await fetch(`${baseUrl}/api/revalidate?path=${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    console.log(`Revalidate ${path}:`, response.status);
  } catch (error) {
    console.error(`Error revalidating ${path}:`, error);
  }
}
