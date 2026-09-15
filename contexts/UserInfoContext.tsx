"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Client-side view of the signed-in customer.
 *
 * This context is DISPLAY STATE, not authority. The real session is the
 * httpOnly `buyer_session` cookie, which the browser cannot read; the user
 * object below is handed down from a Server Component that resolved it via
 * GET /me (see lib/auth-server.ts).
 *
 * Nothing here is persisted. An earlier version kept the user in localStorage
 * and derived `isLogin` from its presence, which meant anyone could grant
 * themselves a session from devtools, and led to `user.id` being sent to the
 * API as a query parameter. Identity now travels only as a cookie the client
 * cannot forge.
 */

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isLogin: boolean;
  /**
   * Kept for compatibility with components that render a skeleton while auth
   * resolves. It is now always false: the server knows who the viewer is
   * before the first byte of HTML, so there is no loading window.
   */
  isAuthLoading: boolean;
  /**
   * Update the local view after a sign-in or sign-out that already happened
   * on the server. This does NOT create or destroy a session on its own — the
   * Server Action that set or cleared the cookie did that.
   */
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUserState] = useState<User | null>(initialUser);

  const setUser = (newUser: User | null) => setUserState(newUser);

  return (
    <AuthContext.Provider
      value={{ user, isLogin: user !== null, isAuthLoading: false, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
