"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reason = searchParams.get("reason") || "payment_failed";

  const reasonMessages: Record<string, string> = {
    payment_failed: "পেমেন্ট সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
    missing_invoice: "ইনভয়েস তথ্য পাওয়া যায়নি।",
    session_expired: "পেমেন্ট সেশন মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।",
    server_error: "সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">পেমেন্ট ব্যর্থ!</h1>
          <p className="text-red-100 text-sm mt-1">পেমেন্ট সম্পন্ন হয়নি</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ {reasonMessages[reason] || reasonMessages.payment_failed}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              কোনো অর্ডার তৈরি হয়নি। চেকআউট পেজে ফিরে আবার চেষ্টা করুন।
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#167389] text-white font-semibold hover:bg-[#125f70] transition"
            >
              <RefreshCw className="w-4 h-4" />
              আবার চেষ্টা করুন
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              হোমপেজে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
