// TikTok Pixel event helpers
// https://ads.tiktok.com/help/article/standard-events-parameters

interface TtqInstance {
  track: (event: string, params?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    ttq: TtqInstance;
  }
}

function ttq(): TtqInstance | null {
  if (typeof window === "undefined" || !window.ttq) return null;
  return window.ttq;
}

export function ttqViewContent(params: { content_id: string; content_name: string; value: number }) {
  ttq()?.track("ViewContent", {
    contents: [{ content_id: params.content_id, content_name: params.content_name, quantity: 1, price: params.value }],
    value: params.value,
    currency: "BDT",
  });
}

export function ttqAddToCart(params: { content_id: string; content_name: string; value: number; quantity: number }) {
  ttq()?.track("AddToCart", {
    contents: [{ content_id: params.content_id, content_name: params.content_name, quantity: params.quantity, price: params.value }],
    value: params.value * params.quantity,
    currency: "BDT",
  });
}

export function ttqInitiateCheckout(value: number) {
  ttq()?.track("InitiateCheckout", { value, currency: "BDT" });
}

export function ttqCompletePayment(params: { transaction_id: string; value: number }) {
  ttq()?.track("CompletePayment", {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: "BDT",
  });
}
