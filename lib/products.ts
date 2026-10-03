import { getDb } from "./db";

export type ProductSearchRow = {
  id: number;
  slug: string;
  title: string;
  model: string | null;
  brand_name: string | null;
  capacity_quart: number | null;
  quality_score: number | null;
  basket_type?: string | null;
  basket_count?: number | null;
  digital_controls?: boolean | null;
  image_url?: string | null;
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
  human_verified: boolean;
  verified_at: string | null;
  conflict_flag: boolean;
  image_url: string | null;
  identifiers: Array<{ identifier_type: string; identifier_value: string }>;
  offers: Array<{ retailer_slug: string; retailer_name: string; external_product_id: string | null; price: number | null; currency: string | null; url: string | null; affiliate_url: string | null; availability: string | null; last_checked_at: string | null }>;
};

export async function getBrands(): Promise<Array<{ slug: string; name: string; product_count: number }>> {
  const db = getDb();
  if (!db) return [];
  const rows = await db`
    SELECT b.slug, b.name, COUNT(p.id)::int AS product_count
    FROM brands b
    LEFT JOIN products p ON p.brand_id = b.id AND p.status = 'active'
    GROUP BY b.id, b.slug, b.name
    ORDER BY COUNT(p.id) DESC, b.name ASC
  `;
  return rows as unknown as Array<{ slug: string; name: string; product_count: number }>;
}

export async function getCatalogCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const rows = await db`SELECT COUNT(*)::int AS count FROM products WHERE status = 'active' AND indexable = true AND EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = products.id AND pi.image_url IS NOT NULL AND pi.image_url <> '')`;
  return Number(rows[0]?.count ?? 0);
}

export async function getFeaturedProducts(limit = 50, offset = 0): Promise<ProductSearchRow[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db`
    SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart, p.quality_score, p.basket_type, p.basket_count, p.digital_controls,
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.image_url IS NOT NULL AND pi.image_url <> '' ORDER BY pi.licensed DESC, pi.sort_order ASC LIMIT 1) AS image_url
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.status = 'active' AND p.indexable = true
      AND EXISTS (SELECT 1 FROM product_images px WHERE px.product_id = p.id AND px.image_url IS NOT NULL AND px.image_url <> '')
    ORDER BY p.quality_score DESC NULLS LAST, p.updated_at DESC, p.title ASC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows as unknown as ProductSearchRow[];
}

export async function searchProducts(query: string): Promise<ProductSearchRow[]> {
  const db = getDb();
  if (!db || !query.trim()) return [];
  const q = query.trim();
  const capacityMatch = q.match(/^(\d+(?:\.\d+)?)\s*(?:qt|qts|quart|quarts)$/i);
  const capacityQuart = capacityMatch ? Number(capacityMatch[1]) : null;
  const rows = await db`
    SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart, p.quality_score,
      p.basket_type, p.basket_count, p.digital_controls,
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.image_url IS NOT NULL AND pi.image_url <> '' ORDER BY pi.licensed DESC, pi.sort_order ASC LIMIT 1) AS image_url,
      (CASE WHEN lower(coalesce(p.model, '')) = lower(${q}) THEN 100 ELSE 0 END +
       CASE WHEN lower(p.title) = lower(${q}) THEN 90 ELSE 0 END +
       CASE WHEN lower(coalesce(b.name, '')) = lower(${q}) THEN 80 ELSE 0 END +
       CASE WHEN ${capacityQuart}::numeric IS NOT NULL AND p.capacity_quart IS NOT NULL AND abs(p.capacity_quart - ${capacityQuart}::numeric) < 0.01 THEN 120 ELSE 0 END +
       CASE WHEN lower(p.title) LIKE '%' || lower(${q}) || '%' THEN 45 ELSE 0 END +
       CASE WHEN lower(coalesce(p.model, '')) LIKE '%' || lower(${q}) || '%' THEN 55 ELSE 0 END +
       similarity(p.title, ${q}) * 35 + similarity(coalesce(p.model, ''), ${q}) * 30 +
       similarity(coalesce(b.name, ''), ${q}) * 20) AS match_score
    FROM products p LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.status = 'active' AND EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.image_url IS NOT NULL AND pi.image_url <> '') AND (
      (${capacityQuart}::numeric IS NOT NULL AND p.capacity_quart IS NOT NULL AND abs(p.capacity_quart - ${capacityQuart}::numeric) < 0.01) OR
      lower(p.title) LIKE '%' || lower(${q}) || '%' OR lower(coalesce(p.model, '')) LIKE '%' || lower(${q}) || '%' OR
      lower(coalesce(b.name, '')) LIKE '%' || lower(${q}) || '%' OR similarity(p.title, ${q}) > 0.18 OR
      similarity(coalesce(p.model, ''), ${q}) > 0.25 OR similarity(coalesce(b.name, ''), ${q}) > 0.25 OR
      EXISTS (SELECT 1 FROM product_identifiers i WHERE i.product_id = p.id AND lower(i.identifier_value) = lower(${q}))
    )
    ORDER BY match_score DESC, quality_score DESC NULLS LAST, p.title ASC LIMIT 50
  `;
  return rows as unknown as ProductSearchRow[];
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db`
    SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart, p.quality_score,
      p.description, p.capacity_liters, p.wattage, p.basket_type, p.basket_count,
      p.dishwasher_safe, p.rotisserie, p.digital_controls, p.temperature_min, p.temperature_max,
      p.dimensions, p.weight, p.indexable, p.human_verified, p.verified_at, p.conflict_flag,
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.image_url IS NOT NULL AND pi.image_url <> '' ORDER BY pi.licensed DESC, pi.sort_order ASC LIMIT 1) AS image_url,
      COALESCE((SELECT json_agg(json_build_object('identifier_type', i.identifier_type, 'identifier_value', i.identifier_value) ORDER BY i.identifier_type)
        FROM product_identifiers i WHERE i.product_id = p.id AND i.verified = true), '[]'::json) AS identifiers,
      COALESCE((SELECT json_agg(json_build_object('retailer_slug', r.domain, 'retailer_name', r.name, 'external_product_id', pr.external_product_id, 'price', pr.price, 'currency', pr.currency, 'url', pr.url, 'affiliate_url', pr.affiliate_url, 'availability', pr.availability, 'last_checked_at', pr.last_checked_at) ORDER BY pr.price NULLS LAST)
        FROM product_retailers pr JOIN retailers r ON r.id = pr.retailer_id
        WHERE pr.product_id = p.id AND pr.affiliate_url IS NOT NULL
          AND pr.id = (SELECT MAX(pr2.id) FROM product_retailers pr2 WHERE pr2.product_id = pr.product_id AND pr2.retailer_id = pr.retailer_id)), '[]'::json) AS offers
    FROM products p LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.slug = ${slug} AND p.status = 'active' LIMIT 1
  `;
  return (rows[0] ?? null) as unknown as ProductRecord | null;
}

export type ComparisonProduct = ProductRecord;
export type ComparisonRecord = { slug: string; status: string; search_demand: number | null; quality_score: number | null; a: ComparisonProduct; b: ComparisonProduct };

export async function getComparisonBySlug(slug: string): Promise<ComparisonRecord | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db`
    SELECT c.slug, c.status, c.search_demand, c.quality_score,
      json_build_object('slug', a.slug, 'title', a.title, 'model', a.model, 'brand_name', ba.name, 'capacity_quart', a.capacity_quart, 'quality_score', a.quality_score, 'description', a.description, 'capacity_liters', a.capacity_liters, 'wattage', a.wattage, 'basket_type', a.basket_type, 'basket_count', a.basket_count, 'dishwasher_safe', a.dishwasher_safe, 'rotisserie', a.rotisserie, 'digital_controls', a.digital_controls, 'temperature_min', a.temperature_min, 'temperature_max', a.temperature_max, 'dimensions', a.dimensions, 'weight', a.weight, 'indexable', a.indexable) AS a,
      json_build_object('slug', b.slug, 'title', b.title, 'model', b.model, 'brand_name', bb.name, 'capacity_quart', b.capacity_quart, 'quality_score', b.quality_score, 'description', b.description, 'capacity_liters', b.capacity_liters, 'wattage', b.wattage, 'basket_type', b.basket_type, 'basket_count', b.basket_count, 'dishwasher_safe', b.dishwasher_safe, 'rotisserie', b.rotisserie, 'digital_controls', b.digital_controls, 'temperature_min', b.temperature_min, 'temperature_max', b.temperature_max, 'dimensions', b.dimensions, 'weight', b.weight, 'indexable', b.indexable) AS b
    FROM comparisons c JOIN products a ON a.id = c.product_a_id JOIN products b ON b.id = c.product_b_id LEFT JOIN brands ba ON ba.id = a.brand_id LEFT JOIN brands bb ON bb.id = b.brand_id
    WHERE c.slug = ${slug} LIMIT 1
  `;
  return (rows[0] ?? null) as unknown as ComparisonRecord | null;
}

export type AlternativeProduct = ProductRecord & { match_score: number };
type AlternativeRow = { product: ProductRecord; match_score: number };

export async function getAlternatives(slug: string): Promise<{ product: ProductRecord | null; alternatives: AlternativeProduct[] }> {
  const db = getDb();
  if (!db) return { product: null, alternatives: [] };
  const product = await getProductBySlug(slug);
  if (!product) return { product: null, alternatives: [] };
  const rows = await db`
    WITH target AS (SELECT * FROM products WHERE slug = ${slug} AND status = 'active' LIMIT 1)
    SELECT json_build_object('slug', p.slug, 'title', p.title, 'model', p.model, 'brand_name', bp.name, 'capacity_quart', p.capacity_quart, 'quality_score', p.quality_score, 'description', p.description, 'capacity_liters', p.capacity_liters, 'wattage', p.wattage, 'basket_type', p.basket_type, 'basket_count', p.basket_count, 'dishwasher_safe', p.dishwasher_safe, 'rotisserie', p.rotisserie, 'digital_controls', p.digital_controls, 'temperature_min', p.temperature_min, 'temperature_max', p.temperature_max, 'dimensions', p.dimensions, 'weight', p.weight, 'indexable', p.indexable) AS product,
      (CASE WHEN t.brand_id = p.brand_id THEN 10 ELSE 0 END + CASE WHEN t.capacity_quart IS NOT NULL AND p.capacity_quart IS NOT NULL THEN greatest(0, 20 - abs(t.capacity_quart - p.capacity_quart) * 5) ELSE 0 END + CASE WHEN t.basket_type IS NOT NULL AND t.basket_type = p.basket_type THEN 15 ELSE 0 END + CASE WHEN t.basket_count IS NOT NULL AND t.basket_count = p.basket_count THEN 10 ELSE 0 END + CASE WHEN t.dishwasher_safe IS NOT NULL AND t.dishwasher_safe = p.dishwasher_safe THEN 5 ELSE 0 END) AS match_score
    FROM target t JOIN products p ON p.slug <> ${slug} AND p.status = 'active' LEFT JOIN brands bp ON bp.id = p.brand_id
    WHERE p.indexable = true ORDER BY match_score DESC, p.quality_score DESC NULLS LAST LIMIT 12
  `;
  const typedRows = rows as unknown as AlternativeRow[];
  return { product, alternatives: typedRows.map((x) => ({ ...x.product, match_score: x.match_score })) };
}

export async function getSimilarProducts(productId: number, limit = 4): Promise<ProductSearchRow[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db`
    WITH target AS (SELECT brand_id, capacity_quart, basket_type, basket_count FROM products WHERE id = ${productId} LIMIT 1)
    SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name, p.capacity_quart, p.quality_score,
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.image_url IS NOT NULL AND pi.image_url <> '' ORDER BY pi.licensed DESC, pi.sort_order ASC LIMIT 1) AS image_url
    FROM target t JOIN products p ON p.id <> ${productId} AND p.status = 'active' AND p.indexable = true
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE EXISTS (SELECT 1 FROM product_images px WHERE px.product_id = p.id AND px.image_url IS NOT NULL AND px.image_url <> '')
    ORDER BY (CASE WHEN t.brand_id = p.brand_id THEN 30 ELSE 0 END) + (CASE WHEN t.basket_type IS NOT NULL AND t.basket_type = p.basket_type THEN 20 ELSE 0 END) + (CASE WHEN t.capacity_quart IS NOT NULL AND p.capacity_quart IS NOT NULL THEN greatest(0, 25 - abs(t.capacity_quart - p.capacity_quart) * 5) ELSE 0 END) + (CASE WHEN t.basket_count IS NOT NULL AND t.basket_count = p.basket_count THEN 10 ELSE 0 END) DESC, p.quality_score DESC NULLS LAST, p.title ASC
    LIMIT ${limit}
  `;
  return rows as unknown as ProductSearchRow[];
}
