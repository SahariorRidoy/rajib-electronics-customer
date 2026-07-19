/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from "next/navigation";
import Image from "@/lib/image";
import Link from "next/link";
import { fetchProduct, fetchProducts } from "@/services/catalog";
import type { Product } from "@/types";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import GtmViewItem from "@/components/product/GtmViewItem";
import ReviewSection from "@/components/product/ReviewSection";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function normalizeProducts(resp: unknown): Product[] {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp as Product[];
  if (typeof resp !== "object") return [];

  const obj = resp as Record<string, any>;
  if (Array.isArray(obj.items)) return obj.items as Product[];
  if (Array.isArray(obj.data)) return obj.data as Product[];
  if (obj.data && Array.isArray(obj.data.items)) return obj.data.items as Product[];
  if (Array.isArray(obj.results)) return obj.results as Product[];

  const firstArr = Object.values(obj).find((v) => Array.isArray(v));
  if (Array.isArray(firstArr)) return firstArr as Product[];

  return [];
}

function RelatedCard({ product }: { product: Product | any }) {
  const maybeImages = Array.isArray((product as any)?.images)
    ? (product as any).images
    : undefined;
  const img = product.image || (maybeImages ? maybeImages[0] : "") || "/fallback.webp";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="rel-card h-full flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-linear-to-br from-[#F5FDF8] to-[#F5FDF8]">
        <Image
          src={img}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-11">
          {product.title}
        </h3>
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-pink-700 font-bold">
            ৳{Number(product.price || 0).toFixed(0)}
          </span>
          {typeof product.compareAtPrice === "number" &&
            product.compareAtPrice > (product.price || 0) && (
              <span className="text-gray-400 line-through text-sm">
                ৳{product.compareAtPrice}
              </span>
            )}
        </div>
      </div>
    </Link>
  );
}

async function fetchHotline(): Promise<string> {
  try {
    const API = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;
    if (!API) return "";
    const res = await fetch(`${API}/settings`, { cache: "no-store" });
    const json = await res.json();
    return json?.data?.contactInfo?.phones?.[0] || "";
  } catch {
    return "";
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotline = await fetchHotline();

  const res = await fetchProduct(slug).catch(() => null);
  if (!res?.data) return notFound();

  const product = res.data as Product;

  const galleryImages =
    Array.isArray((product as any)?.images) && (product as any).images.length
      ? (product as any).images.filter(Boolean)
      : [];
  const finalGallery = galleryImages.length
    ? galleryImages
    : product.image
      ? [product.image]
      : [];

  let related: Product[] = [];
  if (product.categorySlug) {
    const raw = await fetchProducts({
      category: product.categorySlug,
      limit: 12,
      sort: "-createdAt",
    }).catch(() => null);

    const candidate = raw?.data ?? raw;
    const arr = normalizeProducts(candidate);
    related = arr.filter((p) => p.slug !== product.slug).slice(0, 8);
  }

  const hasDiscount =
    !!product.isDiscounted ||
    (typeof product.compareAtPrice === "number" &&
      product.compareAtPrice > product.price);

  const rawDesc = typeof product.description === "string" ? product.description : "";
  const hasDesc = /\S/.test(rawDesc);
  const safeDesc = rawDesc.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(safeDesc);

  return (
    <div className="min-h-screen bg-[#F5FDF8] mt-6">
      <GtmViewItem
        productId={product._id}
        title={product.title}
        price={product.price}
      />
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 pt-10">
        <ProductDetailClient
          product={product}
          galleryImages={finalGallery}
          hotline={hotline}
          hasDiscount={hasDiscount}
          hasDesc={hasDesc}
          safeDesc={safeDesc}
          looksHtml={looksHtml}
        />

        {/* Reviews */}
        <ReviewSection key={slug} productSlug={slug} />

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12 sm:mt-14 md:mt-16 lg:mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight">
                  Related Products
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2 font-medium">
                  Your Favorite Collections
                </p>
              </div>
              <Link
                href={
                  product.categorySlug
                    ? `/products?category=${product.categorySlug}`
                    : "/products"
                }
                className="text-[#167389] font-bold hover:text-pink-700 transition-colors flex items-center gap-1.5 sm:gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded text-sm sm:text-base"
                aria-label="See all related products"
              >
                <span>See All</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr items-stretch gap-3 sm:gap-4 md:gap-5 lg:gap-6"
              aria-label="Related products"
            >
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
