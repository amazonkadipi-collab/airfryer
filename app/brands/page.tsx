import Link from "next/link";
import type { Metadata } from "next";
import { getBrands } from "@/lib/products";

export const metadata: Metadata = {
  title: "Air Fryer Brands",
  description: "Explore air fryer brands and the product models currently in the catalog.",
  alternates: { canonical: "/brands" },
  openGraph: { url: "/brands", type: "website" },
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <main>
      <header className="site-header"><div className="shell nav">
        <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
        <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
        <Link href="/search" className="nav-cta">Search models</Link>
      </div></header>
      <section className="section"><div className="shell">
        <span className="eyebrow">BRANDS</span>
        <h1 className="page-title">Air fryer brands.</h1>
        <p className="page-lead">Browse manufacturers represented in the structured product catalog.</p>
        <div className="brand-list">
          {brands.map((brand, i) => (
            <Link href={`/search?q=${encodeURIComponent(brand.name)}`} className="brand-row" key={brand.slug}>
              <span className="brand-number">{String(i + 1).padStart(2, "0")}</span>
              <strong>{brand.name}</strong>
              <span>{brand.product_count} {brand.product_count === 1 ? "model" : "models"} →</span>
            </Link>
          ))}
        </div>
      </div></section>
    </main>
  );
}
