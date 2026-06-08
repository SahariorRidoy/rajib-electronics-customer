"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "@/lib/image";

type Banner = {
  _id?: string;
  image?: string;
  title?: string;
  link?: string;
};

export default function CategoryHeroSlider({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  const safeBanners = Array.isArray(banners) && banners.length ? banners : [];

  useEffect(() => {
    if (!safeBanners.length) return;
    timerRef.current = window.setInterval(() => {
      setIdx((s) => (s + 1) % safeBanners.length);
    }, 2000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [safeBanners.length]);

  const prev = () => {
    if (!safeBanners.length) return;
    setIdx((s) => (s - 1 + safeBanners.length) % safeBanners.length);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const next = () => {
    if (!safeBanners.length) return;
    setIdx((s) => (s + 1) % safeBanners.length);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!safeBanners.length) {
    return (
      <div className="w-full h-56 md:h-80 lg:h-96 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
        No banners
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-50">
      <div className="w-full aspect-[3/1] relative">
        <Image
          src={safeBanners[idx]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"}
          alt={safeBanners[idx]?.title ?? "banner"}
          fill
          className="object-contain"
          sizes="100vw"
          priority={idx === 0}
        />
        {/* overlay title */}
        {safeBanners[idx]?.title && (
          <div className="absolute left-2 bottom-1 bg-black/40 text-white px-2 py-1 rounded-md">
            <h3 className="font-semibold text-xs md:text-base">
              {safeBanners[idx]?.title}
            </h3>
          </div>
        )}
      </div>

      {/* controls */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-gray-900 text-xl font-bold"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-gray-900 text-xl font-bold"
      >
        ›
      </button>

      {/* indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2 z-20">
        {safeBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/40"}`}
            aria-label={`Goto slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
