import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { amazonApiConfigured, getAmazonConfig } from "@/lib/amazon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AmazonItem = {
  asin?: string;
  detailPageURL?: string;
  offersV2?: {
    listings?: Array<{
      price?: {
        money?: {
          amount?: number;
          currency?: string;
        };
      };
      availability?: {
        type?: string;
        message?: string;
      };
    }>;
  };
};

async function getAccessToken(clientId: string, clientSecret: string) {
  const response = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Amazon token request failed: ${response.status}`);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("Amazon token response did not contain access_token");
  return data.access_token;
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!amazonApiConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "Amazon Creators API credentials are not configured yet. No prices were changed.",
    }, { status: 503 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured" }, { status: 503 });

  const { clientId, clientSecret, marketplace } = getAmazonConfig();
  const token = await getAccessToken(clientId, clientSecret);

  const rows = await db`
    SELECT pr.id, pr.external_product_id
    FROM product_retailers pr
    JOIN retailers r ON r.id = pr.retailer_id
    WHERE lower(r.domain) IN ('amazon.com', 'www.amazon.com')
      AND pr.external_product_id IS NOT NULL
      AND btrim(pr.external_product_id) <> ''
    ORDER BY pr.id
  ` as Array<{ id: number; external_product_id: string }>;

  let updated = 0;
  let unavailable = 0;
  let failed = 0;

  for (let offset = 0; offset < rows.length; offset += 10) {
    const batch = rows.slice(offset, offset + 10);
    const itemIds = [...new Set(batch.map((row) => row.external_product_id.trim()))];

    const response = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-marketplace": marketplace,
      },
      body: JSON.stringify({
        itemIds,
        itemIdType: "ASIN",
        marketplace,
        partnerTag: getAmazonConfig().storeId,
        resources: ["offersV2.listings.price", "offersV2.listings.availability"],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      failed += batch.length;
      continue;
    }

    const data = await response.json() as { itemsResult?: { items?: AmazonItem[] } };
    const items = data.itemsResult?.items ?? [];

    for (const row of batch) {
      const item = items.find((candidate) => candidate.asin === row.external_product_id.trim());
      const listing = item?.offersV2?.listings?.[0];
      const amount = listing?.price?.money?.amount;
      const currency = listing?.price?.money?.currency;

      if (typeof amount !== "number" || !currency) {
        unavailable++;
        continue;
      }

      const availability = listing?.availability?.type === "IN_STOCK"
        ? "in_stock"
        : listing?.availability?.type === "OUT_OF_STOCK"
          ? "out_of_stock"
          : "unknown";

      await db`
        UPDATE product_retailers
        SET price = ${amount},
            currency = ${currency},
            availability = ${availability},
            affiliate_url = COALESCE(
              affiliate_url,
              ${`https://${marketplace}/dp/${encodeURIComponent(row.external_product_id.trim())}?tag=${encodeURIComponent(getAmazonConfig().storeId)}`}
            ),
            last_checked_at = now()
        WHERE id = ${row.id}
      `;
      updated++;
    }
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    marketplace,
    checked: rows.length,
    updated,
    unavailable,
    failed,
  });
}
