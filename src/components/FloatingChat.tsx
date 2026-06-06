"use client";

import { useState } from "react";
import { SiWhatsapp, SiMessenger } from "react-icons/si";
import { X, MessageCircle } from "lucide-react";
import { usePublicSettings } from "@/hooks/usePublicSettings";

export default function FloatingChat() {
  const { socialLinks } = usePublicSettings();
  const [open, setOpen] = useState(false);

  const whatsapp = socialLinks.find((l) => l.platform.toLowerCase() === "whatsapp");
  const messenger = socialLinks.find((l) => l.platform.toLowerCase() === "messenger");

  if (!whatsapp && !messenger) return null;

  const buttons = [
    whatsapp && {
      key: "whatsapp",
      href: whatsapp.resolvedLink || `https://wa.me/${whatsapp.value.replace(/\D/g, "")}`,
      icon: <SiWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: "WhatsApp",
      bg: "bg-[#25D366]",
      shadow: "shadow-[0_4px_20px_rgba(37,211,102,0.45)]",
      ring: "focus-visible:ring-green-400",
    },
    messenger && {
      key: "messenger",
      href: messenger.resolvedLink || messenger.value,
      icon: <SiMessenger className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: "Messenger",
      bg: "bg-[#0084FF]",
      shadow: "shadow-[0_4px_20px_rgba(0,132,255,0.45)]",
      ring: "focus-visible:ring-blue-400",
    },
  ].filter(Boolean) as NonNullable<typeof whatsapp extends undefined ? never : {
    key: string; href: string; icon: React.ReactNode;
    label: string; bg: string; shadow: string; ring: string;
  }>[];

  return (
    /* sits above mobile bottom nav (70px) + 16px gap = bottom-[86px], desktop bottom-8 */
    <div className="fixed bottom-[86px] right-3 sm:bottom-8 sm:right-5 z-40 flex flex-col items-end gap-3">

      {/* Expanded chat options */}
      {open && (
        <div className="flex flex-col items-end gap-2.5 mb-1">
          {buttons.map((btn) => (
            <a
              key={btn.key}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat on ${btn.label}`}
              className={`
                flex items-center gap-2.5 pr-3.5 pl-2.5 py-2
                ${btn.bg} ${btn.shadow}
                text-white text-sm font-semibold rounded-full
                hover:brightness-110 active:scale-95
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 ${btn.ring}
              `}
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                {btn.icon}
              </span>
              <span className="whitespace-nowrap">{btn.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <div className="relative">
        {/* Pulse ring — only when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#167389] opacity-30 animate-ping" />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
          className={`
            relative w-12 h-12 sm:w-14 sm:h-14
            rounded-full flex items-center justify-center
            bg-[#167389] text-white
            shadow-[0_4px_24px_rgba(22,115,137,0.5)]
            hover:brightness-110 active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167389]
          `}
        >
          {open
            ? <X className="w-5 h-5 sm:w-6 sm:h-6" />
            : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          }
        </button>
      </div>
    </div>
  );
}
