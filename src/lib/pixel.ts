// Meta Pixel event helpers — typed, tree-shakeable
// https://developers.facebook.com/docs/meta-pixel/reference

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "1300284518118504";

/** Fire any standard or custom pixel event */
export function pixelEvent(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] ${event}`, params ?? "");
  }
  if (eventId) {
    window.fbq("track", event, params ?? {}, { eventID: eventId });
  } else if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}

// ─── Standard ecommerce events ───────────────────────────────────────────────

type PixelContent = { id: string; quantity: number; item_price: number; title: string };

export function pixelViewContent(params: {
  content_ids: string[];
  content_name: string;
  contents: PixelContent[];
  content_type?: string;
  value?: number;
  currency?: string;
}) {
  pixelEvent("ViewContent", {
    content_type: "product",
    currency: "BDT",
    ...params,
    value: params.value != null ? parseFloat(params.value.toFixed(2)) : undefined,
  });
}

export function pixelAddToCart(params: {
  content_ids: string[];
  content_name: string;
  contents: PixelContent[];
  value: number;
  quantity?: number;
  currency?: string;
}) {
  pixelEvent("AddToCart", {
    content_type: "product",
    currency: "BDT",
    ...params,
    value: parseFloat(params.value.toFixed(2)),
  });
}

export function pixelInitiateCheckout(params: {
  content_ids: string[];
  contents: PixelContent[];
  num_items: number;
  value: number;
  currency?: string;
}) {
  pixelEvent("InitiateCheckout", {
    currency: "BDT",
    ...params,
    value: parseFloat(params.value.toFixed(2)),
  });
}

export function pixelPurchase(params: {
  content_ids: string[];
  contents: PixelContent[];
  num_items: number;
  value: number;
  currency?: string;
  order_id?: string;
}) {
  const { order_id, currency = "BDT", value, ...rest } = params;
  pixelEvent(
    "Purchase",
    { ...rest, value: parseFloat(value.toFixed(2)), currency },
    order_id
  );
}

export function pixelSearch(params: { search_string: string }) {
  pixelEvent("Search", params);
}

export function pixelCompleteRegistration() {
  pixelEvent("CompleteRegistration");
}

export function pixelContact() {
  pixelEvent("Contact");
}
