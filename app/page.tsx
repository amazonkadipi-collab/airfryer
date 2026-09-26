import Link from "next/link";

const capacities = [
  ["Compact", "Under 4 qt"],
  ["4 Quart", "Everyday cooking"],
  ["6 Quart", "Most households"],
  ["8 Quart", "Family size"],
  ["10+ Quart", "Large batches"],
];
const uses = ["1 person", "2 people", "Families", "Small kitchen", "Large family"];
const brands = ["Ninja", "Cosori", "Instant", "Philips", "Chefman", "Cuisinart"];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
          <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
          <Link href="/search" className="nav-cta">Find an air fryer</Link>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow"><span className="live-dot" /> PRODUCT INTELLIGENCE</div>
            <h1>Find an air fryer that actually fits your kitchen.</h1>
            <p className="hero-copy">Search real models, compare specifications, check identifiers, and find current retailer options — without the filler.</p>
            <form action="/search" method="get" className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="search"
                name="q"
                required
                minLength={2}
                autoComplete="off"
                aria-label="Search air fryers"
                placeholder="Search model, UPC, EAN, ASIN, or brand…"
              />
              <button type="submit">Search</button>
            </form>
            <div className="quick-links"><span>Try:</span><Link href="/search?q=Ninja+AF141">Ninja AF141</Link><Link href="/search?q=Cosori">Cosori</Link><Link href="/search?q=dual+basket">Dual basket</Link></div>
          </div>
          <div className="hero-card">
            <div className="hero-card-top"><span>DATA-FIRST</span><span>01</span></div>
            <div className="air-icon">◉</div>
            <h2>One place for the details that matter.</h2>
            <div className="spec-list"><div><b>MODEL</b><span>Exact identity</span></div><div><b>SPECS</b><span>Structured data</span></div><div><b>RETAILERS</b><span>Current availability</span></div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head"><div><span className="eyebrow">EXPLORE</span><h2>Shop by capacity</h2></div><Link href="/air-fryers">View all →</Link></div>
          <div className="capacity-grid">{capacities.map(([name, sub]) => <Link href="/air-fryers" className="capacity-card" key={name}><strong>{name}</strong><span>{sub}</span><i>→</i></Link>)}</div>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-head"><div><span className="eyebrow">BUILT FOR REAL USE</span><h2>Find by how you cook</h2></div></div>
          <div className="use-grid">{uses.map(x => <Link href="/air-fryers" className="use-card" key={x}><span>↗</span>{x}</Link>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head"><div><span className="eyebrow">BRANDS</span><h2>Explore popular brands</h2></div><Link href="/brands">All brands →</Link></div>
          <div className="brand-grid">{brands.map(x => <Link href="/brands" key={x} className="brand-pill">{x}<span>→</span></Link>)}</div>
        </div>
      </section>

      <section className="trust">
        <div className="shell trust-grid">
          <div><span className="eyebrow">WHY AIR FRYER</span><h2>Useful information.<br/>No invented specs.</h2></div>
          <div className="trust-item"><b>01</b><strong>Product identity</strong><p>Model, UPC, EAN, ASIN and MPN matching.</p></div>
          <div className="trust-item"><b>02</b><strong>Clear comparisons</strong><p>See meaningful differences between similar models.</p></div>
          <div className="trust-item"><b>03</b><strong>Retailer context</strong><p>Prices and availability only when current data is available.</p></div>
        </div>
      </section>

      <footer><div className="shell footer"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><span>Product intelligence for better decisions.</span><div><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></div></div></footer>
    </main>
  );
}