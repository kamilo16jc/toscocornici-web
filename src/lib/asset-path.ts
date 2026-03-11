/**
 * Prepends the basePath for static assets (images).
 * Next.js basePath applies automatically to <Image> but NOT plain <img> tags.
 */
export function assetPath(path: string): string {
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_BASE_PATH || ""
      : (window as unknown as { __NEXT_DATA__?: { basePath?: string } })
          .__NEXT_DATA__?.basePath || "";
  return `${base}${path}`;
}
