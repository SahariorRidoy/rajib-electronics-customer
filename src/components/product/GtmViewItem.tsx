"use client";

import { useEffect, useRef } from "react";
import { gtmViewItem } from "@/lib/gtm";

interface Props {
  productId: string;
  title: string;
  price: number;
}

export default function GtmViewItem({ productId, title, price }: Props) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    gtmViewItem({ item_id: productId, item_name: title, price });
  }, []);

  return null;
}
