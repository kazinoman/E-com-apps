"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

export const ProductGallery = ({ images, activeIndex: externalIndex, onActiveIndexChange }: ProductGalleryProps) => {
  const [internalIndex, setInternalIndex] = useState(0);

  const activeIndex = externalIndex ?? internalIndex;
  const setActiveIndex = onActiveIndexChange ?? setInternalIndex;

  const nextImage = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-slate-50 flex items-center justify-center p-8 overflow-hidden group">
        <Image
          src={images[activeIndex]}
          alt={`Product image ${activeIndex + 1}`}
          fill
          className="object-contain p-8 mix-blend-multiply"
          priority
        />
        
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-slate-400" : "w-2 bg-slate-200"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevImage}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-300/50 hover:bg-slate-300 text-slate-700 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-square w-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border-2 transition-all duration-200",
                i === activeIndex ? "border-slate-800" : "border-transparent hover:border-slate-200"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-contain p-2 mix-blend-multiply"
              />
            </button>
          ))}
        </div>

        <button
          onClick={nextImage}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-800 text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
