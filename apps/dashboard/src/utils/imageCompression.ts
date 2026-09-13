/**
 * Client-Side Smart Image Compressor for Bina Project Dashboard
 * Automatically resizes & compresses high-resolution smartphone / DSLR photos before upload.
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

export async function compressImageClientSide(
  file: File,
  maxWidth = 1920,
  quality = 0.85
): Promise<CompressionResult> {
  const originalSize = file.size;

  // If not an image or already under 1.2MB, keep as is
  if (!file.type.startsWith('image/') || file.size <= 1.2 * 1024 * 1024) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
    };
  }

  // SVG images should never be compressed via canvas
  if (file.type === 'image/svg+xml') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Scale proportionally if larger than maxWidth
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            wasCompressed: false,
          });
          return;
        }

        // Draw and compress to WebP (or JPEG fallback)
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= originalSize) {
              // If compression didn't reduce size, keep original
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                wasCompressed: false,
              });
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: blob.size,
              wasCompressed: true,
            });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          wasCompressed: false,
        });
      };
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        wasCompressed: false,
      });
    };
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
