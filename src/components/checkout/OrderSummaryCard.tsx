/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ShoppingBag } from "lucide-react";
import ItemRow from "./ItemRow";
const money = (n: number) => `৳${Number(n || 0).toFixed(2)}`;

export default function OrderSummaryCard({
  items,
  subtotal,
  deliveryCharge,
  deliveryLoading,
  isFreeDelivery,
  amountNeeded,
  total,
  zone,
}: {
  items: any[];
  subtotal: number;
  deliveryCharge: number;
  deliveryLoading: boolean;
  isFreeDelivery: boolean;
  amountNeeded: number;
  total: number;
  zone?: "inside" | "outside";
}) {
  const zoneLabel = zone === "inside" ? "Inside Dhaka" : "Outside Dhaka";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-pink-600" aria-hidden />
        <span>Order Summary</span>
      </h2>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {items.map((it) => (
          <ItemRow key={it._id} item={it} />
        ))}
      </div>

      <div className="mt-5 border-t border-pink-200 pt-3 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>
            Delivery
            {zone && (
              <span className="ml-1 text-xs text-gray-400">({zoneLabel})</span>
            )}
          </span>
          <span>
            {deliveryLoading ? (
              <span className="text-gray-400 text-sm">Calculating...</span>
            ) : isFreeDelivery ? (
              <span className="text-green-600 font-semibold">FREE</span>
            ) : (
              <span>{money(deliveryCharge)}</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total</span>
          <span className="text-pink-600">{money(total)}</span>
        </div>
      </div>

      {!isFreeDelivery && amountNeeded > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-700">
            💡 Add <span className="font-semibold">{money(amountNeeded)}</span> more for FREE delivery!
          </p>
        </div>
      )}

      {isFreeDelivery && deliveryCharge === 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 font-semibold">
            ✓ You qualify for FREE delivery!
          </p>
        </div>
      )}
    </div>
  );
}
