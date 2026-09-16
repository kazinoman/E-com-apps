import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { CustomBreadcrumb, type BreadcrumbRoute } from "@/components/common/CustomBreadcrumb";
import { PaginationNav } from "@/components/common/PaginationNav";
import { ProductGrid } from "@/components/common/ProductGrid";
import { cn } from "@/lib/utils";
import { parsePage } from "@/lib/types/pagination";
import {
  fetchCategory,
  fetchCategoryContext,
  fetchCategoryProducts,
} from "@/services/category.service";

const PAGE_SIZE = 24;

/**
 * The backend validates `sort` against exactly these five values and 400s on
 * anything else, so an unknown `?sort=` in the URL is dropped rather than
 * forwarded. `relevance` is omitted: with no search query it sorts by nothing.
 */
const SORTS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
] as const;

type Params = { slug: string };
type Query = { page?: string; sort?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  return { title: category ? category.name : "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Query>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const page = parsePage(query.page);
  const sort = SORTS.some((s) => s.value === query.sort) ? query.sort : undefined;

  // A missing category is a 404, not an empty grid — `?category=` on the
  // products endpoint happily returns nothing for a slug that never existed.
  const category = await fetchCategory(slug);
  if (!category) notFound();

  const [results, context] = await Promise.all([
    fetchCategoryProducts(slug, page, PAGE_SIZE, sort),
    fetchCategoryContext(slug),
  ]);

  // `ancestors` is the backend's own trail; the tree lookup is the fallback for
  // a child whose detail response leaves it empty.
  const trail: BreadcrumbRoute[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
  ];
  const ancestors = category.ancestors?.length
    ? category.ancestors
    : context.parent
      ? [{ slug: context.parent.id, name: context.parent.name }]
      : [];
  for (const ancestor of ancestors) {
    trail.push({ label: ancestor.name, href: `/category/${encodeURIComponent(ancestor.slug)}` });
  }
  trail.push({ label: category.name });

  const children = context.node?.subcategories ?? [];
  const { totalItems } = results.pagination;

  const sortHref = (value?: string) => {
    const qs = new URLSearchParams();
    if (value) qs.set("sort", value);
    const s = qs.toString();
    return s ? `/category/${encodeURIComponent(slug)}?${s}` : `/category/${encodeURIComponent(slug)}`;
  };

  const chip =
    "inline-flex items-center h-9 px-4 rounded-full border text-[13px] font-medium transition-colors whitespace-nowrap";
  const chipIdle =
    "bg-white dark:bg-zinc-900 border-[#EAE4E3] dark:border-zinc-800 text-[#555555] dark:text-gray-300 hover:border-[#F05C22] hover:text-[#F05C22]";
  const chipActive = "bg-[#F05C22] border-[#F05C22] text-white";

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <CustomBreadcrumb routes={trail} />

      <Container className="py-8 lg:py-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-[26px] lg:text-[32px] font-bold text-[#333333] dark:text-white">
            {category.name}
          </h1>
          <p className="text-[14px] text-[#999999] dark:text-gray-400">
            {totalItems.toLocaleString()} {totalItems === 1 ? "product" : "products"}
          </p>
        </header>

        {children.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {children.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${encodeURIComponent(sub.id)}`}
                className={cn(chip, chipIdle)}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-6 pb-6 border-b border-[#EAE4E3] dark:border-zinc-800">
          <span className="text-[13px] text-[#999999] dark:text-gray-500 mr-1">Sort</span>
          <Link href={sortHref()} className={cn(chip, sort ? chipIdle : chipActive)}>
            Default
          </Link>
          {SORTS.map((option) => (
            <Link
              key={option.value}
              href={sortHref(option.value)}
              className={cn(chip, sort === option.value ? chipActive : chipIdle)}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <ProductGrid
            products={results.items}
            emptyMessage={
              page > 1
                ? "No more products on this page."
                : `No products in ${category.name} yet.`
            }
          />
        </div>

        <PaginationNav
          pagination={results.pagination}
          basePath={`/category/${encodeURIComponent(slug)}`}
          params={{ sort }}
        />
      </Container>
    </div>
  );
}
