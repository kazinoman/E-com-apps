"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header.component";
import { Footer } from "./Footer.component";
import { StoreFeatures } from "@/components/common/StoreFeatures";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname.includes("login") || pathname.includes("signup");

  return (
    <>
      {!hideLayout && (
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>
      )}
      <main className="flex-1 flex flex-col">{children}</main>
      {!hideLayout && <StoreFeatures />}
      {!hideLayout && <Footer />}
    </>
  );
}