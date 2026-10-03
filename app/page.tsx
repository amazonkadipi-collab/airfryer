import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getFeaturedProducts } from "@/lib/products";

const capacities = [
  ["4 qt", "Small & quick", "/search?q=4+qt"],
  ["5 qt", "Everyday sweet spot", "/search?q=5+qt"],
  ["6 qt", "Most popular", "/air-fryers/6-quart"],
  ["8 qt", "Family cooking", "/search?q=8+qt"],
  ["10+ qt", "Big batches", "/search?q=10+qt"],
];

export default async function HomePage() {
  const [products, brands] = await Promise.all([getFeaturedProducts(8), getBrands()]);

  return (
    <main className="home">
      <SiteHeader />

      <section className="home-hero">
        <div className="shell home-hero__grid">
          <div className="home-hero__copy">
            <div className="hero-badge"><span className="live-dot" /> REAL PRODUCT DATA · NO FILLER</div>
            <h1>Air fryers,<br /><em>made simple.</em></h1>
            <p>Find a real model, understand the specs, compare options, and jump to the retailer in a few clicks.</p>

            <form action="/search" method="get" className="home-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" name="q" required minLength={2} autoComplete="off" aria-label="Search air fryers" placeholder="Search model, brand, ASIN, UPC…" />
              <button type="submit">Search</button>
            </form>

            <div className="home-quick">
              <span>Popular:</span>
              <Link href="/search?q=Ninja+AF141">Ninja AF141</Link>
              <Link href="/search?q=COSORI">COSORI</Link>
              <Link href="/search?q=dual+basket">Dual basket</Link>
            </div>
          </div>

          <div className="home-visual" aria-hidden="true">
            <div className="home-orbit home-orbit--one" />
            <div className="home-orbit home-orbit--two" />
            <div className="home-machine">
              <div className="machine-glow" />
              <div className="machine-top"><span>AF</span><i /></div>
              <div className="machine-body"><div className="machine-screen">185°</div><div className="machine-dial" /></div>
              <div className="machine-basket"><span>READY</span></div>
            </div>
            <div className="float-card float-card--score"><b>98</b><span>data score</span><i>● verified fields</i></div>
            <div className="float-card float-card--size"><b>6 qt</b><span>popular size</span><strong>↗</strong></div>
            <div className="float-card float-card--pulse"><span>LIVE CATALOG</span><b>35+ models</b><div className="mini-bars"><i /><i /><i /><i /><i /></div></div>
          </div>
        </div>
      </section>

      <section className="home-strip">
        <div className="shell home-strip__inner">
          <span><b>35+</b> catalog models</span><span><b>8</b> popular picks</span><span><b>5</b> size paths</span><span><b>1</b> focused category</span>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section home-section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">START HERE</span><h2>Popular models</h2></div>
              <Link href="/air-fryers">See all models →</Link>
            </div>
            <div className="product-grid home-products">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
          </div>
        </section>
      )}

      <section className="home-finder section">
        <div className="shell">
          <div className="finder-card">
            <div className="finder-copy">
              <span className="eyebrow">QUICK FINDER</span>
              <h2>How much air fryer do you actually need?</h2>
              <p>Pick a size and go straight to matching models. No quiz, no clutter.</p>
            </div>
            <div className="finder-options">
              {capacities.map(([label, description, href]) => (
                <Link href={href} className="finder-option" key={label}>
                  <strong>{label}</strong><span>{description}</span><i>→</i>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="section home-section home-brands">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">EXPLORE</span><h2>Shop by brand</h2></div>
              <Link href="/brands">All brands →</Link>
            </div>
            <div className="brand-pills">
              {brands.slice(0, 8).map((brand) => (
                <Link href={"/search?q=" + encodeURIComponent(brand.name)} className="brand-pill" key={brand.slug}>
                  <span>{brand.name.slice(0, 1)}</span><b>{brand.name}</b><small>{brand.product_count}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section home-how">
        <div className="shell">
          <div className="how-head">
            <div><span className="eyebrow">THE SIMPLE WAY</span><h2>Search → understand → choose</h2></div>
            <Link href="/compare" className="button light">Compare models</Link>
          </div>
          <div className="how-grid">
            <div><b>01</b><span>SEARCH</span><h3>Find your exact model</h3><p>Search by name, model number or product identifier.</p></div>
            <div><b>02</b><span>CHECK</span><h3>See the useful details</h3><p>Capacity, basket type, power and available identifiers in one view.</p></div>
            <div><b>03</b><span>COMPARE</span><h3>Make the shortlist</h3><p>Put two real models side by side before you buy.</p></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}