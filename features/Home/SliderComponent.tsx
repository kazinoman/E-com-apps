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
          className="w-full aspect-[16/5] min-h-[250px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative cursor-pointer">
                {/* Full Image Link */}
                <Link href={slide.linkUrl} className="block w-full h-full relative">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 100vw"
                    priority
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
