/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/c/:slug",
        destination: "/products?category=:slug",
        permanent: false,
      },
      {
        source: "/category/:slug",
        destination: "/products?category=:slug",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Long-term cache for static public assets
        source: "/:path*.(png|jpg|jpeg|webp|svg|ico|gif|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js optimized images — 1 day
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  images: {
    // Optimization enabled — Next.js compresses images with sharp on the VPS
    // (removes the ~3.6 MB raw logo problem; serves WebP/AVIF at correct size)
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 86400, // cache optimized images for 1 day
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "rajib-electronics-backend.vercel.app" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "api.rajibelectronics.com" },
      { protocol: "http", hostname: "localhost", port: "5000" },
    ],
  },
};

module.exports = nextConfig;
