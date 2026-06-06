/** @type {import('next-sitemap').IConfig} */
const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://rajib-electronics-backend.vercel.app/api/v1";

module.exports = {
  siteUrl: "https://rajibelectronics.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,

  // Exclude auth/account/utility pages
  exclude: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/profile",
    "/profile/edit",
    "/orders",
    "/cart",
    "/checkout",
    "/invoices/*",
  ],

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: "*",
        disallow: [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/profile",
          "/orders",
          "/cart",
          "/checkout",
          "/invoices",
        ],
      },
    ],
  },

  // Dynamically generate URLs for products, categories, manufacturers
  additionalPaths: async (config) => {
    const paths = [];

    try {
      // ── Products ──────────────────────────────────────────────
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `${API}/products?page=${page}&limit=60`,
          { cache: "no-store" }
        ).then((r) => r.json()).catch(() => null);

        const items =
          res?.data?.items ?? res?.data?.data ?? res?.data ?? res?.items ?? [];

        if (!Array.isArray(items) || items.length === 0) {
          hasMore = false;
          break;
        }

        for (const product of items) {
          if (product?.slug) {
            paths.push({
              loc: `/products/${product.slug}`,
              changefreq: "daily",
              priority: 0.9,
              lastmod: product.updatedAt ?? new Date().toISOString(),
            });
          }
        }

        const total = res?.data?.total ?? res?.total ?? 0;
        const limit = 60;
        hasMore = page * limit < total && items.length === limit;
        page++;
      }
    } catch (e) {
      console.warn("[next-sitemap] Failed to fetch products:", e.message);
    }

    try {
      // ── Categories ────────────────────────────────────────────
      const res = await fetch(`${API}/categories`, { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null);

      const categories = res?.data ?? res?.items ?? [];

      if (Array.isArray(categories)) {
        for (const cat of categories) {
          if (cat?.slug) {
            paths.push({
              loc: `/category/${cat.slug}`,
              changefreq: "weekly",
              priority: 0.8,
              lastmod: cat.updatedAt ?? new Date().toISOString(),
            });
          }
        }
      }
    } catch (e) {
      console.warn("[next-sitemap] Failed to fetch categories:", e.message);
    }

    try {
      // ── Manufacturers ─────────────────────────────────────────
      const res = await fetch(`${API}/manufacturers`, { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null);

      const manufacturers = res?.data ?? res?.items ?? [];

      if (Array.isArray(manufacturers)) {
        for (const m of manufacturers) {
          if (m?.slug) {
            paths.push({
              loc: `/manufacturer/${m.slug}`,
              changefreq: "weekly",
              priority: 0.7,
              lastmod: m.updatedAt ?? new Date().toISOString(),
            });
          }
        }
      }
    } catch (e) {
      console.warn("[next-sitemap] Failed to fetch manufacturers:", e.message);
    }

    return paths;
  },
};
