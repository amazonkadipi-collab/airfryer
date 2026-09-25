import { getDb } from "./db";

export type ProductSearchRow = {
  slug: string;
  title: string;
  model: string | null;
  brand_name: string | null;
  capacity_quart: number | null;
  quality_score: number | null;
};

export type ProductRecord = ProductSearchRow & {
  description: string | null;
  capacity_liters: number | null;
  wattage: number | null;
  basket_type: string | null;
  basket_count: number | null;
  dishwasher_safe: boolean | null;
  rotisserie: boolean | null;
  digital_controls: boolean | null;
  temperature_min: number | null;
  temperature_max: number | null;
  dimensions: unknown;
  weight: number | null;
  indexable: boolean;
};

export async function searchProducts(query: string): Promise<ProductSearchRow[]> {
  const db = getDb();
  if (!db || !query.trim()) return [];
  const q = query.trim();
  return db<ProductSearchRow[]>`
    SELECT
      p.slug, p.title, p.model, b.name AS brand_name,
      p.capacity_quart, p.quality_score,
      (
        CASE WHEN lower(coalesce(p.model, '')) = lower(${q}) THEN 100 ELSE 0 END +
        CASE WHEN lower(p.title) = lower(${q}) THEN 90 ELSE 0 END +
        CASE WHEN lower(coalesce(b.name, '')) = lower(${q}) THEN 80 ELSE 0 END +
        CASE WHEN lower(p.title) LIKE '%' || lower(${q}) || '%' THEN 45 ELSE 0 END +
        CASE WHEN lower(coalesce(p.model, '')) LIKE '%' || lower(${q}) || '%' THEN 55 ELSE 0 END +
        similarity(p.title, ${q}) * 35 +
        similarity(coalesce(p.model, ''), ${q}) * 30 +
        similarity(coalesce(b.name, ''), ${q}) * 20
      ) AS match_score
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.status = 'active'
      AND (
        lower(p.title) LIKE '%' || lower(${q}) ||
        lower(coalesce(p.model, '')) LIKE '%' || lower(${q}) ||
        lower(coalesce(b.name, '')) LIKE '%' || lower(${q}) ||
        similarity(p.title, ${q}) > 0.18 ||
        similarity(coalesce(p.model, ''), ${q}) > 0.25 ||
        similarity(coalesce(b.name, ''), ${q}) > 0.25 ||
        EXISTS (
          SELECT 1 FROM product_identifiers i
          WHERE i.product_id = p.id AND lower(i.identifier_value) = lower(${q})
        )
      )
    ORDER BY match_score DESC, quality_score DESC NULLS LAST, p.title ASC
    LIMIT 24
  `;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db<ProductRecord[]>`
    SELECT
      p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart,
      p.quality_score, p.description, p.capacity_liters, p.wattage,
      p.basket_type, p.basket_count, p.dishwasher_safe, p.rotisserie,
      p.digital_controls, p.temperature_min, p.temperature_max,
      p.dimensions, p.weight, p.indexable
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.slug = ${slug} AND p.status = 'active'
    LIMIT 1
  `;
  return rows[0] ?? null;
}
