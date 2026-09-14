"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

export const ProductGallery = ({ images, activeIndex: externalIndex, onActiveIndexChange }: ProductGalleryProps) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));

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
      <div 
        className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden group cursor-pointer"
        onClick={() => {
          setZoomLevel(1);
          setIsZoomModalOpen(true);
        }}
      >
        <Image
          src={images[activeIndex]}
          alt={`Product image ${activeIndex + 1}`}
          fill
          className="object-cover mix-blend-multiply dark:mix-blend-normal"
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
                i === activeIndex ? "w-6 bg-slate-400 dark:bg-gray-300" : "w-2 bg-slate-200 dark:bg-gray-700"
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
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-300/50 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition-colors"
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
                "relative aspect-square w-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-gray-900 border-2 transition-all duration-200",
                i === activeIndex ? "border-slate-800 dark:border-gray-400" : "border-transparent hover:border-slate-200 dark:hover:border-gray-700"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
              />
            </button>
          ))}
        </div>

        <button
          onClick={nextImage}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-700 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-200 text-white dark:text-black transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Close button */}
          <button 
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[110] bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Zoom controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 px-6 py-3 rounded-full z-[110] text-white backdrop-blur-md border border-white/20 shadow-lg">
            <button onClick={handleZoomOut} className="hover:text-gray-300 transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-full" aria-label="Zoom out">
              <ZoomOut className="w-6 h-6" />
            </button>
            <span className="font-medium text-sm w-12 text-center select-none">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} className="hover:text-gray-300 transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-full" aria-label="Zoom in">
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>

          {/* Image container */}
          <div className="w-full h-full overflow-auto no-scrollbar flex items-center justify-center p-4">
            <div 
              className="relative transition-transform duration-200 ease-out origin-center"
              style={{ 
                transform: `scale(${zoomLevel})`,
                width: '80vw',
                height: '80vh'
              }}
            >
              <Image
                src={images[activeIndex]}
                alt={`Zoomed product image ${activeIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
