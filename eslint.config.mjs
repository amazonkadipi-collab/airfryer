import { defineConfig, globalIgnores } from "eslint/config";
import nextVitalsModule from "eslint-config-next/core-web-vitals.js";

const nextVitals = nextVitalsModule.default ?? nextVitalsModule;

export default defineConfig([
  ...(Array.isArray(nextVitals) ? nextVitals : [nextVitals]),
  globalIgnores([".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"]),
]);
