"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          borderRadius: "14px",
          boxShadow: "0 20px 40px -8px rgba(0,0,0,0.35), 0 4px 12px -2px rgba(0,0,0,0.2)",
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "360px",
          border: "1px solid rgba(255,255,255,0.08)",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#4ade80",
            secondary: "#1e293b",
          },
          style: {
            background: "linear-gradient(135deg, #052e16 0%, #14532d 100%)",
            color: "#dcfce7",
            border: "1px solid #16a34a",
            boxShadow: "0 20px 40px -8px rgba(22,163,74,0.35), 0 4px 12px -2px rgba(0,0,0,0.2)",
          },
        },
        error: {
          duration: 4500,
          iconTheme: {
            primary: "#f87171",
            secondary: "#1e293b",
          },
          style: {
            background: "linear-gradient(135deg, #2d0a0a 0%, #450a0a 100%)",
            color: "#fee2e2",
            border: "1px solid #dc2626",
            boxShadow: "0 20px 40px -8px rgba(220,38,38,0.35), 0 4px 12px -2px rgba(0,0,0,0.2)",
          },
        },
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: "#60a5fa",
            secondary: "#1e293b",
          },
          style: {
            background: "linear-gradient(135deg, #0c1a2e 0%, #1e3a5f 100%)",
            color: "#dbeafe",
            border: "1px solid #2563eb",
            boxShadow: "0 20px 40px -8px rgba(37,99,235,0.35), 0 4px 12px -2px rgba(0,0,0,0.2)",
          },
        },
      }}
    />
  );
}
