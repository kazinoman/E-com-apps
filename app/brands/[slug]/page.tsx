import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { PaginationNav } from "@/components/common/PaginationNav";
import { ProductGrid } from "@/components/common/ProductGrid";
import { parsePage } from "@/lib/types/pagination";
import { fetchBrand, fetchBrandProducts } from "@/services/brand.service";

const PAGE_SIZE = 24;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await fetchBrand(slug);
  return { title: brand ? brand.name : "Brand" };
}

/**
 * One brand and its products.
 *
 * `GET /brands/:slug` answers `{slug, name, productCount}` — that is the entire
 * record. No logo, no description, no country, no "since 1998". The header is
 * the name and the count because those are the only two facts that exist.
 */
export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

  // 404s with `BRAND_NOT_FOUND`; the service turns that into null.
  const brand = await fetchBrand(slug);
  if (!brand) notFound();

  const results = await fetchBrandProducts(slug, page, PAGE_SIZE);

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <CustomBreadcrumb
        routes={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />

      <Container className="py-8 lg:py-10">
        <header className="flex flex-col gap-1 pb-6 border-b border-[#EAE4E3] dark:border-zinc-800">
          <h1 className="text-[26px] lg:text-[32px] font-bold text-[#333333] dark:text-white">
            {brand.name}
          </h1>
          <p className="text-[14px] text-[#999999] dark:text-gray-400">
            {brand.productCount.toLocaleString()}{" "}
            {brand.productCount === 1 ? "product" : "products"} in the catalog
          </p>
        </header>

        <div className="mt-6">
          <ProductGrid
            products={results.items}
            emptyMessage={
              page > 1
                ? "No more products on this page."
                : `No products listed under ${brand.name}.`
            }
          />
        </div>

        <PaginationNav
          pagination={results.pagination}
          basePath={`/brands/${encodeURIComponent(slug)}`}
        />
      </Container>
    </div>
  );
}
