import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";

export const metadata = {
  title: "Air Fryers",
  description: "Browse air fryers by capacity, basket type, and structured product data.",
};

const filters = ["Compact", "4 Quart", "6 Quart", "8 Quart", "10+ Quart", "Dual Basket", "Dishwasher Safe", "Rotisserie"];

export default async function AirFryersPage() {
  const products = await getFeaturedProducts(24);

  return (
    <main>
      <header className="site-header"><div className="shell nav">
        <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
        <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
        <Link href="/search" className="nav-cta">Search models</Link>
      </div></header>

      <section className="section"><div className="shell">
        <span className="eyebrow">CATALOG</span>
        <h1 className="page-title">Air fryers, organized by what matters.</h1>
        <p className="page-lead">Browse real models by capacity, basket design, and product identity. Missing specifications are left blank rather than guessed.</p>

        <div className="filter-grid">{filters.map(x => <Link href={`/search?q=${encodeURIComponent(x)}`} key={x} className="filter-card"><strong>{x}</strong><span>Explore models →</span></Link>)}</div>

        {products.length > 0 ? (
          <section className="section">
            <div className="section-head">
              <div><span className="eyebrow">PRODUCTS</span><h2>Catalog models</h2></div>
              <span>{products.length} models</span>
            </div>
            <div className="capacity-grid">
              {products.map(product => (
                <Link href={`/products/${product.slug}`} className="capacity-card" key={product.slug}>
                  <span className="eyebrow">{product.brand_name ?? "Brand"}</span>
                  <strong>{product.title}</strong>
                  <span>{product.capacity_quart ? `${product.capacity_quart} qt` : "Capacity not verified"}{product.model ? ` · ${product.model}` : ""}</span>
                  <i>View product →</i>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="empty-panel"><span className="eyebrow">DATA PIPELINE</span><h2>The catalog is being connected to live product data.</h2><p>Products will appear as structured records become available.</p></div>
        )}
      </div></section>
    </main>
  );
}
