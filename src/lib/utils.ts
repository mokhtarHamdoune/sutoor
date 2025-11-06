/**
 * Generates a URL-friendly slug from a string
 * 
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphenated slug with no special characters
 * 
 * @example
 * generateSlug("Hello World") // "hello-world"
 * generateSlug("What's New?") // "whats-new"
 * generateSlug("Hello,  World!") // "hello-world"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")  // Remove special characters
    .trim()                         // Remove edge spaces
    .replace(/\s+/g, "-")          // Replace spaces with dashes
    .replace(/-+/g, "-");          // Replace multiple dashes with single dash
}
