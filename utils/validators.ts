export const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function isValidImageType(type: string | null) {
  return type ? allowedImageTypes.includes(type) : false;
}

export function getImageExtension(mimeType: string) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}
