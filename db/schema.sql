CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS brands (
  id BIGSERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
  website TEXT, logo_url TEXT, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY, parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT
);
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
  model TEXT, title TEXT NOT NULL, description TEXT, category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  capacity_quart NUMERIC, capacity_liters NUMERIC, wattage INTEGER, basket_type TEXT, basket_count INTEGER,
  dishwasher_safe BOOLEAN, rotisserie BOOLEAN, digital_controls BOOLEAN, temperature_min INTEGER, temperature_max INTEGER,
  dimensions JSONB, weight NUMERIC, release_date DATE, status TEXT NOT NULL DEFAULT 'active',
  lifecycle_state TEXT NOT NULL DEFAULT 'draft', match_method TEXT, match_score NUMERIC,
  human_verified BOOLEAN NOT NULL DEFAULT false, verified_by TEXT, verified_at TIMESTAMPTZ,
  conflict_flag BOOLEAN NOT NULL DEFAULT false, conflict_fields JSONB,
  quality_score INTEGER, indexable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_identifiers (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  identifier_type TEXT NOT NULL, identifier_value TEXT NOT NULL, country TEXT, source TEXT,
  verified BOOLEAN NOT NULL DEFAULT false, source_timestamp TIMESTAMPTZ, verified_at TIMESTAMPTZ,
  UNIQUE(identifier_type, identifier_value)
);
CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, source TEXT, licensed BOOLEAN NOT NULL DEFAULT false, sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS product_features (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL, feature_value TEXT, source TEXT, verified BOOLEAN NOT NULL DEFAULT false,
  source_timestamp TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS data_sources (
  id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, type TEXT, api_endpoint TEXT, terms_url TEXT,
  rate_limit TEXT, commercial_use BOOLEAN, last_sync_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS data_licenses (
  id BIGSERIAL PRIMARY KEY, source_id BIGINT NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  license_type TEXT, redistribution_allowed BOOLEAN, caching_allowed BOOLEAN, image_reuse_allowed BOOLEAN,
  attribution_required BOOLEAN, attribution_text TEXT, expires_at TIMESTAMPTZ, verified_by TEXT, verified_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS retailers (
  id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, domain TEXT NOT NULL UNIQUE, country TEXT,
  affiliate_program TEXT, affiliate_status TEXT NOT NULL DEFAULT 'inactive'
);
CREATE TABLE IF NOT EXISTS product_retailers (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer_id BIGINT NOT NULL REFERENCES retailers(id) ON DELETE CASCADE, external_product_id TEXT,
  url TEXT, affiliate_url TEXT, price NUMERIC, currency TEXT, availability TEXT, last_checked_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  retailer_id BIGINT REFERENCES retailers(id) ON DELETE SET NULL, page_path TEXT,
  country TEXT, device TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS comparisons (
  id BIGSERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, product_a_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_b_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, status TEXT NOT NULL DEFAULT 'draft',
  search_demand NUMERIC, quality_score INTEGER, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK(product_a_id <> product_b_id)
);
CREATE TABLE IF NOT EXISTS use_cases (
  id BIGSERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT
);
CREATE TABLE IF NOT EXISTS product_use_cases (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, use_case_id BIGINT NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  match_score NUMERIC, evidence TEXT, PRIMARY KEY(product_id, use_case_id)
);
CREATE TABLE IF NOT EXISTS keywords (
  id BIGSERIAL PRIMARY KEY, keyword TEXT NOT NULL, normalized_keyword TEXT NOT NULL UNIQUE, intent TEXT,
  volume INTEGER, country TEXT, language TEXT NOT NULL DEFAULT 'en', source TEXT, last_updated_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS keyword_pages (
  keyword_id BIGINT NOT NULL REFERENCES keywords(id) ON DELETE CASCADE, page_type TEXT NOT NULL, page_id BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', PRIMARY KEY(keyword_id, page_type, page_id)
);
CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id BIGSERIAL PRIMARY KEY, source_id BIGINT REFERENCES data_sources(id) ON DELETE SET NULL, job_type TEXT, status TEXT,
  started_at TIMESTAMPTZ, finished_at TIMESTAMPTZ, records_seen INTEGER DEFAULT 0, records_written INTEGER DEFAULT 0, error_log TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_model ON products(model);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON products USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_identifiers_value ON product_identifiers(identifier_value);
CREATE INDEX IF NOT EXISTS idx_retailers_product ON product_retailers(product_id);
CREATE INDEX IF NOT EXISTS idx_keywords_normalized ON keywords(normalized_keyword);
CREATE INDEX IF NOT EXISTS idx_comparisons_a ON comparisons(product_a_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_b ON comparisons(product_b_id);
