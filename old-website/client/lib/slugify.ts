// lib/slugify.ts
// Converts a title into a URL-safe slug.
// Example: "Hello World! 2025" → "hello-world-2025"

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")       // spaces/underscores → dash
    .replace(/[^\w-]+/g, "")       // remove non-word chars
    .replace(/--+/g, "-")          // collapse multiple dashes
    .replace(/^-+|-+$/g, "");      // trim leading/trailing dashes
}