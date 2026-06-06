/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

function extractItems(res: any): Product[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.items)) return res.data.items;
  if (Array.isArray(res.items)) return res.items;
  const firstArr = Object.values(res).find((v) => Array.isArray(v));
  if (Array.isArray(firstArr)) return firstArr as Product[];
  return [];
}

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const PAGE_SIZE = 12;

type Props = {
  initialProducts: Product[] | any;
  manufacturerSlug: string;
  brandName?: string;
  total?: number;
};

export default function ManufacturerProducts({
  initialProducts,
  manufacturerSlug,
  brandName,
  total = 0,
}: Props) {
  const normalized = extractItems(initialProducts);
  const [items, setItems] = useState<Product[]>(normalized);
  const [loading, setLoading] = useState(false);
  // use server total to know if more pages exist
  const [hasMore, setHasMore] = useState(
    total > 0 ? normalized.length < total : normalized.length >= PAGE_SIZE
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const pageRef = useRef(2);

  useEffect(() => {
    const arr = extractItems(initialProducts);
    setItems(arr);
    setHasMore(total > 0 ? arr.length < total : arr.length >= PAGE_SIZE);
    pageRef.current = 2;
  }, [manufacturerSlug, initialProducts, total]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const url = new URL(`${API}/products`);
      // always use slug — same as what the server used for page 1
      url.searchParams.set("brand", manufacturerSlug);
      url.searchParams.set("limit", String(PAGE_SIZE));
      url.searchParams.set("page", String(pageRef.current));
      url.searchParams.set("status", "ACTIVE");

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json().catch(() => ({}));
      const next = extractItems(json);

      if (next.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => {
          const updated = [...prev, ...next];
          // stop if we've loaded everything
          if (total > 0 && updated.length >= total) setHasMore(false);
          else if (next.length < PAGE_SIZE) setHasMore(false);
          return updated;
        });
        pageRef.current += 1;
      }
    } catch (err) {
      console.error("ManufacturerProducts loadMore error", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, manufacturerSlug, total]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {items.length > 0 ? (
          items.map((p) => <ProductCard key={p._id} product={p} />)
        ) : (
          !loading && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products found
            </div>
          )
        )}

        {loading &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={`skel-${i}`}
              className="bg-gray-200 animate-pulse rounded-2xl aspect-[3/4]"
            />
          ))}
      </div>

      {hasMore && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          All products loaded
        </p>
      )}
    </div>
  );
}
