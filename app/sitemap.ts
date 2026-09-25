import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://airfryer.vercel.app";
  const db = getDb();
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: base + "/air-fryers", changeFrequency: "daily", priority: 0.8 },
    { url: base + "/brands", changeFrequency: "weekly", priority: 0.6 },
  ];
  if (!db) return staticPages;
  const products = await db<{slug:string; updated_at:string}[]>`
    SELECT slug, updated_at FROM products
    WHERE status = 'active' AND indexable = true
    ORDER BY updated_at DESC LIMIT 5000
  `;
  return [...staticPages, ...products.map((p) => ({
    url: base + "/products/" + p.slug,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))];
}
