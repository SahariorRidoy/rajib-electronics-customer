
import { z } from "zod";

export const ZCategory = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  images: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "HIDDEN"]),
});

const ZColorVariant = z.object({
  colorName: z.string(),
  colorHex: z.string().optional(),
  image: z.string(),
  imageId: z.string().optional(),
});

export const ZProduct = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.coerce.number().min(0),
  brand: z.string().nullable().optional(),
  manufacturer: z.string().nullable().optional(),
  compareAtPrice: z.coerce.number().min(0).optional(),
  isDiscounted: z.boolean().optional(),
  featured: z.boolean().optional(),
  stock: z.number().optional(),
  availableStock: z.number().optional(),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  tagSlugs: z.array(z.string()).optional(),
  colorVariants: z.array(ZColorVariant).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "HIDDEN"]),
  createdAt: z.string().optional(),
  description: z.string().optional().default(""),
});

export const ZCategoriesResponse = z.object({
  ok: z.boolean(),
  data: z.array(ZCategory),
});

export const ZProductsResponse = z.object({
  ok: z.boolean(),
  data: z.array(ZProduct),
  pageInfo: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number().optional(),
      hasNext: z.boolean().optional(),
    })
    .optional(),
});

export const ZOkProduct = z.object({ ok: z.boolean(), data: ZProduct });
export const ZOkCategory = z.object({ ok: z.boolean(), data: ZCategory });

export type Category = z.infer<typeof ZCategory>;
export type Product = z.infer<typeof ZProduct>;
export type CategoriesResponse = z.infer<typeof ZCategoriesResponse>;
export type ProductsResponse = z.infer<typeof ZProductsResponse>;
