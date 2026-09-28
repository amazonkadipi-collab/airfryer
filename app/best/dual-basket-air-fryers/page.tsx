import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Dual-Basket Air Fryers", description: "Explore dual-basket air fryer models and compare basket configuration, capacity and verified specifications.", alternates: { canonical: "/best/dual-basket-air-fryers" } };

export default async function DualBasketPage() {
  const products = await searchProducts("dual basket");
  return <main><SiteHeader /><section className="section"><div className="shell">
    <span className="eyebrow">USE-CASE GUIDE</span><h1 className="page-title">Dual-basket air fryers.</h1>
    <p className="page-lead">Two baskets can make it easier to prepare different foods at the same time. Compare the actual basket count, total capacity and dimensions instead of relying on the product name alone.</p>
    <div className="guide-grid"><div className="guide-card"><b>Why choose dual basket?</b><span>Useful when you regularly cook two foods with different times or temperatures.</span></div><div className="guide-card"><b>Check capacity carefully</b><span>Total quart capacity and usable basket space are not always the same experience.</span></div><div className="guide-card"><b>Compare cleaning</b><span>Check dishwasher-safe information and removable-part details when verified.</span></div></div>
    <section className="section"><div className="section-head"><div><span className="eyebrow">CATALOG MATCHES</span><h2>Dual-basket models</h2></div><Link href="/compare">Compare two →</Link></div><div className="product-grid">{products.map(p=><ProductCard key={p.slug} product={p}/>)}</div></section>
  </div></section><SiteFooter /></main>;
}
