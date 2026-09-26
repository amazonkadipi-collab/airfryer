import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { parseDimensions, parseWeight, validateProduct, type RawProduct } from "@/scripts/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ACTOR = process.env.APIFY_ACTOR ?? "epctex~amazon-scraper";

async function findDuplicate(sql: ReturnType<typeof neon>, p: RawProduct): Promise<boolean> {
  const identifiers = [
    ["ASIN", p.asin?.trim().toUpperCase()],
    ["UPC", p.upc?.replace(/\D/g, "")],
    ["EAN", p.ean?.replace(/\D/g, "")],
  ].filter((x): x is [string, string] => Boolean(x[1]));

  for (const [type, value] of identifiers) {
    const rows = await sql`SELECT product_id FROM product_identifiers
      WHERE identifier_type = ${type} AND identifier_value = ${value} LIMIT 1`;
    if (rows.length) return true;
  }

  if (p.model?.trim()) {
    const rows = await sql`SELECT p.id FROM products p
      JOIN brands b ON b.id = p.brand_id
      WHERE lower(b.name) = lower(${p.brand || "Unknown"})
        AND lower(p.model) = lower(${p.model.trim()}) LIMIT 1`;
    if (rows.length) return true;
  }
  return false;
}

function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(/^https?:\/\//i.test(configured) ? configured : `https://${configured}`).origin;
    } catch {}
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://airfryer1.vercel.app";
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

function adapt(raw: Record<string, unknown>): RawProduct | null {
  const pick = (...keys: string[]) => keys.map(k => raw[k]).find(v => v !== undefined && v !== null && v !== "");
  const pickNumber = (...keys: string[]) => {
    const v = pick(...keys);
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number.parseFloat(v.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };
  const pickArray = (...keys: string[]) => {
    const v = pick(...keys);
    if (Array.isArray(v)) return v.map(x => typeof x === "string" ? x : x && typeof x === "object" ? String((x as Record<string, unknown>).url ?? (x as Record<string, unknown>).text ?? "") : "").filter(Boolean);
    return typeof v === "string" && v.trim() ? [v.trim()] : [];
  };
  const title = pick("title", "productTitle", "name", "itemName");
  if (typeof title !== "string" || title.trim().length < 5) return null;
  const priceRaw = pick("price", "currentPrice", "buyboxPrice");
  let price: number | undefined;
  if (typeof priceRaw === "number") price = priceRaw;
  else if (priceRaw && typeof priceRaw === "object") {
    const v = (priceRaw as Record<string, unknown>).value ?? (priceRaw as Record<string, unknown>).amount;
    price = typeof v === "number" ? v : typeof v === "string" ? Number.parseFloat(v.replace(/[^0-9.-]/g, "")) : undefined;
  } else if (typeof priceRaw === "string") price = Number.parseFloat(priceRaw.replace(/[^0-9.-]/g, ""));
  return {
    asin: String(pick("asin", "ASIN", "productAsin") ?? ""),
    upc: String(pick("upc", "UPC", "gtin12") ?? ""),
    ean: String(pick("ean", "EAN", "gtin13") ?? ""),
    title: title.trim(),
    brand: String(pick("brand", "brandName", "manufacturer", "byLine") ?? ""),
    model: String(pick("model", "modelNumber", "partNumber", "mpn") ?? ""),
    price: Number.isFinite(price) ? price : undefined,
    currency: String(pick("currency", "currencyCode") ?? "USD").toUpperCase(),
    rating: pickNumber("rating", "averageRating", "stars"),
    review_count: pickNumber("reviewsCount", "reviewCount", "ratingsCount", "reviews"),
    categories: pickArray("categories", "category", "categoryPath", "breadcrumbs"),
    images: pickArray("images", "imageUrls", "image", "photos", "gallery"),
    features: pickArray("featureBullets", "features", "feature_bullets", "bullets", "aboutThisItem"),
    dimensions: String(pick("productDimensions", "dimensions", "itemDimensions", "size") ?? ""),
    weight: String(pick("itemWeight", "weight", "shippingWeight") ?? ""),
    source: "apify"
  };
}

async function uniqueSlug(sql: ReturnType<typeof neon>, base: string) {
  const root = slugify(base) || "air-fryer";
  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const rows = await sql`SELECT 1 FROM products WHERE slug = ${candidate} LIMIT 1`;
    if (!rows.length) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function POST(request: Request) {
  const token = process.env.APIFY_TOKEN;
  const databaseUrl = process.env.DATABASE_URL;
  if (!token || !databaseUrl) return NextResponse.json({ ok: false, error: "Server ingestion configuration is incomplete" }, { status: 500 });

  const event = await request.json().catch(() => ({}));
  const resource = event?.resource ?? event;
  const runId = resource?.id ?? resource?.actorRunId ?? event?.actorRunId;
  if (!runId) return NextResponse.json({ ok: false, error: "Missing actorRunId" }, { status: 400 });

  const runResponse = await fetch(`https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
  });
  const runBody = await runResponse.json().catch(() => ({}));
  if (!runResponse.ok) return NextResponse.json({ ok: false, error: "Unable to verify Apify run" }, { status: 502 });

  const run = runBody?.data;
  if (run?.status !== "SUCCEEDED") {
    console.log("Apify run did not succeed", runId, run?.status);
    return NextResponse.json({ ok: true, runId, status: run?.status ?? "UNKNOWN" });
  }
  if (!run?.defaultDatasetId) return NextResponse.json({ ok: false, error: "Apify run has no dataset" }, { status: 502 });

  const itemsResponse = await fetch(`https://api.apify.com/v2/datasets/${encodeURIComponent(run.defaultDatasetId)}/items?clean=true&limit=10`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
  });
  const raw = await itemsResponse.json().catch(() => []);
  if (!itemsResponse.ok || !Array.isArray(raw)) return NextResponse.json({ ok: false, error: "Unable to read Apify dataset" }, { status: 502 });

  const products = raw.map((x) => x && typeof x === "object" ? adapt(x as Record<string, unknown>) : null).filter((x): x is RawProduct => Boolean(x));
  const sql = neon(databaseUrl);
  const stats = { received: raw.length, adapted: products.length, inserted: 0, duplicate: 0, invalid: 0, failed: 0 };

  for (const product of products) {
    try {
      const validation = validateProduct(product);
      if (!validation.valid) { stats.invalid++; continue; }
      const duplicate = await findDuplicate(sql, product);
      if (duplicate.isDuplicate) { stats.duplicate++; continue; }

      const brand = (product.brand || "Unknown").trim();
      const brandSlug = slugify(brand) || "unknown";
      const brandRows = await sql`
        INSERT INTO brands (slug, name) VALUES (${brandSlug}, ${brand})
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
        RETURNING id
      `;
      const brandId = Number(brandRows[0].id);
      const model = product.model?.trim() || null;
      const slug = await uniqueSlug(sql, `${brand}-${model || product.title}`);
      const hasIdentifier = Boolean(product.asin || product.upc || product.ean);
      const qualityScore = Math.min(100, Math.round(
        (product.images?.length ? 20 : 0) + (model ? 20 : 0) + (hasIdentifier ? 30 : 0) +
        (product.brand ? 15 : 0) + (product.wattage || product.capacity_quart ? 10 : 0) +
        (product.features?.length ? 5 : 0)
      ));
      const indexable = qualityScore >= 70 && hasIdentifier && Boolean(model) && Boolean(product.brand);

      const rows = await sql`
        INSERT INTO products (
          slug, brand_id, model, title, capacity_quart, capacity_liters, wattage,
          dimensions, weight, status, lifecycle_state, match_method, match_score,
          human_verified, conflict_flag, quality_score, indexable
        ) VALUES (
          ${slug}, ${brandId}, ${model}, ${product.title.trim()}, ${product.capacity_quart ?? null},
          ${product.capacity_liters ?? null}, ${product.wattage ?? null},
          ${product.dimensions ? JSON.stringify(parseDimensions(product.dimensions)) : null}::jsonb,
          ${parseWeight(product.weight)}, 'active', 'draft', 'source', NULL, false, false,
          ${qualityScore}, ${indexable}
        ) RETURNING id
      `;
      const productId = Number(rows[0].id);

      for (const [i, url] of (product.images ?? []).slice(0, 8).entries()) {
        if (/^https?:\/\//i.test(url)) await sql`
          INSERT INTO product_images (product_id, image_url, source, licensed, sort_order)
          VALUES (${productId}, ${url}, 'apify', false, ${i})
        `;
      }
      for (const feature of (product.features ?? []).slice(0, 30)) {
        const value = feature.trim();
        if (value) await sql`
          INSERT INTO product_features (product_id, feature_key, feature_value, source, verified)
          VALUES (${productId}, 'feature', ${value}, 'apify', false)
        `;
      }
      const identifiers: Array<[string,string]> = [];
      if (product.asin) identifiers.push(["ASIN", product.asin.trim().toUpperCase()]);
      if (product.upc) identifiers.push(["UPC", product.upc.replace(/\D/g, "")]);
      if (product.ean) identifiers.push(["EAN", product.ean.replace(/\D/g, "")]);
      if (product.model) identifiers.push(["MPN", product.model.trim()]);
      for (const [type, value] of identifiers) if (value) await sql`
        INSERT INTO product_identifiers (product_id, identifier_type, identifier_value, source, verified)
        VALUES (${productId}, ${type}, ${value}, 'apify', false)
        ON CONFLICT (identifier_type, identifier_value) DO NOTHING
      `;
      stats.inserted++;
    } catch (error) {
      stats.failed++;
      console.error("Ingestion item failed", error instanceof Error ? error.message : error);
    }
  }

  await sql`
    UPDATE ingestion_jobs
    SET status = 'completed', finished_at = NOW(),
        metadata = COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({ runId, stats })}::jsonb
    WHERE id = (
      SELECT id FROM ingestion_jobs
      WHERE source = 'apify' AND status = 'running'
      ORDER BY started_at DESC LIMIT 1
    )
  `;

  console.log("Apify ingestion completed", stats);
  return NextResponse.json({ ok: true, runId, stats });
}
