# Air Fryer Product Intelligence

English-first, data-driven air fryer discovery and comparison platform.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL, Vercel.

## Principles
- Real structured product data over AI-generated filler
- Product identity resolution across UPC/EAN/GTIN/ASIN/MPN
- Quality-gated programmatic SEO
- Multi-retailer affiliate abstraction
- Data licensing and freshness controls

## Local development
npm install
npm run dev

Set NEXT_PUBLIC_SITE_URL for production canonical URLs. Supabase credentials will be added server-side when the database layer is connected.