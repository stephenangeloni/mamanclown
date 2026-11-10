import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stampAssetVersions } from './stamp-asset-versions.mjs';

function makeSite(files) {
  const root = mkdtempSync(join(tmpdir(), 'stamp-'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

const read = (root, path) => readFileSync(join(root, path), 'utf8');

// First 8 hex digits of the SHA-256 of "body{}" (from `printf 'body{}' | shasum -a 256`).
const BODY_HASH = '7c98040a';

test('adds a hash of the file contents to a page link to a stylesheet', () => {
  const root = makeSite({
    'styles.css': 'body{}',
    'FR/accueil.html': '<link rel="stylesheet" href="../styles.css">',
    'EN/home.html': '<link rel="stylesheet" href="../styles.css">',
  });
  stampAssetVersions(root);
  assert.equal(read(root, 'FR/accueil.html'), `<link rel="stylesheet" href="../styles.css?v=${BODY_HASH}">`);
  assert.equal(read(root, 'EN/home.html'), `<link rel="stylesheet" href="../styles.css?v=${BODY_HASH}">`);
});

test('gives a script a new version when its contents change', () => {
  const page = '<script src="../header.js"></script>';
  const root = makeSite({ 'header.js': 'run()', 'FR/accueil.html': page, 'EN/home.html': page });
  stampAssetVersions(root);
  assert.equal(read(root, 'FR/accueil.html'), '<script src="../header.js?v=02fcae88"></script>');

  writeFileSync(join(root, 'header.js'), 'run(2)');
  stampAssetVersions(root);
  assert.equal(read(root, 'FR/accueil.html'), '<script src="../header.js?v=980c2daf"></script>');
});

test('running twice does not stamp a link twice', () => {
  const page = '<link rel="stylesheet" href="../styles.css">';
  const root = makeSite({ 'styles.css': 'body{}', 'FR/accueil.html': page, 'EN/home.html': page });
  stampAssetVersions(root);
  stampAssetVersions(root);
  assert.equal(read(root, 'FR/accueil.html'), `<link rel="stylesheet" href="../styles.css?v=${BODY_HASH}">`);
});

test('leaves the font, favicon and outside URLs alone', () => {
  const page = [
    '<link rel="icon" type="image/svg+xml" href="../favicon.svg">',
    '<link rel="preload" href="../fonts/fredoka-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.1/dist/confetti.browser.min.js" defer></script>',
    '<img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-148,h-60,f-auto,q-80">',
    '<a href="/FR/contact.html">Contact</a>',
  ].join('\n');
  const root = makeSite({ 'FR/accueil.html': page, 'EN/home.html': page });
  stampAssetVersions(root);
  assert.equal(read(root, 'FR/accueil.html'), page);
});
