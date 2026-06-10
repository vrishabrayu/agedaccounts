import { NextResponse } from "next/server";
import { getMarketplaceProducts } from "../../../lib/products";

export async function GET() {
  const products = await getMarketplaceProducts();
  return NextResponse.json({ products });
}
