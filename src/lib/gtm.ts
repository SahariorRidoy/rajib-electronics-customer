// GTM dataLayer helpers — GA4 ecommerce standard
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
  if (process.env.NODE_ENV === "development") {
    console.log("[GTM]", String(event).replace(/[\r\n]/g, ""), JSON.stringify(data ?? ""));
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function gtmPageView(url: string) {
  push("page_view", { page_path: url });
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface GtmItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  item_category?: string;
  currency?: string;
}

export function gtmViewItem(item: GtmItem) {
  push("view_item", {
    currency: "BDT",
    value: item.price,
    items: [item],
  });
}

export function gtmAddToCart(item: GtmItem, quantity: number) {
  push("add_to_cart", {
    currency: "BDT",
    value: item.price * quantity,
    items: [{ ...item, quantity }],
  });
}

export function gtmRemoveFromCart(item: GtmItem, quantity: number) {
  push("remove_from_cart", {
    currency: "BDT",
    value: item.price * quantity,
    items: [{ ...item, quantity }],
  });
}

export function gtmViewCart(items: GtmItem[], value: number) {
  push("view_cart", {
    currency: "BDT",
    value,
    items,
  });
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export function gtmBeginCheckout(items: GtmItem[], value: number) {
  push("begin_checkout", {
    currency: "BDT",
    value,
    items,
  });
}

export function gtmPurchase(params: {
  transaction_id: string;
  value: number;
  shipping: number;
  items: GtmItem[];
}) {
  push("purchase", {
    currency: "BDT",
    ...params,
  });
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function gtmSearch(search_term: string) {
  push("search", { search_term });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function gtmLogin(method = "email") {
  push("login", { method });
}

export function gtmSignUp(method = "email") {
  push("sign_up", { method });
}
