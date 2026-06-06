import z from "zod";

export type AppProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  status?: "ACTIVE" | "DRAFT" | "HIDDEN";
  brand?: string | null;
  manufacturer?: string | null;
  description?: string;
  image?: string;
  images?: string[];
  compareAtPrice?: number;
  stock?: number;
  availableStock?: number;
  sku?: string;
  vendor?: string;
  colorVariants?: { colorName: string; colorHex?: string; image: string; imageId?: string }[];
  createdAt?: string | Date;
  updatedAt?: Date;
};

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
  brand: z.string().optional(),
  manufacturer: z.string().optional(),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional(),
  isDiscounted: z.boolean().optional(),
  featured: z.boolean().optional(),
  stock: z.number().optional(),
  availableStock: z.number().optional(),
  categorySlug: z.string().optional(),
  tagSlugs: z.array(z.string()).optional(),
  colorVariants: z.array(ZColorVariant).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "HIDDEN"]),
  createdAt: z.string().optional(),
  description: z.string().optional().default(""),
  sku: z.string().optional(),
  vendor: z.string().optional(),
});

export type Product = z.infer<typeof ZProduct>;
