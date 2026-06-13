"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

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
