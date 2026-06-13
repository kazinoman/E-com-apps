"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image: "https://picsum.photos/seed/luxe-banner-1/1920/1080",
    title: "The Autumn Collection",
    subtitle: "Discover timeless elegance carefully crafted for the shifting seasons.",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/luxe-banner-2/1920/1080",
    title: "Modern Craftsmanship",
    subtitle: "Where traditional tailoring meets contemporary design.",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/luxe-banner-3/1920/1080",
    title: "Evening Atelier",
    subtitle: "Sophisticated silhouettes for your most memorable nights.",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[800px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            referrerPolicy="no-referrer"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Slide Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h1
              className={cn(
                "text-5xl md:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-300",
                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              {slide.title}
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl font-medium max-w-2xl transition-all duration-700 delay-500",
                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              {slide.subtitle}
            </p>
            <button
              className={cn(
                "mt-8 px-8 py-3 bg-white text-primary font-semibold text-sm hover:bg-[#F2EDEC] transition-all duration-700 delay-700",
                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              Explore Now
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80 w-1.5",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
