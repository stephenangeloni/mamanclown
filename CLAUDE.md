# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Maman Clown is a static website for a children's entertainer in Monaco, serving French (primary) and English audiences. The site is deployed to GitHub Pages via automated CI/CD.

## Development

This is a pure static site with no build step:
- Open any HTML file directly in a browser for local development
- Use a local HTTP server for accurate path testing: `python -m http.server 8000`

**Deployment**: Push to `main` branch triggers automatic GitHub Pages deployment via `.github/workflows/static.yml`

## Architecture

### Multilingual Structure
```
/FR/              # French pages (primary)
/EN/              # English pages
/index.html       # Redirects to /FR/accueil.html
```

Pages use `data-page` and `data-lang` attributes on `<body>` for navigation state:
```html
<body data-page="birthdays" data-lang="fr">
```

### Shared Components

**header.js** - Multilingual navigation component
- `pageConfigs` object maps page IDs to titles and URLs for both languages
- Language detection: `data-lang` attribute > URL path > defaults to French
- Dynamically builds menu and language switcher from page configs
- To add a new page: add entry to `pageConfigs` object
- Also builds the footer (contact icons and service area) at the end of every page

**fonts/** - Fredoka, the heading font, served from the site (`@font-face` in `styles.css`, preloaded in each page's `<head>`)

**gallery.js / gallery.css** - Photo grid with a full-screen viewer
- Markup: `<section class="gallery"></section>`
- Reads `<folder>/photos.json`; an empty or missing list hides the section
- Photo folder is `images/<page-id>/`, from `<body data-page>`, so FR and EN versions of a page share it
- Thumbnails and full-size photos come from ImageKit (account ID: `6b4fz9a3u`), falling back to the local file

### Image Delivery

All images served via ImageKit CDN with responsive transformations:
- URL pattern: `https://ik.imagekit.io/6b4fz9a3u/[path]?tr=[transforms]`
- Common transforms: `w-[width],h-[height],f-auto,q-80`
- Local images stored in `images/` mirror ImageKit structure

## Current Pages

Page IDs used in `header.js` pageConfigs:
- `home` → FR: accueil.html, EN: home.html
- `birthdays` → FR: anniversaire.html, EN: birthday-party.html
- `shows` → FR: spectacles.html, EN: shows.html
- `characters` → FR: personnages.html, EN: characters.html
- `workshops` → FR: ateliers.html, EN: workshops.html
- `contact` → FR: contact.html, EN: contact.html

## Adding New Pages

1. Create both `/FR/[page].html` and `/EN/[page].html`
2. Add page entry to `pageConfigs` in `header.js`
3. Set `data-page="[page-id]"` and `data-lang="[fr|en]"` on body
4. Include shared assets: `../header.css`, `../header.js`
5. For photos: add `../gallery.css`, `../gallery.js` and a `<section class="gallery">`; photos go in `images/<page-id>/`

### Adding Photos

1. Drop the photo files into `images/<page-id>/` (`birthdays`, `characters`, `workshops`, `shows`; webp, jpg, png, avif or gif).
2. Run `npm run photos` to rewrite that folder's `photos.json` (the deploy also runs it).
3. Commit and push to `main`.

Tests: `npm test`.
