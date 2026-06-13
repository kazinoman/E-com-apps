import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").regex(emailRegex, "Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.email("Please enter a valid email"),

  phone: z.string().min(11, "Phone number is invalid"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
