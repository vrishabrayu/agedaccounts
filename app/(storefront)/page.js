import { getMarketplaceProducts } from "../../lib/products";
import Marketplace from "../../components/Marketplace";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getMarketplaceProducts();
  return <Marketplace initialProducts={products} />;
}
