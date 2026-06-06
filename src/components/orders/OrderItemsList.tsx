/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import type { Order } from "@/types/order";

const money = (n: number) => `৳${Number(n || 0).toFixed(2)}`;

function OrderItem({ item }: { item: any }) {
  const qty = item.qty ?? item.quantity ?? 0;
  const title = item.title || item.name || "Product";
  const price = item.price || 0;
  const image = item.image || null;
  const color = item.color || null;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-4/3 w-20 sm:w-24 shrink-0 rounded-lg overflow-hidden border border-pink-200 bg-pink-50">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="96px"
            className="object-contain p-1"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-8 h-8 text-pink-400" />
          </div>
        )}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#167389] rounded-full flex items-center justify-center z-10">
          <span className="text-white text-xs font-bold">{qty}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2">
          {title}
        </h5>
        {color && (
          <p className="text-xs text-gray-500 mb-1">Color: <span className="font-medium text-gray-700">{color}</span></p>
        )}
        <p className="text-gray-600 text-sm sm:text-base">
          {money(price)} × {qty}
        </p>
      </div>

      <div className="text-right">
        <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          {money(price * qty)}
        </p>
      </div>
    </div>
  );
}

export default function OrderItemsList({ order }: { order: Order }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
        <Package className="w-5 h-5 text-[#167389]" />
        Order Items
      </h4>
      <div className="space-y-4">
        {order.lines.map((item, i) => (
          <OrderItem key={(item as any)._id || i} item={item} />
        ))}
      </div>
    </div>
  );
}
