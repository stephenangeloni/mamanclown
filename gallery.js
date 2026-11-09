/**
 * Photo gallery: a grid of thumbnails that open in a full-screen viewer.
 *
 * Markup:  <section class="gallery" data-folder="images/FR/personnages"></section>
 * Photos:  the folder's photos.json, written by scripts/build-photo-lists.mjs.
 * Images come from ImageKit; if ImageKit fails, the local file is used instead.
 */
(function () {
  'use strict';

  const IMAGEKIT = 'https://ik.imagekit.io/6b4fz9a3u/';
  const FIRST_BATCH = 9;

  const TEXT = {
    fr: {
      open: (n, total) => `Agrandir la photo ${n} sur ${total}`,
      alt: (n, total) => `Maman Clown, photo ${n} sur ${total}`,
      more: (total) => `Voir les ${total} photos`,
      close: 'Fermer',
      prev: 'Photo précédente',
      next: 'Photo suivante',
      viewer: 'Visionneuse de photos',
      failed: 'Cette photo ne peut pas être affichée.',
    },
    en: {
      open: (n, total) => `Enlarge photo ${n} of ${total}`,
      alt: (n, total) => `Maman Clown, photo ${n} of ${total}`,
      more: (total) => `See all ${total} photos`,
      close: 'Close',
      prev: 'Previous photo',
      next: 'Next photo',
      viewer: 'Photo viewer',
      failed: 'This photo cannot be displayed.',
    },
  };
  const lang = document.body.dataset.lang === 'en' ? 'en' : 'fr';
  const t = TEXT[lang];

  // "images/FR/x/a b.webp" -> ImageKit path "FR/x/a%20b.webp" (ImageKit root is images/).
  const imagekitUrl = (path, transforms) =>
    `${IMAGEKIT}${path.replace(/^images\//, '')}?tr=${transforms},f-auto`;
  const localUrl = (path) => `/${path}`;

  function photoPaths(folder, names) {
    return names.map((name) => `${folder}/${encodeURIComponent(name)}`);
  }

  // Swap to the local copy if ImageKit fails; call onFail if that fails too.
  function withFallback(img, path, onFail) {
    img.onerror = () => {
      if (img.src.startsWith(IMAGEKIT)) {
        img.removeAttribute('srcset');
        img.src = localUrl(path);
      } else if (onFail) {
        onFail();
      }
    };
  }

  function setThumb(img, path) {
    img.src = imagekitUrl(path, 'w-480,h-480,fo-auto,q-75');
    img.srcset = `${imagekitUrl(path, 'w-240,h-240,fo-auto,q-75')} 240w, ${img.src} 480w`;
    img.sizes = '(max-width: 640px) 45vw, 240px';
  }

  function setFull(img, path) {
    img.src = imagekitUrl(path, 'w-1600,q-85');
    img.srcset = [800, 1600, 2400]
      .map((w) => `${imagekitUrl(path, `w-${w},q-85`)} ${w}w`)
      .join(', ');
    img.sizes = '100vw';
  }

  /* ---------------------------------------------------------------------
     Full-screen viewer (one per page, shared by all galleries)
     --------------------------------------------------------------------- */

  let viewer = null;

  function buildViewer() {
    const dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', t.viewer);
    dialog.innerHTML = `
      <figure class="lightbox-figure">
        <img class="lightbox-img" alt="">
        <figcaption class="lightbox-counter" aria-live="polite"></figcaption>
        <p class="lightbox-error" hidden>${t.failed}</p>
      </figure>
      <button type="button" class="lightbox-btn lightbox-close" aria-label="${t.close}">✕</button>
      <button type="button" class="lightbox-btn lightbox-prev" aria-label="${t.prev}">‹</button>
      <button type="button" class="lightbox-btn lightbox-next" aria-label="${t.next}">›</button>`;
    document.body.appendChild(dialog);

    const img = dialog.querySelector('.lightbox-img');
    const counter = dialog.querySelector('.lightbox-counter');
    const error = dialog.querySelector('.lightbox-error');
    const prevBtn = dialog.querySelector('.lightbox-prev');
    const nextBtn = dialog.querySelector('.lightbox-next');
    const state = { paths: [], index: 0, opener: null };

    function show(index) {
      const total = state.paths.length;
      state.index = (index + total) % total;
      const path = state.paths[state.index];
      error.hidden = true;
      img.hidden = false;
      img.alt = t.alt(state.index + 1, total);
      withFallback(img, path, () => {
        img.hidden = true;
        error.hidden = false;
      });
      setFull(img, path);
      counter.textContent = `${state.index + 1} / ${total}`;
      // Warm the cache for the neighbours so next/previous feels instant.
      [state.index - 1, state.index + 1].forEach((i) => {
        const p = state.paths[(i + total) % total];
        new Image().src = imagekitUrl(p, 'w-1600,q-85');
      });
    }

    function open(paths, index, opener) {
      state.paths = paths;
      state.opener = opener;
      const single = paths.length < 2;
      prevBtn.hidden = single;
      nextBtn.hidden = single;
      show(index);
      dialog.showModal();
    }

    prevBtn.addEventListener('click', () => show(state.index - 1));
    nextBtn.addEventListener('click', () => show(state.index + 1));
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());

    // Click on the dark backdrop (not the photo or buttons) closes.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.classList.contains('lightbox-figure')) dialog.close();
    });

    dialog.addEventListener('keydown', (e) => {
      if (state.paths.length < 2) return;
      if (e.key === 'ArrowLeft') show(state.index - 1);
      if (e.key === 'ArrowRight') show(state.index + 1);
    });

    // Swipe left/right on touch screens.
    let startX = null;
    dialog.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      if (startX === null || state.paths.length < 2) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(state.index + (dx < 0 ? 1 : -1));
    });

    dialog.addEventListener('close', () => {
      img.removeAttribute('src');
      img.removeAttribute('srcset');
      if (state.opener) state.opener.focus();
    });

    return { open };
  }

  /* ---------------------------------------------------------------------
     Thumbnail grid
     --------------------------------------------------------------------- */

  function renderGrid(section, paths) {
    const total = paths.length;
    const grid = document.createElement('div');
    grid.className = 'gallery-grid' + (total === 1 ? ' gallery-grid--single' : '');

    paths.forEach((path, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-item';
      button.setAttribute('aria-label', t.open(i + 1, total));
      if (i >= FIRST_BATCH) button.hidden = true;

      const img = document.createElement('img');
      img.alt = '';
      img.loading = i < 3 ? 'eager' : 'lazy';
      img.decoding = 'async';
      withFallback(img, path, () => button.remove());
      setThumb(img, path);

      button.appendChild(img);
      button.addEventListener('click', () => {
        viewer = viewer || buildViewer();
        viewer.open(paths, i, button);
      });
      grid.appendChild(button);
    });

    section.appendChild(grid);

    if (total > FIRST_BATCH) {
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'gallery-more';
      more.textContent = t.more(total);
      more.addEventListener('click', () => {
        const firstHidden = grid.querySelector('.gallery-item[hidden]');
        grid.querySelectorAll('.gallery-item[hidden]').forEach((b) => { b.hidden = false; });
        more.remove();
        if (firstHidden) firstHidden.focus();
      });
      section.appendChild(more);
    }
  }

  async function initGallery(section) {
    const folder = section.dataset.folder.replace(/\/$/, '');
    try {
      const response = await fetch(`/${folder}/photos.json`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const names = await response.json();
      if (!Array.isArray(names) || names.length === 0) {
        section.hidden = true;
        return;
      }
      renderGrid(section, photoPaths(folder, names));
    } catch (err) {
      console.warn(`Gallery: could not load ${folder}/photos.json`, err);
      section.hidden = true;
    }
  }

  document.querySelectorAll('.gallery[data-folder]').forEach(initGallery);
})();
