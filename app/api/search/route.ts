import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return Response.json({ results: [], level: "none", query: q ?? "" });

  const db = getDb();
  if (!db) return Response.json({ results: [], level: "unavailable", query: q }, { status: 503 });

  try {
    const byIdentifier = await db`
      SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name,
             pi.identifier_type AS matched_type, pi.identifier_value AS matched_value
      FROM product_identifiers pi
      JOIN products p ON p.id = pi.product_id
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE lower(pi.identifier_value) = lower(${q})
        AND p.status = 'active'
      LIMIT 5
    `;
    if (byIdentifier.length) return Response.json({ results: byIdentifier, level: "identifier", query: q });

    const byModel = await db`
      SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE lower(coalesce(p.model, '')) = lower(${q})
        AND p.status = 'active'
      LIMIT 10
    `;
    if (byModel.length) return Response.json({ results: byModel, level: "model", query: q });

    const byTrigram = await db`
      SELECT p.id, p.slug, p.title, p.model, b.name AS brand_name,
             similarity(p.title, ${q}) AS score
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.status = 'active'
        AND (
          p.title % ${q}
          OR similarity(coalesce(p.model, ''), ${q}) > 0.25
          OR similarity(coalesce(b.name, ''), ${q}) > 0.25
        )
      ORDER BY score DESC, p.quality_score DESC NULLS LAST, p.title ASC
      LIMIT 20
    `;
    return Response.json({ results: byTrigram, level: "trigram", query: q });
  } catch (error) {
    console.error("search failed", error);
    return Response.json({ results: [], level: "error", query: q }, { status: 500 });
  }
}
