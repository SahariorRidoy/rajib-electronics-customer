"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { DeliveryZone } from "@/hooks/useDeliveryCharge";

const CustomerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .transform((val) => {
      if (val.startsWith("+88")) return val.substring(3);
      if (val.startsWith("88") && val.length === 13) return val.substring(2);
      if (val.startsWith("1") && val.length === 10) return "0" + val;
      return val;
    })
    .refine((val) => /^01[0-9]{9}$/.test(val), {
      message: "Enter a valid Bangladeshi number (01XXXXXXXXX)",
    }),
  address: z.string().min(5, "Please enter your full address"),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;

interface DeliveryInfo {
  deliveryCharge: number;
  isFree: boolean;
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  freeDeliveryThreshold: number;
}

interface Props {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Partial<CustomerFormData>;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  deliveryInfo: DeliveryInfo | null;
  isFreeDelivery: boolean;
}

const inputBase =
  "w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors";
const inputOk = `${inputBase} border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100`;
const inputErr = `${inputBase} border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100`;

export default memo(function CustomerInfoForm({
  onSubmit,
  isSubmitting,
  initialData,
  deliveryZone,
  setDeliveryZone,
  deliveryInfo,
  isFreeDelivery,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: initialData || {},
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const hasReset = useRef(false);

  useEffect(() => {
    if (hasReset.current) return;
    if (!initialData) return;
    if (!(initialData.name || initialData.phone || initialData.address)) return;
    reset(initialData);
    hasReset.current = true;
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Enter your full name"
          className={errors.name ? inputErr : inputOk}
          autoComplete="name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          {...register("phone")}
          placeholder="01XXXXXXXXX"
          className={errors.phone ? inputErr : inputOk}
          autoComplete="off"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("address")}
          placeholder="Enter your full address (house, road, area, district)"
          rows={3}
          className={`${errors.address ? inputErr : inputOk} resize-none`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Delivery Zone Selector */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Delivery Location <span className="text-xs">(select your location) </span><span className="text-red-500">*</span></p>
        <div className="flex gap-2">
          {(["outside", "inside"] as const).map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setDeliveryZone(zone)}
              className={`flex flex-1 items-center gap-3 px-4 py-3 rounded-md border-2 transition-colors ${
                deliveryZone === zone
                  ? "border-[#167389] bg-[#167389]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  deliveryZone === zone ? "border-[#167389]" : "border-gray-300"
                }`}
              >
                {deliveryZone === zone && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#167389]" />
                )}
              </div>
              <span className="text-sm text-gray-700">
                {zone === "outside" ? "🚚 Outside Dhaka" : "🏙️ Inside Dhaka"}
              </span>
              {deliveryInfo && (
                <span className="ml-auto text-sm font-semibold text-[#167389]">
                  {isFreeDelivery && deliveryZone === zone
                    ? "FREE"
                    : `৳${zone === "outside" ? deliveryInfo.outsideDhakaCharge : deliveryInfo.insideDhakaCharge}`}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-colors active:scale-[0.97] active:shadow-md ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#167389] hover:bg-[#125f70] cursor-pointer"
        }`}
        style={{ transition: "background-color 0.15s, transform 0.1s, box-shadow 0.1s" }}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Place Order
          </>
        )}
      </button>
    </form>
  );
})
