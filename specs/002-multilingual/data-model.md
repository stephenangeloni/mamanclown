# Data Model: Multilingual Website Support

**Feature**: 002-multilingual  
**Date**: November 16, 2025  
**Status**: Complete

This document defines the logical data model for the multilingual website structure. Although this is a static HTML site with no backend database, these entities represent the conceptual organization of pages, languages, and translations.

---

## Entity: Language

Represents a supported language on the website.

### Attributes

| Attribute       | Type    | Description                                   | Example         |
|-----------------|---------|-----------------------------------------------|-----------------|
| code            | string  | Two-letter ISO 639-1 language code            | `"fr"`, `"en"`  |
| directoryPath   | string  | URL path prefix for language pages            | `"/FR/"`, `"/EN/"` |
| isDefault       | boolean | Whether this is the default language          | `true` (FR), `false` (EN) |
| hreflangCode    | string  | Language code for hreflang tags               | `"fr"`, `"en"`  |
| htmlLangCode    | string  | Value for `<html lang="...">` attribute       | `"fr"`, `"en"`  |

### Instances

| code | directoryPath | isDefault | hreflangCode | htmlLangCode |
|------|---------------|-----------|--------------|--------------|
| fr   | /FR/          | true      | fr           | fr           |
| en   | /EN/          | false     | en           | en           |

### Notes

- French (`fr`) is the default language per spec (Monaco/Monte-Carlo primary audience)
- X-default hreflang points to French
- Legacy root-level URLs redirect to French versions

---

## Entity: Page

Represents a distinct page type with content in multiple languages.

### Attributes

| Attribute       | Type    | Description                                   | Example           |
|-----------------|---------|-----------------------------------------------|-------------------|
| pageId          | string  | Unique identifier for page type               | `"home"`, `"birthdays"` |
| legacyFilename  | string  | Original root-level filename (for redirects)  | `"index.html"`    |
| hasLegacyFile   | boolean | Whether a root-level redirect page exists     | `true`, `false`   |

### Instances

| pageId     | legacyFilename    | hasLegacyFile | Notes                          |
|------------|-------------------|---------------|--------------------------------|
| home       | index.html        | true          | Redirects to FR/accueil.html   |
| birthdays  | birthdays.html    | true          | Redirects to FR/anniversaire.html |
| contact    | contact.html      | true          | Redirects to FR/contact.html   |
| shows      | shows.html        | true          | Redirects to FR/spectacles.html |
| characters | characters.html   | true          | Redirects to FR/personnages.html |
| workshops  | (none)            | false         | New page, no legacy file       |

---

## Entity: LocalizedPage

Represents a page instance in a specific language with all translated content.

### Attributes

| Attribute            | Type     | Description                                      | Example (French)          |
|----------------------|----------|--------------------------------------------------|---------------------------|
| pageId               | string   | Reference to parent Page entity                  | `"home"`                  |
| languageCode         | string   | Reference to Language entity                     | `"fr"`                    |
| filename             | string   | Language-specific filename                       | `"accueil.html"`          |
| fullPath             | string   | Complete URL path                                | `"/FR/accueil.html"`      |
| browserTitle         | string   | `<title>` tag content                            | `"Maman Clown - Accueil"` |
| headerTitle          | string   | Page title in header `<h1>`                      | `"Accueil"`               |
| metaDescription      | string   | SEO meta description (150-160 chars)             | `"Spectacles captivants pour enfants..."` |
| openGraphTitle       | string   | `og:title` meta tag                              | `"Maman Clown - Spectacles pour Enfants Monaco"` |
| openGraphDescription | string   | `og:description` meta tag                        | `"Anniversaires magiques avec Maman Clown..."` |
| twitterCardTitle     | string   | `twitter:title` meta tag                         | `"Maman Clown - Spectacles pour Enfants Monaco"` |
| twitterCardDescription | string | `twitter:description` meta tag                   | `"Anniversaires magiques avec Maman Clown..."` |
| imageAltTexts        | object   | Key-value pairs of image identifiers and alt text | `{ "logo": "Maman Clown", "hero": "Maman Clown" }` |
| menuLabel            | string   | Navigation menu link text                        | `"Accueil"`               |

### Example Instances

#### French Home Page

```javascript
{
  pageId: "home",
  languageCode: "fr",
  filename: "accueil.html",
  fullPath: "/FR/accueil.html",
  browserTitle: "Maman Clown - Accueil",
  headerTitle: "Accueil",
  metaDescription: "Maman Clown - Spectacles captivants pour enfants 2-8 ans à Monaco. Anniversaires magiques et inoubliables. Divertissement professionnel à Monte-Carlo.",
  openGraphTitle: "Maman Clown - Spectacles pour Enfants Monaco",
  openGraphDescription: "Anniversaires magiques avec Maman Clown à Monaco. Spectacles interactifs pour enfants 2-8 ans. Réservez maintenant!",
  twitterCardTitle: "Maman Clown - Spectacles pour Enfants Monaco",
  twitterCardDescription: "Anniversaires magiques avec Maman Clown à Monaco. Spectacles interactifs pour enfants 2-8 ans. Réservez maintenant!",
  imageAltTexts: {
    "logo": "Maman Clown",
    "hero": "Maman Clown"
  },
  menuLabel: "Accueil"
}
```

#### English Home Page

```javascript
{
  pageId: "home",
  languageCode: "en",
  filename: "home.html",
  fullPath: "/EN/home.html",
  browserTitle: "Maman Clown - Home",
  headerTitle: "Home",
  metaDescription: "Maman Clown - Captivating children's entertainment ages 2-8 in Monaco. Magical unforgettable birthday parties. Professional shows in Monte-Carlo.",
  openGraphTitle: "Maman Clown - Children's Entertainment Monaco",
  openGraphDescription: "Magical birthdays with Maman Clown in Monaco. Interactive shows for children ages 2-8. Book now!",
  twitterCardTitle: "Maman Clown - Children's Entertainment Monaco",
  twitterCardDescription: "Magical birthdays with Maman Clown in Monaco. Interactive shows for children ages 2-8. Book now!",
  imageAltTexts: {
    "logo": "Maman Clown",
    "hero": "Maman Clown"
  },
  menuLabel: "Home"
}
```

---

## Entity: PageMapping

Represents the relationship between language-specific page instances.

### Attributes

| Attribute       | Type   | Description                                      | Example               |
|-----------------|--------|--------------------------------------------------|-----------------------|
| pageId          | string | Unique page identifier                           | `"home"`              |
| frenchFilename  | string | French page filename                             | `"accueil.html"`      |
| englishFilename | string | English page filename                            | `"home.html"`         |
| frenchPath      | string | Complete French page URL                         | `"/FR/accueil.html"`  |
| englishPath     | string | Complete English page URL                        | `"/EN/home.html"`     |
| legacyPath      | string | Root-level legacy URL (if exists)                | `"/index.html"`       |
| hreflangPairs   | array  | Array of hreflang link objects for this page pair | (see below)           |

### Complete Page Mapping Table

| pageId     | frenchFilename    | englishFilename      | frenchPath             | englishPath               | legacyPath       |
|------------|-------------------|----------------------|------------------------|---------------------------|------------------|
| home       | accueil.html      | home.html            | /FR/accueil.html       | /EN/home.html             | /index.html      |
| birthdays  | anniversaire.html | birthday-party.html  | /FR/anniversaire.html  | /EN/birthday-party.html   | /birthdays.html  |
| contact    | contact.html      | contact.html         | /FR/contact.html       | /EN/contact.html          | /contact.html    |
| shows      | spectacles.html   | shows.html           | /FR/spectacles.html    | /EN/shows.html            | /shows.html      |
| characters | personnages.html  | characters.html      | /FR/personnages.html   | /EN/characters.html       | /characters.html |
| workshops  | ateliers.html     | workshops.html       | /FR/ateliers.html      | /EN/workshops.html        | (none)           |

### hreflang Structure

For each page pair, both versions include identical hreflang tags:

```html
<link rel="alternate" hreflang="fr" href="https://mamanclown.com/FR/[page].html" />
<link rel="alternate" hreflang="en" href="https://mamanclown.com/EN/[page].html" />
<link rel="alternate" hreflang="x-default" href="https://mamanclown.com/FR/[page].html" />
```

---

## Entity: SharedResource

Represents assets shared between all language versions (not duplicated).

### Attributes

| Attribute     | Type   | Description                                  | Example            |
|---------------|--------|----------------------------------------------|--------------------|
| resourceType  | string | Type of resource                             | `"css"`, `"js"`    |
| filename      | string | Filename at root level                       | `"header.css"`     |
| rootPath      | string | Path from repository root                    | `/header.css`      |
| subdirPath    | string | Relative path from language subdirectories   | `../header.css`    |

### Instances

| resourceType | filename      | rootPath       | subdirPath      | Notes                           |
|--------------|---------------|----------------|-----------------|----------------------------------|
| css          | header.css    | /header.css    | ../header.css   | Shared header styles             |
| js           | header.js     | /header.js     | ../header.js    | Language-aware navigation script |
| image        | favicon.svg   | /favicon.svg   | ../favicon.svg  | Site favicon                     |
| image        | (ImageKit CDN)| (external)     | (absolute URL)  | All photos via ImageKit CDN      |
| font         | (Google Fonts)| (external)     | (absolute URL)  | Comic Neue font via Google       |
| library      | confetti.js   | (CDN)          | (absolute URL)  | Confetti animation library       |

---

## Entity: Redirect

Represents a redirect from legacy root-level URL to language-specific URL.

### Attributes

| Attribute       | Type   | Description                                  | Example               |
|-----------------|--------|----------------------------------------------|-----------------------|
| legacyPath      | string | Old root-level URL                           | `/index.html`         |
| targetPath      | string | New language-specific URL (French default)   | `/FR/accueil.html`    |
| redirectMethod  | string | Implementation mechanism                     | `"javascript+meta"`   |
| isTemporary     | boolean| Whether redirect is temporary (should be permanent) | `false`        |

### Instances

| legacyPath       | targetPath             | redirectMethod      | Notes                           |
|------------------|------------------------|---------------------|---------------------------------|
| /index.html      | /FR/accueil.html       | javascript+meta     | Home page → French home         |
| /birthdays.html  | /FR/anniversaire.html  | javascript+meta     | Birthdays → French birthdays    |
| /contact.html    | /FR/contact.html       | javascript+meta     | Contact → French contact        |
| /shows.html      | /FR/spectacles.html    | javascript+meta     | Shows → French shows            |
| /characters.html | /FR/personnages.html   | javascript+meta     | Characters → French characters  |

---

## Entity Relationships

```text
Language (1) ──────── (many) LocalizedPage
    │
    │ isDefault determines x-default hreflang
    │
    └─→ French (fr) is default

Page (1) ────────── (many) LocalizedPage
    │
    │ One Page instance per page type
    │ Each Page has 2 LocalizedPage instances (FR + EN)
    │
    └─→ pageId links Page to LocalizedPages

PageMapping (1) ────── (1) Page
    │
    │ Maps page filenames across languages
    │ Includes legacy redirect information
    │
    └─→ pageId is primary key

SharedResource ────── (no direct relationship)
    │
    │ Referenced by all LocalizedPages
    │ Single instance per resource type
    │
    └─→ Accessed via relative paths from subdirectories

Redirect (1) ────── (1) Page
    │
    │ Legacy path maps to French LocalizedPage
    │ Maintains SEO value and avoids 404s
    │
    └─→ targetPath always points to French version
```

---

## Navigation Configuration Data Structure

The `header.js` file contains a centralized configuration object that maps page IDs to localized titles and URLs:

```javascript
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
```

This structure serves as the single source of truth for:
- Navigation menu generation
- Page title localization
- URL routing within each language

---

## Validation Rules

### LocalizedPage Validation

1. **Meta Description Length**: 150-160 characters
2. **Language Code**: Must be valid ISO 639-1 (`fr` or `en`)
3. **Path Structure**: Must follow pattern `/{LANG}/{filename}.html`
4. **Bidirectional hreflang**: Both language versions must reference each other
5. **Canonical URL**: Should point to self (no redirects)
6. **HTML Lang Attribute**: Must match language code

### PageMapping Validation

1. **Unique Page IDs**: No duplicate pageId values
2. **Filename Consistency**: French and English filenames must be distinct (except "contact.html")
3. **Legacy Path Uniqueness**: No two pages can have same legacy path

### Redirect Validation

1. **Target Exists**: Target path must point to existing French LocalizedPage
2. **No Redirect Chains**: Legacy → French (no intermediate redirects)
3. **Canonical Match**: Target page canonical URL matches redirect target

---

## State Transitions

Since this is a static site, there are no runtime state transitions. However, the migration process has states:

### Migration States

1. **Pre-Migration**: All pages at root level, no language directories
2. **In-Progress**: Language directories created, pages being migrated
3. **Migrated**: All pages in language directories, redirects in place
4. **Legacy Cleanup**: Optional removal of redirect pages after 12+ months

**Current State**: Pre-Migration  
**Target State**: Migrated (with active redirects)

---

## Summary

This data model defines:
- **2 Languages**: French (default) and English
- **6 Page Types**: home, birthdays, contact, shows, characters, workshops
- **12 LocalizedPages**: 6 pages × 2 languages
- **5 Redirects**: Legacy root URLs → French versions
- **6 SharedResources**: CSS, JS, favicon, and external CDN resources

All entities support the functional requirements defined in `spec.md` and implement the research decisions from `research.md`.
