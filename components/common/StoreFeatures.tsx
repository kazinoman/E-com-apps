import React from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { 
  Truck, 
  RotateCcw, 
  Eye, 
  Globe2, 
  ShieldCheck, 
  CreditCard 
} from "lucide-react";

const features = [
  {
    title: "FAST DELIVERY",
    description: "Shipping for Select Items Thanks to Our Enhanced Logistics Network",
    icon: Truck,
  },
  {
    title: "REFUND POLICY",
    description: "Our refund policy ensures we facilitate a hassle-free refund process",
    icon: RotateCcw,
  },
  {
    title: "TRANSPARENCY",
    description: "With us, you can expect clarity, accountability, & a commitment to ethical business",
    icon: Eye,
  },
  {
    title: "WORLDWIDE PURCHASE",
    description: "You have no boundaries for purchasing products that you like!",
    icon: Globe2,
  },
  {
    title: "VERIFIED SELLERS",
    description: "We provide you with our verified seller that helps get a quality product",
    icon: ShieldCheck,
  },
  {
    title: "SAFE PAYMENT",
    description: "We care about every penny of our customers & we ensure safety of that",
    icon: CreditCard,
  },
];

export function StoreFeatures() {
  return (
    <div className="w-full bg-[#F8F9FA] dark:bg-zinc-900 border-y border-[#EAE4E3] dark:border-zinc-800">
      <Container className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            // Determine right borders based on index and breakpoints
            // On mobile (col=1): no right borders
            // On tablet (col=2): right border on even items (index 0, 2, 4)
            // On desktop (col=3): right border on items 0, 1, 3, 4
            const isTabletRight = index % 2 === 0;
            const isDesktopRight = (index + 1) % 3 !== 0;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "flex items-start gap-4 px-4 sm:px-6",
                  isTabletRight ? "md:border-r md:border-[#EAE4E3] dark:md:border-zinc-800" : "md:border-r-0",
                  isDesktopRight ? "lg:border-r lg:border-[#EAE4E3] dark:lg:border-zinc-800" : "lg:border-r-0"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  <Icon className="w-8 h-8 text-[#8B8BA7]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[14px] font-bold text-[#333333] dark:text-gray-200 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-[12px] leading-relaxed text-[#8B8BA7] dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
