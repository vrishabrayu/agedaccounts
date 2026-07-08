import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { mapProductForMarketplace } from "../../../../lib/products";
import ProductDetailClient from "../../../../components/ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { id } = params;

  // Fetch the product from database
  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
  });

  if (!product) {
    notFound();
  }

  // Count available stock
  const availableStock = await prisma.credential.count({
    where: { productId: product.id, status: "AVAILABLE" },
  });

  const mappedProduct = mapProductForMarketplace(product, availableStock);

  return <ProductDetailClient product={mappedProduct} />;
}
