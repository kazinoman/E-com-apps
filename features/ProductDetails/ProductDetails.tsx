"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { primaryImage, type Product, type ProductCardData, type Sku } from "@/schemas/product";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { ProductTabs } from "./components/ProductTabs";
import { Container } from "@/components/common/Container";
import { ProductCard } from "@/components/common/ProductCard";

interface ProductDetailsProps {
  product: Product;
  similarProducts?: ProductCardData[];
  /** Merchant's current advance percentage — fetched server-side, never hardcoded. */
  advancePct: number;
}

export const ProductDetails = ({ product, similarProducts = [], advancePct }: ProductDetailsProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState<Sku | undefined>(undefined);
  const router = useRouter();

  const handleShowMoreSimilar = () => {
    if (product.category) {
      router.push(`/search?subCategory=${encodeURIComponent(product.category)}`);
    } else {
      router.push('/search');
    }
  };

  console.log({ product })
  /*
   * The gallery is the product's own images. A selected SKU usually has its
   * own photo, and when it is one of the product images we jump to it rather
   * than swapping the gallery out — a shopper who picked a colour should still
   * be able to page through the other shots.
   */
  const images = useMemo(() => {
    const urls = product.images.map((i) => i.url);
    if (urls.length) return urls;
    const primary = primaryImage(product);
    return primary ? [primary] : [];
  }, [product]);

  const handleSkuSelect = (sku: Sku) => {
    setSelectedSku(sku);
    if (!sku.imageUrl) return;
    const idx = images.indexOf(sku.imageUrl);
    if (idx !== -1) setActiveImageIndex(idx);
  };

  // A SKU image that is not in the gallery is appended rather than dropped, so
  // picking that variant still shows the variant.
  const displayImages =
    selectedSku?.imageUrl && !images.includes(selectedSku.imageUrl)
      ? [selectedSku.imageUrl, ...images]
      : images;

  const currentActiveIndex = activeImageIndex >= displayImages.length ? 0 : activeImageIndex;

  return (
    <Container className=" py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
        {/* Left Column: Gallery */}
        <div className="w-full">
          <ProductGallery
            images={displayImages}
            activeIndex={currentActiveIndex}
            onActiveIndexChange={setActiveImageIndex}
          />
        </div>

        {/* Right Column: Info */}
        <div className="w-full">
          <ProductInfo product={product} selectedSku={selectedSku} onSkuSelect={handleSkuSelect} advancePct={advancePct} />
        </div>
      </div>

      <ProductTabs product={product} similarProducts={similarProducts} />

      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-gray-50">Similar Products</h2>
          <div className="grid grid-cols-2 min-[450px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {similarProducts.slice(0, 15).map((p) => (
              <div key={p.id} className="w-full max-w-[280px] mx-auto min-[450px]:mx-0">
                <ProductCard {...p} />
              </div>
            ))}
          </div>

          {similarProducts.length >= 15 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleShowMoreSimilar}
                className="px-10 py-4 text-base md:text-lg font-semibold text-slate-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-600 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
              >
                Show More Products
              </button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};
