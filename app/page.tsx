import { HeroSlider } from "@/features/Home/SliderComponent";
import { SectionSlider } from "@/components/common/SectionSlider";
import { ProductCard } from "@/components/common/ProductCard";
import { Container } from "@/components/common/Container";

const DUMMY_PRODUCTS = Array.from({ length: 10 }).map((_, i) => ({
  id: `prod-${i}`,
  title: "iPhone 14 Pro Plus Max Black Edition",
  category: "Smartphone",
  brand: "Apple",
  price: 1234.99,
  originalPrice: (i === 2 || i === 3) ? 1234.99 : undefined,
  rating: 4.9,
  image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=500&auto=format&fit=crop",
  badge: i === 0 ? { text: "Out of stock", type: "out-of-stock" as const } : 
         i === 1 ? { text: "Sale", type: "sale" as const } : 
         i === 2 ? { text: "5% off", type: "discount" as const } : 
         { text: "", type: "none" as const },
}));

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black pb-20">
      <main className="flex flex-1 w-full flex-col dark:bg-black">
        <HeroSlider />
        
        <Container className="mt-12 space-y-4 flex flex-col ">
          <SectionSlider title="Featured Products">
            {DUMMY_PRODUCTS.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </SectionSlider>

          <SectionSlider title="Trending Products">
            {DUMMY_PRODUCTS.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </SectionSlider>
        </Container>
      </main>
    </div>
  );
}
