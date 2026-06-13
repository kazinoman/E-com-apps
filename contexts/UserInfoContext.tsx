"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isLogin: boolean;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    setIsLogin(!!newUser);

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return <AuthContext.Provider value={{ user, setUser, isLogin }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
