import Link from "next/link";
import type { AppProduct } from "@/types/product";
import Image from "@/lib/image";

export default function ProductCardCompact({ p }: { p: AppProduct }) {
  const discount =
    p.compareAtPrice && p.compareAtPrice > p.price
      ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      : 0;

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
        <Image
          src={p.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"}
          alt={p.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors mb-2 min-h-[2.5rem]">
          {p.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ৳{p.price}
          </span>
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ৳{p.compareAtPrice}
            </span>
          )}
        </div>
        <Link
          href={`/products/${p.slug}`}
          className="block text-center rounded-xl bg-gradient-to-r from-[#167389] to-[#167389] text-white px-3 py-2 sm:py-2.5 text-sm font-semibold hover:from-cyan-200 hover:to-cyan-600 transition-all shadow-sm hover:shadow-md"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
