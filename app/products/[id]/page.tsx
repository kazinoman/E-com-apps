import { getProductById, getSimilarProducts } from "@/services/product.service";
import { ProductDetails } from "@/features/ProductDetails/ProductDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // `getProductById` already unwraps the response envelope and answers null on
  // a 404, so there is no `success` flag to check here. Checking for one is
  // what made every real catalog id 404 on this route.
  const product = await getProductById(id);
  if (!product) notFound();

  const similarProducts = product.category
    ? await getSimilarProducts(product.category, 20)
    : [];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <ProductDetails product={product} similarProducts={similarProducts} />
    </main>
  );
}
