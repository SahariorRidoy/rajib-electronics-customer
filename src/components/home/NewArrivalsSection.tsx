/* src/components/home/NewArrivalsSection.tsx */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchProducts } from "@/services/catalog";
import type { AppProduct } from "@/types/product";
import ProductCard from "../ProductCard";

const PAGE_LIMIT = 12;

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const loadMore = useCallback(async (pageNum: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetchProducts({
        sort: "createdAt:desc",
        limit: PAGE_LIMIT,
        page: pageNum,
        status: "ACTIVE",
      });

      const items = (res.data?.items ?? []) as AppProduct[];
      const inStock = items.filter(
        (p) => Number(p.stock ?? p.availableStock ?? 0) > 0
      );

      setProducts((prev) =>
        pageNum === 1 ? inStock : [...prev, ...inStock]
      );

      // if fewer items returned than limit, no more pages
      setHasMore(items.length >= PAGE_LIMIT);
    } catch (err) {
      console.error("NewArrivalsSection fetch error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // initial load
  useEffect(() => {
    loadMore(1);
  }, [loadMore]);

  // IntersectionObserver — triggers next page when sentinel is visible
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          setPage((prev) => {
            const next = prev + 1;
            loadMore(next);
            return next;
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <section className="py-3 lg:py-6">
      <div className="product-section">
        {/* Header */}
        <div className="flex items-end justify-between gap-2 mb-3 lg:mb-6">
          <div>
            <h2 className="text-base lg:text-3xl font-bold text-[#167389]">
              All Products
            </h2>
            <p className="text-xs lg:text-lg text-gray-600 font-extralight mt-0.5">
              Discover our all products collections
            </p>
          </div>
          <Link
            href="/search?sort=createdAt%3Adesc&availability=in_stock"
            className="inline-flex items-center gap-1 px-2 py-1.5 lg:px-3 lg:py-2 bg-[#167389] text-white rounded-md text-xs lg:text-sm font-semibold whitespace-nowrap"
          >
            View All
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
          </Link>
        </div>

        {/* Grid — same columns on mobile and desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || `na-${index}`}
              product={product}
              showDiscount={true}
              variant="default"
            />
          ))}

          {/* Skeleton placeholders while loading */}
          {loading &&
            Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div
                key={`skel-${i}`}
                className="bg-gray-200 animate-pulse rounded-2xl aspect-[3/4]"
              />
            ))}
        </div>

        {/* Sentinel — IntersectionObserver watches this */}
        {hasMore && <div ref={sentinelRef} className="h-10 mt-4" />}

        {/* End message */}
        {!hasMore && products.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-6">
            You&apos;ve seen all products
          </p>
        )}
      </div>
    </section>
  );
}
