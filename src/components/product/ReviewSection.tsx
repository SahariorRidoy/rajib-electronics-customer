"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Send, User, Loader2, MessageSquare, ThumbsUp, Camera, X } from "lucide-react";
import Image from "@/lib/image";
import toast from "react-hot-toast";
import { API } from "@/lib/api";

interface Review {
  _id: string;
  name: string;
  image?: string;
  message: string;
  rating: number;
  createdAt: string;
}

const STARS = [1, 2, 3, 4, 5];

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {STARS.map((s) => (
        <Star key={s} className={`${cls} ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {STARS.map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
          >
            <Star className={`w-8 h-8 transition-all duration-150 ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                : "fill-gray-200 text-gray-200 hover:fill-amber-200 hover:text-amber-200"
            }`} />
          </button>
        ))}
      </div>
      <span className="text-xs font-semibold text-amber-600 h-4 leading-4">
        {(hovered || value) > 0 ? labels[hovered || value] : ""}
      </span>
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-gray-600 font-medium">{star}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-gray-500">{count}</span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export default function ReviewSection({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", message: "", rating: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageUrlRef = useRef<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReviews = useCallback(async (pageNum = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const res = await fetch(`${API}/reviews/${productSlug}?limit=5&page=${pageNum}`, { cache: "no-store" });
      const json = await res.json();
      setReviews((prev) => append ? [...prev, ...(json?.data ?? [])] : (json?.data ?? []));
      setTotal(json?.total ?? 0);
      setHasMore(json?.hasMore ?? false);
    } catch {
      if (!append) setReviews([]);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    setReviews([]);
    setTotal(0);
    setHasMore(false);
    setPage(1);
    fetchReviews(1, false);
  }, [fetchReviews]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchReviews(next, true);
  };

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingCounts = STARS.reduce((acc, s) => {
    acc[s] = reviews.filter((r) => r.rating === s).length;
    return acc;
  }, {} as Record<number, number>);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images allowed");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to backend
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/uploads/review-image`, { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json?.data?.url) throw new Error(json?.message || "Upload failed");
      imageUrlRef.current = json.data.url;
      setImageUrl(json.data.url);
      toast.success("Photo uploaded!");
    } catch (err) {
      console.error("Review image upload error:", err);
      toast.error("Photo upload failed — review can still be submitted without a photo.");
      setImagePreview(null);
      setImageUrl("");
      imageUrlRef.current = "";
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageUrl("");
    imageUrlRef.current = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.message.trim()) e.message = "Review message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    if (!form.rating) e.rating = "Please select a rating";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (imageUploading) { toast.error("Please wait for photo to finish uploading"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/reviews/${productSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrlRef.current }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      toast.success("✅ Review submitted! It will appear after approval.");
      setForm({ name: "", message: "", rating: 0 });
      setImagePreview(null);
      setImageUrl("");
      imageUrlRef.current = "";
      setShowForm(false);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setErrors({});
    setImagePreview(null);
    setImageUrl("");
    imageUrlRef.current = "";
  };

  return (
    <section className="mt-12 sm:mt-14 md:mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#167389]" />
            Customer Reviews
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {total > 0 ? `${total} verified review${total > 1 ? "s" : ""}` : "Be the first to review this product"}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#167389] text-white font-semibold rounded-xl hover:bg-[#125f73] transition-all shadow-md hover:shadow-lg text-sm"
        >
          <Star className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 sm:p-6 mb-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            <StarDisplay rating={Math.round(avgRating)} size="lg" />
            <span className="text-sm text-gray-500 mt-1">{total} review{total > 1 ? "s" : ""}</span>
          </div>
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((s) => (
              <RatingBar key={s} star={s} count={ratingCounts[s] ?? 0} total={reviews.length} />
            ))}
          </div>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#167389]/20 shadow-md p-5 sm:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#167389]" />
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
              <input
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                placeholder="Enter your name"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#167389]/20 focus:border-[#167389]"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your Photo <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              {imagePreview ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#167389]/30 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {imageUploading ? (
                      <span className="text-xs text-[#167389] font-medium flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">✓ Photo ready</span>
                    )}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 w-fit cursor-pointer group">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 group-hover:border-[#167389] flex items-center justify-center transition bg-gray-50 group-hover:bg-[#167389]/5">
                    <Camera className="w-6 h-6 text-gray-400 group-hover:text-[#167389] transition" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-[#167389] transition">Upload photo</p>
                    <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 3MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating *</label>
              <StarPicker value={form.rating} onChange={(v) => { setForm({ ...form, rating: v }); setErrors({ ...errors, rating: "" }); }} />
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review *</label>
              <textarea
                value={form.message}
                onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                rows={4}
                placeholder="Share your experience with this product..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition resize-none ${
                  errors.message ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#167389]/20 focus:border-[#167389]"
                }`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              <p className="text-xs text-gray-400 mt-1">{form.message.length}/500 characters</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || imageUploading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#167389] text-white font-semibold rounded-xl hover:bg-[#125f73] disabled:opacity-60 transition shadow-md text-sm"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin text-[#167389]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-10 text-center">
          <ThumbsUp className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {review.image ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#167389]/20">
                        <Image src={review.image} alt={review.name} fill sizes="44px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#167389] to-[#125f73] flex items-center justify-center ring-2 ring-[#167389]/20">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                      <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                    </div>
                    <StarDisplay rating={review.rating} />
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed">{review.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-[#167389] text-[#167389] font-semibold text-sm hover:bg-[#167389] hover:text-white disabled:opacity-50 transition-all"
              >
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                {loadingMore ? "Loading..." : `Load More Reviews (${total - reviews.length} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
