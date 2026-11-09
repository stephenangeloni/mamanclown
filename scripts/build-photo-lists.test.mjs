import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildPhotoLists } from './build-photo-lists.mjs';

function makeSite(files) {
  const root = mkdtempSync(join(tmpdir(), 'photos-'));
  for (const f of files) {
    mkdirSync(join(root, f, '..'), { recursive: true });
    writeFileSync(join(root, f), '');
  }
  return root;
}

const read = (root, dir) => JSON.parse(readFileSync(join(root, dir, 'photos.json'), 'utf8'));

test('lists the photos in each page folder, in natural order', () => {
  const root = makeSite([
    'images/FR/personnages/IMG_10.webp',
    'images/FR/personnages/IMG_9.JPG',
    'images/FR/personnages/a photo.png',
    'images/FR/anniversaire/Mice.webp',
  ]);
  buildPhotoLists(root);
  assert.deepEqual(read(root, 'images/FR/personnages'), ['a photo.png', 'IMG_9.JPG', 'IMG_10.webp']);
  assert.deepEqual(read(root, 'images/FR/anniversaire'), ['Mice.webp']);
});

test('ignores files that are not photos', () => {
  const root = makeSite([
    'images/FR/ateliers/ateliers.webp',
    'images/FR/ateliers/.DS_Store',
    'images/FR/ateliers/notes.txt',
    'images/FR/ateliers/photos.json',
  ]);
  buildPhotoLists(root);
  assert.deepEqual(read(root, 'images/FR/ateliers'), ['ateliers.webp']);
});

test('writes an empty list for a page folder with no photos yet', () => {
  const root = makeSite(['images/FR/spectacles/photos.json']);
  buildPhotoLists(root);
  assert.deepEqual(read(root, 'images/FR/spectacles'), []);
});

test('does not write lists for loose files at the top of images/', () => {
  const root = makeSite(['images/mamanclown.webp', 'images/FR/anniversaire/Mice.webp']);
  buildPhotoLists(root);
  assert.equal(existsSync(join(root, 'images', 'photos.json')), false);
  assert.equal(existsSync(join(root, 'images', 'FR', 'photos.json')), false);
});
