"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

//  Validation Schema (aligned with backend DTO)
const CustomerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .transform((val) => {
      if (val.startsWith('+88')) return val.substring(3);
      if (val.startsWith('88') && val.length === 13) return val.substring(2);
      if (val.startsWith('1') && val.length === 10) return '0' + val;
      return val;
    })
    .refine((val) => /^01[0-9]{9}$/.test(val), {
      message: "Enter a valid Bangladeshi number (01XXXXXXXXX)"
    }),
  address: z.string().min(5, "Please enter your full address"),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;

interface Props {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Partial<CustomerFormData>;
}

export default function CustomerInfoForm({ onSubmit, isSubmitting, initialData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: initialData || {},
  });

  const hasAppliedInitialData = useRef(false);

  // Pre-fill form with initial data only once, and only if user hasn't started typing
  useEffect(() => {
    if (!initialData) return;
    const hasContent = !!(initialData.name || initialData.phone || initialData.address);
    if (hasContent && !isDirty && !hasAppliedInitialData.current) {
      reset(initialData);
      hasAppliedInitialData.current = true;
    }
  }, [initialData, isDirty, reset]);

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      await onSubmit(data);
    } catch (e) {
      console.error(e);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors 
     ${
       hasError
         ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
         : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
     }`;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 sm:space-y-5"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
         
          <input
            type="text"
            {...register("name")}
            placeholder="Enter your full name"
            className={inputClass(!!errors.name)}
            autoComplete="name"
          />
        </div>
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
        <div className="relative">
          {/* <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
          <input
            type="tel"
            {...register("phone")}
            placeholder="01XXXXXXXXX"
            className={inputClass(!!errors.phone)}
            autoComplete="off"
          />
        </div>
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
          className={`${inputClass(!!errors.address)} resize-none`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-linear-to-r from-[#167389] to-[#167389] hover:from-cyan-500 hover:to-cyan-600"
        }`}
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
      </motion.button>
    </form>
  );
}
