#!/usr/bin/env node
/**
 * Copy sahar-site/ into public/sahar/ so Netlify/Next serve it at /sahar/.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "sahar-site");
const dest = path.join(root, "public", "sahar");

if (!existsSync(src)) {
  console.error("sync-sahar-public: missing sahar-site/");
  process.exit(1);
}

mkdirSync(path.dirname(dest), { recursive: true });
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, {
  recursive: true,
  filter: (source) => !source.endsWith("netlify.toml"),
});

console.log(`sync-sahar-public: ${src} → ${dest}`);
