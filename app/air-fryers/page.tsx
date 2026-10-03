import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Air Fryers",
  description: "Browse air fryers by capacity, basket type, and structured product data.",
  alternates: { canonical: "/air-fryers" },
  openGraph: { url: "/air-fryers", type: "website" },
};

const filters = ["Compact", "4 Quart", "6 Quart", "8 Quart", "10+ Quart", "Dual Basket", "Dishwasher Safe", "Rotisserie"];

export default async function AirFryersPage() {
  const products = await getFeaturedProducts(100);

  return (
    <main>
      <SiteHeader />
      <section className="section"><div className="shell">
        <span className="eyebrow">CATALOG</span>
        <h1 className="page-title">Air fryers, organized by what matters.</h1>
        <p className="page-lead">Simple product pages with the important information up front: image, model, capacity, basket type, specifications and retailer data when available.</p>

        <div className="filter-grid">{filters.map(x => <Link href={`/search?q=${encodeURIComponent(x)}`} key={x} className="filter-card"><strong>{x}</strong><span>Explore models →</span></Link>)}</div>

        {products.length > 0 ? (
          <section className="section">
            <div className="section-head">
              <div><span className="eyebrow">PRODUCTS</span><h2>Catalog models</h2></div>
              <span>{products.length} models · Page {page}</span>
            </div>
            <div className="product-grid">
              {products.map(product => <ProductCard key={product.slug} product={product} />)}
            </div>
          </section>
        ) : (
          <div className="empty-panel"><span className="eyebrow">DATA PIPELINE</span><h2>The catalog is being connected to live product data.</h2><p>Products will appear as structured records become available.</p></div>
        )}
      </div></section>
      <SiteFooter />
    </main>
  );
}
