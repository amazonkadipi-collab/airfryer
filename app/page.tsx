import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBrands, getCatalogCount, getFeaturedProducts } from "@/lib/products";

const PAGE_SIZE = 50;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const total = await getCatalogCount();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;

  const [products, brands] = await Promise.all([
    getFeaturedProducts(PAGE_SIZE, offset),
    getBrands(),
  ]);

  return (
    <main className="storefront-home">
      <SiteHeader />
      <section className="store-catalog-head">
        <div className="shell">
          <div>
            <span className="store-kicker">AIR FRYER STORE</span>
            <h1>Shop air fryers</h1>
            <p>{total.toLocaleString()} image-backed models from the live catalog. Browse, search and compare real products.</p>
          </div>
          <form action="/search" method="get" className="store-search store-search--compact">
            <span aria-hidden="true">⌕</span>
            <input type="search" name="q" required minLength={2} placeholder="Search brand, model, ASIN or UPC" aria-label="Search air fryers" />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section store-section store-section--catalog">
        <div className="shell">
          <div className="catalog-toolbar">
            <div><strong>{total.toLocaleString()}</strong> products</div>
            <div>Page {safePage} of {totalPages}</div>
          </div>

          {products.length > 0 ? (
            <div className="store-product-grid market-product-grid">
              {products.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          ) : (
            <div className="market-empty">No image-backed products are currently available.</div>
          )}

          {totalPages > 1 && (
            <nav className="catalog-pagination" aria-label="Product pagination">
              {safePage > 1 ? <Link href={safePage === 2 ? "/" : `/?page=${safePage - 1}`}>← Previous</Link> : <span className="disabled">← Previous</span>}
              <div className="catalog-pages">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 7) {
                    if (safePage <= 4) p = i + 1;
                    else if (safePage >= totalPages - 3) p = totalPages - 6 + i;
                    else p = safePage - 3 + i;
                  }
                  return <Link className={p === safePage ? "active" : ""} href={p === 1 ? "/" : `/?page=${p}`} key={p}>{p}</Link>;
                })}
              </div>
              {safePage < totalPages ? <Link href={`/?page=${safePage + 1}`}>Next →</Link> : <span className="disabled">Next →</span>}
            </nav>
          )}
        </div>
      </section>

      <section className="store-catalog-tools">
        <div className="shell">
          <Link href="/compare"><strong>Compare models</strong><span>Side-by-side specifications →</span></Link>
          <Link href="/brands"><strong>Browse brands</strong><span>{brands.length} brands in the catalog →</span></Link>
          <Link href="/air-fryers/6-quart"><strong>6-quart air fryers</strong><span>Shop a popular size →</span></Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
