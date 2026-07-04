"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gtmPageView } from "@/lib/gtm";
import Footer from "./Footer";
import Topbar from "./Topbar";
import AuthProvider from "./AuthProvider";
import FloatingChat from "./FloatingChat";

// Suppress Next.js 15 params/searchParams Proxy warnings triggered by
// Chrome extensions (e.g. DataLayer Inspector / GTM Debugger) that call
// JSON.stringify on the page props. All real occurrences in this codebase
// are already fixed; what remains is extension noise.
function useSupressExtensionParamWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const orig = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (
        msg.includes("React.use()") &&
        (msg.includes("params") || msg.includes("searchParams"))
      ) return;
      orig(...args);
    };
    return () => { console.error = orig; };
  }, []);
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSupressExtensionParamWarnings();
  const pathname = usePathname();

  useEffect(() => {
    gtmPageView(pathname);
  }, [pathname]);
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname);

  return (
    <AuthProvider>
      {isAuthPage ? (
        children
      ) : (
        <div className="min-h-screen relative overflow-hidden">
          <div className="relative z-10">
            <Topbar />
            <main className="w-full bg-[#F5FDF8] pt-0">{children}</main>
            <Footer />
          </div>
          <FloatingChat />
        </div>
      )}
    </AuthProvider>
  );
}
