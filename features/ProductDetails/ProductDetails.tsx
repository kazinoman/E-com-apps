"use client";

import { useState } from "react";
import { Product, Sku } from "@/schemas/product";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { ProductTabs } from "./components/ProductTabs";
import { Container } from "@/components/common/Container";

interface ProductDetailsProps {
  product: Product;
  similarProducts?: any[];
}

export const ProductDetails = ({ product, similarProducts = [] }: ProductDetailsProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState<Sku | undefined>(product.skus?.[0]);

  const handleSkuSelect = (sku: Sku) => {
    setSelectedSku(sku);

    const fallbackImages = product.images || (product.image ? [product.image] : []);

    if (sku.image) {
      const idx = fallbackImages.findIndex((img) => img === sku.image);
      if (idx !== -1) {
        setActiveImageIndex(idx);
        return;
      }
    }

    // Fallback for mock data without explicit sku.image mapping
    if (product.colors) {
      const colorIndex = product.colors.findIndex(c => c.name === sku.color);
      if (colorIndex !== -1 && colorIndex < fallbackImages.length) {
        setActiveImageIndex(colorIndex);
      }
    }
  };

  const fallbackImages = product.images || (product.image ? [product.image] : []);
  const displayImages = selectedSku?.image ? [selectedSku.image] : fallbackImages;
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
          <ProductInfo
            product={product}
            selectedSku={selectedSku}
            onSkuSelect={handleSkuSelect}
          />
        </div>
      </div>

      <ProductTabs product={product} similarProducts={similarProducts} />
    </Container>
  );
};
