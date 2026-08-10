// src/lib/image-utils.ts
// Cache-busting utility for article images
// Appends a deterministic version parameter based on post.updatedAt

/**
 * Appends a cache-busting version parameter to an image URL.
 * Uses the post's updatedAt timestamp to ensure:
 * - Same article = same URL (stable caching)
 * - Article update = new URL (cache busting)
 * - Build remains stable
 * 
 * @param imageUrl - The original image URL (may already have query params)
 * @param version - ISO timestamp string from post.updatedAt or post.createdAt
 * @returns Versioned image URL or original if no imageUrl provided
 */
export function getVersionedImageUrl(imageUrl: string | null | undefined, version?: string | Date): string | null {
  if (!imageUrl) return null;
  
  // Use provided version or current time as fallback (should not happen in production)
  const versionString = version 
    ? (version instanceof Date ? version.toISOString() : version)
    : new Date().toISOString();
  
  // Extract timestamp portion for shorter URL (YYYYMMDDHHmmss)
  const timestamp = versionString.replace(/[-:T.]/g, '').slice(0, 14);
  
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}v=${timestamp}`;
}

/**
 * Creates a versioned image URL from a Post object.
 * Uses post.updatedAt as the version source.
 * 
 * @param post - Post object with imageUrl and updatedAt fields
 * @returns Versioned image URL or null if no imageUrl
 */
export function getPostImageUrl(post: { imageUrl?: string | null; updatedAt?: Date | string | null; createdAt?: Date | string | null }): string | null {
  if (!post.imageUrl) return null;
  
  // Prefer updatedAt, fallback to createdAt
  const version = post.updatedAt ?? post.createdAt;
  return getVersionedImageUrl(post.imageUrl, version ?? undefined);
}

/**
 * Creates versioned image URLs for OpenGraph metadata.
 * Returns array of versioned URLs (Next.js Metadata expects array).
 * 
 * @param imageUrl - Original image URL
 * @param version - Version timestamp
 * @returns Array with single versioned URL, or empty array
 */
export function getVersionedOgImages(imageUrl: string | null | undefined, version?: string | Date): string[] {
  const versioned = getVersionedImageUrl(imageUrl, version);
  return versioned ? [versioned] : [];
}