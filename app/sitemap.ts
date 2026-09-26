import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

type SitemapProduct = { slug: string; updated_at: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://airfryer1.vercel.app";
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/air-fryers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
  const db = getDb();
  if (!db) return staticPages;
  try {
    const products = (await db`SELECT slug, updated_at FROM products WHERE status = 'active' AND indexable = true ORDER BY updated_at DESC LIMIT 5000`) as SitemapProduct[];
    return [...staticPages, ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date(product.updated_at), changeFrequency: "weekly" as const, priority: 0.7 }))];
  } catch { return staticPages; }
}
