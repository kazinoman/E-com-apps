import { searchProducts, fetchCategories, SearchParams } from "@/services/search.service";
import { ProductCard } from "@/components/common/ProductCard";
import { FilterSidebar } from "@/features/Search/FilterSidebar";
import { ActiveFilters } from "@/features/Search/ActiveFilters";
import { FilterDrawer } from "@/features/Search/FilterDrawer";
import { InfiniteProductGrid } from "@/features/Search/InfiniteProductGrid";
import { Container } from "@/components/common/Container";

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  // Wait for searchParams to be resolved (Next 15 compatibility standard)
  const params = await searchParams;
  
  const query: SearchParams = {
    category: params.category,
    subCategory: params.subCategory,
    title: params.title,
    search: params.search,
    sort: params.sort,
    order: params.order,
    priceMin: params.priceMin ? Number(params.priceMin) : undefined,
    priceMax: params.priceMax ? Number(params.priceMax) : undefined,
    rating: params.rating ? Number(params.rating) : undefined,
    color: params.color,
    page: 1,
    limit: 8,
  };

  const [response, categories] = await Promise.all([
    searchProducts(query),
    fetchCategories()
  ]);
  
  const products = response?.data || [];
  const total = response?.meta?.pagination?.total || 0;


  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <Container className="py-8 flex flex-col md:flex-row gap-8">
        {/* Mobile & Tablet Header & Drawer */}
        <div className="md:hidden flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">Search Results</h1>
          <FilterDrawer categories={categories} />
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[150px] lg:w-[240px] shrink-0 sticky top-0 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1 pb-10">
           <FilterSidebar categories={categories} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <ActiveFilters total={total} />
          
          <InfiniteProductGrid 
            key={JSON.stringify(query)}
            initialProducts={products}
            initialTotalPages={response?.meta?.pagination?.totalPages || 1}
            queryParams={query}
          />
        </div>
      </Container>
    </div>
  )
}
