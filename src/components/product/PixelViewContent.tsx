"use client";

import { useEffect } from "react";
import { pixelViewContent } from "@/lib/pixel";
import { gtmViewItem } from "@/lib/gtm";

interface Props {
  productId: string;
  title: string;
  price: number;
}

export default function PixelViewContent({ productId, title, price }: Props) {
  useEffect(() => {
    pixelViewContent({
      content_ids: [productId],
      content_name: title,
      contents: [{ id: productId, quantity: 1, item_price: price, title }],
      value: price,
    });

    gtmViewItem({ item_id: productId, item_name: title, price });
  }, [productId, title, price]);

  return null;
}
