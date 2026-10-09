"use client";

import React, { useId, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";

export interface SectionSliderProps {
  title: string;
  category?: string;
  children: React.ReactNode;
  breakpoints?: SwiperOptions["breakpoints"];
  className?: string;
}

export function SectionSlider({
  title,
  category,
  children,
  breakpoints,
  className,
}: SectionSliderProps) {
  // useId() creates a stable unique ID that avoids hydration mismatches
  const uniqueId = useId().replace(/:/g, "");
  const prevClass = `slider-prev-${uniqueId}`;
  const nextClass = `slider-next-${uniqueId}`;

  // State to ensure Swiper only renders after client hydration
  // which helps prevent class mismatches with custom navigation
  const [isMounted, setIsMounted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultBreakpoints = {
    320: { slidesPerView: 2, spaceBetween: 0 }, // 16px gap (0 + 16)
    480: { slidesPerView: 2, spaceBetween: 0 },   // 16px gap (0 + 16)
    640: { slidesPerView: 2.5, spaceBetween: 0 }, // 16px gap (0 + 16)
    768: { slidesPerView: 4, spaceBetween: 4 },   // 20px gap (4 + 16)
    1024: { slidesPerView: 5, spaceBetween: 8 },  // 24px gap (8 + 16)
    1280: { slidesPerView: 5, spaceBetween: 8 },  // 24px gap (8 + 16)
    1440: { slidesPerView: 5, spaceBetween: 8 },  // 24px gap (8 + 16)
  };

  return (
    <div className={cn("w-full py-2 md:py-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-6 px-1 md:px-0">
        <h2 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        {/* Custom Navigation */}
        <div className="flex items-center gap-2">
          <button
            className={cn(
              prevClass,
              "flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer",
              "[&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:hover:bg-transparent"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={cn(
              nextClass,
              "flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer",
              "[&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:hover:bg-transparent",
              isEnd && "hidden"
            )}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {isEnd && (
            <Button variant="outline" size="sm" className="h-8 text-xs px-3 rounded-full" asChild>
              <Link href="/search">
                Show more
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Slider */}
      {isMounted && (
        <div className="relative -mx-1 md:-mx-2 mt-0">
          <Swiper
            modules={[Navigation]}
            onInit={(swiper) => setIsEnd(swiper.isEnd)}
            onSlideChange={(swiper) => setIsEnd(swiper.isEnd)}
            navigation={{
              prevEl: `.${prevClass}`,
              nextEl: `.${nextClass}`,
            }}
            spaceBetween={0}
            slidesPerView={2}
            breakpoints={breakpoints || defaultBreakpoints}
            className="w-full pb-8"
          >
            {React.Children.map(children, (child, index) => {
              if (!React.isValidElement(child)) return null;
              return (
                <SwiperSlide key={index} className="h-auto">
                  <div className="py-2 md:py-4 px-1 md:px-2 h-full">
                    {child}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
}
