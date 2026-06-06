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
  images: {
    unoptimized: true, // disables Vercel image optimization entirely — no 5k limit
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
