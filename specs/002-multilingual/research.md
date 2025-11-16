# Research: Multilingual Website Support

**Feature**: 002-multilingual  
**Date**: November 16, 2025  
**Status**: Complete

This document consolidates research findings for implementing multilingual support on the Maman Clown static HTML website.

---

## RT-001: Redirect Implementation for Static Sites

### Decision

**Use JavaScript redirects with meta refresh fallback** in legacy root-level HTML files.

### Rationale

1. **GitHub Pages Constraints**: GitHub Pages does not support server-side redirects (`.htaccess`, `_redirects`, or web.config files)
2. **SEO-Friendly**: Google explicitly follows and treats JavaScript redirects similarly to 301 permanent redirects
3. **No Infrastructure Changes**: Works with existing static HTML deployment via GitHub Actions
4. **Fast User Experience**: Instant redirects for 99%+ of users with JavaScript enabled
5. **Graceful Fallback**: Meta refresh provides backup for non-JavaScript environments

### Implementation Pattern

Replace legacy root-level files (e.g., `index.html`, `birthdays.html`) with redirect pages:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex">
    <link rel="canonical" href="https://mamanclown.com/FR/accueil.html">
    <title>Redirection - Maman Clown</title>
    <script>
        window.location.replace('/FR/accueil.html');
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=/FR/accueil.html">
    </noscript>
</head>
<body>
    <p>Cette page a été déplacée vers <a href="/FR/accueil.html">notre nouvelle page</a>.</p>
</body>
</html>
```

**Key Elements**:
- `<meta name="robots" content="noindex">`: Prevent search engines from indexing redirect page
- `<link rel="canonical" href="...">`: Signal the authoritative URL to search engines
- `window.location.replace()`: JavaScript redirect without history entry
- `<meta http-equiv="refresh" ...>`: Fallback for non-JavaScript environments
- Visible link: Fallback for both accessibility and edge cases

### Redirect Mapping

| Legacy File       | Redirect Target         |
|-------------------|-------------------------|
| /index.html       | /FR/accueil.html        |
| /birthdays.html   | /FR/anniversaire.html   |
| /contact.html     | /FR/contact.html        |
| /shows.html       | /FR/spectacles.html     |
| /characters.html  | /FR/personnages.html    |

### SEO Implications

- **Transition Timeline**: 2-3 months for full search engine reindexing
- **Canonical Tags**: New pages must include `<link rel="canonical">` to establish authority
- **Sitemap Update**: Generate new sitemap.xml with language-specific URLs
- **Search Console**: Submit updated sitemap and monitor International Targeting report
- **Retention Period**: Keep redirect pages active for 12+ months to allow gradual migration

### Alternatives Considered

1. **Jekyll Redirect Plugin**: Rejected - Requires Jekyll build process, violates "Simplicity First" (Constitution I)
2. **Custom 404 Routing**: Rejected - Poor SEO, requires additional JavaScript complexity
3. **Manual DNS/Hosting Change**: Rejected - Requires infrastructure changes outside project scope

### References

- [Google Search Central: JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [GitHub Pages Documentation: Static Site Hosting](https://docs.github.com/en/pages)
- [MDN: window.location.replace()](https://developer.mozilla.org/en-US/docs/Web/API/Location/replace)

---

## RT-002: hreflang Tag Implementation

### Decision

**Implement bidirectional hreflang tags in the `<head>` of every page**, using absolute URLs, with `x-default` pointing to French (default language).

### Rationale

1. **Search Engine Language Discovery**: hreflang tags tell Google, Bing, and other search engines which language version to serve based on user location/language settings
2. **Bidirectional Requirement**: Google requires return links between all language versions (non-bidirectional tags are ignored)
3. **X-Default for Fallback**: Provides default version for users whose language/location doesn't match available versions
4. **Absolute URLs Preferred**: Official Google standard, avoids parsing ambiguity
5. **Static Site Simplicity**: With only 6 pages, HTML `<head>` tags are more appropriate than XML sitemaps

### Implementation Template

Every page in both languages includes **identical hreflang tags**:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Maman Clown - Accueil</title>
    
    <!-- Hreflang tags - IDENTICAL on both FR and EN versions -->
    <link rel="alternate" hreflang="fr" href="https://mamanclown.com/FR/accueil.html" />
    <link rel="alternate" hreflang="en" href="https://mamanclown.com/EN/home.html" />
    <link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/accueil.html" />
    
    <!-- Other head elements... -->
</head>
<body>
    <!-- Content -->
</body>
</html>
```

### hreflang Tag Checklist

For each page pair (e.g., `/FR/accueil.html` ↔ `/EN/home.html`):

- [ ] Self-referential tag (page links to itself)
- [ ] Alternate language tag (French page links to English equivalent)
- [ ] Return link (English page links back to French)
- [ ] X-default tag (points to French as default)
- [ ] Absolute URLs (full `https://domain.com/path`)
- [ ] Valid language codes (ISO 639-1: `fr`, `en`)
- [ ] Identical tags on both language versions

### Page-Specific hreflang Mapping

| Page ID    | French hreflang href                    | English hreflang href                     |
|------------|-----------------------------------------|-------------------------------------------|
| home       | https://mamanclown.com/FR/accueil.html  | https://mamanclown.com/EN/home.html       |
| birthdays  | https://mamanclown.com/FR/anniversaire.html | https://mamanclown.com/EN/birthday-party.html |
| contact    | https://mamanclown.com/FR/contact.html  | https://mamanclown.com/EN/contact.html    |
| shows      | https://mamanclown.com/FR/spectacles.html | https://mamanclown.com/EN/shows.html    |
| characters | https://mamanclown.com/FR/personnages.html | https://mamanclown.com/EN/characters.html |
| workshops  | https://mamanclown.com/FR/ateliers.html | https://mamanclown.com/EN/workshops.html  |

### Common Mistakes to Avoid

1. ❌ **Missing return links** (non-bidirectional)
2. ❌ **Different tags on language pairs** (must be identical)
3. ❌ **Relative URLs** (use absolute URLs)
4. ❌ **No self-referential tag**
5. ❌ **Broken or redirected URLs in hreflang**
6. ❌ **Invalid language codes** (use `fr` and `en`, not `fr-FR`)

### Validation

- **Google Search Console**: International Targeting → Language tab
- **URL Inspection Tool**: Verify Google's interpretation of hreflang tags
- **Third-Party Tools**: Ahrefs Site Audit, Merkle hreflang testing tool
- **Manual Check**: Ensure identical tags across all page pairs

### Alternatives Considered

1. **XML Sitemap hreflang**: Rejected - HTML tags simpler for 6 pages (small site)
2. **HTTP Headers**: Rejected - Not supported on GitHub Pages static hosting
3. **No x-default**: Rejected - Google recommends x-default for fallback

### References

- [Google: Tell Google about localized versions of your page](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Ahrefs: Hreflang Guide for Beginners](https://ahrefs.com/blog/hreflang-tags/)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

---

## RT-003: Resource Path Resolution from Subdirectories

### Decision

**Use relative paths with parent directory traversal** (`../resource.ext`) for shared assets (CSS, JS, favicon, fonts).

### Rationale

1. **Simple and Standard**: Relative paths are a web standard, no special configuration needed
2. **Works with Static Hosting**: GitHub Pages serves static files with standard path resolution
3. **No Asset Duplication**: Single copy of `header.css`, `header.js`, favicon at root
4. **ImageKit CDN URLs Unaffected**: External CDN URLs remain absolute (no changes needed)

### Path Resolution Patterns

#### From Language Subdirectory Pages (`/FR/*.html`, `/EN/*.html`)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    
    <!-- Favicon (SVG at root) -->
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    
    <!-- External fonts (absolute URLs - no change) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap" rel="stylesheet">
    
    <!-- Shared CSS at root -->
    <link rel="stylesheet" href="../header.css">
</head>
<body>
    <!-- Hero image from ImageKit CDN (absolute URL - no change) -->
    <img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-375,f-auto,q-80" 
         alt="Maman Clown"
         width="375" 
         height="375">
    
    <!-- Shared JavaScript at root -->
    <script src="../header.js"></script>
</body>
</html>
```

#### Asset Types & Path Patterns

| Asset Type           | Current Location | Path from Subdirectory | Notes                    |
|----------------------|------------------|------------------------|--------------------------|
| CSS (header.css)     | /header.css      | ../header.css          | Relative, parent dir     |
| JavaScript (header.js) | /header.js     | ../header.js           | Relative, parent dir     |
| Favicon (SVG)        | /favicon.svg     | ../favicon.svg         | Relative, parent dir     |
| Images (ImageKit CDN)| External CDN     | (absolute URL)         | No change needed         |
| External Fonts       | Google Fonts CDN | (absolute URL)         | No change needed         |
| External Libraries   | CDN (confetti.js)| (absolute URL)         | No change needed         |

### Testing Checklist

Before deployment, verify from `/FR/` and `/EN/` pages:

- [ ] `../header.css` loads correctly (check Network tab)
- [ ] `../header.js` executes without errors (check Console)
- [ ] `../favicon.svg` displays in browser tab
- [ ] ImageKit CDN images load (unchanged absolute URLs)
- [ ] Google Fonts load (unchanged CDN URLs)
- [ ] No 404 errors in Network tab
- [ ] No console errors related to resource loading

### Alternatives Considered

1. **Absolute Paths from Root**: Rejected - Breaks if site deployed to subdirectory (e.g., `example.com/site/`)
2. **Asset Duplication in Language Dirs**: Rejected - Violates DRY, increases maintenance
3. **Build Tool for Path Rewriting**: Rejected - Violates "Simplicity First" (Constitution I)

### References

- [MDN: HTML File Paths](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#document_fragments)
- [W3C: Relative URLs](https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2)

---

## RT-004: Navigation Menu Language Awareness

### Decision

**Implement language detection via URL path analysis with `data-lang` attribute fallback**, using centralized page configuration object in `header.js`.

### Rationale

1. **Single Source of Truth**: Centralized `pageConfigs` object maps page IDs to titles/URLs for both languages
2. **No Code Duplication**: Single `header.js` file serves both French and English pages
3. **Automatic Detection**: JavaScript detects language from URL path or `data-lang` attribute
4. **Simplicity First**: Pure vanilla JavaScript, no frameworks, no external dependencies (Constitution I)
5. **Performance**: Zero network requests, all translations embedded in script (~1.5KB addition)

### Implementation Pattern

#### Updated `header.js` Structure

```javascript
/**
 * Maman Clown Website - Multilingual Header Component
 */

(function() {
    'use strict';
    
    // Language detection (priority: data attribute > URL path > default)
    function detectLanguage() {
        const declaredLang = document.body.dataset.lang;
        if (declaredLang) {
            return declaredLang.toLowerCase();
        }
        
        const path = window.location.pathname;
        if (path.includes('/EN/')) return 'en';
        if (path.includes('/FR/')) return 'fr';
        
        return 'fr'; // Default to French (primary audience)
    }
    
    // Centralized page configuration
    const pageConfigs = {
        home: {
            titles: { fr: 'Accueil', en: 'Home' },
            urls: { fr: '/FR/accueil.html', en: '/EN/home.html' }
        },
        birthdays: {
            titles: { fr: 'Anniversaire', en: 'Birthday Party' },
            urls: { fr: '/FR/anniversaire.html', en: '/EN/birthday-party.html' }
        },
        contact: {
            titles: { fr: 'Contact', en: 'Contact' },
            urls: { fr: '/FR/contact.html', en: '/EN/contact.html' }
        },
        shows: {
            titles: { fr: 'Spectacles', en: 'Shows' },
            urls: { fr: '/FR/spectacles.html', en: '/EN/shows.html' }
        },
        characters: {
            titles: { fr: 'Personnages', en: 'Characters' },
            urls: { fr: '/FR/personnages.html', en: '/EN/characters.html' }
        },
        workshops: {
            titles: { fr: 'Ateliers', en: 'Workshops' },
            urls: { fr: '/FR/ateliers.html', en: '/EN/workshops.html' }
        }
    };
    
    // Build pages array for current language
    function buildPagesForLanguage(lang) {
        return Object.entries(pageConfigs).map(([id, config]) => ({
            id: id,
            title: config.titles[lang] || config.titles['fr'],
            url: config.urls[lang] || config.urls['fr']
        }));
    }
    
    const currentPage = document.body.dataset.page || 'home';
    const currentLang = detectLanguage();
    const pages = buildPagesForLanguage(currentLang);
    
    // Build menu (exclude current page)
    function initMenu() {
        const menu = document.getElementById('menu');
        if (!menu) return;
        
        const menuLinks = pages.filter(p => p.id !== currentPage);
        
        menuLinks.forEach(page => {
            const link = document.createElement('a');
            link.href = page.url;
            link.textContent = page.title;
            link.className = 'menu-link';
            menu.appendChild(link);
        });
    }
    
    // [Existing hamburger menu and scroll detection functions remain unchanged]
    
    function init() {
        initMenu();
        initHamburgerMenu();
        initScrollDetection();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
```

#### HTML Page Data Attributes

Each page declares its language and page ID:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Maman Clown - Accueil</title>
    <!-- ... -->
</head>
<body data-page="home" data-lang="fr">
    <header id="site-header">
        <img src="..." alt="Maman Clown" class="header-logo">
        <h1 class="page-title">Accueil</h1>
        <button class="hamburger" aria-label="Menu">☰</button>
    </header>
    
    <!-- Menu and overlay -->
    <div id="menu-overlay"></div>
    <nav id="menu" aria-hidden="true"></nav>
    
    <!-- ... rest of page ... -->
    
    <script src="../header.js"></script>
</body>
</html>
```

**Required Attributes**:
- `<html lang="fr">`: Tells screen readers and search engines the page language
- `data-page="home"`: Page identifier (matches `pageConfigs` keys)
- `data-lang="fr"`: Explicit language declaration for JavaScript

### Language Detection Flow

1. **Check `data-lang` attribute** on `<body>` (explicit declaration, highest priority)
2. **Fallback to URL path analysis** (check if URL contains `/FR/` or `/EN/`)
3. **Default to French** if neither method succeeds (primary audience per spec)

### Adding New Pages

To add a new page (e.g., "Gallery / Galerie"):

1. Add entry to `pageConfigs`:
   ```javascript
   gallery: {
       titles: { fr: 'Galerie', en: 'Gallery' },
       urls: { fr: '/FR/galerie.html', en: '/EN/gallery.html' }
   }
   ```

2. Create pages with correct attributes:
   ```html
   <!-- /FR/galerie.html -->
   <body data-page="gallery" data-lang="fr">
   
   <!-- /EN/gallery.html -->
   <body data-page="gallery" data-lang="en">
   ```

3. No other changes needed - menu builds automatically

### Performance & Constitution Compliance

- **No External Dependencies**: Pure vanilla JavaScript (Constitution I)
- **Single File**: No duplication, ~1.5KB addition to existing `header.js`
- **No Network Requests**: All translations embedded (Constitution III: Performance)
- **Zero Async Complexity**: Synchronous language detection (Constitution I: Simplicity)

### Alternatives Considered

1. **Duplicate `header-fr.js` and `header-en.js`**: Rejected - Violates "Simplicity First", doubles maintenance
2. **External JSON Translation Files**: Rejected - Requires HTTP requests, hurts performance
3. **Query Parameter Language Switching** (`?lang=fr`): Rejected - Spec requires directory structure
4. **Server-Side Rendering**: Rejected - Project is static HTML, no build tools

### References

- [MDN: data-* Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)
- [MDN: window.location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)

---

## RT-005: Meta Tag Translation Patterns

### Decision

**Create language-specific meta tag templates** with Monaco/Monte-Carlo keywords in both French and English, ensuring 150-160 character descriptions optimized for local SEO.

### Rationale

1. **Local SEO Critical**: Monaco/Monte-Carlo targeting essential for business discovery (Constitution III:70)
2. **Bilingual Audience**: French (primary) and English (expatriates/tourists) both need optimized meta tags
3. **Search Result Optimization**: 150-160 char limit ensures full description displays in Google results
4. **Social Sharing**: Open Graph and Twitter Card tags improve Facebook/Twitter link previews

### Meta Tag Structure Template

Every page requires these meta tags in the `<head>`:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary SEO Meta Tags -->
    <meta name="description" content="[150-160 chars with Monaco/Monte-Carlo keywords]">
    <title>Maman Clown - [Page Title in Language]</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mamanclown.com/[LANG]/[page].html">
    <meta property="og:title" content="Maman Clown - [Page Title]">
    <meta property="og:description" content="[Same as meta description or variant]">
    <meta property="og:image" content="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-1200,h-630,f-auto,q-80">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://mamanclown.com/[LANG]/[page].html">
    <meta property="twitter:title" content="Maman Clown - [Page Title]">
    <meta property="twitter:description" content="[Same as meta description or variant]">
    <meta property="twitter:image" content="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-1200,h-630,f-auto,q-80">
    
    <!-- Hreflang (see RT-002) -->
    <link rel="alternate" hreflang="fr" href="https://mamanclown.com/FR/[page].html" />
    <link rel="alternate" hreflang="en" href="https://mamanclown.com/EN/[page].html" />
    <link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/[page].html" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    
    <!-- ... rest of head ... -->
</head>
```

### French Meta Tag Keywords

Target keywords for French SEO:
- **anniversaire enfants Monaco** / **anniversaire Monaco**
- **spectacle enfants Monte-Carlo**
- **animateur anniversaire Côte d'Azur**
- **clown anniversaire Monaco**
- **divertissement enfants 2-8 ans**
- **fête enfants professionnelle**

### English Meta Tag Keywords

Target keywords for English SEO:
- **children birthday party Monaco**
- **kids entertainment Monte-Carlo**
- **birthday party entertainer Côte d'Azur**
- **clown birthday Monaco**
- **children's party professional**
- **kids shows Monaco**

### Page-Specific Meta Tags

#### French Home Page (`/FR/accueil.html`)

```html
<meta name="description" content="Maman Clown - Spectacles captivants pour enfants 2-8 ans à Monaco. Anniversaires magiques et inoubliables. Divertissement professionnel à Monte-Carlo.">
<meta property="og:title" content="Maman Clown - Spectacles pour Enfants Monaco">
<meta property="og:description" content="Anniversaires magiques avec Maman Clown à Monaco. Spectacles interactifs pour enfants 2-8 ans. Réservez maintenant!">
<title>Maman Clown - Accueil</title>
```

#### English Home Page (`/EN/home.html`)

```html
<meta name="description" content="Maman Clown - Captivating children's entertainment ages 2-8 in Monaco. Magical unforgettable birthday parties. Professional shows in Monte-Carlo.">
<meta property="og:title" content="Maman Clown - Children's Entertainment Monaco">
<meta property="og:description" content="Magical birthdays with Maman Clown in Monaco. Interactive shows for children ages 2-8. Book now!">
<title>Maman Clown - Home</title>
```

#### French Birthdays Page (`/FR/anniversaire.html`)

```html
<meta name="description" content="Anniversaires magiques avec Maman Clown à Monaco et Monte-Carlo. Spectacles interactifs pour enfants 2-8 ans. Réservez maintenant pour une fête inoubliable!">
<meta property="og:title" content="Maman Clown - Anniversaires à Monaco">
<meta property="og:description" content="Offrez à votre enfant un anniversaire magique avec Maman Clown. Spectacles, jeux, et moments de joie garantis!">
<title>Maman Clown - Anniversaire</title>
```

#### English Birthdays Page (`/EN/birthday-party.html`)

```html
<meta name="description" content="Magical birthday parties with Maman Clown in Monaco and Monte-Carlo. Interactive shows for children ages 2-8. Book now for unforgettable celebration!">
<meta property="og:title" content="Maman Clown - Birthday Parties Monaco">
<meta property="og:description" content="Give your child a magical birthday with Maman Clown. Shows, games, and guaranteed moments of joy!">
<title>Maman Clown - Birthday Party</title>
```

### Meta Tag Validation Checklist

For each page:

- [ ] Meta description length: 150-160 characters
- [ ] Includes Monaco/Monte-Carlo keywords
- [ ] Includes target language keywords (French or English)
- [ ] Open Graph URL matches current page URL
- [ ] Twitter Card URL matches current page URL
- [ ] og:image uses ImageKit CDN with social sharing dimensions (1200×630)
- [ ] Title tag format: "Maman Clown - [Page Name]"
- [ ] No duplicate content between language versions
- [ ] HTML lang attribute matches page language

### Open Graph Image Specifications

Use ImageKit transformation for social sharing:

```html
<meta property="og:image" content="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-1200,h-630,f-auto,q-80">
```

**Dimensions**: 1200×630px (Facebook/Twitter recommended)  
**Format**: WebP with automatic fallback  
**Quality**: 80 (balance between quality and file size)

### Constitution Compliance

- **SEO Mandatory** (Constitution III:70): Meta tags required for discoverability
- **Local Positioning**: Monaco/Monte-Carlo keywords per Constitution guidance
- **Performance**: ImageKit CDN for optimized social images (Constitution III:67-68)

### Alternatives Considered

1. **Generic Meta Tags**: Rejected - Poor local SEO, misses Monaco audience
2. **Duplicate English Meta in French**: Rejected - Multilingual SEO best practices require native language
3. **No Open Graph Tags**: Rejected - Constitution III:70 requires social sharing optimization

### References

- [Google: Meta Tags Best Practices](https://developers.google.com/search/docs/appearance/snippet)
- [Facebook: Open Graph Protocol](https://ogp.me/)
- [Twitter: Card Validator](https://cards-dev.twitter.com/validator)
- [Moz: Meta Description Length](https://moz.com/learn/seo/meta-description)

---

## RT-006: Content Translation Scope

### Decision

**Translate all user-facing content, image alt text, button labels, and aria-labels**, while keeping technical identifiers (vCard filenames, CSS classes) unchanged.

### Rationale

1. **Complete Language Immersion**: Users must see only their chosen language throughout the experience
2. **Accessibility Requirement**: Screen readers need translated aria-labels (Constitution III:67)
3. **SEO Image Optimization**: Alt text contributes to image search rankings
4. **User Experience**: Even button labels affect perceived professionalism (Constitution II:62)

### Translation Checklist

#### Text Content
- [ ] Page titles (`<title>` tag)
- [ ] Headings (`<h1>`, `<h2>`, `<h3>`)
- [ ] Paragraph text (`<p>`)
- [ ] Button labels (e.g., "Ajouter aux contacts" vs. "Add to contacts")
- [ ] Link text (visible anchor text)
- [ ] Form labels (if forms exist)
- [ ] Error messages (if applicable)

#### Meta & SEO
- [ ] Meta description (see RT-005)
- [ ] Open Graph title and description
- [ ] Twitter Card title and description
- [ ] `<html lang="...">` attribute (`fr` or `en`)

#### Images
- [ ] Logo alt text: "Maman Clown" (same both languages)
- [ ] Hero image alt: "Maman Clown" (same both languages)
- [ ] Character images alt: Translate descriptions (if applicable)
- [ ] Decorative images: Empty alt (`alt=""`) appropriate

#### Interactive Elements
- [ ] Navigation menu titles (handled by `header.js`)
- [ ] Hamburger menu aria-label:
  - French: `aria-label="Menu"`
  - English: `aria-label="Menu"`
  - (Note: "Menu" is same in both languages)
- [ ] Navigation aria attributes:
  - `aria-expanded="true/false"` (no translation needed)
  - `aria-hidden="true/false"` (no translation needed)

#### Email/Phone Links
- [ ] Email subject lines in mailto links:
  - French: `subject=Demande%20de%20réservation%20Maman%20Clown`
  - English: `subject=Booking%20Request%20Maman%20Clown`
- [ ] Phone number display (no translation - same number)
- [ ] Email display (no translation - same email)

#### Technical Identifiers (Do NOT Translate)
- ❌ CSS class names (e.g., `.menu-link`, `.contact-card`)
- ❌ JavaScript data attributes (e.g., `data-page="home"` stays "home" in both languages)
- ❌ File names except page filenames (e.g., `header.css` stays `header.css`)
- ❌ vCard download filename: Keep as `maman_clown.vcf` (both languages)

### Example Translation Comparison

#### French Contact Button
```html
<a href="data:text/vcard;charset=utf-8,..." 
   download="maman_clown.vcf" 
   class="contact-button">
    Ajouter aux contacts
</a>
```

#### English Contact Button
```html
<a href="data:text/vcard;charset=utf-8,..." 
   download="maman_clown.vcf" 
   class="contact-button">
    Add to contacts
</a>
```

**Note**: `download` attribute filename stays same, button label translates

### Content Translation Sources

1. **Existing Pages**: Most content already in French (current site)
2. **English Translations Needed**:
   - Home page content
   - Birthday party descriptions
   - Contact page text
   - Shows descriptions
   - Character descriptions
   - Workshops page content (new page)

3. **French Workshop Page**: New content needed (doesn't exist yet)

### Translation Validation

- [ ] All visible text in target language
- [ ] No mixed languages on same page
- [ ] Screen reader announces correct language (test with VoiceOver/NVDA)
- [ ] Email subject lines localized
- [ ] Button labels professional and natural-sounding
- [ ] Meta tags in target language (see RT-005)

### Alternatives Considered

1. **Keep English Tech Terms in French** (e.g., "Email"): Accepted - Some tech terms universal
2. **Translate CSS Classes**: Rejected - Increases complexity, no user benefit
3. **Translate vCard Filename**: Rejected - Technical identifier, not user-facing
4. **Separate vCard Files per Language**: Rejected - vCard format language-agnostic

### References

- [W3C: Internationalization Best Practices](https://www.w3.org/International/quicktips/)
- [MDN: lang Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
- [WebAIM: Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

---

## Summary

All six research tasks (RT-001 through RT-006) have been completed with concrete decisions, implementation patterns, and rationale. Key findings:

1. **Redirects**: JavaScript with meta refresh fallback (GitHub Pages constraint)
2. **Hreflang**: Bidirectional tags in `<head>` with x-default pointing to French
3. **Resource Paths**: Relative paths with parent directory traversal (`../`)
4. **Navigation**: Language-aware `header.js` with centralized config object
5. **Meta Tags**: Language-specific templates with Monaco/Monte-Carlo keywords
6. **Content Translation**: All user-facing content, alt text, and aria-labels

**Next Phase**: Generate data-model.md and quickstart.md (Phase 1: Design & Contracts)
