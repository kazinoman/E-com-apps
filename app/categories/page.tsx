import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { fetchCategories } from "@/services/category.service";

export const metadata: Metadata = {
  title: "All categories",
  description: "Browse the full catalog by category.",
};

/**
 * The category index.
 *
 * `fetchCategories()` already turns the one flat `GET /categories` payload into
 * the two-level tree, so this route re-uses it rather than fetching the list
 * again and rebuilding the same tree.
 *
 * Categories carry a slug and a name and nothing else — no icon, no image, no
 * product count. The cards are therefore typographic; an illustrated tile would
 * mean inventing artwork the catalog does not have.
 */
export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <CustomBreadcrumb routes={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <Container className="py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-[26px] lg:text-[32px] font-bold text-[#333333] dark:text-white">
            All categories
          </h1>
          <p className="text-[14px] text-[#999999] dark:text-gray-400 mt-1">
            {categories.length.toLocaleString()} top-level{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="py-20 text-center text-[15px] text-gray-500 dark:text-gray-400">
            Categories are unavailable right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <section
                key={category.id}
                className="flex flex-col bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  href={`/category/${encodeURIComponent(category.id)}`}
                  className="group flex items-center justify-between gap-2"
                >
                  <h2 className="font-bold text-[16px] text-[#1A1A1A] dark:text-gray-100 group-hover:text-[#F05C22] transition-colors">
                    {category.name}
                  </h2>
                  <ChevronRight className="w-4 h-4 shrink-0 text-[#CCCCCC] group-hover:text-[#F05C22] transition-colors" />
                </Link>

                {category.subcategories.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/category/${encodeURIComponent(sub.id)}`}
                          className="text-[14px] text-[#666666] dark:text-gray-400 hover:text-[#F05C22] dark:hover:text-[#F05C22] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
