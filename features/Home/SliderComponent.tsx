"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

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
    title: "Premium Smart Watch",
    linkText: "Shop now",
    linkUrl: "#",
    image: "/images/banners/ecommerce_banner_tech_1790453728020.jpg",
    backgroundColor: "bg-[#111111]",
  },
  {
    id: 2,
    title: "Premium Accessories",
    linkText: "Shop now",
    linkUrl: "#",
    image: "/images/banners/ecommerce_banner_fashion_1790453741657.jpg",
    backgroundColor: "bg-[#d4c3b3]",
  },
  {
    id: 3,
    title: "High-End Wireless Audio",
    linkText: "Shop now",
    linkUrl: "#",
    image: "/images/banners/ecommerce_banner_audio_1790453752960.jpg",
    backgroundColor: "bg-[#0f1115]",
  }
];

export function HeroSlider({ slides = defaultSlides }: HeroSliderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full relative group">
      {/* Custom Navigation */}
      <button className="hero-slider-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer backdrop-blur-sm [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed">
        <ChevronLeft size={20} />
      </button>

      <button className="hero-slider-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer backdrop-blur-sm [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed">
        <ChevronRight size={20} />
      </button>

      {isMounted && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: '.hero-slider-prev',
            nextEl: '.hero-slider-next',
          }}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${className} w-1.5 h-1.5 mx-1.5 rounded-full bg-white/50 transition-all duration-300 inline-block cursor-pointer [&.swiper-pagination-bullet-active]:w-4 [&.swiper-pagination-bullet-active]:bg-white [&.swiper-pagination-bullet-active]:rounded-md"></span>`;
            },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full aspect-16/5 min-h-62.5"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative">
                {/* Full Image */}
                <div className="block w-full h-full relative">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 100vw"
                    priority
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
