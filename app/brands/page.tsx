import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { PaginationNav } from "@/components/common/PaginationNav";
import { parsePage } from "@/lib/types/pagination";
import { fetchBrands } from "@/services/brand.service";

const PAGE_SIZE = 48;

export const metadata: Metadata = {
  title: "All brands",
  description: "Browse every brand in the catalog.",
};

/**
 * The brand index.
 *
 * ~4,566 brands, so this is paginated server-side at 48 a page (the backend
 * caps `page_size` at 100). It is *not* searchable: `GET /brands` accepts `?q=`
 * and `?search=` and ignores both — they come back as page 1, unfiltered — so a
 * search box here would be a control that silently does nothing. Until the
 * endpoint grows a filter, paging is the whole story.
 *
 * The backend returns brands in descending product count, which puts the ones
 * worth browsing first.
 */
export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

  const { items, pagination } = await fetchBrands(page, PAGE_SIZE);

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <CustomBreadcrumb routes={[{ label: "Home", href: "/" }, { label: "Brands" }]} />

      <Container className="py-8 lg:py-12">
        <header className="mb-8">
          <h1 className="text-[26px] lg:text-[32px] font-bold text-[#333333] dark:text-white">
            All brands
          </h1>
          <p className="text-[14px] text-[#999999] dark:text-gray-400 mt-1">
            {pagination.totalItems.toLocaleString()} brands, most stocked first
          </p>
        </header>

        {items.length === 0 ? (
          <div className="py-20 text-center text-[15px] text-gray-500 dark:text-gray-400">
            No brands on this page.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {items.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${encodeURIComponent(brand.slug)}`}
                className="group flex flex-col justify-between gap-2 bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl px-4 py-4 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Brands carry a slug, a name and a count — there is no logo
                    in the catalog, so none is drawn. */}
                <span className="font-semibold text-[15px] leading-snug text-[#333333] dark:text-gray-100 line-clamp-2 group-hover:text-[#F05C22] transition-colors">
                  {brand.name}
                </span>
                <span className="text-[12px] text-[#999999] dark:text-gray-500">
                  {brand.productCount.toLocaleString()}{" "}
                  {brand.productCount === 1 ? "product" : "products"}
                </span>
              </Link>
            ))}
          </div>
        )}

        <PaginationNav pagination={pagination} basePath="/brands" />
      </Container>
    </div>
  );
}
