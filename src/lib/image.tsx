import NextImage, { ImageProps } from "next/image";

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

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E";

/** Use this instead of next/image throughout the customer frontend */
export default function Image({ src, ...props }: ImageProps) {
  const safeSrc = src && (typeof src !== "string" || src.trim() !== "") ? src : PLACEHOLDER;
  const resolved = typeof safeSrc === "string" ? resolveImageSrc(safeSrc) : safeSrc;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <NextImage src={resolved} {...props} />;
}
