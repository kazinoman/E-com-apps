import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Container } from "./Container";

export interface BreadcrumbRoute {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  /**
   * Array of route objects defining the breadcrumb path.
   * If `href` is provided, it renders as a clickable link.
   * If no `href` is provided (typically the last item), it renders as the current page text.
   */
  routes: BreadcrumbRoute[];
  /**
   * Optional custom separator icon. Defaults to ChevronRight.
   */
  separator?: React.ReactNode;
}

/**
 * A highly reusable, dark-mode friendly breadcrumb component.
 * Built on top of shadcn/ui Breadcrumb to ensure accessibility and consistent styling.
 */
export function CustomBreadcrumb({
  routes,
  separator = <ChevronRight className="w-4 h-4 opacity-50" />
}: CustomBreadcrumbProps) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="w-full bg-[#F8F9FA] dark:bg-black py-4 border-b border-[#EAE4E3] dark:border-zinc-800">
      <Container >
        <Breadcrumb>
          <BreadcrumbList>
            {routes.map((route, index) => {
              const isLast = index === routes.length - 1;

              return (
                <React.Fragment key={`${route.label}-${index}`}>
                  <BreadcrumbItem>
                    {!isLast && route.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={route.href}
                          className="text-[14px] font-medium text-[#8492C4] hover:text-[#5B6AB0] dark:text-[#A5B4FC] dark:hover:text-[#C7D2FE] transition-colors"
                        >
                          {route.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-[14px] font-bold text-[#333333] dark:text-white">
                        {route.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {!isLast && (
                    <BreadcrumbSeparator>
                      {separator}
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </div>
  );
}
