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
  const rows = await db`
    SELECT p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart, p.quality_score,
      (CASE WHEN lower(coalesce(p.model, '')) = lower(${q}) THEN 100 ELSE 0 END +
       CASE WHEN lower(p.title) = lower(${q}) THEN 90 ELSE 0 END +
       CASE WHEN lower(coalesce(b.name, '')) = lower(${q}) THEN 80 ELSE 0 END +
       CASE WHEN lower(p.title) LIKE '%' || lower(${q}) || '%' THEN 45 ELSE 0 END +
       CASE WHEN lower(coalesce(p.model, '')) LIKE '%' || lower(${q}) || '%' THEN 55 ELSE 0 END +
       similarity(p.title, ${q}) * 35 + similarity(coalesce(p.model, ''), ${q}) * 30 +
       similarity(coalesce(b.name, ''), ${q}) * 20) AS match_score
    FROM products p LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.status = 'active' AND (
      lower(p.title) LIKE '%' || lower(${q}) || '%' OR lower(coalesce(p.model, '')) LIKE '%' || lower(${q}) || '%' OR
      lower(coalesce(b.name, '')) LIKE '%' || lower(${q}) || '%' OR similarity(p.title, ${q}) > 0.18 OR
      similarity(coalesce(p.model, ''), ${q}) > 0.25 OR similarity(coalesce(b.name, ''), ${q}) > 0.25 OR
      EXISTS (SELECT 1 FROM product_identifiers i WHERE i.product_id = p.id AND lower(i.identifier_value) = lower(${q}))
    )
    ORDER BY match_score DESC, quality_score DESC NULLS LAST, p.title ASC LIMIT 24
  `;
  return rows as unknown as ProductSearchRow[];
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db`
    SELECT p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart, p.quality_score,
      p.description, p.capacity_liters, p.wattage, p.basket_type, p.basket_count,
      p.dishwasher_safe, p.rotisserie, p.digital_controls, p.temperature_min, p.temperature_max,
      p.dimensions, p.weight, p.indexable
    FROM products p LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.slug = ${slug} AND p.status = 'active' LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getComparisonBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;
  const rows = await db`
    SELECT c.slug, c.status, c.search_demand, c.quality_score,
      json_build_object('slug', a.slug, 'title', a.title, 'model', a.model, 'brand_name', ba.name,
        'capacity_quart', a.capacity_quart, 'quality_score', a.quality_score, 'description', a.description,
        'capacity_liters', a.capacity_liters, 'wattage', a.wattage, 'basket_type', a.basket_type,
        'basket_count', a.basket_count, 'dishwasher_safe', a.dishwasher_safe, 'rotisserie', a.rotisserie,
        'digital_controls', a.digital_controls, 'temperature_min', a.temperature_min, 'temperature_max', a.temperature_max,
        'dimensions', a.dimensions, 'weight', a.weight, 'indexable', a.indexable) AS a,
      json_build_object('slug', b.slug, 'title', b.title, 'model', b.model, 'brand_name', bb.name,
        'capacity_quart', b.capacity_quart, 'quality_score', b.quality_score, 'description', b.description,
        'capacity_liters', b.capacity_liters, 'wattage', b.wattage, 'basket_type', b.basket_type,
        'basket_count', b.basket_count, 'dishwasher_safe', b.dishwasher_safe, 'rotisserie', b.rotisserie,
        'digital_controls', b.digital_controls, 'temperature_min', b.temperature_min, 'temperature_max', b.temperature_max,
        'dimensions', b.dimensions, 'weight', b.weight, 'indexable', b.indexable) AS b
    FROM comparisons c
    JOIN products a ON a.id = c.product_a_id JOIN products b ON b.id = c.product_b_id
    LEFT JOIN brands ba ON ba.id = a.brand_id LEFT JOIN brands bb ON bb.id = b.brand_id
    WHERE c.slug = ${slug} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getAlternatives(slug: string) {
  const db = getDb();
  if (!db) return { product: null, alternatives: [] };
  const rows = await db`
    WITH target AS (SELECT * FROM products WHERE slug = ${slug} AND status = 'active' LIMIT 1)
    SELECT json_build_object('slug', t.slug, 'title', t.title, 'model', t.model, 'brand_name', bt.name,
      'capacity_quart', t.capacity_quart, 'quality_score', t.quality_score, 'description', t.description,
      'capacity_liters', t.capacity_liters, 'wattage', t.wattage, 'basket_type', t.basket_type,
      'basket_count', t.basket_count, 'dishwasher_safe', t.dishwasher_safe, 'rotisserie', t.rotisserie,
      'digital_controls', t.digital_controls, 'temperature_min', t.temperature_min, 'temperature_max', t.temperature_max,
      'dimensions', t.dimensions, 'weight', t.weight, 'indexable', t.indexable) AS product,
      (CASE WHEN t.brand_id = p.brand_id THEN 10 ELSE 0 END +
       CASE WHEN t.capacity_quart IS NOT NULL AND p.capacity_quart IS NOT NULL
         THEN greatest(0, 20 - abs(t.capacity_quart - p.capacity_quart) * 5) ELSE 0 END +
       CASE WHEN t.basket_type IS NOT NULL AND t.basket_type = p.basket_type THEN 15 ELSE 0 END +
       CASE WHEN t.basket_count IS NOT NULL AND t.basket_count = p.basket_count THEN 10 ELSE 0 END +
       CASE WHEN t.dishwasher_safe IS NOT NULL AND t.dishwasher_safe = p.dishwasher_safe THEN 5 ELSE 0 END) AS match_score
    FROM target t JOIN products p ON p.id <> t.id AND p.status = 'active'
    LEFT JOIN brands bt ON bt.id = t.brand_id
    WHERE p.indexable = true
    ORDER BY match_score DESC, p.quality_score DESC NULLS LAST LIMIT 12
  `;
  const target = rows[0]?.product ?? null;
  return { product: target, alternatives: rows.map(x => ({...x.product, match_score:x.match_score})) };
}
