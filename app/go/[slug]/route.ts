import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { getAmazonAffiliateUrl, getAmazonAsin } from "@/lib/amazon";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const asin = getAmazonAsin(product.identifiers);
  if (!asin) {
    return NextResponse.json({ error: "No verified Amazon ASIN for this product" }, { status: 404 });
  }

  return NextResponse.redirect(getAmazonAffiliateUrl(asin), 302);
}
