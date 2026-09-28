import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav aria-label="Primary"><Link href="/air-fryers">Browse</Link><Link href="/compare">Compare</Link><Link href="/brands">Brands</Link><Link href="/best/air-fryers-for-two">Guides</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Find an air fryer</Link></div></header>;
}
