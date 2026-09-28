import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "6-Quart Air Fryers",
  description: "Explore 6-quart air fryers and compare capacity, basket type, power and verified product data.",
  alternates: { canonical: "/air-fryers/6-quart" },
  openGraph: { url: "/air-fryers/6-quart", type: "website" },
};

export default async function SixQuartPage() {
  const products = await searchProducts("6 quart");
  return <main><SiteHeader /><section className="section"><div className="shell">
    <nav className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/air-fryers">Air Fryers</Link><span>/</span><span>6 quart</span></nav>
    <span className="eyebrow">CAPACITY GUIDE</span><h1 className="page-title">6-quart air fryers.</h1>
    <p className="page-lead">A practical middle size for everyday cooking. Use this page to discover models in the catalog, then check each product's verified specifications before choosing.</p>
    <div className="guide-grid"><div className="guide-card"><b>Good fit</b><span>Many 2–4 person households, depending on what you cook.</span></div><div className="guide-card"><b>Check first</b><span>Basket shape, counter footprint, dishwasher-safe parts and controls.</span></div><div className="guide-card"><b>Compare</b><span>Capacity alone does not tell you power, basket layout or features.</span></div></div>
    <section className="section"><div className="section-head"><div><span className="eyebrow">CATALOG MATCHES</span><h2>6-quart models</h2></div><Link href="/air-fryers">Browse all →</Link></div><div className="product-grid">{products.map(p=><ProductCard key={p.slug} product={p} />)}</div></section>
  </div></section><SiteFooter /></main>;
}
