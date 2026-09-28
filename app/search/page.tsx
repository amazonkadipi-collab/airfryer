import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Air Fryer product database by model, brand, UPC, EAN, ASIN, MPN or product title.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
  openGraph: { url: "/search", type: "website" },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const suggestions = ["Ninja AF141", "Cosori CP158", "8 quart", "dual basket", "dishwasher safe"];
  const results = query ? await searchProducts(query) : [];

  return <main>
    <SiteHeader />
    <section className="section"><div className="shell">
      <span className="eyebrow">SEARCH</span><h1 className="page-title">Search the product database.</h1>
      <p className="page-lead">Search by model, brand, UPC, EAN, ASIN, MPN or product title. Results show the image and the key product details before you open the full page.</p>
      <form action="/search" method="get" className="search-box"><span className="search-icon">⌕</span><input type="search" name="q" defaultValue={query} required minLength={2} autoComplete="off" aria-label="Search air fryers" placeholder="Search model, UPC, EAN, ASIN, or brand…" /><button type="submit">Search</button></form>
      <div className="quick-links"><span>Try:</span>{suggestions.map(x=><Link key={x} href={`/search?q=${encodeURIComponent(x)}`}>{x}</Link>)}</div>
      {query && results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <div className="search-state">
          <div><span className="eyebrow">{query ? "NO VERIFIED MATCH" : "READY"}</span><h2>{query ? `No verified products found for “${query}”` : "Your search starts here."}</h2><p>{query ? "Try the exact model, UPC/EAN/ASIN, brand name, or a shorter feature phrase." : "Enter a model number, identifier, brand or feature to find matching products."}</p></div>
          <div className="search-signals"><span>01 Exact identifiers</span><span>02 Model & brand</span><span>03 Full-text</span><span>04 Fuzzy match</span></div>
        </div>
      )}
    </div></section>
    <SiteFooter />
  </main>;
}
