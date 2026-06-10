// src/lib/cdn.tsx
import Image, { ImageProps } from "next/image";

/** No-op — kept for backwards compatibility */
export function resolveImageSrc(src: string): string {
  return src;
}

/** Previously used for Cloudinary URL transforms — now a no-op passthrough.
 *  Kept for backwards compatibility so all existing cldFill() calls still compile. */
export function cldFill(src: string, _w: number, _h: number) {
  return src;
}

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E";

/** Drop-in replacement for next/image — now simply renders next/image directly. */
export function CldImage({ src, ...props }: ImageProps) {
  const safeSrc = src && (typeof src !== "string" || src.trim() !== "") ? src : PLACEHOLDER;
  const resolvedSrc = typeof safeSrc === "string" ? resolveImageSrc(safeSrc) : safeSrc;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={resolvedSrc} {...props} />;
}
