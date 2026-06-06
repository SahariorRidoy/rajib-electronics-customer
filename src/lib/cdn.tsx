// src/lib/cdn.tsx
import Image, { ImageProps } from "next/image";

export function cldFill(src: string, w: number, h: number) {
  if (!src.includes("/upload/")) return src;
  return src.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_fill,g_auto,w_${w},h_${h}/`
  );
}

function cldLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.includes("/upload/")) return src;
  return src.replace("/upload/", `/upload/f_auto,q_${quality ?? 75},w_${width}/`);
}

/** Drop-in replacement for next/image that uses Cloudinary for optimization.
 *  For non-Cloudinary src (local files, placeholders) it falls back unoptimized. */
export function CldImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  if (!src.includes("/upload/")) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...props} unoptimized />;
  }
  return <Image {...props} loader={cldLoader} unoptimized={false} />;
}
