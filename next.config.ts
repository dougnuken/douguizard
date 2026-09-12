import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // The widths the layout actually asks for: phone frame ≤ 400 CSS px,
    // browser frame ≤ 1330 CSS px, both at DPR 1–3. Trimming the default
    // ladder removes transform variants nothing ever requests.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    imageSizes: [200, 256, 384, 400, 800],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
