/**
 * Returns the asset path as-is. No basePath needed on Vercel.
 * Kept as a helper so img tags don't need to be changed if we ever add a basePath again.
 */
export function assetPath(path: string): string {
  return path;
}
