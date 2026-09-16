import { Metadata } from "next";
import { HeroSlider } from "@/features/Home/SliderComponent";
import { SectionSlider } from "@/components/common/SectionSlider";
import { ProductCard } from "@/components/common/ProductCard";
import { Container } from "@/components/common/Container";
import { fetchHomeSections, fetchSliderImages } from "@/services/home.service";

export async function generateMetadata(): Promise<Metadata> {
  const sections = await fetchHomeSections();

  const allProducts = sections.flatMap((section) => section.products);
  const uniqueTitles = Array.from(new Set(allProducts.map((p) => p.title)));
  const uniqueCategories = Array.from(
    new Set(allProducts.map((p) => p.category).filter((c): c is string => c !== null)),
  );

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
  const [sections, sliderImages] = await Promise.all([
    fetchHomeSections(),
    fetchSliderImages()
  ]);

  const allProducts = sections.flatMap((section) => section.products);
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": uniqueProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://zaag.com/product/${product.id}`,
      // Only facts the catalog actually holds. No brand (there is none on a
      // card) and no aggregateRating unless the product has real reviews —
      // Google penalises invented review markup, and it would be invented.
      "item": {
        "@type": "Product",
        "name": product.title,
        "image": product.imageUrl ?? undefined,
        "category": product.category ?? undefined,
        "offers": {
          "@type": "Offer",
          "price": product.price.bdt,
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock"
        },
        ...(product.ratingAvg !== null && product.ratingCount
          ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.ratingAvg,
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": product.ratingCount
              }
            }
          : {})
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
        {/* No hero until the merchant can set one (HYDRA 3e1d1569) — an empty
            slider beats stock photography standing in for merchandising. */}
        {sliderImages.length > 0 && <HeroSlider slides={sliderImages} />}
        
        <Container className="mt-12 space-y-4 flex flex-col ">
          {sections.map((section) => (
            section.products.length > 0 && (
              <SectionSlider key={section.id} title={section.title}>
                {section.products.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </SectionSlider>
            )
          ))}
        </Container>
      </main>
    </div>
  );
}
