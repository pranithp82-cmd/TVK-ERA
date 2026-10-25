/**
 * Image compression utility for TVK ERA.
 * Automatically resizes large mobile camera photos and applies JPEG compression.
 * This keeps images under ~80KB, preventing QuotaExceededError in localStorage,
 * reducing memory consumption, and ensuring flawless performance on mobile devices.
 */
export const compressImage = (file, maxWidth = 900, maxHeight = 900, quality = 0.72) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    // If not an image, resolve null safely
    if (!file.type || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onerror = () => resolve(null);
      reader.onload = (loadEvent) => {
        const img = new Image();
        img.onerror = () => resolve(null);
        img.onload = () => {
          try {
            let { width, height } = img;

            // Scale down if dimensions exceed bounds
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, width);
            canvas.height = Math.max(1, height);

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(loadEvent.target.result);
              return;
            }

            // High-quality canvas image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch (canvasErr) {
            console.warn('[ImageCompressor] Canvas export failed, using fallback:', canvasErr);
            resolve(loadEvent.target.result);
          }
        };
        img.src = loadEvent.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('[ImageCompressor] Error reading file:', err);
      resolve(null);
    }
  });
};
