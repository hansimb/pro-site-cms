function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Images must be 4 MB or smaller.");
  }
}

export function createSafeUploadFileName(originalName: string) {
  const dotIndex = originalName.lastIndexOf(".");
  const extension = dotIndex > -1 ? originalName.slice(dotIndex + 1).toLowerCase() : "bin";
  const baseName = dotIndex > -1 ? originalName.slice(0, dotIndex) : originalName;
  const safeBaseName = slugifySegment(baseName) || "upload";
  const safeExtension = slugifySegment(extension) || "bin";

  return `${safeBaseName}-${Date.now()}.${safeExtension}`;
}
