import type { Metadata } from 'next';
import { getProductById, getSimilarProducts } from "@/services/product.service";
import { primaryImage } from "@/schemas/product";
import { fetchCheckoutTerms } from "@/services/checkout-terms.service";
import { ProductDetails } from "@/features/ProductDetails/ProductDetails";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};

  const cleanDescription = product.descriptionHtml
    ? product.descriptionHtml.replace(/<[^>]*>?/gm, '').substring(0, 160).trim()
    : `Buy ${product.title} at best price.`;

  const imageUrl = primaryImage(product);

  return {
    title: product.title,
    description: cleanDescription,
    openGraph: {
      title: product.title,
      description: cleanDescription,
      images: imageUrl ? [imageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: cleanDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // `getProductById` already unwraps the response envelope and answers null on
  // a 404, so there is no `success` flag to check here. Checking for one is
  // what made every real catalog id 404 on this route.
  const [product, terms] = await Promise.all([getProductById(id), fetchCheckoutTerms()]);
  if (!product) notFound();

  const similarProducts = product.category
    ? await getSimilarProducts(product.category, 20)
    : [];

  return (
    <main className="min-h-screen bg-background">
      <ProductDetails product={product} similarProducts={similarProducts} advancePct={terms.advancePct} />
    </main>
  );
}
