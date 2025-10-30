/**
 * useSuspenseImage - Hook to preload and cache images with suspense support
 *
 * How it works:
 * 1. Check if image is in cache
 * 2. If not, create new Image() and start loading
 * 3. Throw promise (React Suspense catches it)
 * 4. When loaded, cache the result
 * 5. Re-render with cached result
 */

/**
 * Shared types for image-node components
 */

export type ImageStatus =
  | { error: true }
  | { error: false; width: number; height: number };

const imageCache = new Map<string, Promise<ImageStatus> | ImageStatus>();

export function useSuspenseImage(src: string): ImageStatus {
  let cached = imageCache.get(src);

  // Already loaded (success or error)
  if (cached && "error" in cached && typeof cached.error === "boolean") {
    return cached;
  }

  // Not in cache, start loading
  if (!cached) {
    cached = new Promise<ImageStatus>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () =>
        resolve({
          error: false,
          height: img.naturalHeight,
          width: img.naturalWidth,
        });
      img.onerror = () => resolve({ error: true });
    }).then((result) => {
      imageCache.set(src, result);
      return result;
    });
    imageCache.set(src, cached);
  }

  // Throw promise for Suspense to catch
  throw cached;
}
