import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").regex(emailRegex, "Please enter a valid email address"),
});

/*
 * The code and password rules mirror the backend DTO exactly
 * (backend/src/modules/auth/dto/password-reset.dto.ts): a 6-digit code, and a
 * password of 8–72 characters — 72 because bcrypt truncates beyond that.
 * Anything looser here just turns into a round-trip 400.
 */
export const resetPasswordSchema = z
  .object({
    email: z.string().trim().min(1, "Email is required").regex(emailRegex, "Please enter a valid email address"),
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
