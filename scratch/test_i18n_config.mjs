import fs from 'fs';

const config = fs.readFileSync('astro.config.mjs', 'utf-8');
if (!config.includes("defaultLocale: 'id'") || !config.includes("locales: ['id', 'en']")) {
  console.error("FAIL: Astro i18n config not found");
  process.exit(1);
}
console.log("PASS: Astro i18n config is present");
