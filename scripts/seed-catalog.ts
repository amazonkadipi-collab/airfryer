import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const sql = neon(databaseUrl);

const brands = [
  ["ninja","Ninja","https://www.ninjakitchen.com"],
  ["cosori","COSORI","https://cosori.com"],
  ["instant","Instant","https://instantpot.com"],
  ["philips","Philips","https://www.philips.com"],
  ["cuisinart","Cuisinart","https://www.cuisinart.com"],
  ["bella","bella","https://bellakitchenware.com"],
  ["chefman","Chefman","https://chefman.com"],
] as const;

const products = [
  ["ninja-af101-4-quart","ninja","AF101","Ninja AF101 4-Quart Air Fryer",4,"single basket",1],
  ["ninja-foodi-dualzone-8-quart","ninja",null,"Ninja Foodi DualZone 8-Quart Air Fryer",8,"dual basket",2],
  ["ninja-doublestack-xl-10-quart","ninja",null,"Ninja DoubleStack XL 10-Quart Air Fryer",10,"dual basket",2],
  ["cosori-turboblaze-6-quart","cosori",null,"COSORI TurboBlaze 6-Qt Air Fryer",6,"single basket",1],
  ["cosori-pro-le-5-quart-cp158-af","cosori","CP158-AF","COSORI Pro LE 5-Qt Air Fryer",5,"single basket",1],
  ["instant-vortex-plus-clearcook-6-quart","instant","140-3088-01","Instant Vortex Plus ClearCook 6-Quart Air Fryer",6,"single basket",1],
  ["instant-vortex-plus-dual-8-quart","instant",null,"Instant Vortex Plus Dual 8-Quart Air Fryer",8,"dual basket",2],
  ["philips-5000-na555-00-9-6-quart","philips","NA555/00","Philips 5000 Series Dual-Basket Airfryer with Steam 9.6-Qt",9.6,"dual basket",2],
  ["cuisinart-clearview-4-quart","cuisinart",null,"Cuisinart ClearView 4-Qt Glass Air Fryer",4,"glass basket",1],
  ["bella-pro-smartcrisp-8-quart","bella",null,"bella PRO SmartCrisp 8-Qt Touchscreen Air Fryer",8,"single basket",1],
  ["chefman-turbofry-6-quart","chefman",null,"Chefman TurboFry 6-Qt Air Fryer",6,"single basket",1],
] as const;

await sql`INSERT INTO categories (slug,name,description) VALUES ('air-fryers','Air Fryers','Air fryer products and structured specifications.') ON CONFLICT (slug) DO NOTHING`;

for (const [slug,name,website] of brands) {
  await sql`INSERT INTO brands (slug,name,website) VALUES (${slug},${name},${website}) ON CONFLICT (slug) DO NOTHING`;
}

for (const [slug,brand,model,title,quart,basketType,basketCount] of products) {
  await sql`
    INSERT INTO products
      (slug,brand_id,model,title,description,category_id,capacity_quart,capacity_liters,basket_type,basket_count,digital_controls,status,lifecycle_state,match_method,match_score,quality_score,indexable)
    VALUES
      (${slug},(SELECT id FROM brands WHERE slug=${brand}),${model},${title},
       ${title + " structured product record."},
       (SELECT id FROM categories WHERE slug='air-fryers'),
       ${quart},${Number(quart) * 0.946},${basketType},${basketCount},true,
       'active','published','curated-web',0.95,80,true)
    ON CONFLICT (slug) DO NOTHING
  `;
}

console.log(`Catalog seed complete: ${products.length} product models.`);
