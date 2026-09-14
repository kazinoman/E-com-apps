"use client";

import { getLocalStorage } from "@/lib/storage";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = getLocalStorage<User>("user");
    if (storedUser) {
      setUserState(storedUser);
      setIsLogin(true);
    }
    setIsAuthLoading(false); // Finished checking
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    setIsLogin(!!newUser);

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return <AuthContext.Provider value={{ user, setUser, isLogin, isAuthLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
