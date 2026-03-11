/**
 * Prepends the basePath for static assets (images).
 * Next.js basePath applies automatically to <Image> but NOT plain <img> tags.
 * NEXT_PUBLIC_BASE_PATH is baked in at build time, so it works on both
 * server (SSG) and client without relying on __NEXT_DATA__ (App Router doesn't use it).
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}
