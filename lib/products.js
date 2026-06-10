import { prisma } from "./prisma";

export function mapProductForMarketplace(product, availableStock) {
  return {
    id: product.id,
    name: product.name,
    platform: product.platform,
    niche: product.niche || product.name,
    followers: product.followers,
    engagement: product.engagement,
    price: product.priceCents / 100,
    availableStock,
    description: product.description,
    imageUrl: product.imageUrl,
  };
}

export async function getMarketplaceProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const withStock = await Promise.all(
    products.map(async (product) => {
      const availableStock = await prisma.credential.count({
        where: { productId: product.id, status: "AVAILABLE" },
      });
      return mapProductForMarketplace(product, availableStock);
    })
  );

  return withStock.filter((product) => product.availableStock > 0);
}
