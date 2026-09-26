import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

const ACTOR = process.env.APIFY_ACTOR ?? "epctex~amazon-scraper";
const MAX_ITEMS = Math.min(Number(process.env.MAX_ITEMS ?? 10), 10);

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

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const token = process.env.APIFY_TOKEN;
  const databaseUrl = process.env.DATABASE_URL;
  if (!token) return NextResponse.json({ ok: false, error: "APIFY_TOKEN is missing" }, { status: 500 });
  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });

  const webhook = Buffer.from(JSON.stringify([{
    eventTypes: ["ACTOR.RUN.SUCCEEDED", "ACTOR.RUN.FAILED", "ACTOR.RUN.TIMED_OUT"],
    requestUrl: `${siteUrl()}/api/apify/webhook`,
    doNotRetry: false
  }])).toString("base64");

  const input = {
    categoryUrls: ["https://www.amazon.com/s?k=air+fryer"],
    maxItems: MAX_ITEMS,
    proxyConfiguration: { useApifyProxy: true }
  };

  const url = new URL(`https://api.apify.com/v2/actors/${ACTOR}/runs`);
  url.searchParams.set("maxItems", String(MAX_ITEMS));
  url.searchParams.set("waitForFinish", "0");
  url.searchParams.set("webhooks", webhook);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
    cache: "no-store"
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Apify start failed", response.status, body);
    return NextResponse.json({ ok: false, error: `Apify returned ${response.status}` }, { status: 502 });
  }

  const run = body?.data;
  const sql = neon(databaseUrl);
  await sql`
    INSERT INTO ingestion_jobs (source, status, started_at, metadata)
    VALUES ('apify', 'running', NOW(), ${JSON.stringify({
      runId: run?.id ?? null,
      actor: ACTOR,
      maxItems: MAX_ITEMS
    })}::jsonb)
  `;

  console.log("Apify ingestion started", run?.id);
  return NextResponse.json({ ok: true, runId: run?.id ?? null, status: run?.status ?? "RUNNING", maxItems: MAX_ITEMS });
}
