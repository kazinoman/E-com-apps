"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { relaySessionCookie } from "@/lib/session-cookie";

export type SignupResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function signup(values: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<SignupResponse> {
  try {
    const response = await api.post(auth.register, values);

    // Signing up signs you in, so relay the session cookie the same way
    // login does.
    await relaySessionCookie(response.headers["set-cookie"]);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Signup failed",
    };
  }
}
