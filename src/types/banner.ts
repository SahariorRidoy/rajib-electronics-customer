export type Banner = {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  discount?: string;
  status: "ACTIVE" | "HIDDEN";
  sort: number;
  position: "hero" | "side";
  link?: string;
  categorySlug?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string | { _id: string; slug?: string; title?: string };
};
