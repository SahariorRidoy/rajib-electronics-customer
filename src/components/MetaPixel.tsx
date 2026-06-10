"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { gtmPageView } from "@/lib/gtm";

function PixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");

    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "PageView");
      if (process.env.NODE_ENV === "development") {
        console.log("[Meta Pixel] PageView", url);
      }
    }

    // GTM
    gtmPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <PixelPageView />
    </Suspense>
  );
}
