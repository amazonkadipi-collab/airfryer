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

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "air-fryer";
  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const rows = await sql`SELECT 1 FROM products WHERE slug = ${candidate} LIMIT 1`;
    if (!rows.length) return candidate;
  }
  return `${root}-${Date.now()}`;
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

async function insertProduct(p: RawProduct, brandId: number): Promise<number> {
  const model = extractModel(p.title, p.model);
  const slug = await uniqueSlug(`${p.brand || "unknown"}-${model || p.title}`);
  const dimensions = parseDimensions(p.dimensions);
  const capacityQuart = extractCapacityQuart(p.title, p.capacity_quart, p.capacity_liters);
  const wattage = p.wattage ?? extractWattage(p.features, p.title);
  const weight = parseWeight(p.weight);

  // Index only records that pass the minimum identity/completeness gate.
  // Affiliate offers are intentionally not part of this gate.
  const hasIdentifier = Boolean(p.asin || p.upc || p.ean);
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

  const rows = await sql`
    INSERT INTO products (
      slug, brand_id, model, title, capacity_quart, capacity_liters, wattage,
      dimensions, weight, status, lifecycle_state, match_method,
      match_score, human_verified, conflict_flag, quality_score, indexable
    ) VALUES (
      ${slug}, ${brandId}, ${model}, ${p.title.trim()},
      ${capacityQuart}, ${p.capacity_liters ?? null}, ${wattage},
      ${dimensions ? JSON.stringify(dimensions) : null}::jsonb, ${weight},
      'active', 'draft', 'source', NULL, false, false,
      ${qualityScore}, ${indexable}
    )
    RETURNING id
  `;
  return Number(rows[0].id);
}

async function insertIdentifiers(productId: number, p: RawProduct): Promise<void> {
  const ids: Array<[string, string]> = [];
  if (p.asin) ids.push(["ASIN", p.asin.trim().toUpperCase()]);
  if (p.upc) ids.push(["UPC", p.upc.replace(/\D/g, "")]);
  if (p.ean) ids.push(["EAN", p.ean.replace(/\D/g, "")]);
  if (p.model) ids.push(["MPN", p.model.trim()]);

  for (const [type, value] of ids) {
    if (!value) continue;
    await sql`
      INSERT INTO product_identifiers (product_id, identifier_type, identifier_value, source, verified)
      VALUES (${productId}, ${type}, ${value}, ${p.source}, false)
      ON CONFLICT (identifier_type, identifier_value) DO NOTHING
    `;
  }
}

async function insertImages(productId: number, p: RawProduct): Promise<void> {
  for (const [i, url] of (p.images ?? []).slice(0, 8).entries()) {
    if (!/^https?:\/\//i.test(url)) continue;
    await sql`
      INSERT INTO product_images (product_id, image_url, source, licensed, sort_order)
      VALUES (${productId}, ${url}, ${p.source}, false, ${i})
    `;
  }
}

async function insertFeatures(productId: number, p: RawProduct): Promise<void> {
  for (const feature of (p.features ?? []).slice(0, 30)) {
    const text = feature.trim();
    if (!text) continue;
    await sql`
      INSERT INTO product_features (product_id, feature_key, feature_value, source, verified)
      VALUES (${productId}, 'feature', ${text}, ${p.source}, false)
    `;
  }
}

async function ingestFile(filePath: string): Promise<void> {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const products: RawProduct[] = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
  if (!products.length) throw new Error("Input JSON contains no products");

  const stats = { total: products.length, inserted: 0, duplicate: 0, invalid: 0, failed: 0 };

  for (const [index, product] of products.entries()) {
    const prefix = `[${index + 1}/${products.length}]`;
    try {
      const validation = validateProduct(product);
      if (!validation.valid) { console.warn(prefix, "INVALID", validation.errors.join("; ")); stats.invalid++; continue; }
      const duplicate = await findDuplicate(product);
      if (duplicate.isDuplicate) { console.log(prefix, "DUPLICATE", duplicate.matchedBy); stats.duplicate++; continue; }

      const brandId = await ensureBrand(product.brand || "Unknown");
      const productId = await insertProduct(product, brandId);
      await insertIdentifiers(productId, product);
      await insertImages(productId, product);
      await insertFeatures(productId, product);
      stats.inserted++;
      console.log(prefix, "OK", productId, product.title.slice(0, 70));
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
