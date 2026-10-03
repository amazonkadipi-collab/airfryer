import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getCatalogCount, getFeaturedProducts } from "@/lib/products";

const categories = [
  ["6 Quart Air Fryers", "A popular everyday size", "/air-fryers/6-quart"],
  ["Dual Basket", "Cook two foods at once", "/best/dual-basket-air-fryers"],
  ["Air Fryers for Two", "Compact picks for smaller kitchens", "/best/air-fryers-for-two"],
  ["All Air Fryers", "Browse the full catalog", "/air-fryers"],
];

const capacities = [
  ["2–4 qt", "Compact", "/search?q=4+qt"],
  ["5 qt", "Everyday", "/search?q=5+qt"],
  ["6 qt", "Most popular", "/air-fryers/6-quart"],
  ["8 qt", "Family size", "/search?q=8+qt"],
  ["9–10+ qt", "Big batches", "/search?q=10+qt"],
];

export default async function HomePage() {
  const [products, brands, catalogCount] = await Promise.all([
    getFeaturedProducts(8),
    getBrands(),
    getCatalogCount(),
  ]);
  const heroProduct = products[0];

  return (
    <main className="storefront-home">
      <SiteHeader />

      <div className="market-breadcrumb">
        <div className="shell"><Link href="/">Home</Link><span>›</span><Link href="/air-fryers">Air Fryers</Link><span>›</span><span>Product catalog</span></div>
      </div>

      <section className="store-hero">
        <div className="shell store-hero__grid">
          <div className="store-hero__copy">
            <span className="store-kicker">AIR FRYER PRODUCT CATALOG</span>
            <h1>Find the right air fryer for your kitchen.</h1>
            <p>Search real models, compare specifications and check product information before you buy.</p>
            <form action="/search" method="get" className="store-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" name="q" required minLength={2} autoComplete="off" placeholder="Search brand, model, ASIN or UPC" aria-label="Search air fryers" />
              <button type="submit">Search</button>
            </form>
            <div className="store-quick"><span>Popular:</span><Link href="/air-fryers/6-quart">6 quart</Link><Link href="/best/dual-basket-air-fryers">dual basket</Link><Link href="/brands">brands</Link><Link href="/compare">compare</Link></div>
          </div>
          <div className="store-hero__visual">
            {heroProduct?.image_url ? (
              <Image src={heroProduct.image_url} alt={heroProduct.title} width={620} height={620} priority sizes="(max-width: 900px) 80vw, 48vw" />
            ) : <div className="hero-placeholder">AF</div>}
            {heroProduct && <Link href={`/products/${heroProduct.slug}`} className="hero-product-label"><small>FEATURED PRODUCT</small><strong>{heroProduct.title}</strong><span>See product details →</span></Link>}
          </div>
        </div>
      </section>

      <section className="market-category-strip">
        <div className="shell">
          <div className="market-section-title"><h2>Shop air fryers by category</h2><Link href="/air-fryers">See all</Link></div>
          <div className="market-category-grid">
            {categories.map(([title, note, href]) => (
              <Link href={href} key={href} className="market-category-card">
                <span className="market-category-card__icon">AF</span>
                <strong>{title}</strong>
                <small>{note}</small>
                <b>Explore →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="store-proof">
        <div className="shell store-proof__grid">
          <div><strong>{catalogCount}</strong><span>models in catalog</span></div>
          <div><strong>{brands.length}</strong><span>brands indexed</span></div>
          <div><strong>Model-level</strong><span>specifications</span></div>
          <div><strong>Side by side</strong><span>comparison tools</span></div>
        </div>
      </section>

      <section className="section store-section market-products-section">
        <div className="shell">
          <div className="market-section-title"><div><h2>Featured air fryers</h2><p>Explore products from the live catalog.</p></div><Link href="/air-fryers">View all air fryers</Link></div>
          {products.length > 0 ? <div className="store-product-grid market-product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="market-empty">No products are currently available in the catalog.</div>}
        </div>
      </section>

      <section className="market-tools">
        <div className="shell">
          <div className="market-section-title"><div><h2>Make shopping easier</h2><p>Use the catalog tools to narrow down what you need.</p></div></div>
          <div className="market-tools-grid">
            <Link href="/compare"><span>COMPARE</span><strong>Compare models</strong><small>Put products side by side and inspect the differences.</small><b>Compare →</b></Link>
            <Link href="/brands"><span>BRANDS</span><strong>Browse brands</strong><small>Explore the manufacturers represented in the catalog.</small><b>Browse brands →</b></Link>
            <Link href="/best/air-fryers-for-two"><span>GUIDE</span><strong>Shop for two</strong><small>See models organized for smaller households.</small><b>Open guide →</b></Link>
            <Link href="/best/dual-basket-air-fryers"><span>STYLE</span><strong>Dual basket</strong><small>Explore the dual-basket category.</small><b>Explore →</b></Link>
          </div>
        </div>
      </section>

      <section className="section store-section">
        <div className="shell">
          <div className="market-section-title"><div><h2>Explore by capacity</h2><p>Start with the size that fits your cooking needs.</p></div></div>
          <div className="capacity-pills">{capacities.map(([size, note, href]) => <Link href={href} key={size}><strong>{size}</strong><span>{note}</span><b>→</b></Link>)}</div>
        </div>
      </section>

      <section className="market-brands">
        <div className="shell">
          <div className="market-section-title"><div><h2>Popular brands</h2><p>Jump directly into the brands available in the catalog.</p></div><Link href="/brands">See all brands</Link></div>
          <div className="market-brand-list">
            {brands.slice(0, 12).map((brand) => <Link href={`/search?q=${encodeURIComponent(brand)}`} key={brand}>{brand}<span>›</span></Link>)}
          </div>
        </div>
      </section>

      <section className="store-data">
        <div className="shell store-data__grid"><div><span className="store-kicker">PRODUCT INTELLIGENCE</span><h2>Shopping-first. Data-backed.</h2></div><p>Specifications, identifiers and retailer information are kept at the model level. When a value is unavailable, the site does not invent it.</p></div>
      </section>
      <SiteFooter />
    </main>
  );
}
