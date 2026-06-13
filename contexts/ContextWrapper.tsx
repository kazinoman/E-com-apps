"use client";

import { ReactNode } from "react";

import { AuthProvider } from "./UserInfoContext";

export function ContextWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
