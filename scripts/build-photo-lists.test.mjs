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
    'images/characters/IMG_10.webp',
    'images/characters/IMG_9.JPG',
    'images/characters/a photo.png',
    'images/birthdays/Mice.webp',
  ]);
  buildPhotoLists(root);
  assert.deepEqual(read(root, 'images/characters'), ['a photo.png', 'IMG_9.JPG', 'IMG_10.webp']);
  assert.deepEqual(read(root, 'images/birthdays'), ['Mice.webp']);
});

test('ignores files that are not photos', () => {
  const root = makeSite([
    'images/workshops/ateliers.webp',
    'images/workshops/.DS_Store',
    'images/workshops/notes.txt',
    'images/workshops/photos.json',
  ]);
  buildPhotoLists(root);
  assert.deepEqual(read(root, 'images/workshops'), ['ateliers.webp']);
});

test('writes an empty list for a page folder with no photos yet', () => {
  const root = makeSite(['images/shows/photos.json']);
  buildPhotoLists(root);
  assert.deepEqual(read(root, 'images/shows'), []);
});

test('does not write lists for loose files at the top of images/', () => {
  const root = makeSite(['images/mamanclown.webp', 'images/birthdays/Mice.webp']);
  buildPhotoLists(root);
  assert.equal(existsSync(join(root, 'images', 'photos.json')), false);
});
