"use client";

import { useState } from "react";
import { Pencil, X, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/types/order";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.rajibelectronics.com/api/v1";

export default function CustomerInfo({ order }: { order: Order }) {
  const info = order.customer;
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(info.address ?? "");
  const [saving, setSaving] = useState(false);

  const canEdit = !["DELIVERED", "CANCELLED", "RETURNED"].includes(order.status);

  const save = async () => {
    if (!address.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/customer/orders/${order._id}/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: info.phone, address: address.trim() }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message ?? "Failed");
      toast.success("Address updated");
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-4 bg-white p-3 rounded border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Customer Information</h4>
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Name:</span> {info.name}</p>
        <p><span className="font-medium">Phone:</span> {info.phone}</p>
        <div className="flex items-start gap-2">
          <span className="font-medium shrink-0">Address:</span>
          {editing ? (
            <div className="flex-1 flex flex-col gap-1.5">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#167389] resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving || !address.trim()}
                  className="flex items-center gap-1 px-3 py-1 bg-[#167389] text-white text-xs rounded hover:bg-[#125f70] disabled:opacity-50 transition"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={() => { setEditing(false); setAddress(info.address ?? ""); }}
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50 transition"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <span>{info.address || "N/A"}</span>
              {canEdit && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-[#167389] hover:text-[#125f70] transition"
                  title="Edit address"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
