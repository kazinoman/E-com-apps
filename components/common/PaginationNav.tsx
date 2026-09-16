import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/types/pagination";

/**
 * Server-rendered pagination: every control is a `<Link>`, so this stays a
 * Server Component and the paged data keeps being fetched on the server.
 *
 * `/brands` has 4,566 rows and `/category/bags` has 6,812 products, so a full
 * page list is out of the question — this renders a window around the current
 * page with the first and last always reachable.
 */

interface PaginationNavProps {
  pagination: PaginationMeta;
  /** Route path without a query string, e.g. `/brands` or `/category/bags`. */
  basePath: string;
  /** Query params to carry across every link (sort, filters…). `page` is set here. */
  params?: Record<string, string | undefined>;
  className?: string;
}

/** `1 … 4 5 [6] 7 8 … 92`, with `null` standing in for each gap. */
function pageWindow(page: number, totalPages: number): (number | null)[] {
  const span = 2;
  const wanted = new Set<number>([1, totalPages]);
  for (let p = page - span; p <= page + span; p++) {
    if (p >= 1 && p <= totalPages) wanted.add(p);
  }

  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (previous && p - previous > 1) out.push(null);
    out.push(p);
    previous = p;
  }
  return out;
}

export function PaginationNav({ pagination, basePath, params, className }: PaginationNavProps) {
  const { page, totalPages, totalItems } = pagination;
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value) query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const box =
    "inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-lg border text-[14px] font-medium transition-colors";
  const idle =
    "bg-white dark:bg-zinc-900 border-[#EAE4E3] dark:border-zinc-800 text-[#333333] dark:text-gray-200 hover:border-[#F05C22] hover:text-[#F05C22]";
  const disabled =
    "bg-white dark:bg-zinc-900 border-[#F0F0F0] dark:border-zinc-800 text-[#CCCCCC] dark:text-zinc-700 pointer-events-none";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-2 pt-10", className)}
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" aria-label="Previous page" className={cn(box, idle)}>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(box, disabled)}>
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pageWindow(page, totalPages).map((target, i) =>
        target === null ? (
          <span key={`gap-${i}`} className="px-1 text-[#999999] select-none">
            …
          </span>
        ) : target === page ? (
          <span
            key={target}
            aria-current="page"
            className={cn(box, "bg-[#F05C22] border-[#F05C22] text-white")}
          >
            {target}
          </span>
        ) : (
          <Link key={target} href={href(target)} className={cn(box, idle)}>
            {target}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" aria-label="Next page" className={cn(box, idle)}>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(box, disabled)}>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}

      <span className="w-full text-center text-[13px] text-[#999999] dark:text-gray-500 mt-2">
        Page {page.toLocaleString()} of {totalPages.toLocaleString()} ·{" "}
        {totalItems.toLocaleString()} results
      </span>
    </nav>
  );
}
