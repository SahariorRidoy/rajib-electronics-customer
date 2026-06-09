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

// Stable derived values cached at module level — never recreated
let cache: SiteSettings | null = null;
let activeLogo: Logo | undefined = undefined;
let socialLinks: SocialLink[] = [];
let emails: string[] = [];
let phones: string[] = [];
let siteName: string = process.env.NEXT_PUBLIC_BRAND || "Rajib Electronics";
let fetchPromise: Promise<void> | null = null;

function applyCache(data: SiteSettings) {
  cache = data;
  siteName = data.siteName ?? (process.env.NEXT_PUBLIC_BRAND || "Rajib Electronics");
  activeLogo = data.logos.find((l) => l.isActive);
  socialLinks = data.socialLinks ?? [];
  emails = data.contactInfo?.emails ?? [];
  phones = data.contactInfo?.phones ?? [];
}

export function usePublicSettings() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (cache) return;
    if (fetchPromise) {
      fetchPromise.then(() => forceUpdate((n) => n + 1));
      return;
    }
    const API = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;
    if (!API) return;
    fetchPromise = fetch(`${API}/settings`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.data) return;
        applyCache(res.data);
        forceUpdate((n) => n + 1);
      })
      .catch(() => {});
  }, []);

  return { siteName, activeLogo, socialLinks, emails, phones };
}
