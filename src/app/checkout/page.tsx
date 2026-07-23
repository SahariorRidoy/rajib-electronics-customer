/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { User, CheckCircle, LogIn } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/services/orders";
import CustomerInfoForm from "@/components/checkout/CustomerInfoForm";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import { useDeliveryCharge, type DeliveryZone } from "@/hooks/useDeliveryCharge";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { gtmBeginCheckout, gtmPurchase } from "@/lib/gtm";

const toNum = (v: unknown, f = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : f;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const syncCartPrices = useCartStore((s) => s.syncCartPrices);
  const subtotal = useCartStore((s) =>
    s.items.reduce((acc, it) => acc + Number(it.price || 0) * (it.quantity || 0), 0)
  );

  const { customerInfo, isGuest, isLoggedIn, user } = useCustomerInfo();
  const stableCustomerInfo = useMemo(
    () => customerInfo,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerInfo.name, customerInfo.phone, customerInfo.address]
  );

  const { hotline } = usePublicSettings();

  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("outside");
  const [debouncedSubtotal, setDebouncedSubtotal] = useState(subtotal);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSubtotal(subtotal), 400);
    return () => clearTimeout(t);
  }, [subtotal]);

  const { deliveryInfo, loading: deliveryLoading } = useDeliveryCharge(debouncedSubtotal, deliveryZone);
  const deliveryCharge = deliveryInfo?.deliveryCharge || 0;
  const isFreeDelivery = deliveryInfo?.isFree || false;
  const amountNeeded = deliveryInfo ? Math.max(0, deliveryInfo.freeDeliveryThreshold - subtotal) : 0;
  const total = subtotal + deliveryCharge;

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    syncCartPrices();
  }, []);

  const beginCheckoutFired = useRef(false);
  useEffect(() => {
    if (!items.length || beginCheckoutFired.current) return;
    beginCheckoutFired.current = true;
    gtmBeginCheckout(
      items.map((i) => ({ item_id: i._id, item_name: i.title, price: i.price, quantity: i.quantity })),
      subtotal
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(async (customerData: any) => {
    if (!items.length) {
      toast.error("Your cart is empty. Please add products first.");
      return;
    }

    const customer: any = {
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
    };

    const payload = {
      items: items.map((it) => ({
        _id: String(it._id),
        quantity: Math.max(1, toNum(it.quantity, 1)),
        title: it.title,
        price: it.price,
        image: it.image ?? "",
        color: it.color ?? "Default",
      })),
      customer,
      totals: {
        subTotal: subtotal,
        shipping: deliveryCharge,
        grandTotal: total,
      },
      deliveryZone,
    };

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Placing your order...");
      const result = await createOrder(payload);
      toast.dismiss(loadingToast);

      if (result.ok) {
        toast.success("Order placed successfully!");
        gtmPurchase({
          transaction_id: result.data?.orderId ?? Date.now().toString(),
          value: total,
          shipping: deliveryCharge,
          items: items.map((i) => ({ item_id: i._id, item_name: i.title, price: i.price, quantity: i.quantity })),
        });
        if (isGuest && customerData.phone) {
          localStorage.setItem("customer_phone", customerData.phone);
        }
        clearCart();
        setTimeout(() => router.push("/orders"), 1500);
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (err: any) {
      console.error("❌ Order submission error:", err);
      toast.dismiss();
      toast.error(err?.data?.message || err?.message || "Failed to place order. Please try again.");
      if (err?.data?.code === "NO_ITEMS") console.error("Items payload issue:", payload.items);
    } finally {
      setIsSubmitting(false);
    }
  }, [items, subtotal, deliveryCharge, total, deliveryZone, isGuest, clearCart, router]);

  if (!mounted) return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto pt-10 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-8" />
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-white rounded-2xl h-96 shadow" />
          <div className="md:col-span-2 bg-white rounded-2xl h-64 shadow hidden md:block" />
        </div>
      </div>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Please add items to proceed to checkout.</p>
          <button
            onClick={() => router.push("/products")}
            className="inline-block bg-[#167389] text-white px-6 py-3 rounded-xl hover:bg-[#125f70] transition-all shadow-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 min-h-screen py-8 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto pt-10">

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#167389] to-[#125f70]">
            Checkout
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Fill in your details to complete the order.
          </p>
          {isLoggedIn ? (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border-2 border-green-200 px-4 py-2 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-green-700">Ordering as: {user?.name}</p>
                <p className="text-xs text-green-600">{user?.email || user?.phone}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-700">Continue as Guest</p>
                <p className="text-xs text-blue-600">No account needed</p>
              </div>
            </div>
          )}
        </div>

        {/* Guest Sign-in Prompt */}
        {isGuest && (
          <div className="mb-6 bg-linear-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <LogIn className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 mb-1">Have an account?</p>
                <p className="text-xs text-gray-600 mb-2">Sign in for faster checkout and order tracking</p>
                <Link
                  href="/login?redirect=/checkout"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
                >
                  Sign in now →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-6 lg:gap-8 w-full min-w-0">
          {/* Mobile: Order Summary */}
          <div className="md:hidden w-full min-w-0">
            <OrderSummaryCard
              items={items}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              deliveryLoading={deliveryLoading}
              isFreeDelivery={isFreeDelivery}
              amountNeeded={amountNeeded}
              total={total}
              zone={deliveryZone}
            />
          </div>

          {/* Left: Customer Form */}
          <div className="md:col-span-3 w-full min-w-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-pink-100">
              {isLoggedIn && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700">
                    ✓ Your information has been pre-filled. You can edit if needed.
                  </p>
                </div>
              )}
              <CustomerInfoForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                initialData={stableCustomerInfo}
                deliveryZone={deliveryZone}
                setDeliveryZone={setDeliveryZone}
                deliveryInfo={deliveryInfo}
                isFreeDelivery={isFreeDelivery}
              />
              <div className="text-center pt-6 border-t border-pink-100">
                <p className="text-gray-600 mb-3 text-sm">Or</p>
                <a
                  href={`tel:${hotline}`}
                  className="inline-flex items-center gap-2 text-[#167389] hover:text-pink-700 font-semibold text-sm sm:text-base"
                >
                  📞 Call to order: {hotline}
                </a>
              </div>
            </div>
          </div>

          {/* Right: Summary (Desktop) */}
          <div className="md:col-span-2 hidden md:block">
            <div className="sticky top-4">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                deliveryLoading={deliveryLoading}
                isFreeDelivery={isFreeDelivery}
                amountNeeded={amountNeeded}
                total={total}
                zone={deliveryZone}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
