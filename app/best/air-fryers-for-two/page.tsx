import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Best Air Fryers for Two", description: "Find air fryer models that may suit two-person households using capacity and structured product data.", alternates: { canonical: "/best/air-fryers-for-two" } };

export default async function BestForTwoPage() {
  const products = (await getFeaturedProducts(24)).filter(p => p.capacity_quart != null && p.capacity_quart <= 6).slice(0, 12);
  return <main><SiteHeader /><section className="section"><div className="shell">
    <span className="eyebrow">BUYING GUIDE</span><h1 className="page-title">Air fryers for two.</h1>
    <p className="page-lead">For two people, a smaller footprint can be more useful than chasing the biggest basket. Start with capacity, then compare basket style, cleaning and controls on the product page.</p>
    <div className="guide-grid"><div className="guide-card"><b>Start around 4–6 qt</b><span>Use this as a browsing range, not a promise about serving size.</span></div><div className="guide-card"><b>Think about counter space</b><span>Dimensions and basket shape can matter as much as listed capacity.</span></div><div className="guide-card"><b>Verify the details</b><span>We keep missing values marked as not verified instead of filling gaps.</span></div></div>
    <section className="section"><div className="section-head"><div><span className="eyebrow">MATCHING MODELS</span><h2>Smaller-capacity catalog picks</h2></div></div><div className="product-grid">{products.map(p=><ProductCard key={p.slug} product={p}/>)}</div></section>
    <p className="page-lead"><Link href="/air-fryers/6-quart">See the 6-quart guide →</Link></p>
  </div></section><SiteFooter /></main>;
}
