"use client";

import { useEffect, useState } from "react";

interface Logo {
  _id: string;
  logoUrl: string;
  isActive: boolean;
}

interface SocialLink {
  _id: string;
  platform: string;
  value: string;
  label: string;
  resolvedLink?: string;
}

interface ContactInfo {
  emails: string[];
  phones: string[];
}

interface SiteSettings {
  siteName: string;
  logos: Logo[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
}

let cache: SiteSettings | null = null;

export function usePublicSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);

  useEffect(() => {
    if (cache) return;
    const API = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;
    if (!API) return;
    let cancelled = false;
    fetch(`${API}/settings`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled || !res.data) return;
        cache = res.data;
        setSettings(res.data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const activeLogo = settings?.logos.find((l) => l.isActive);
  const siteName = settings?.siteName ?? (process.env.NEXT_PUBLIC_BRAND || "Rajib Electronics");
  const socialLinks = settings?.socialLinks ?? [];
  const emails = settings?.contactInfo?.emails ?? [];
  const phones = settings?.contactInfo?.phones ?? [];

  return { siteName, activeLogo, socialLinks, emails, phones };
}
