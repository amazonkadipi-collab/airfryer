import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getFeaturedProducts } from "@/lib/products";

const capacities = [
  ["4 qt", "Compact everyday use"],
  ["5 qt", "Balanced capacity"],
  ["6 qt", "Most households"],
  ["8 qt", "Family-size cooking"],
  ["10+ qt", "Large batches"],
];

export default async function HomePage() {
  const [products, brands] = await Promise.all([
    getFeaturedProducts(8),
    getBrands(),
  ]);

  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="shell">
          <span className="eyebrow"><span className="live-dot" /> PRODUCT INTELLIGENCE</span>
          <h1 className="hero__title">Find the right air fryer.</h1>
          <p className="hero__sub">
            Search real models, compare specifications, and check product identifiers.
            No filler. No invented data.
          </p>
          <form action="/search" method="get" className="search-box hero__search">
            <input
              type="search"
              name="q"
              required
              minLength={2}
              autoComplete="off"
              aria-label="Search air fryers"
              placeholder="Model, brand, ASIN, UPC or EAN"
            />
            <button type="submit">Search</button>
          </form>
          <div className="quick-links">
            <span>Try:</span>
            <Link href="/search?q=Ninja+AF141">Ninja AF141</Link>
            <Link href="/search?q=Cosori">Cosori</Link>
            <Link href="/search?q=dual+basket">Dual basket</Link>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">POPULAR MODELS</span><h2>Air fryers worth identifying</h2></div>
              <Link href="/air-fryers">Browse all →</Link>
            </div>
            <div className="product-grid">
              {products.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div><span className="eyebrow">EXPLORE</span><h2>Browse by capacity</h2></div>
          </div>
          <div className="capacity-grid">
            {capacities.map(([label, description]) => (
              <Link href={`/search?q=${encodeURIComponent(label)}`} className="capacity-card" key={label}>
                <strong>{label}</strong>
                <span>{description}</span>
                <i>Explore models →</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">BRANDS</span><h2>Explore manufacturers</h2></div>
              <Link href="/brands">All brands →</Link>
            </div>
            <div className="product-grid">
              {brands.slice(0, 8).map((brand) => (
                <Link href={`/search?q=${encodeURIComponent(brand.name)}`} className="capacity-card" key={brand.slug}>
                  <strong>{brand.name}</strong>
                  <span>{brand.product_count} {brand.product_count === 1 ? "model" : "models"} in catalog</span>
                  <i>View models →</i>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div><span className="eyebrow">HOW IT WORKS</span><h2>Google search → product intelligence</h2></div>
          </div>
          <div className="product-grid">
            <div className="empty-panel"><span className="eyebrow">01 IDENTIFY</span><h2>Find the exact model.</h2><p>Search by model, title, brand, or verified product identifier.</p></div>
            <div className="empty-panel"><span className="eyebrow">02 UNDERSTAND</span><h2>Read the useful specs.</h2><p>Capacity, basket configuration, power and other stored fields are shown clearly.</p></div>
            <div className="empty-panel"><span className="eyebrow">03 COMPARE</span><h2>Choose with context.</h2><p>Use similar models and retailer information when reliable data is available.</p></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
