import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Package, Star, TrendingUp } from "lucide-react";
import { Container } from "@/components/common/Container";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { PaginationNav } from "@/components/common/PaginationNav";
import { ProductGrid } from "@/components/common/ProductGrid";
import { parsePage } from "@/lib/types/pagination";
import { vendorDisplayName } from "@/lib/types/vendor";
import { fetchVendor, fetchVendorProducts } from "@/services/vendor.service";

const PAGE_SIZE = 24;

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const vendor = await fetchVendor(id);
  const name = vendor ? vendorDisplayName(vendor) : null;
  return { title: name ?? "Supplier" };
}

/**
 * A supplier's storefront.
 *
 * `name` is frequently the vendor id repeated back — an upstream backfill that
 * never finished — so `vendorDisplayName` returns null in that case and the
 * page falls back to the generic heading "Supplier". Printing
 * `BBB5pGRqM8jKpfDH4Dn02mPRg` as a shop name would be showing the customer an
 * internal key and calling it a business.
 *
 * `score`, `productCount` and `unitsSold` are each nullable and each stat
 * disappears rather than rendering a zero — an unrated supplier is not a
 * supplier rated 0.
 */
export default async function VendorPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

  const vendor = await fetchVendor(id);
  if (!vendor) notFound();

  const results = await fetchVendorProducts(id, page, PAGE_SIZE);

  const name = vendorDisplayName(vendor);
  const heading = name ?? "Supplier";

  const stats: { icon: React.ReactNode; label: string; value: string }[] = [];
  if (vendor.score !== null && vendor.score !== undefined) {
    stats.push({
      icon: <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />,
      label: "Supplier score",
      value: vendor.score.toFixed(1),
    });
  }
  if (vendor.productCount !== null && vendor.productCount !== undefined) {
    stats.push({
      icon: <Package className="w-4 h-4 text-[#8492C4]" />,
      label: vendor.productCount === 1 ? "Product" : "Products",
      value: vendor.productCount.toLocaleString(),
    });
  }
  if (vendor.unitsSold !== null && vendor.unitsSold !== undefined) {
    stats.push({
      icon: <TrendingUp className="w-4 h-4 text-[#8492C4]" />,
      label: "Units sold",
      value: vendor.unitsSold.toLocaleString(),
    });
  }

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <CustomBreadcrumb routes={[{ label: "Home", href: "/" }, { label: heading }]} />

      <Container className="py-8 lg:py-10">
        <header className="flex flex-col gap-4 pb-6 border-b border-[#EAE4E3] dark:border-zinc-800">
          <div>
            <h1 className="text-[26px] lg:text-[32px] font-bold text-[#333333] dark:text-white">
              {heading}
            </h1>
            {/* No subtitle when the name is missing: there is nothing true to
                put there, and the id is not a name. */}
            {name === null && (
              <p className="text-[14px] text-[#999999] dark:text-gray-400 mt-1">
                This supplier has not published a trading name.
              </p>
            )}
          </div>

          {stats.length > 0 && (
            <dl className="flex flex-wrap gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-xl px-4 py-2.5"
                >
                  {stat.icon}
                  <div className="flex flex-col leading-tight">
                    <dt className="text-[12px] text-[#999999] dark:text-gray-500">{stat.label}</dt>
                    <dd className="text-[15px] font-bold text-[#333333] dark:text-gray-100">
                      {stat.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </header>

        <div className="mt-6">
          <ProductGrid
            products={results.items}
            emptyMessage={
              page > 1
                ? "No more products on this page."
                : "This supplier has no products listed."
            }
          />
        </div>

        <PaginationNav
          pagination={results.pagination}
          basePath={`/vendor/${encodeURIComponent(id)}`}
        />
      </Container>
    </div>
  );
}
