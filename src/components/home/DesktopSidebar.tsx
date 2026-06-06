"use client";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { Category } from "@/lib/schemas";
import { memo, useState, useEffect} from "react";

interface Props {
  categories: Category[];
  loading: boolean;
}

function DesktopSidebarBase({ categories, loading }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <aside className="hidden lg:block">
        <div className="desktop-sidebar h-full">
          <div className="desktop-sidebar__header">
            <Sparkles size={18} /> Categories
          </div>
          <div className="desktop-sidebar__content">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`safe-${i}`} className="desktop-sidebar__skeleton" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky">
        <div className="desktop-sidebar h-full">
          <div className="desktop-sidebar__header">
            <Sparkles size={18} /> Categories
          </div>
          <div className="desktop-sidebar__content">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`load-${i}`}
                    className="desktop-sidebar__skeleton"
                  />
                ))
              : categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/c/${c.slug}`}
                    className="group rounded-md border border-gray-200 bg-white p-1 flex flex-col items-stretch hover:shadow-md hover:border-cyan-300 transition"
                  >
                    <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-50">
                      <Image
                        src={c.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"}
                        alt={c.title}
                        fill
                        sizes="110px"
                        className="object-contain p-1"
                        onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"; }}
                      />
                    </div>
                    <p className="flex items-center justify-center text-[11px] font-semibold text-gray-800 text-center py-1 px-1 leading-tight line-clamp-2">
                      {c.title}
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export const DesktopSidebar = memo(DesktopSidebarBase);
