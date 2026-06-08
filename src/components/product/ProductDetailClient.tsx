"use client";

import { useState } from "react";
import Image from "@/lib/image";
import Link from "next/link";
import { Phone, Sparkles } from "lucide-react";
import type { Product, ColorVariant } from "@/types";
import ProductActions from "./ProductActions";

interface Props {
  product: Product;
  galleryImages: string[];
  hotline: string;
  hasDiscount: boolean;
  hasDesc: boolean;
  safeDesc: string;
  looksHtml: boolean;
}

export default function ProductDetailClient({
  product,
  galleryImages,
  hotline,
  hasDiscount,
  hasDesc,
  safeDesc,
  looksHtml,
}: Props) {
  const colorVariants: ColorVariant[] = product.colorVariants ?? [];

  // gallery images first, then color variant images
  const thumbImages = [
    ...galleryImages,
    ...colorVariants.map((v) => v.image),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = thumbImages[activeIndex] ?? null;

  const colorStartIndex = galleryImages.length;
  const selectedColor =
    activeIndex >= colorStartIndex
      ? colorVariants[activeIndex - colorStartIndex] ?? null
      : null;

  const defaultImage = galleryImages[0];

  const thumbAlt = (i: number) =>
    i < colorStartIndex
      ? `${product.title} ${i + 1}`
      : colorVariants[i - colorStartIndex]?.colorName ?? `${product.title} ${i + 1}`;

  const ColorButtons = ({ mobile }: { mobile: boolean }) =>
    colorVariants.length > 0 ? (
      <div className={mobile ? "mt-3 pt-3 border-t border-gray-100" : "mt-4"}>
        <p className={`font-semibold text-gray-700 mb-2 ${mobile ? "text-xs" : "text-sm"}`}>
          Available Colors:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            title="Default"
            onClick={() => setActiveIndex(0)}
            className={`flex items-center gap-1 px-2 py-1 rounded border-2 transition-all font-medium ${mobile ? "text-[10px]" : "text-xs gap-1.5 px-3 py-1.5"} ${
              activeIndex < colorStartIndex
                ? "border-[#167389] bg-[#f0fafc] text-[#167389]"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <span className={`rounded-sm bg-gray-300 inline-block ${mobile ? "w-3 h-3" : "w-4 h-4"}`} />
            Default
          </button>
          {colorVariants.map((v, i) => (
            <button
              key={v.colorName}
              type="button"
              title={v.colorName}
              onClick={() => setActiveIndex(colorStartIndex + i)}
              className={`flex items-center gap-1 px-2 py-1 rounded border-2 transition-all font-medium ${mobile ? "text-[10px]" : "text-xs gap-1.5 px-3 py-1.5"} ${
                activeIndex === colorStartIndex + i
                  ? "border-[#167389] bg-[#f0fafc] text-[#167389]"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <span
                className={`rounded-sm inline-block ${mobile ? "w-3 h-3" : "w-4 h-4"}`}
                style={{ backgroundColor: v.colorHex ?? "#ccc" }}
              />
              {v.colorName}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      {/* ── Mobile Layout ── */}
      <div className="lg:hidden">
        <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-3 mb-4">
          <h1 className="text-base font-bold text-gray-900 mb-3 leading-tight">
            {product.title}
          </h1>

          <div className="flex gap-3">
            {/* Left: Image + Thumbs (2/3) */}
            <div className="w-2/3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-linear-to-br from-[#F5FDF8] to-[#F5FDF8]">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={selectedColor ? `${product.title} - ${selectedColor.colorName}` : product.title}
                    fill
                    sizes="66vw"
                    className="object-contain transition-all duration-300"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {thumbImages.length > 1 && (
                <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {thumbImages.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        activeIndex === i ? "border-[#167389] scale-105" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image src={src} alt={thumbAlt(i)} fill sizes="64px" className="object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Pricing, Stock & Actions (1/3) */}
            <div className="w-1/3 flex flex-col">
              <div className="text-lg font-bold text-pink-600 mb-1">
                ৳{product.price.toFixed(0)}
              </div>
              {hasDiscount && typeof product.compareAtPrice === "number" && (
                <div className="text-xs text-gray-400 line-through mb-1">
                  ৳{product.compareAtPrice.toFixed(0)}
                </div>
              )}
              {hasDiscount && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300 mb-2 inline-block">
                  Special Offer
                </span>
              )}
              <div className="text-[10px] text-center mb-2 p-1.5 bg-linear-to-r from-orange-50 to-rose-50 rounded-md border border-orange-200">
                {product.stock && product.stock > 0 ? (
                  product.stock < 10 ? (
                    <span className="text-orange-600 font-semibold">Only {product.stock} left</span>
                  ) : (
                    <span className="text-green-600 font-semibold">In Stock</span>
                  )
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>
              <ProductActions
                product={product}
                hotline={hotline}
                selectedColor={selectedColor}
                defaultImage={defaultImage}
              />
            </div>
          </div>

          <ColorButtons mobile={true} />

          {/* Category Info */}
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
            <span className="font-semibold text-gray-800">Category:</span>{" "}
            {product.categorySlug ? (
              <Link
                className="text-[#167389] hover:text-pink-700 font-bold hover:underline"
                href={`/products?category=${product.categorySlug}`}
              >
                {product.categorySlug}
              </Link>
            ) : (
              <span className="text-gray-500">Not Available</span>
            )}
          </div>

          {/* Order by Phone */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-[10px] text-center text-gray-600 mb-2">Or Order by Phone</p>
            <a
              href={`tel:${hotline}`}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-linear-to-r from-pink-50 to-rose-50 border border-pink-300 text-pink-700 font-semibold rounded-lg hover:from-pink-100 hover:to-rose-100 text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{hotline}</span>
            </a>
            <p className="text-[9px] text-center text-gray-500 mt-1.5">Available 9 AM - 9 PM Daily</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-4">
          <h3 className="text-base font-semibold text-gray-900">Description</h3>
          {hasDesc ? (
            looksHtml ? (
              <div
                className="mt-2 leading-relaxed text-gray-800 text-sm wrap-break-word prose prose-sm max-w-none **:text-gray-800"
                dangerouslySetInnerHTML={{ __html: safeDesc }}
              />
            ) : (
              <p className="mt-2 leading-relaxed text-gray-800 text-sm whitespace-pre-line wrap-break-word">
                {safeDesc}
              </p>
            )
          ) : (
            <p className="mt-2 text-gray-500 text-sm">No description available.</p>
          )}
        </div>
      </div>

      {/* ── Desktop Layout ── */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        {/* LEFT: Image + Thumbs + Description */}
        <div className="bg-white rounded-2xl text-black sm:rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-100 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4">
          <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-linear-to-br from-[#F5FDF8] to-[#F5FDF8] shadow-inner">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={selectedColor ? `${product.title} - ${selectedColor.colorName}` : product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-gray-300" />
              </div>
            )}
          </div>

          {thumbImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {thumbImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activeIndex === i ? "border-[#167389] scale-105 shadow-md" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image src={src} alt={thumbAlt(i)} fill sizes="96px" className="object-contain" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Description</h3>
            {hasDesc ? (
              looksHtml ? (
                <div
                  className="mt-2 leading-relaxed text-gray-800 wrap-break-word prose prose-sm max-w-none **:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: safeDesc }}
                />
              ) : (
                <p className="mt-2 leading-relaxed text-gray-800 whitespace-pre-line wrap-break-word">
                  {safeDesc}
                </p>
              )
            ) : (
              <p className="mt-2 text-gray-500">No description available.</p>
            )}
          </div>
        </div>

        {/* RIGHT: Info + Actions */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-pink-100 p-5 sm:p-6 md:p-7 lg:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] font-bold text-gray-900 wrap-break-word leading-tight tracking-tight">
            {product.title}
          </h1>

          <div className="mt-4 sm:mt-5 flex flex-wrap items-end gap-2.5 sm:gap-3">
            <div className="text-3xl sm:text-4xl font-semibold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              ৳{product.price.toFixed(2)}
            </div>
            {hasDiscount && typeof product.compareAtPrice === "number" && (
              <div className="text-lg sm:text-xl md:text-2xl text-gray-400 line-through font-semibold">
                ৳{product.compareAtPrice.toFixed(2)}
              </div>
            )}
            {hasDiscount && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-linear-to-r from-pink-100 to-rose-100 text-pink-700 border-2 border-pink-300 shadow-sm">
                Special Offer
              </span>
            )}
            <span className={`ml-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full border-2 shadow-sm ${
              product.stock && product.stock > 0
                ? product.stock < 10
                  ? "bg-orange-50 text-orange-600 border-orange-300"
                  : "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-600 border-red-300"
            }`}>
              {product.stock && product.stock > 0
                ? product.stock < 10 ? `Only ${product.stock} left` : "In Stock"
                : "Out of Stock"}
            </span>
          </div>

          <ColorButtons mobile={false} />

          <div className="mt-6 sm:mt-7">
            <ProductActions
              product={product}
              hotline={hotline}
              selectedColor={selectedColor}
              defaultImage={defaultImage}
            />
          </div>

          <div className="mt-6 sm:mt-7 p-4 sm:p-5 bg-linear-to-r from-pink-50 via-rose-50 to-purple-50 rounded-xl sm:rounded-2xl border-2 border-pink-200 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-[#167389] shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-medium">
                All our products are 100% authentic and of premium quality.
                Specially curated collection for your beauty and care needs.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 wrap-break-word">
              <span className="font-semibold text-gray-800">Category:</span>{" "}
              {product.categorySlug ? (
                <Link
                  className="text-[#167389] hover:text-pink-700 font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded inline-block"
                  href={`/products?category=${product.categorySlug}`}
                >
                  {product.categorySlug}
                </Link>
              ) : (
                <span className="text-gray-500">Not Available</span>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-7">
            <a
              href={`tel:${hotline}`}
              className="inline-flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-linear-to-r from-[#167389] to-[#167389] text-white font-bold rounded-xl sm:rounded-2xl hover:from-cyan-200 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 text-sm sm:text-base"
            >
              <Phone className="w-5 h-5" />
              <span>Hotline: {hotline}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
