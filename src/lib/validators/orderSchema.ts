import { z } from "zod";

export const CustomerInfoSchema = z.object({
  name: z.string().min(2, "Full name required"),
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Enter a valid Bangladeshi number (01XXXXXXXXX)"),
  address: z.string().min(5, "Address required"),
});

export type CustomerInfoFormValues = z.infer<typeof CustomerInfoSchema>;
