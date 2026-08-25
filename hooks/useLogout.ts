"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/UserInfoContext";
import { logoutAction } from "@/server/actions/logout.action";
import { PageUrls } from "@/constants/PageUrls";

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await logoutAction();

      console.log(res)
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local user context
      setUser(null);

      // Redirect to home or login page
      router.push(PageUrls.home || "/");
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
}
