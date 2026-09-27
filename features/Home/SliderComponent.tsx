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
    id: "cargo-ship-banner",
    title: "Sea Freight Services",
    linkText: "Learn more",
    linkUrl: "#",
    image: "/images/cargo_ship_banner.jpg",
    backgroundColor: "bg-cyan-900",
  },
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
                  {slide.id === "cargo-ship-banner" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center px-4 md:px-8 drop-shadow-xl bg-white/40 md:bg-transparent p-6 rounded-2xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#0088cc] drop-shadow-md mb-2">
                          চাইনিজ পণ্য
                        </h2>
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 drop-shadow-md mb-6">
                          দেশে আনুন <span className="text-[#0088cc]">জাহাজে</span>
                        </h3>
                        <p className="text-lg md:text-2xl font-bold text-slate-800 drop-shadow-sm">
                          শিপিং চার্জ ১৭০/- থেকে শুরু
                        </p>
                        <p className="text-lg md:text-2xl font-bold text-slate-800 drop-shadow-sm">
                          মিনিমাম ১০০ কেজি
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
