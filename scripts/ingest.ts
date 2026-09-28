import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";
import { findDuplicate } from "./dedupe";
import { parseDimensions, parseWeight, validateProduct, type RawProduct } from "./validate";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = neon(databaseUrl);

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

function extractModel(title: string, fallback?: string): string | null {
  if (fallback?.trim()) return fallback.trim();
  const m = title.match(/\b([A-Z]{2,}[ -]?\d{2,}[A-Z0-9-]*)\b/i);
  return m ? m[1].replace(/\s+/g, "") : null;
}

function extractWattage(features: string[] = [], title = ""): number | null {
  for (const src of [...features, title]) {
    const m = src.match(/(\d{3,4})\s*W(?:att)?s?\b/i);
    if (m) {
      const w = Number(m[1]);
      if (w >= 700 && w <= 2500) return w;
    }
  }
  return null;
}

function extractCapacityQuart(title: string, explicit?: number, liters?: number): number | null {
  if (explicit && explicit > 0) return explicit;
  if (liters && liters > 0) return Math.round(liters * 1.05669 * 10) / 10;
  const m = title.match(/(\d+(?:\.\d+)?)\s*(qt|quarts?|l|liters?|litres?)\b/i);
  if (!m) return null;
  const n = Number(m[1]);
  return /^l/i.test(m[2]) ? Math.round(n * 1.05669 * 10) / 10 : n;
}

async function ensureBrand(name: string): Promise<number> {
  const clean = name.trim() || "Unknown";
  const slug = slugify(clean) || "unknown";
  const rows = await sql`
    INSERT INTO brands (slug, name) VALUES (${slug}, ${clean})
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
    RETURNING id
  `;
  return Number(rows[0].id);
}

async function findExistingProductId(p: RawProduct, brandId: number, model: string | null, slug: string): Promise<number | null> {
  const bySlug = await sql`SELECT id FROM products WHERE slug = ${slug} LIMIT 1`;
  if (bySlug.length) return Number(bySlug[0].id);

  if (model) {
    const byModel = await sql`
      SELECT id FROM products
      WHERE brand_id = ${brandId} AND lower(model) = lower(${model})
      ORDER BY id ASC LIMIT 1
    `;
    if (byModel.length) return Number(byModel[0].id);
  }

  return null;
}

async function upsertProduct(p: RawProduct, brandId: number, model: string | null, slug: string): Promise<number> {
  const dimensions = parseDimensions(p.dimensions);
  const capacityQuart = extractCapacityQuart(p.title, p.capacity_quart, p.capacity_liters);
  const wattage = p.wattage ?? extractWattage(p.features, p.title);
  const weight = parseWeight(p.weight);
  const hasIdentifier = Boolean(p.asin || p.upc || p.ean || model);
  const qualityScore = Math.min(
    100,
    Math.round(
      (p.images?.length ? 20 : 0) +
      (model ? 20 : 0) +
      (hasIdentifier ? 30 : 0) +
      (p.brand ? 15 : 0) +
      (wattage || capacityQuart ? 10 : 0) +
      (p.features?.length ? 5 : 0),
    ),
  );
  const indexable = qualityScore >= 70 && hasIdentifier && Boolean(model) && Boolean(p.brand);
  const existingId = await findExistingProductId(p, brandId, model, slug);

  if (existingId) {
    const rows = await sql`
      UPDATE products
      SET
        title = ${p.title.trim()},
        model = COALESCE(${model}, model),
        brand_id = COALESCE(${brandId}, brand_id),
        capacity_quart = COALESCE(${capacityQuart}, capacity_quart),
        capacity_liters = COALESCE(${p.capacity_liters ?? null}, capacity_liters),
        wattage = COALESCE(${wattage}, wattage),
        dimensions = COALESCE(${dimensions ? JSON.stringify(dimensions) : null}::jsonb, dimensions),
        weight = COALESCE(${weight}, weight),
        quality_score = GREATEST(COALESCE(quality_score, 0), ${qualityScore}),
        indexable = indexable OR ${indexable},
        updated_at = NOW()
      WHERE id = ${existingId}
      RETURNING id
    `;
    return Number(rows[0].id);
  }

  const rows = await sql`
    INSERT INTO products (
      slug, brand_id, model, title, capacity_quart, capacity_liters, wattage,
      dimensions, weight, status, lifecycle_state, match_method,
      match_score, human_verified, conflict_flag, quality_score, indexable
    ) VALUES (
      ${slug}, ${brandId}, ${model}, ${p.title.trim()},
      ${capacityQuart}, ${p.capacity_liters ?? null}, ${wattage},
      ${dimensions ? JSON.stringify(dimensions) : null}::jsonb, ${weight},
      'active', 'draft', ${p.source}, NULL, false, false,
      ${qualityScore}, ${indexable}
    )
    RETURNING id
  `;
  return Number(rows[0].id);
}

async function insertIdentifiers(productId: number, p: RawProduct, model: string | null): Promise<number> {
  const ids: Array<[string, string]> = [];
  if (p.asin) ids.push(["ASIN", p.asin.trim().toUpperCase()]);
  if (p.upc) ids.push(["UPC", p.upc.replace(/\D/g, "")]);
  if (p.ean) ids.push(["EAN", p.ean.replace(/\D/g, "")]);
  if (model) ids.push(["MPN", model.trim()]);

  let inserted = 0;
  for (const [type, value] of ids) {
    if (!value) continue;
    const rows = await sql`
      INSERT INTO product_identifiers (product_id, identifier_type, identifier_value, source, verified)
      SELECT ${productId}, ${type}, ${value}, ${p.source}, false
      WHERE NOT EXISTS (
        SELECT 1 FROM product_identifiers
        WHERE identifier_type = ${type} AND identifier_value = ${value}
      )
      RETURNING id
    `;
    if (rows.length) inserted++;
  }
  return inserted;
}

async function insertImages(productId: number, p: RawProduct): Promise<number> {
  let inserted = 0;
  for (const [i, url] of (p.images ?? []).slice(0, 8).entries()) {
    if (!/^https?:\/\//i.test(url)) continue;
    const rows = await sql`
      INSERT INTO product_images (product_id, image_url, source, licensed, sort_order)
      SELECT ${productId}, ${url}, ${p.source}, false, ${i}
      WHERE NOT EXISTS (
        SELECT 1 FROM product_images
        WHERE product_id = ${productId} AND image_url = ${url}
      )
      RETURNING id
    `;
    if (rows.length) inserted++;
  }
  return inserted;
}

async function insertFeatures(productId: number, p: RawProduct): Promise<number> {
  let inserted = 0;
  for (const feature of (p.features ?? []).slice(0, 30)) {
    const text = feature.trim();
    if (!text) continue;
    const rows = await sql`
      INSERT INTO product_features (product_id, feature_key, feature_value, source, verified)
      SELECT ${productId}, 'feature', ${text}, ${p.source}, false
      WHERE NOT EXISTS (
        SELECT 1 FROM product_features
        WHERE product_id = ${productId} AND feature_key = 'feature' AND feature_value = ${text}
      )
      RETURNING id
    `;
    if (rows.length) inserted++;
  }
  return inserted;
}

function retailerDomain(url?: string): string | null {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return hostname || null;
  } catch {
    return null;
  }
}

async function ensureRetailer(name: string, domain: string): Promise<number> {
  const rows = await sql`
    INSERT INTO retailers (name, domain)
    VALUES (${name.trim() || domain}, ${domain})
    ON CONFLICT (domain) DO UPDATE SET name = COALESCE(NULLIF(EXCLUDED.name, ''), retailers.name)
    RETURNING id
  `;
  return Number(rows[0].id);
}

async function insertRetailerOffer(productId: number, p: RawProduct): Promise<boolean> {
  if (!p.product_url || p.price == null || !Number.isFinite(p.price) || p.price <= 0) return false;
  const domain = p.retailer_domain || retailerDomain(p.product_url);
  if (!domain) return false;
  const retailer = await ensureRetailer(p.retailer_name || domain, domain);

  const rows = await sql`
    INSERT INTO product_retailers (
      product_id, retailer_id, external_product_id, url, affiliate_url,
      price, currency, availability, last_checked_at
    )
    SELECT
      ${productId}, ${retailer}, ${p.retailer_product_id ?? null},
      ${p.product_url}, ${p.affiliate_url ?? null},
      ${p.price}, ${p.currency ?? "USD"}, ${p.availability ?? null}, NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM product_retailers
      WHERE product_id = ${productId}
        AND retailer_id = ${retailer}
        AND COALESCE(url, '') = COALESCE(${p.product_url}, '')
    )
    RETURNING id
  `;
  return rows.length > 0;
}

async function ingestFile(filePath: string): Promise<void> {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const products: RawProduct[] = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
  if (!products.length) throw new Error("Input JSON contains no products");

  const stats = { total: products.length, inserted: 0, updated: 0, invalid: 0, duplicate: 0, failed: 0, images: 0, identifiers: 0, features: 0, offers: 0 };

  for (const [index, product] of products.entries()) {
    const prefix = `[${index + 1}/${products.length}]`;
    try {
      const validation = validateProduct(product);
      if (!validation.valid) {
        console.warn(prefix, "INVALID", validation.errors.join("; "));
        stats.invalid++;
        continue;
      }

      const brandId = await ensureBrand(product.brand || "Unknown");
      const model = extractModel(product.title, product.model);
      const slug = slugify(`${product.brand || "unknown"}-${model || product.title}`) || "air-fryer";
      const existingBefore = await findExistingProductId(product, brandId, model, slug);

      if (!existingBefore) {
        const duplicate = await findDuplicate(product);
        if (duplicate.isDuplicate) {
          console.log(prefix, "DUPLICATE", duplicate.matchedBy);
          stats.duplicate++;
          continue;
        }
      }

      const productId = await upsertProduct(product, brandId, model, slug);
      if (existingBefore) stats.updated++;
      else stats.inserted++;

      stats.identifiers += await insertIdentifiers(productId, product, model);
      stats.images += await insertImages(productId, product);
      stats.features += await insertFeatures(productId, product);
      if (await insertRetailerOffer(productId, product)) stats.offers++;

      console.log(prefix, existingBefore ? "UPDATED" : "INSERTED", productId, product.title.slice(0, 70));
    } catch (error) {
      stats.failed++;
      console.error(prefix, "FAILED", error instanceof Error ? error.message : error);
    }
  }

  console.log(JSON.stringify(stats, null, 2));
  if (stats.failed) process.exitCode = 1;
}

const input = process.argv[2];
if (!input) throw new Error("Usage: npm run ingest -- ./data/airfryers.json");
ingestFile(path.resolve(input));
