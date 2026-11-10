#!/usr/bin/env node
// Writes images/<page>/photos.json, listing every photo in that folder.
// The gallery on each page reads this list, so adding a photo means dropping
// the file in the folder and running this script (the deploy runs it too).
//
// Usage: node scripts/build-photo-lists.mjs

import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PHOTO = /\.(webp|jpe?g|png|avif|gif)$/i;
const naturalOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare;

const subfolders = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => join(dir, e.name));

export function buildPhotoLists(root) {
  for (const pageDir of subfolders(join(root, 'images'))) {
    const photos = readdirSync(pageDir)
      .filter((name) => PHOTO.test(name) && !name.startsWith('.'))
      .sort(naturalOrder);
    writeFileSync(join(pageDir, 'photos.json'), JSON.stringify(photos, null, 2) + '\n');
    console.log(`${pageDir}: ${photos.length} photos`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildPhotoLists(join(dirname(fileURLToPath(import.meta.url)), '..'));
}
