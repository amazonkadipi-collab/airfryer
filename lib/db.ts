import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export function getDb() {
  if (!databaseUrl) return null;
  return neon(databaseUrl);
}
