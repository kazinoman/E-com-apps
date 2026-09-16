"use client";

import { useMemo, useState } from "react";
import { primaryImage, type Product, type ProductCardData, type Sku } from "@/schemas/product";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { ProductTabs } from "./components/ProductTabs";
import { Container } from "@/components/common/Container";

interface ProductDetailsProps {
  product: Product;
  similarProducts?: ProductCardData[];
}

export const ProductDetails = ({ product, similarProducts = [] }: ProductDetailsProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState<Sku | undefined>(undefined);

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
          <ProductInfo product={product} selectedSku={selectedSku} onSkuSelect={handleSkuSelect} />
        </div>
      </div>

      <ProductTabs product={product} similarProducts={similarProducts} />
    </Container>
  );
};
