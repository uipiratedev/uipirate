/**
 * Compresses an image file on the client side using Canvas.
 * Resizes the image to fit within maxWidth/maxHeight and encodes it as a compressed JPEG.
 * Returns a promise resolving to a compressed JPEG data URL string.
 */
export const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("File is not an image."));
    }

    // Limit maximum accepted file size to 5MB
    const maxLimit = 5 * 1024 * 1024;
    if (file.size > maxLimit) {
      return reject(new Error("Image size exceeds the maximum limit of 5MB."));
    }

    // For small images (<200KB), resolve directly with original DataURL
    // to preserve pixel perfection, transparency, and GIF animations.
    if (file.size <= 200 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;

        // Calculate aspect ratio scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback to original read if canvas context cannot be initialized
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        
        // Convert canvas image to compressed JPEG format
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      image.onerror = (err) => reject(err);
      image.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
