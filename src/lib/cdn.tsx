// src/lib/cdn.tsx
import Image, { ImageProps } from "next/image";

/** Rewrites production image URLs to localhost in development */
export function resolveImageSrc(src: string): string {
  if (!src) return src;
  if (process.env.NODE_ENV === "development") {
    return src.replace(
      /https:\/\/api\.rajibelectronics\.com/g,
      "http://localhost:5000"
    );
  }
  return src;
}

/** Previously used for Cloudinary URL transforms — now a no-op passthrough.
 *  Kept for backwards compatibility so all existing cldFill() calls still compile. */
export function cldFill(src: string, _w: number, _h: number) {
  return src;
}

/** Drop-in replacement for next/image — now simply renders next/image directly. */
export function CldImage({ src, ...props }: ImageProps) {
  const resolvedSrc = typeof src === "string" ? resolveImageSrc(src) : src;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={resolvedSrc} {...props} />;
}
