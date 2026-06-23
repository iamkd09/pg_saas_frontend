import { z } from "zod";

export const registerSchema = z.object({
  organization_name: z.string().min(2, "Organization name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z.string().min(10, "Enter a valid phone number"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
