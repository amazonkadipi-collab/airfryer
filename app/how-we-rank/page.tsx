import Link from "next/link";

export const metadata = {
  title: "How We Rank",
  description: "How Air Fryer evaluates product data, identity, completeness and comparison usefulness.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <main>
    <header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Find an air fryer</Link></div></header>
    <section className="section"><div className="shell narrow-copy"><span className="eyebrow">TRANSPARENCY</span><h1 className="page-title">How We Rank</h1><p className="page-lead">Our product pages are built around structured data quality, not paid placement.</p>
    <div className="legal-copy"><p>We evaluate products using identifiable product records, model and identifier matching, specification completeness, source quality and whether useful comparison information is available.</p><p>Retailer offers are a separate layer. A product does not need an affiliate offer to appear in our catalog. When retailer information is shown, availability and other time-sensitive details may change and should be checked with the retailer.</p><p>Affiliate relationships, where applicable, do not determine a product's technical specifications or identity. We aim to keep product information separate from commercial offers.</p></div></div></section>
    <footer><div className="shell footer"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><span>Product intelligence for better decisions.</span><div><Link href="/about">About</Link><Link href="/affiliate-disclosure">Affiliate Disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></div></div></footer>
  </main>;
}