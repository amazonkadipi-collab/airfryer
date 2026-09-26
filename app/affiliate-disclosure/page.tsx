import Link from "next/link";

export const metadata = {
  title: "Affiliate Disclosure",
  description: "Affiliate disclosure for Air Fryer.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <main>
    <header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Find an air fryer</Link></div></header>
    <section className="section"><div className="shell narrow-copy"><span className="eyebrow">DISCLOSURE</span><h1 className="page-title">Affiliate Disclosure</h1><p className="page-lead">Some retailer links on Air Fryer may be affiliate links.</p>
    <div className="legal-copy"><p>If a retailer link is an affiliate link, we may receive a commission when a visitor makes a qualifying purchase through that link, at no additional cost to the visitor.</p><p>Not every product is an affiliate product. Our catalog is designed to contain product information independently of retailer offers. A product may have no retailer offer, one offer, or offers from multiple retailers.</p><p>Retailer prices and availability can change. When shown, commercial information should be verified on the retailer's website before purchase.</p></div></div></section>
    <footer><div className="shell footer"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Product intelligence</span></Link><div><Link href="/about">About</Link><Link href="/how-we-rank">How we rank</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></div></div></footer>
  </main>;
}