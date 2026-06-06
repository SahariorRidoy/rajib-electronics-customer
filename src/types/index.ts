export type Category = {
  _id: string;
  name?: string;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  status: "ACTIVE" | "HIDDEN";
};

export type ColorVariant = {
  colorName: string;
  colorHex?: string;
  image: string;
  imageId?: string;
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  imageId?: string;
  images?: string[];
  price: number;
  compareAtPrice?: number;
  isDiscounted?: boolean;
  featured?: boolean;
  stock?: number;
  categorySlug?: string;
  subcategorySlug?: string;
  tagSlugs?: string[];
  brand?: string;
  manufacturer?: string | null;
  status: "ACTIVE" | "DRAFT" | "HIDDEN";
  description?: string;
  availableStock?: number;
  colorVariants?: ColorVariant[];
  createdAt?: string;
  updatedAt?: string;
};

export type Paginated<T> = {
  ok: boolean;
  data: T[];
  pageInfo?: {
    page: number;
    limit: number;
    total?: number;
    hasNext?: boolean;
  };
};


// src/lib/schemas.ts - নিচে যোগ করুন
export type CartItem = {
  _id: string;
  title?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  image?: string;
  slug?: string;
  compareAtPrice?: number;
  isDiscounted?: boolean;
  featured?: boolean;
  categorySlug?: string;
  tagSlugs?: string[];
  status?: "ACTIVE" | "DRAFT" | "HIDDEN";
  createdAt?: string;
  updatedAt?: string;
  images?: string[];
  imageId?: string;
};

export type OrderError = {
  code?: string;
  name?: string;
  errors?: { path?: string; message?: string }[];
  message?: string;
  data?: {
    code?: string;
    message?: string;
  };
  status?: number;
  statusCode?: number;
};