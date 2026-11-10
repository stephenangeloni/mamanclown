#!/usr/bin/env node
// Adds ?v=<hash of the file's contents> to each page's links to the site's own
// .css and .js files, so browsers fetch a fresh copy whenever one changes
// instead of pairing new pages with an old cached stylesheet or script.
// The deploy runs this on the copy it uploads; the files in the repo stay plain.
//
// Usage: node scripts/stamp-asset-versions.mjs <site folder>

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const PAGE_FOLDERS = ['FR', 'EN'];
// href="../styles.css" or src="../header.js", with or without an earlier ?v=
const ASSET_LINK = /((?:href|src)=")\.\.\/([\w-]+\.(?:css|js))(?:\?v=\w+)?"/g;

const shortHash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 8);

export function stampAssetVersions(root) {
  for (const folder of PAGE_FOLDERS) {
    for (const name of readdirSync(join(root, folder)).filter((n) => n.endsWith('.html'))) {
      const page = join(root, folder, name);
      const html = readFileSync(page, 'utf8').replace(
        ASSET_LINK,
        (_, attr, asset) => `${attr}../${asset}?v=${shortHash(join(root, asset))}"`,
      );
      writeFileSync(page, html);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.argv[2];
  if (!root) {
    console.error('Usage: node scripts/stamp-asset-versions.mjs <site folder>');
    process.exit(1);
  }
  stampAssetVersions(root);
}
