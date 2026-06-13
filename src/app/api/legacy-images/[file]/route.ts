import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const LEGACY_IMAGE_DIR = path.join(process.cwd(), "Sureno", "static", "uploads");

function getContentType(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".png":
    default:
      return "image/png";
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  const imagePath = path.join(LEGACY_IMAGE_DIR, path.basename(file));

  try {
    const buffer = await fs.readFile(imagePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": getContentType(file),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
