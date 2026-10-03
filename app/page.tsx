import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getCatalogCount, getFeaturedProducts, type ProductSearchRow } from "@/lib/products";

const capacities = [
  ["2–4 qt", "Small kitchens", "/search?q=4+qt"],
  ["5 qt", "Everyday size", "/search?q=5+qt"],
  ["6 qt", "Popular capacity", "/air-fryers/6-quart"],
  ["8 qt", "Family cooking", "/search?q=8+qt"],
  ["9–10+ qt", "Large batches", "/search?q=10+qt"],
];

function ModelRow({ product }: { product: ProductSearchRow }) {
  const modelLine = [product.brand_name ?? "Air fryer", product.model].filter(Boolean).join(" · ");
  const capacity = product.capacity_quart ? String(product.capacity_quart) + " qt" : "—";

  return (
    <Link href={"/products/" + product.slug} className="intel-model">
      <div className="intel-model__image">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.title} width={150} height={150} sizes="90px" />
        ) : <span>AF</span>}
      </div>
      <div className="intel-model__name">
        <strong>{product.title}</strong>
        <small>{modelLine}</small>
      </div>
      <div><b>{capacity}</b><small>capacity</small></div>
      <div><b>{product.basket_count ?? "—"}</b><small>baskets</small></div>
      <div><b>{product.basket_type ?? "—"}</b><small>basket type</small></div>
      <span className="intel-arrow">→</span>
    </Link>
  );
}

export default async function HomePage() {
  const [products, brands, catalogCount] = await Promise.all([
    getFeaturedProducts(8),
    getBrands(),
    getCatalogCount(),
  ]);

  return (
    <main className="intel-home">
      <SiteHeader />
      <section className="intel-hero">
        <div className="shell">
          <div className="intel-hero__eyebrow">AIR FRYER INTELLIGENCE</div>
          <h1>Air fryer reviews,<br /><span>specs & comparisons.</span></h1>
          <p>Search real models, check the specifications that matter, and compare products before you buy.</p>
          <form action="/search" method="get" className="intel-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" name="q" required minLength={2} autoComplete="off" placeholder="Search by model, brand, ASIN or UPC" aria-label="Search air fryers" />
            <button type="submit">Search</button>
          </form>
          <div className="intel-search-links">
            <span>Browse:</span>
            <Link href="/air-fryers">All air fryers</Link>
            <Link href="/air-fryers/6-quart">6-quart</Link>
            <Link href="/best/dual-basket-air-fryers">Dual basket</Link>
            <Link href="/brands">Brands</Link>
          </div>
        </div>
      </section>

      <section className="intel-stats">
        <div className="shell intel-stats__grid">
          <div><b>{catalogCount}</b><span>catalog models</span></div>
          <div><b>{brands.length}</b><span>brands</span></div>
          <div><b>5</b><span>capacity groups</span></div>
          <div><b>1</b><span>product catalog</span></div>
        </div>
      </section>

      <section className="section intel-section">
        <div className="shell">
          <div className="intel-section-head">
            <div>
              <span className="eyebrow">CATALOG</span>
              <h2>Compare the models at a glance</h2>
              <p>Structured product information in one compact view.</p>
            </div>
            <Link href="/air-fryers" className="intel-text-link">View all {catalogCount} models →</Link>
          </div>
          <div className="intel-model-table">
            <div className="intel-model-table__head">
              <span>MODEL</span><span>CAPACITY</span><span>BASKETS</span><span>TYPE</span><span />
            </div>
            {products.slice(0, 6).map((product) => <ModelRow key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="intel-tools">
        <div className="shell">
          <div className="intel-section-head compact">
            <div><span className="eyebrow">TOOLS</span><h2>Choose how you want to shop</h2></div>
          </div>
          <div className="intel-tools-grid">
            <Link href="/compare"><b>Compare models</b><span>Put two products side by side.</span><i>→</i></Link>
            <Link href="/air-fryers"><b>Results table</b><span>Browse the full catalog.</span><i>→</i></Link>
            <Link href="/brands"><b>Browse brands</b><span>Explore products by maker.</span><i>→</i></Link>
            <Link href="/air-fryers/6-quart"><b>6-quart guide</b><span>See the popular capacity.</span><i>→</i></Link>
          </div>
        </div>
      </section>

      <section className="section intel-section">
        <div className="shell">
          <div className="intel-section-head">
            <div><span className="eyebrow">BROWSE BY SIZE</span><h2>Find the capacity that fits</h2></div>
          </div>
          <div className="intel-capacity-grid">
            {capacities.map(([size, note, href]) => (
              <Link href={href} key={size}>
                <strong>{size}</strong><span>{note}</span><i>Explore →</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section intel-section intel-products">
          <div className="shell">
            <div className="intel-section-head">
              <div><span className="eyebrow">CATALOG MODELS</span><h2>Catalog models</h2></div>
              <Link href="/air-fryers" className="intel-text-link">See full catalog →</Link>
            </div>
            <div className="product-grid">
              {products.slice(0, 4).map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section intel-method">
        <div className="shell">
          <div className="intel-method__grid">
            <div>
              <span className="eyebrow">ABOUT THE DATA</span>
              <h2>Product information first.</h2>
              <p>Air Fryer Intelligence is built around model-level product data: names, identifiers, capacity, basket configuration, specifications and retailer availability when verified.</p>
            </div>
            <div className="intel-method__links">
              <Link href="/affiliate-disclosure">Affiliate disclosure <span>→</span></Link>
              <Link href="/brands">Browse brands <span>→</span></Link>
              <Link href="/air-fryers">Browse catalog <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
