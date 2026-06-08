"use client";
import Link from "next/link";
import Image from "@/lib/image";
import { memo } from "react";
import { useGetSideBannersQuery } from "@/services/catalog.api";
import type { Banner } from "@/types/banner";

interface PromoCardProps {
  index: 0 | 1; // 0 = top card (sort 0), 1 = bottom card (sort 1)
  className?: string;
}

function PromoCardBase({ index, className = "" }: PromoCardProps) {
  const { data: sideBanners = [] } = useGetSideBannersQuery();

  // sorted by sort field already (done in query), pick by position index
  const banner: Banner | undefined = sideBanners[index];

  if (!banner) {
    return (
      <div
        className={`rounded-lg bg-gray-100 animate-pulse ${className}`}
      />
    );
  }

  const slug = banner.categorySlug || "";
  const href = slug ? `/products?category=${slug}` : (banner.link || "/products");
  // Capitalize slug for display: "wire" → "Wire"
  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gray-900 ${className}`}
    >
      <Image
        src={banner.image}
        alt={banner.title || categoryName || "Banner"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="220px"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />

      {slug && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/30 to-transparent pt-6 pb-2 px-3">
          <p className="text-white font-bold text-sm md:text-base leading-tight drop-shadow">
            {categoryName}
          </p>
          <p className="text-white/80 text-[10px] md:text-xs mt-0.5">
            পণ্য অর্ডার করতে ক্লিক করুন →
          </p>
        </div>
      )}
    </Link>
  );
}

export const PromoCard = memo(PromoCardBase);
