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

/**
 * Deletes a list of image URLs from Cloudinary by calling the server-side delete endpoint.
 * Supports an optional keepalive parameter for unload/exit cleanup.
 */
export async function deleteImagesFromCloudinary(urls: string[], keepalive = false): Promise<void> {
  if (!urls || urls.length === 0) return;

  try {
    const response = await fetch("/api/pirateCOS/media/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
      keepalive,
    });
    if (!response.ok) {
      console.error("Failed to request image deletion from server:", response.statusText);
    }
  } catch (error) {
    console.error("Error calling media delete endpoint:", error);
  }
}

/**
 * Extracts all image src URLs from an HTML string.
 */
export function extractImageUrlsFromHtml(html: string): string[] {
  if (!html) return [];
  const urls: string[] = [];
  const regex = /<img[^>]+src=["']([^"'>]+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}
