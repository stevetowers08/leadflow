/**
 * Image Compression Utilities
 * Optimizes images for mobile uploads and API processing
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

/**
 * Compress image to reduce file size for API uploads
 * Optimized for mobile bandwidth and API limits
 */
export async function compressImage(
  imageData: string | File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.92,
    mimeType = 'image/jpeg',
  } = options;

  // Convert input to blob if needed
  let blob: Blob;
  if (imageData instanceof File || imageData instanceof Blob) {
    blob = imageData;
  } else if (typeof imageData === 'string') {
    if (imageData.startsWith('data:')) {
      const response = await fetch(imageData);
      blob = await response.blob();
    } else {
      throw new Error('Invalid image format');
    }
  } else {
    throw new Error('Invalid image input type');
  }

  // Create image element to get dimensions
  const img = new Image();
  const imageUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(imageUrl);

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
      }

      // Create canvas and compress
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Convert image to base64 string for API submission
 */
export async function imageToBase64(
  imageData: string | File | Blob
): Promise<string> {
  if (typeof imageData === 'string' && imageData.startsWith('data:')) {
    return imageData;
  }

  let blob: Blob;
  if (imageData instanceof File || imageData instanceof Blob) {
    blob = imageData;
  } else {
    const response = await fetch(imageData);
    blob = await response.blob();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Extract base64 data from data URL (remove data:image/jpeg;base64, prefix)
 */
export function extractBase64Data(dataUrl: string): string {
  const base64Match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  return base64Match ? base64Match[1] : dataUrl;
}

