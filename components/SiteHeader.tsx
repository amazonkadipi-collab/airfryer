import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <header className="site-header amazon-header">
        <div className="shell nav amazon-header__top">
          <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
          <Link href="/air-fryers" className="header-location">☰ <span>Browse<br /><b>Air Fryers</b></span></Link>
          <form action="/search" method="get" className="header-search">
            <select aria-label="Search category" defaultValue="all"><option value="all">All</option></select>
            <input name="q" placeholder="Search air fryers, brands and models" />
            <button type="submit" aria-label="Search">⌕</button>
          </form>
          <Link href="/brands" className="header-account"><small>Explore</small><b>Brands</b></Link>
          <Link href="/compare" className="header-account"><small>Your</small><b>Compare</b></Link>
          <Link href="/search" className="header-cart">♡</Link>
        </div>
      </header>
      <div className="amazon-subnav">
        <div className="shell">
          <nav aria-label="Secondary">
            <Link href="/air-fryers">All Air Fryers</Link>
            <Link href="/best/air-fryers-for-two">Best Sellers</Link>
            <Link href="/air-fryers/6-quart">6 Quart</Link>
            <Link href="/best/dual-basket-air-fryers">Dual Basket</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/search">Search</Link>
          </nav>
        </div>
      </div>
    </>
  );
}
