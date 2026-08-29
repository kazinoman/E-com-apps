import { Metadata } from "next";
import { HeroSlider } from "@/features/Home/SliderComponent";
import { SectionSlider } from "@/components/common/SectionSlider";
import { ProductCard } from "@/components/common/ProductCard";
import { Container } from "@/components/common/Container";
import { fetchProducts } from "@/services/home.service";

export async function generateMetadata(): Promise<Metadata> {
  const [featuredProducts, trendingProducts, newArrivals, youMayAlsoLike] = await Promise.all([
    fetchProducts("featured-products"),
    fetchProducts("trending-products"),
    fetchProducts("new-arrivals"),
    fetchProducts("you-may-also-like"),
  ]);

  const allProducts = [...featuredProducts, ...trendingProducts, ...newArrivals, ...youMayAlsoLike];
  const uniqueTitles = Array.from(new Set(allProducts.map((p) => p.title)));
  const uniqueCategories = Array.from(new Set(allProducts.map((p) => p.category)));

  return {
    title: "Zaag - Premium E-commerce Store",
    description: "Discover the best products with fast delivery, secure payments, and a hassle-free refund policy. Shop the latest trends at Zaag.",
    keywords: ["ecommerce", "shopping", "electronics", "fashion", "zaag", "online store", ...uniqueCategories, ...uniqueTitles],
    openGraph: {
      title: "Zaag - Premium E-commerce Store",
      description: "Discover the best products with fast delivery, secure payments, and a hassle-free refund policy.",
      type: "website",
    }
  };
}

export default async function Home() {
  const [featuredProducts, trendingProducts, newArrivals, youMayAlsoLike] = await Promise.all([
    fetchProducts("featured-products"),
    fetchProducts("trending-products"),
    fetchProducts("new-arrivals"),
    fetchProducts("you-may-also-like"),
  ]);

  const allProducts = [...featuredProducts, ...trendingProducts, ...newArrivals, ...youMayAlsoLike];
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": uniqueProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://zaag.com/product/${product.id}`,
      "item": {
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "category": product.category,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": product.badge === "Out of stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": 1
        }
      }
    }))
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black pb-20">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-1 w-full flex-col dark:bg-black">
        <HeroSlider />
        
        <Container className="mt-12 space-y-4 flex flex-col ">
          {featuredProducts.length > 0 && (
            <SectionSlider title="Featured Products">
              {featuredProducts.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </SectionSlider>
          )}

          {trendingProducts.length > 0 && (
            <SectionSlider title="Trending Products">
              {trendingProducts.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </SectionSlider>
          )}
          
          {newArrivals.length > 0 && (
            <SectionSlider title="New Arrivals">
              {newArrivals.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </SectionSlider>
          )}
          
          {youMayAlsoLike.length > 0 && (
            <SectionSlider title="You May Also Like">
              {youMayAlsoLike.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </SectionSlider>
          )}
        </Container>
      </main>
    </div>
  );
}
