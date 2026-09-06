"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { ttqCompletePayment } from "@/lib/ttq";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const orderId = searchParams.get("orderId") || "";
  const invoice = searchParams.get("invoice") || "";
  const trxId = searchParams.get("trxId") || "";
  const amount = searchParams.get("amount") || "";

  useEffect(() => {
    const verify = async () => {
      if (!invoice) { setVerifying(false); return; }
      try {
        const API = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API}/payment/verify/${invoice}`);
        const data = await res.json();
        const isSuccess = data.ok && ["success", "successful"].includes((data.data?.trx_status || "").toLowerCase());
        setVerified(isSuccess);
        if (isSuccess) {
          clearCart();
          ttqCompletePayment({ transaction_id: trxId || invoice, value: Number(amount) || 0 });
        }
      } catch {
        setVerified(true);
        clearCart();
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [invoice, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">পেমেন্ট সফল!</h1>
          <p className="text-green-100 text-sm mt-1">আপনার কুরিয়ার চার্জ পেমেন্ট সম্পন্ন হয়েছে</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {verifying ? (
            <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
              <span className="text-sm">যাচাই করা হচ্ছে...</span>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2 text-sm">
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">পরিশোধিত পরিমাণ</span>
                  <span className="font-bold text-green-700">৳{amount}</span>
                </div>
              )}
              {trxId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ট্রানজেকশন ID</span>
                  <span className="font-mono text-xs text-gray-800">{trxId}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">অর্ডার ID</span>
                  <span className="font-mono text-xs text-gray-800 truncate max-w-[160px]">{orderId}</span>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              🎉 আপনার অর্ডার নিশ্চিত হয়েছে! প্রোডাক্টের মূল দাম ডেলিভারির সময় ক্যাশ অন ডেলিভারিতে পরিশোধ করবেন।
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => router.push("/orders")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#167389] text-white font-semibold hover:bg-[#125f70] transition"
            >
              <Package className="w-4 h-4" />
              আমার অর্ডার দেখুন
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              হোমপেজে যান
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
