"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  
  // Save to public/uploads
  const path = join(process.cwd(), "public/uploads", filename);
  await writeFile(path, buffer);

  return `/uploads/${filename}`;
}
