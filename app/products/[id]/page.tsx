import { getProductById, getSimilarProducts } from "@/services/product.service";
import { ProductDetails } from "@/features/ProductDetails/ProductDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productResponse = await getProductById(id);

  if (!productResponse || !productResponse.success || !productResponse.data) {
    notFound();
  }

  const product = productResponse.data;
  const similarProducts = await getSimilarProducts(product.category, 20);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <ProductDetails product={product} similarProducts={similarProducts} />
    </main>
  );
}
