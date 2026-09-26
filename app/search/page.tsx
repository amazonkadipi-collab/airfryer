import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Air Fryer product database by model, brand, UPC, EAN, ASIN, MPN or product title.",
  robots: { index: false, follow: true },
};
import { searchProducts } from "@/lib/products";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const suggestions = ["Ninja AF141", "Cosori CP158", "8 quart", "dual basket", "dishwasher safe"];
  const results = query ? await searchProducts(query) : [];

  return <main>
    <header className="site-header"><div className="shell nav">
      <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
      <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
      <Link href="/air-fryers" className="nav-cta">Browse catalog</Link>
    </div></header>
    <section className="section"><div className="shell">
      <span className="eyebrow">SEARCH</span><h1 className="page-title">Search the product database.</h1>
      <p className="page-lead">Search by model, brand, UPC, EAN, ASIN, MPN or product title. Exact identifiers take priority over fuzzy matches.</p>
      <form action="/search" className="search-box"><span className="search-icon">⌕</span><input name="q" defaultValue={query} placeholder="Ninja AF141, UPC, EAN…" /><button>Search</button></form>
      <div className="quick-links"><span>Try:</span>{suggestions.map(x=><Link key={x} href={`/search?q=${encodeURIComponent(x)}`}>{x}</Link>)}</div>
      {query && results.length > 0 ? <div className="brand-list">
        {results.map((product) => <Link className="brand-row" key={product.slug} href={`/products/${product.slug}`}>
          <span className="brand-number">AF</span><span><strong>{product.title}</strong><small>{product.brand_name ?? "Brand pending"}{product.model ? ` · ${product.model}` : ""}{product.capacity_quart ? ` · ${product.capacity_quart} qt` : ""}</small></span><span>View →</span>
        </Link>)}
      </div> : <div className="search-state">
        <div><span className="eyebrow">{query ? "NO VERIFIED MATCH" : "READY"}</span><h2>{query ? `No verified products found for “${query}”` : "Your search starts here."}</h2><p>{query ? "Try the exact model, UPC/EAN/ASIN, brand name, or a shorter feature phrase." : "Enter a model number, identifier, brand or feature to find matching products."}</p></div>
        <div className="search-signals"><span>01 Exact identifiers</span><span>02 Model & brand</span><span>03 Full-text</span><span>04 Fuzzy match</span></div>
      </div>}
    </div></section>
  </main>;
}