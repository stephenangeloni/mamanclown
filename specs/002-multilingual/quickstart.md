# Developer Quickstart: Multilingual Website

**Feature**: 002-multilingual  
**Date**: November 16, 2025  
**Audience**: Developers implementing or maintaining the multilingual website

This guide provides step-by-step instructions for working with the multilingual website structure.

---

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Adding a New Page](#adding-a-new-page)
4. [Updating Existing Page Translations](#updating-existing-page-translations)
5. [Testing Locally](#testing-locally)
6. [Validating SEO & Metadata](#validating-seo--metadata)
7. [Deployment Checklist](#deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Maman Clown website supports two languages:
- **French (`/FR/`)**: Default language, primary audience (Monaco/Monte-Carlo)
- **English (`/EN/`)**: Secondary language, expatriates and tourists

**Key Principles**:
- Each page exists in both languages with translated content
- Shared assets (CSS, JS, images) remain at root level
- Legacy root URLs redirect to French versions
- Navigation menu is language-aware

---

## Directory Structure

```text
/
├── EN/                          # English pages
│   ├── home.html
│   ├── birthday-party.html
│   ├── contact.html
│   ├── shows.html
│   ├── characters.html
│   └── workshops.html
├── FR/                          # French pages
│   ├── accueil.html
│   ├── anniversaire.html
│   ├── contact.html
│   ├── spectacles.html
│   ├── personnages.html
│   └── ateliers.html
├── header.css                   # Shared styles
├── header.js                    # Language-aware navigation
├── favicon.svg                  # Shared favicon
├── index.html                   # Redirect to /FR/accueil.html
├── birthdays.html               # Redirect to /FR/anniversaire.html
├── contact.html                 # Redirect to /FR/contact.html
├── shows.html                   # Redirect to /FR/spectacles.html
└── characters.html              # Redirect to /FR/personnages.html
```

---

## Adding a New Page

Follow these steps to add a new page in both languages.

### Step 1: Update Navigation Configuration

Edit `header.js` and add your page to the `pageConfigs` object:

```javascript
const pageConfigs = {
  // ... existing pages ...
  gallery: {  // New page ID
    titles: { fr: 'Galerie', en: 'Gallery' },
    urls: { fr: '/FR/galerie.html', en: '/EN/gallery.html' }
  }
};
```

### Step 2: Create French Page

Create `/FR/galerie.html` using this template:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="[150-160 chars with Monaco/Monte-Carlo keywords in French]">
    <title>Maman Clown - Galerie</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mamanclown.com/FR/galerie.html">
    <meta property="og:title" content="Maman Clown - Galerie Monaco">
    <meta property="og:description" content="[French description]">
    <meta property="og:image" content="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-1200,h-630,f-auto,q-80">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://mamanclown.com/FR/galerie.html">
    <meta property="twitter:title" content="Maman Clown - Galerie Monaco">
    <meta property="twitter:description" content="[French description]">
    <meta property="twitter:image" content="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-1200,h-630,f-auto,q-80">
    
    <!-- Hreflang Tags -->
    <link rel="alternate" hreflang="fr" href="https://mamanclown.com/FR/galerie.html" />
    <link rel="alternate" hreflang="en" href="https://mamanclown.com/EN/gallery.html" />
    <link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/galerie.html" />
    
    <!-- Favicon & Assets -->
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../header.css">
</head>

<body data-page="gallery" data-lang="fr">
    <!-- Header -->
    <header id="site-header">
        <img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-148,h-60,f-auto,q-80" 
             alt="Maman Clown" 
             class="header-logo"
             width="148"
             height="60">
        <h1 class="page-title">Galerie</h1>
        <button class="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="menu">☰</button>
    </header>

    <!-- Menu Overlay -->
    <div id="menu-overlay"></div>
    
    <!-- Navigation Menu -->
    <nav id="menu" aria-hidden="true"></nav>

    <!-- Main Content -->
    <main>
        <!-- Your French content here -->
    </main>

    <!-- Scripts -->
    <script src="../header.js"></script>
</body>
</html>
```

### Step 3: Create English Page

Create `/EN/gallery.html` with identical structure but English content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Same structure as French, but English content -->
    <meta name="description" content="[150-160 chars with Monaco/Monte-Carlo keywords in English]">
    <title>Maman Clown - Gallery</title>
    
    <!-- Update og:url, twitter:url to /EN/gallery.html -->
    <!-- Keep hreflang tags IDENTICAL to French version -->
</head>

<body data-page="gallery" data-lang="en">
    <header id="site-header">
        <img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-148,h-60,f-auto,q-80" 
             alt="Maman Clown" 
             class="header-logo"
             width="148"
             height="60">
        <h1 class="page-title">Gallery</h1>
        <button class="hamburger" aria-label="Menu">☰</button>
    </header>

    <!-- Same structure as French page -->
</body>
</html>
```

### Step 4: Create Redirect Page (Optional)

If you want to support a legacy root-level URL (e.g., `/gallery.html`), create a redirect page:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex">
    <link rel="canonical" href="https://mamanclown.com/FR/galerie.html">
    <title>Redirection - Maman Clown</title>
    <script>
        window.location.replace('/FR/galerie.html');
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=/FR/galerie.html">
    </noscript>
</head>
<body>
    <p>Cette page a été déplacée vers <a href="/FR/galerie.html">notre nouvelle page</a>.</p>
</body>
</html>
```

### Step 5: Test

1. Open `/FR/galerie.html` in browser
2. Verify navigation menu includes "Galerie" in correct language
3. Open `/EN/gallery.html` and verify menu shows "Gallery"
4. Test redirect page if created

---

## Updating Existing Page Translations

### Updating Text Content

1. **Locate the page**: e.g., `/FR/anniversaire.html` or `/EN/birthday-party.html`
2. **Edit visible text**: Update paragraphs, headings, buttons
3. **Update meta tags**: If content changed significantly, update meta description
4. **Update Open Graph**: Update `og:description` and `twitter:description` if needed
5. **Verify language**: Ensure no mixed-language content

### Updating Images

1. **Update alt text**: Translate image alt attributes to match page language
   ```html
   <!-- French -->
   <img src="..." alt="Spectacle d'anniversaire magique">
   
   <!-- English -->
   <img src="..." alt="Magical birthday show">
   ```

2. **ImageKit CDN URLs**: No changes needed (absolute URLs work from any path)

### Updating Metadata

See [research.md RT-005](research.md#rt-005-meta-tag-translation-patterns) for meta tag templates.

**Checklist**:
- [ ] Meta description 150-160 characters
- [ ] Includes Monaco/Monte-Carlo keywords
- [ ] Open Graph title and description updated
- [ ] Twitter Card title and description updated
- [ ] hreflang tags still correct (bidirectional)
- [ ] Canonical URL points to self

---

## Testing Locally

### Prerequisites

- A local web server (VS Code Live Server, Python `http.server`, or similar)
- Modern browser (Chrome, Firefox, or Safari)

### Local Testing Steps

1. **Start local server**:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

2. **Test French pages**:
   - Navigate to `http://localhost:8000/FR/accueil.html`
   - Verify all text in French
   - Check navigation menu displays French page names
   - Click menu links - should navigate within `/FR/` directory

3. **Test English pages**:
   - Navigate to `http://localhost:8000/EN/home.html`
   - Verify all text in English
   - Check navigation menu displays English page names
   - Click menu links - should navigate within `/EN/` directory

4. **Test redirects**:
   - Navigate to `http://localhost:8000/index.html`
   - Should immediately redirect to `/FR/accueil.html`
   - Test all legacy URLs (`birthdays.html`, `contact.html`, etc.)

5. **Test resource loading**:
   - Open browser DevTools → Network tab
   - Verify `header.css` loads without 404 errors
   - Verify `header.js` loads without errors
   - Verify favicon displays in browser tab
   - Check Console for JavaScript errors

### Browser Testing Matrix

Test on these browsers per Constitution Review Gates:

- [ ] Safari iOS 15+ (iPhone)
- [ ] Chrome Android (latest)
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop

### Accessibility Testing

1. **Keyboard navigation**:
   - Tab through navigation menu
   - Press Escape to close menu
   - Verify focus trap works in menu

2. **Screen reader** (VoiceOver on macOS/iOS, NVDA on Windows):
   - Open French page, verify screen reader announces French
   - Open English page, verify screen reader announces English
   - Navigate through menu, verify link labels announced

---

## Validating SEO & Metadata

### hreflang Validation

1. **Manual check**: View page source, verify hreflang tags present:
   ```html
   <link rel="alternate" hreflang="fr" href="https://mamanclown.com/FR/page.html" />
   <link rel="alternate" hreflang="en" href="https://mamanclown.com/EN/page.html" />
   <link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/page.html" />
   ```

2. **Bidirectionality**: Ensure French and English versions have IDENTICAL hreflang tags

3. **Absolute URLs**: Verify all hreflang URLs are absolute (start with `https://`)

### Meta Description Validation

1. **Length check**: 150-160 characters
   ```bash
   # Count characters (macOS/Linux)
   echo "Your meta description here" | wc -c
   ```

2. **Keyword check**: Verify Monaco/Monte-Carlo keywords present

3. **Language check**: French meta on French pages, English on English

### Open Graph Validation

Use Facebook's Sharing Debugger:
- URL: https://developers.facebook.com/tools/debug/
- Enter your page URL (e.g., `https://mamanclown.com/FR/accueil.html`)
- Click "Scrape Again" to refresh cache
- Verify image displays correctly (1200×630px)
- Verify title and description in correct language

### Twitter Card Validation

Use Twitter Card Validator:
- URL: https://cards-dev.twitter.com/validator
- Enter your page URL
- Verify card displays correctly
- Verify title and description in correct language

### Google Search Console

After deployment:
1. Submit sitemap.xml with new language-specific URLs
2. Navigate to **International Targeting** → **Language** tab
3. Verify hreflang tags detected correctly
4. Monitor for errors over 2-3 weeks

---

## Deployment Checklist

Before deploying to production:

### Pre-Deployment

- [ ] All pages tested locally in both languages
- [ ] Navigation works within each language (no cross-language links)
- [ ] Redirects tested for all legacy URLs
- [ ] Meta descriptions 150-160 characters
- [ ] hreflang tags present and bidirectional
- [ ] All images have alt text in correct language
- [ ] No console errors in browser DevTools
- [ ] No 404 errors in Network tab
- [ ] HTML validates (use https://validator.w3.org/)

### Post-Deployment

- [ ] Test live URLs for both languages
- [ ] Verify redirects work on production
- [ ] Test social sharing (Facebook, Twitter)
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor International Targeting report for hreflang errors
- [ ] Test on mobile devices (Safari iOS, Chrome Android)
- [ ] Test page load speed (<2 seconds on 3G per Constitution)

### Constitution Review Gates

Per Constitution section "Review Gates", verify:

- [ ] All links work (phone, email, social, vCard)
- [ ] All images load correctly via ImageKit CDN
- [ ] Page loads in under 2 seconds on 3G
- [ ] Interactions work on mobile (tap, scroll)
- [ ] Visual consistency maintained
- [ ] No console errors
- [ ] HTML validates
- [ ] Meta description present and accurate (150-160 chars)
- [ ] Open Graph and Twitter Card tags present
- [ ] ImageKit transformations working (WebP, srcset, quality)

---

## Troubleshooting

### Problem: Navigation menu shows wrong language

**Symptoms**: English menu items appear on French page (or vice versa)

**Solution**:
1. Check `data-lang` attribute on `<body>` tag:
   ```html
   <body data-page="home" data-lang="fr">
   ```
2. Verify `<html lang="fr">` attribute matches
3. Clear browser cache and refresh

---

### Problem: CSS/JS not loading (404 errors)

**Symptoms**: Page displays unstyled, DevTools shows 404 for `header.css` or `header.js`

**Solution**:
1. Check relative paths from language subdirectory:
   ```html
   <link rel="stylesheet" href="../header.css">
   <script src="../header.js"></script>
   ```
2. Verify files exist at repository root
3. Check for typos in `href` or `src` attributes

---

### Problem: Redirect loops or doesn't redirect

**Symptoms**: Browser shows "Too many redirects" error or legacy page displays instead of redirecting

**Solution**:
1. Verify redirect page uses `window.location.replace()` (not `window.location.href`)
2. Check target URL is correct:
   ```javascript
   window.location.replace('/FR/accueil.html');
   ```
3. Ensure meta refresh URL matches JavaScript target:
   ```html
   <meta http-equiv="refresh" content="0; url=/FR/accueil.html">
   ```
4. Clear browser cache

---

### Problem: hreflang errors in Search Console

**Symptoms**: Google Search Console reports hreflang errors

**Common Causes**:
1. **Non-bidirectional links**: French page links to English, but English doesn't link back
2. **Broken URLs**: hreflang points to 404 page
3. **Relative URLs**: hreflang uses relative paths instead of absolute
4. **Missing x-default**: No fallback language specified

**Solution**:
- Ensure IDENTICAL hreflang tags on both language versions
- Use absolute URLs: `https://mamanclown.com/FR/page.html`
- Include x-default pointing to French:
  ```html
  <link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/page.html" />
  ```

---

### Problem: Search engines indexing redirect pages

**Symptoms**: Google shows `/index.html` instead of `/FR/accueil.html` in results

**Solution**:
1. Add `noindex` meta tag to redirect pages:
   ```html
   <meta name="robots" content="noindex">
   ```
2. Add canonical tag pointing to target:
   ```html
   <link rel="canonical" href="https://mamanclown.com/FR/accueil.html">
   ```
3. Submit updated sitemap excluding redirect pages
4. Wait 2-3 weeks for reindexing

---

### Problem: Mixed language content

**Symptoms**: French page contains English words (or vice versa)

**Solution**:
1. Review translation checklist in [research.md RT-006](research.md#rt-006-content-translation-scope)
2. Common missed items:
   - Button labels
   - Image alt text
   - Meta descriptions
   - Email subject lines in mailto: links
   - Page title in header (`<h1>`)
3. Use browser Find feature to search for opposite language keywords

---

## Additional Resources

- [Specification (spec.md)](spec.md) - Feature requirements
- [Research (research.md)](research.md) - Technical decisions and rationale
- [Data Model (data-model.md)](data-model.md) - Logical structure
- [Constitution (.specify/memory/constitution.md)](../.specify/memory/constitution.md) - Project principles

---

## Quick Reference

### File Structure Cheat Sheet

```text
Add new page:
1. Update header.js pageConfigs
2. Create /FR/[french-name].html (data-lang="fr")
3. Create /EN/[english-name].html (data-lang="en")
4. Add hreflang tags to both (identical)
5. Test locally

Update page:
1. Edit /FR/ or /EN/ file
2. Update meta tags if content changed
3. Verify language-specific keywords
4. Test in browser
```

### Essential HTML Attributes

```html
<!-- Required on every page -->
<html lang="fr">  <!-- or "en" -->
<body data-page="home" data-lang="fr">  <!-- or "en" -->

<!-- Required in <head> -->
<meta name="description" content="[150-160 chars]">
<link rel="alternate" hreflang="fr" href="https://..." />
<link rel="alternate" hreflang="en" href="https://..." />
<link rel="alternate" hreflang="x-default" href="https://..." />
<link rel="stylesheet" href="../header.css">

<!-- Required before </body> -->
<script src="../header.js"></script>
```

### Testing Command Quick Reference

```bash
# Start local server
python3 -m http.server 8000

# Validate HTML
# Visit: https://validator.w3.org/

# Count meta description length
echo "Description here" | wc -c

# Check for mixed language (search for English words in French pages)
grep -r "birthday" FR/
```

---

**Questions?** Refer to research.md for detailed technical decisions or open an issue in the repository.

---

## Adding a New Language (e.g., Italian)

To add Italian (IT) support in the future:

### Step 1: Update header.js

Add Italian to the languages array:

```javascript
const languages = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'it', label: 'IT', name: 'Italiano' }  // NEW
];
```

Add Italian translations to pageConfigs:

```javascript
const pageConfigs = {
    home: {
        titles: { fr: 'Accueil', en: 'Home', it: 'Home' },
        urls: { fr: '/FR/accueil.html', en: '/EN/home.html', it: '/IT/home.html' }
    },
    // ... repeat for all pages
};
```

### Step 2: Create IT/ Directory

```bash
mkdir IT
```

### Step 3: Create Italian Pages

Create 6 Italian pages following the same structure as FR and EN:
- IT/home.html
- IT/compleanno.html (birthday)
- IT/contatto.html
- IT/spettacoli.html (shows)
- IT/personaggi.html (characters)
- IT/laboratori.html (workshops)

### Step 4: Update hreflang Tags

All pages (FR, EN, IT) must include all three languages:

```html
<link rel="alternate" hreflang="fr" href="https://mamanclown.com/FR/[page].html" />
<link rel="alternate" hreflang="en" href="https://mamanclown.com/EN/[page].html" />
<link rel="alternate" hreflang="it" href="https://mamanclown.com/IT/[page].html" />
<link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/[page].html" />
```

The language switcher will automatically show "FR | EN | IT" on all pages!
