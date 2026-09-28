import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Air Fryer Finder",
  description: "Use capacity, basket style and controls to narrow down air fryer models in the catalog.",
  alternates: { canonical: "/finder" },
  openGraph: { url: "/finder", type: "website" },
};

export default async function FinderPage({ searchParams }: { searchParams: Promise<{ size?: string; basket?: string; controls?: string }> }) {
  const { size, basket, controls } = await searchParams;
  const products = await getFeaturedProducts(48);
  const filtered = products.filter(p => {
    if (size === "small" && !(p.capacity_quart && p.capacity_quart <= 5)) return false;
    if (size === "medium" && !(p.capacity_quart && p.capacity_quart > 5 && p.capacity_quart <= 8)) return false;
    if (size === "large" && !(p.capacity_quart && p.capacity_quart > 8)) return false;
    if (basket === "dual" && !(p.basket_type?.toLowerCase().includes("dual") || (p as any).basket_count > 1)) return false;
    if (controls === "digital" && !(p as any).digital_controls) return false;
    return true;
  }).slice(0, 24);

  return <main><SiteHeader/><section className="section"><div className="shell">
    <span className="eyebrow">GUIDED FINDER</span><h1 className="page-title">Find an air fryer by what matters to you.</h1>
    <p className="page-lead">Choose a few preferences to narrow the catalog. The finder filters stored product data; it does not invent missing specifications.</p>
    <form className="finder-grid" method="get">
      <label><span>Capacity</span><select name="size" defaultValue={size ?? ""}><option value="">Any size</option><option value="small">Up to 5 qt</option><option value="medium">Over 5 to 8 qt</option><option value="large">Over 8 qt</option></select></label>
      <label><span>Basket</span><select name="basket" defaultValue={basket ?? ""}><option value="">Any basket</option><option value="dual">Dual basket</option></select></label>
      <label><span>Controls</span><select name="controls" defaultValue={controls ?? ""}><option value="">Any controls</option><option value="digital">Digital controls</option></select></label>
      <button type="submit" className="button">Find models</button>
    </form>
    <div className="section-head"><div><span className="eyebrow">RESULTS</span><h2>{filtered.length} catalog models</h2></div><Link href="/air-fryers">Browse all →</Link></div>
    {filtered.length ? <div className="product-grid">{filtered.map(p=><ProductCard key={p.slug} product={p}/>)}</div> : <div className="empty-panel"><h2>No catalog match</h2><p>Try fewer filters or browse the complete catalog.</p><Link href="/air-fryers" className="button">Browse all models</Link></div>}
  </div></section><SiteFooter/></main>;
}
