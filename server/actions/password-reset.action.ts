"use server";

import { cookies } from "next/headers";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import type { PasswordResetResult } from "@/lib/types/password-reset";

/**
 * Step 1 — ask for a reset code.
 *
 * The backend takes exactly one of `email` / `phone`; only email actually
 * delivers today (SMS needs paid credentials), so the UI only offers email.
 *
 * It answers 204 whether or not the address is registered — deliberately, so
 * the endpoint cannot be used to enumerate accounts. That means a `success`
 * here says only "the request was accepted", never "an account exists" or "a
 * mail was sent", and the copy on the page must not claim more than that.
 */
export async function requestPasswordReset(values: { email: string }): Promise<PasswordResetResult> {
  try {
    await api.post(auth.passwordReset.request, { email: values.email });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Could not start the password reset",
    };
  }
}

/**
 * Step 2 — redeem the emailed 6-digit code and set the new password.
 *
 * `newPassword` is camelCase here and goes out as `new_password`: the axios
 * request interceptor snake-cases outbound bodies (lib/api/axios.ts).
 *
 * The backend clears the caller's own session cookie on success so the shopper
 * signs in afresh, so we mirror that locally. Only `buyer_session` is dropped —
 * the guest cart/wishlist/compare tokens are untouched, exactly as the backend
 * leaves them.
 */
export async function confirmPasswordReset(values: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<PasswordResetResult> {
  try {
    await api.post(auth.passwordReset.confirm, {
      email: values.email,
      code: values.code,
      newPassword: values.newPassword,
    });

    const jar = await cookies();
    jar.delete(SESSION_COOKIE);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Could not reset the password",
    };
  }
}
