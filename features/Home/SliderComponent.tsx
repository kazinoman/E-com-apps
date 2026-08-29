"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface SlideData {
  id: string | number;
  title: string;
  linkText: string;
  linkUrl: string;
  image: string;
  backgroundColor: string;
}

interface HeroSliderProps {
  slides?: SlideData[];
}

const defaultSlides: SlideData[] = [
  {
    id: 1,
    title: "Wireless Headphone",
    linkText: "Shop now",
    linkUrl: "#",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    backgroundColor: "bg-[#4895EF]",
  },
  {
    id: 2,
    title: "Smart Watch Series 9",
    linkText: "Shop now",
    linkUrl: "#",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    backgroundColor: "bg-[#FF7B54]",
  },
  {
    id: 3,
    title: "Premium Camera Lens",
    linkText: "Shop now",
    linkUrl: "#",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    backgroundColor: "bg-[#2ECC71]",
  }
];

export function HeroSlider({ slides = defaultSlides }: HeroSliderProps) {
  return (
    <div className="w-full relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] custom-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`w-full h-full flex flex-col md:flex-row items-center justify-between px-10 md:px-24 lg:px-32 ${slide.backgroundColor}`}>
              {/* Left Content */}
              <div className="flex-1 flex flex-col items-center md:items-start justify-center text-white space-y-4 md:space-y-6 pt-10 md:pt-0 z-10 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {slide.title}
                </h1>
                <Link 
                  href={slide.linkUrl} 
                  className="flex items-center justify-center md:justify-start gap-2 text-sm sm:text-base md:text-lg font-medium hover:opacity-80 transition-opacity"
                >
                  {slide.linkText} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </div>

              {/* Right Image */}
              <div className="flex-1 relative w-full h-1/2 md:h-full flex items-center justify-center pb-8 md:pb-0">
                <div className="relative w-4/5 h-4/5 md:w-3/4 md:h-3/4 max-w-[400px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
