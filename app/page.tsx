import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getCatalogCount, getFeaturedProducts } from "@/lib/products";

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
  const secondaryProducts = products.slice(1, 5);

  return (
    <main className="storefront-home">
      <SiteHeader />
      <section className="store-hero">
        <div className="shell store-hero__grid">
          <div className="store-hero__copy">
            <span className="store-kicker">THE AIR FRYER EDIT</span>
            <h1>Find the air fryer that fits <em>your kitchen.</em></h1>
            <p>Explore real models, compare the details that matter, and shop with product information you can actually verify.</p>
            <form action="/search" method="get" className="store-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" name="q" required minLength={2} autoComplete="off" placeholder="Search brand, model, ASIN or UPC" aria-label="Search air fryers" />
              <button type="submit">Find my fryer</button>
            </form>
            <div className="store-quick"><span>Popular:</span><Link href="/air-fryers/6-quart">6 quart</Link><Link href="/best/dual-basket-air-fryers">dual basket</Link><Link href="/brands">top brands</Link></div>
          </div>
          <div className="store-hero__visual">
            <div className="hero-orbit hero-orbit--one" />
            <div className="hero-orbit hero-orbit--two" />
            {heroProduct?.image_url ? <Image src={heroProduct.image_url} alt={heroProduct.title} width={620} height={620} priority sizes="(max-width: 900px) 80vw, 48vw" /> : <div className="hero-placeholder">AF</div>}
            {heroProduct && <Link href={`/products/${heroProduct.slug}`} className="hero-product-label"><small>FEATURED MODEL</small><strong>{heroProduct.title}</strong><span>View product →</span></Link>}
          </div>
        </div>
      </section>
      <section className="store-proof"><div className="shell store-proof__grid"><div><strong>{catalogCount}</strong><span>models</span></div><div><strong>{brands.length}</strong><span>brands</span></div><div><strong>Verified</strong><span>source-aware data</span></div><div><strong>Compare</strong><span>before you buy</span></div></div></section>
      <section className="section store-section"><div className="shell"><div className="store-heading"><div><span className="store-kicker">EDITOR'S PICKS</span><h2>Models worth a closer look</h2><p>Real products from the catalog, presented without the spreadsheet feel.</p></div><Link href="/air-fryers">Shop all models <b>→</b></Link></div>{products.length > 0 && <div className="feature-products">{products.slice(0, 2).map((product, i) => <Link href={`/products/${product.slug}`} className="feature-product" key={product.slug}><div className="feature-product__image">{product.image_url ? <Image src={product.image_url} alt={product.title} width={520} height={520} sizes="(max-width: 700px) 85vw, 38vw" /> : <span>AF</span>}</div><div className="feature-product__copy"><small>{i === 0 ? "FEATURED" : "EDITOR PICK"}</small><h3>{product.title}</h3><p>{product.brand_name ?? "Air fryer"}{product.capacity_quart ? ` · ${product.capacity_quart} qt` : ""}</p><span>Explore model →</span></div></Link>)}</div>}</div></section>
      <section className="section store-section store-section--cream"><div className="shell"><div className="store-heading"><div><span className="store-kicker">SHOP THE CATALOG</span><h2>Fresh finds</h2></div><Link href="/air-fryers">View catalog <b>→</b></Link></div><div className="store-product-grid">{secondaryProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div></div></section>
      <section className="store-dark"><div className="shell store-dark__grid"><div><span className="store-kicker">MAKE A SMARTER CHOICE</span><h2>Not sure what size or style you need?</h2><p>Start with capacity, basket configuration or a side-by-side comparison instead of scrolling through endless listings.</p></div><div className="shop-tools"><Link href="/compare"><span>01</span><strong>Compare two models</strong><b>→</b></Link><Link href="/air-fryers/6-quart"><span>02</span><strong>Explore 6-quart</strong><b>→</b></Link><Link href="/brands"><span>03</span><strong>Browse brands</strong><b>→</b></Link></div></div></section>
      <section className="section store-section"><div className="shell"><div className="store-heading"><div><span className="store-kicker">BY CAPACITY</span><h2>Choose your size</h2></div></div><div className="capacity-pills">{capacities.map(([size, note, href]) => <Link href={href} key={size}><strong>{size}</strong><span>{note}</span><b>→</b></Link>)}</div></div></section>
      <section className="store-data"><div className="shell store-data__grid"><div><span className="store-kicker">WHY THIS SITE</span><h2>Product intelligence without the clutter.</h2></div><p>Air Fryer Intelligence keeps model-level specifications, identifiers, sourcing and retailer availability together so you can make a better decision without pretending missing data is verified.</p></div></section>
      <SiteFooter />
    </main>
  );
}
