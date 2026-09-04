"use client";

import { X, CreditCard, Truck } from "lucide-react";

interface Props {
  open: boolean;
  deliveryCharge: number;
  deliveryZone: "inside" | "outside";
  isInitiating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeliveryChargeModal({
  open,
  deliveryCharge,
  deliveryZone,
  isInitiating,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const zoneLabel = deliveryZone === "inside" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#167389] to-[#125f70] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-base">কুরিয়ার চার্জ পেমেন্ট</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Bengali message */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-gray-800 text-sm leading-relaxed font-medium">
              রাজীব ইলেকট্রনিক্সে আপনাকে স্বাগতম! ফেক অর্ডার রোধে আমরা শুধুমাত্র কুরিয়ার চার্জ{" "}
              <span className="text-orange-600 font-bold text-base">৳{deliveryCharge}</span> টাকা অগ্রিম নিচ্ছি।
              প্রোডাক্টের মূল দাম ক্যাশ অন ডেলিভারিতে শোধ করবেন।
            </p>
          </div>

          {/* Charge summary */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <div>
              <p className="text-xs text-gray-500">ডেলিভারি জোন</p>
              <p className="text-sm font-semibold text-gray-800">{zoneLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">কুরিয়ার চার্জ</p>
              <p className="text-xl font-bold text-[#167389]">৳{deliveryCharge}</p>
            </div>
          </div>

          {/* Info note */}
          <p className="text-xs text-gray-500 text-center">
            আপনাকে PayStation-এর নিরাপদ পেমেন্ট পেজে নিয়ে যাওয়া হবে।
            bKash, Nagad, Rocket, Card সহ সব পেমেন্ট মেথড সাপোর্টেড।
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isInitiating}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm disabled:opacity-50"
          >
            বাতিল করুন
          </button>
          <button
            onClick={onConfirm}
            disabled={isInitiating}
            className="flex-1 px-4 py-3 rounded-xl bg-[#167389] text-white font-bold hover:bg-[#125f70] transition text-sm disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          >
            {isInitiating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                অপেক্ষা করুন...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                ৳{deliveryCharge} পেমেন্ট করুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
