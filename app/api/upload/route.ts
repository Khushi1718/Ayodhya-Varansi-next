import { NextResponse } from "next/server";
import { createHash } from "crypto";

const UPLOAD_FOLDER = "divine-journeys-cms";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary config missing:", { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
    throw new Error("Missing Cloudinary environment variables.");
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const sortedKeys = Object.keys(params).sort();
  const signaturePayload = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = `${signaturePayload}${apiSecret}`;
  const signature = createHash("sha1").update(stringToSign).digest("hex");
  
  // Log the string to sign (without secret) for debugging purposes
  console.log("Cloudinary Upload - String to sign (payload only):", signaturePayload);
  
  return signature;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || UPLOAD_FOLDER).trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Cloudinary signed upload parameters
    const paramsToSign: Record<string, string> = {
      folder: folder,
      timestamp: timestamp,
    };

    const signature = createSignature(paramsToSign, apiSecret);

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", timestamp);
    uploadForm.append("folder", folder);
    uploadForm.append("signature", signature);

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadForm,
    });

    const uploadResult = await uploadResponse.json().catch(() => ({}));

    if (!uploadResponse.ok) {
      console.error("Cloudinary Error Response:", uploadResult);
      const message = uploadResult?.error?.message || "Cloudinary upload failed";
      return NextResponse.json({ success: false, error: message }, { status: uploadResponse.status });
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (error) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}