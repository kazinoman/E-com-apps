"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header.component";
import { Footer } from "./Footer.component";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname.includes("login") || pathname.includes("signup");

  return (
    <>
      {!hideLayout && <Header />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
