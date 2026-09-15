"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header.component";
import { Footer } from "./Footer.component";
import { StoreFeatures } from "@/components/common/StoreFeatures";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname.includes("login") || pathname.includes("signup");
  const isHomePage = pathname === "/";
  const isAuthPage = pathname.includes("login") || pathname.includes("signup");
  const showBreadcrumb = !isHomePage && !isAuthPage;

  const breadcrumbRoutes = (() => {
    if (isHomePage) return [];
    const segments = pathname.split('/').filter(Boolean);
    const routes: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];
    
    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      routes.push({ label, href: currentPath });
    });
    
    if (routes.length > 0) {
      delete routes[routes.length - 1].href;
    }
    
    return routes;
  })();

  return (
    <>
      {!hideLayout && (
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>
      )}
      {showBreadcrumb && (
        <CustomBreadcrumb routes={breadcrumbRoutes} />
      )}
      <main className="flex-1 flex flex-col">{children}</main>
      {!hideLayout && <StoreFeatures />}
      {!hideLayout && <Footer />}
    </>
  );
}