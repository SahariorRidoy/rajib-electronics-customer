"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerInfoSchema,
  CustomerInfoFormValues,
} from "@/lib/validators/orderSchema";

type Props = {
  onSubmit: (values: CustomerInfoFormValues) => void;
  defaultValues?: Partial<CustomerInfoFormValues>;
  isLoading?: boolean;
};

export default function CustomerInfoForm({
  onSubmit,
  defaultValues,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(CustomerInfoSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Full Name
        </label>
        <input
          {...register("name")}
          placeholder="Enter your full name"
          className="input"
        />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Phone
        </label>
        <input
          {...register("phone")}
          placeholder="e.g. 017xxxxxxxx"
          className="input"
        />
        {errors.phone && <p className="error">{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div className="col-span-full">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Address
        </label>
        <textarea
          {...register("address")}
          placeholder="Enter your full address (house, road, area, district)"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#167389] focus:border-[#167389] text-gray-800 resize-none"
        />
        {errors.address && (
          <p className="error">{errors.address.message}</p>
        )}
      </div>

      <div className="col-span-full flex justify-end mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#167389] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#125f70] transition-all disabled:opacity-60"
        >
          {isLoading ? "Submitting..." : "Continue to Payment"}
        </button>
      </div>
    </form>
  );
}
