import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const suggestions = ["Ninja AF141", "Cosori CP158", "8 quart", "dual basket", "dishwasher safe"];
  return <main>
    <header className="site-header"><div className="shell nav">
      <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
      <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
      <Link href="/air-fryers" className="nav-cta">Browse catalog</Link>
    </div></header>
    <section className="section"><div className="shell">
      <span className="eyebrow">SEARCH</span><h1 className="page-title">Search the product database.</h1>
      <p className="page-lead">Search by model, brand, UPC, EAN, ASIN, MPN or product title. Exact identifiers will take priority over fuzzy matches.</p>
      <form action="/search" className="search-box"><span className="search-icon">⌕</span><input name="q" defaultValue={query} placeholder="Ninja AF141, UPC, EAN…" /><button>Search</button></form>
      <div className="quick-links"><span>Try:</span>{suggestions.map(x=><Link key={x} href={`/search?q=${encodeURIComponent(x)}`}>{x}</Link>)}</div>
      <div className="search-state">
        <div><span className="eyebrow">{query ? "RESULTS" : "READY"}</span><h2>{query ? `Searching for “${query}”` : "Your search starts here."}</h2><p>{query ? "Live matching will use exact identifier, model, title, feature and fuzzy signals after the Neon catalog is connected." : "Enter a model number, identifier, brand or feature to find matching products."}</p></div>
        <div className="search-signals"><span>01 Exact identifiers</span><span>02 Model & brand</span><span>03 Full-text</span><span>04 Fuzzy match</span></div>
      </div>
    </div></section>
  </main>;
}