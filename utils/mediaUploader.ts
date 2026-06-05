/**
 * Uploads an image file to the server-side Cloudinary endpoint.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/pirateCOS/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to upload image to Cloudinary.");
  }

  const data = await response.json();
  if (!data.success || !data.url) {
    throw new Error(data.error || "Failed to upload image to Cloudinary.");
  }

  return data.url;
}
