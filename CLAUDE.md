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

**carousel.js** - Image carousel with ImageKit CDN
- Images discovered from `<script type="application/json" id="carousel-images">` manifest
- Path convention: `images/[LANG]/[page-name]/[filename]`
- ImageKit account ID: `6b4fz9a3u`
- Automatic fallback to local paths if ImageKit fails

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
5. For carousel: add `../carousel.css`, `../carousel.js`, and image manifest

### Carousel Image Manifest

Pages with carousels require a JSON manifest listing image filenames:
```html
<script type="application/json" id="carousel-images">
["image1.webp", "image2.webp", "image3.webp"]
</script>
```

The carousel.js auto-discovers images from `images/[LANG]/[page-name]/` based on URL path.
