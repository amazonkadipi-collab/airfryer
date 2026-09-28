import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav">
        <Link href="/" className="brand">
          <span className="brand-mark">AF</span>
          <span>Air Fryer</span>
        </Link>
        <nav aria-label="Primary">
          <Link href="/air-fryers">Browse</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/search">Search</Link>
        </nav>
        <Link href="/search" className="nav-cta">Find an air fryer</Link>
      </div>
    </header>
  );
}
