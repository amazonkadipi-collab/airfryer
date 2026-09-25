import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://airfryer.vercel.app"), title: { default: "Air Fryer Product Intelligence", template: "%s | Air Fryer" }, description: "Search, compare, and discover air fryers using structured product data, identifiers, features, and retailer information.", robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }