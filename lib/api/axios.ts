import axios from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 Only useful if this instance is shared with client-side code
});

// Request Interceptor: Attach tokens from Next.js cookies
api.interceptors.request.use(async (config) => {
  // 1. Get the Next.js cookie store (async in Next.js 15/16)
  const cookieStore = await cookies();

  // 2. Look for the specific cookie you set in your login Server Action
  const sessionToken = cookieStore.get("buyer_session")?.value;

  if (sessionToken) {
    // OPTION A: If your external API expects this as a Cookie header
    config.headers.Cookie = `buyer_session=${sessionToken}`;

    // OPTION B: If your external API expects this as a Bearer token, use this instead:
    // config.headers.Authorization = `Bearer ${sessionToken}`;
  }

  return config;
});

// Response Interceptor: Handle 401 and Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) throw new Error("No refresh token available");

        // Call your external refresh endpoint
        const refreshResponse = await axios.post(`${process.env.API_BASE_URL}/auth/refresh`, {
          token: refreshToken,
        });

        const newAccessToken = refreshResponse.data.accessToken;

        // ⚠️ CRITICAL NEXT.JS LIMITATION:
        // You cannot call `cookieStore.set()` inside a Server Component.
        // If this runs during a Server Component render, the server knows the new token,
        // but it CANNOT send it back to the user's browser.
        // (See the note below on how to fix this using Middleware).

        // Update the original request with the new token and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or throw
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
