/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",           // Static HTML export
  trailingSlash: true,        // Required for GitHub Pages routing
  images: { unoptimized: true }, // next/image doesn't work in static export
  // basePath is injected by the GitHub Actions workflow at build time
  // so local dev (no env var) uses "/" and GitHub Pages uses "/repo-name"
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export default nextConfig;
