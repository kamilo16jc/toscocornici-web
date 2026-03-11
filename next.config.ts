import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/toscocornici-web" : "";

const nextConfig: NextConfig = {
  output: "export",        // static HTML export for GitHub Pages
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,     // required for static export
  },
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
