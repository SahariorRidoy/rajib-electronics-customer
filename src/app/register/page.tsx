"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import { authApi } from "@/services/auth.api";
import { clearGuestData } from "@/lib/localStorage";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "@/lib/image";
import { usePublicSettings } from "@/hooks/usePublicSettings";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { siteName, activeLogo } = usePublicSettings();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const isSettingsLoading = !isMounted || (!siteName && !activeLogo);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await authApi.register(formData);

      if (!response.ok || !response.data) {
        throw new Error(response.message || "Registration failed");
      }

      // Clear any old guest/customer data before setting new auth
      clearGuestData();

      dispatch(setAuth({
        user: response.data.customer,
        token: response.data.accessToken
      }));

      router.push("/profile");
    } catch (err: unknown) {
      console.error("Registration failed:", err);
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5FDF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Back to Shop */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 bg-white border border-[#167389] text-[#167389] hover:bg-[#167389] hover:text-white transition-all duration-200 text-sm font-medium px-4 py-2 rounded-lg shadow-sm mb-6"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        {/* Logo + title */}
        {isSettingsLoading ? (
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse" />
            </div>
            <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-lg mx-auto mb-2" />
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mx-auto" />
          </div>
        ) : (
          <Link href="/" className="text-center mb-6 block">
            {activeLogo && (
              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100">
                  <Image
                    src={activeLogo.logoUrl}
                    alt={siteName}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}
            <h1 className="text-3xl font-bold text-[#167389] mb-1">{siteName}</h1>
            <p className="text-gray-600 text-sm">Join Our Community!</p>
          </Link>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Start your journey with us</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#167389]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#167389] focus:ring-1 focus:ring-[#167389] transition placeholder:text-gray-400 text-gray-900 selection:bg-[#167389] selection:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#167389]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#167389] focus:ring-1 focus:ring-[#167389] transition placeholder:text-gray-400 text-gray-900 selection:bg-[#167389] selection:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#167389]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#167389] focus:ring-1 focus:ring-[#167389] transition placeholder:text-gray-400 text-gray-900 selection:bg-[#167389] selection:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#167389]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#167389] focus:ring-1 focus:ring-[#167389] transition placeholder:text-gray-400 text-gray-900 selection:bg-[#167389] selection:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#167389] transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#167389] hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {apiError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {apiError}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#167389] hover:text-cyan-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
