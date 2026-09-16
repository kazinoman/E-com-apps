"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header.component";
import { Footer } from "./Footer.component";
import { StoreFeatures } from "@/components/common/StoreFeatures";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { ScrollToTop } from "@/components/common/ScrollToTop";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname.includes("login") || pathname.includes("signup");
  const isHomePage = pathname === "/";
  const isAuthPage = pathname.includes("login") || pathname.includes("signup");
  /**
   * The catalog-browsing routes build their own breadcrumb from real data and
   * opt out of the path-derived one below, which cannot do better than
   * title-casing URL segments. On those routes it was actively wrong:
   * `/vendor/BBB5pGRqM8jKpfDH4Dn02mPRg` rendered the opaque supplier id as a
   * crumb, and `/category/bags` linked a "Category" crumb at `/category`,
   * which is not a page.
   */
  const ownsBreadcrumb = [/^\/categories/, /^\/category\//, /^\/brands/, /^\/vendor\//].some(
    (route) => route.test(pathname),
  );

  const showBreadcrumb = !isHomePage && !isAuthPage && !ownsBreadcrumb;

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
      <ScrollToTop />
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