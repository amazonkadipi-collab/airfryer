import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getCatalogCount, getFeaturedProducts, type ProductSearchRow } from "@/lib/products";

const capacities = [
  ["4 qt", "Small", "/search?q=4+qt"],
  ["5 qt", "Everyday", "/search?q=5+qt"],
  ["6 qt", "Popular", "/air-fryers/6-quart"],
  ["8 qt", "Family", "/search?q=8+qt"],
  ["10+ qt", "Big batches", "/search?q=10+qt"],
];

function FeaturedVisual({ product }: { product: ProductSearchRow }) {
  return (
    <div className="home-featured" aria-label={product.title}>
      <div className="home-featured__decor home-featured__decor--one" />
      <div className="home-featured__decor home-featured__decor--two" />
      <div className="home-featured__top">
        <span className="eyebrow">FEATURED FROM THE CATALOG</span>
        <span className="home-live"><i /> live catalog</span>
      </div>
      <Link href={"/products/" + product.slug} className="home-featured__product">
        <div className="home-featured__image">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              width={460}
              height={460}
              sizes="(max-width: 900px) 62vw, 430px"
              priority
            />
          ) : (
            <div className="home-featured__placeholder">AF</div>
          )}
        </div>
        <div className="home-featured__info">
          <span className="home-featured__brand">{product.brand_name ?? "Air fryer"}</span>
          <h2>{product.title}</h2>
          <p>{product.model ? `Model: ${product.model}` : "Model details"}{product.capacity_quart ? ` · ${product.capacity_quart} qt` : ""}{product.basket_type ? ` · ${product.basket_type}` : ""}</p>
          <span className="home-featured__link">Open product →</span>
        </div>
      </Link>
      <div className="home-featured__signal">
        <span><b>{product.capacity_quart ? product.capacity_quart + " qt" : "—"}</b><small>capacity</small></span>
        <span><b>{product.basket_count ?? "—"}</b><small>baskets</small></span>
        <span><b>{product.model ? "Model" : "Specs"}</b><small>identifier</small></span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [products, brands, catalogCount] = await Promise.all([
    getFeaturedProducts(7),
    getBrands(),
    getCatalogCount(),
  ]);
  const featured = products[0];

  return (
    <main className="home">
      <SiteHeader />

      <section className="home-hero">
        <div className="shell home-hero__grid">
          <div className="home-hero__copy">
            <div className="hero-badge"><span className="live-dot" /> AIR FRYER PRODUCT INTELLIGENCE</div>
            <h1>Find the right<br /><em>air fryer.</em></h1>
            <p>Search real models, check the important specs, compare options, and follow the retailer link when one is available.</p>

            <form action="/search" method="get" className="home-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" name="q" required minLength={2} autoComplete="off" aria-label="Search air fryers" placeholder="Model, brand, ASIN or UPC…" />
              <button type="submit">Search</button>
            </form>

            <div className="home-quick">
              <span>Try:</span>
              <Link href="/search?q=Ninja+AF141">Ninja AF141</Link>
              <Link href="/search?q=COSORI">COSORI</Link>
              <Link href="/search?q=dual+basket">Dual basket</Link>
            </div>

            <div className="home-mini-stats">
              <span><b>{catalogCount}</b><small>catalog models</small></span>
              <span><b>{brands.length}</b><small>brands</small></span>
              <span><b>5</b><small>size paths</small></span>
            </div>
          </div>

          {featured ? <FeaturedVisual product={featured} /> : (
            <div className="home-featured home-featured--empty">
              <span className="eyebrow">AIR FRYER CATALOG</span>
              <h2>Search the catalog</h2>
              <p>Browse models, brands and product specifications.</p>
              <Link href="/air-fryers" className="button">Browse models →</Link>
            </div>
          )}
        </div>
      </section>

      <section className="home-strip">
        <div className="shell home-strip__inner">
          <Link href="/air-fryers"><b>Browse</b><span>all models →</span></Link>
          <Link href="/compare"><b>Compare</b><span>two models →</span></Link>
          <Link href="/brands"><b>Brands</b><span>explore makers →</span></Link>
          <Link href="/search"><b>Search</b><span>find a model →</span></Link>
        </div>
      </section>

      {products.length > 1 && (
        <section className="section home-section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">CURATED FROM THE CATALOG</span><h2>Popular models</h2></div>
              <Link href="/air-fryers">See all {catalogCount} →</Link>
            </div>
            <div className="product-grid home-products">
              {products.slice(1, 7).map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="home-finder section">
        <div className="shell">
          <div className="finder-card">
            <div className="finder-copy">
              <span className="eyebrow">QUICK FINDER</span>
              <h2>Start with the size.</h2>
              <p>Jump straight to models that match the capacity you need.</p>
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
            <div><span className="eyebrow">HOW IT WORKS</span><h2>Less scrolling. More clarity.</h2></div>
            <Link href="/compare" className="button light">Compare models</Link>
          </div>
          <div className="how-grid">
            <div><b>01</b><span>SEARCH</span><h3>Find the model</h3><p>Search by name, model number or product identifier.</p></div>
            <div><b>02</b><span>CHECK</span><h3>Read the useful specs</h3><p>Capacity, basket type, power and identifiers in one place.</p></div>
            <div><b>03</b><span>CHOOSE</span><h3>Compare before buying</h3><p>Put real models side by side and open the available retailer link.</p></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
