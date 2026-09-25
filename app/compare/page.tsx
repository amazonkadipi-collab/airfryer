import Link from "next/link";

export const metadata = { title: "Compare Air Fryers", description: "Compare air fryer models using structured product data.", robots: { index: false, follow: true } };

export default function ComparePage() {
  return <main>
    <header className="site-header"><div className="shell nav">
      <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
      <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
      <Link href="/search" className="nav-cta">Search models</Link>
    </div></header>
    <section className="section"><div className="shell">
      <span className="eyebrow">COMPARE</span><h1 className="page-title">Put two air fryers side by side.</h1>
      <p className="page-lead">Choose models and compare only the fields supported by verified product data.</p>
      <div className="compare-select"><div><span>MODEL A</span><strong>Choose a product</strong></div><b>VS</b><div><span>MODEL B</span><strong>Choose a product</strong></div></div>
      <div className="empty-panel"><span className="eyebrow">COMPARISON ENGINE</span><h2>Comparison tables will be generated from matched records.</h2><p>Price, capacity, dimensions, power, basket configuration, features and retailer context will be shown when the underlying sources are verified.</p><Link href="/search" className="button dark">Search products</Link></div>
    </div></section>
  </main>;
}