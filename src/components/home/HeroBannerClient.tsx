"use client";

import { BannerCarousel } from "./BannerCarousel";
import { useGetHeroBannersQuery } from "@/services/catalog.api";

export default function HeroBannerClient({
  limit = 6,
  heightClass,
}: {
  limit?: number;
  heightClass?: string;
}) {
  const { data, isFetching } = useGetHeroBannersQuery(limit, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  if (isFetching || !data) {
    return (
      <div
        className={`w-full rounded-md bg-gray-200 animate-pulse ${
          heightClass ?? "h-[160px] sm:h-[280px] lg:h-full"
        }`}
      />
    );
  }

  return <BannerCarousel items={data} heightClass={heightClass} />;
}
