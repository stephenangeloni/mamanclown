# Implementation Plan: Multilingual Website Support

**Branch**: `002-multilingual` | **Date**: November 16, 2025 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-multilingual/spec.md`

## Summary

Restructure the Maman Clown website to support English and French languages by organizing pages into language-specific directories (`/EN/` and `/FR/`), translating all content and metadata, and implementing redirects from legacy root URLs to the French (default) language versions. This enables French-speaking families in Monaco/Monte-Carlo and English-speaking expatriates to access fully localized content optimized for search engine discovery in both languages.

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES6+)  
**Primary Dependencies**: None (static HTML site with shared CSS/JS assets)  
**Storage**: N/A (static files served directly)  
**Testing**: Manual browser testing (Safari iOS 15+, Chrome Android, Desktop browsers)  
**Target Platform**: Static web hosting (GitHub Pages via `.github/workflows/static.yml`)  
**Project Type**: Static website with multi-page navigation  
**Performance Goals**: <2 seconds page load on 3G connections (per Constitution Principle II)  
**Constraints**: 
  - ImageKit CDN transformations must work from subdirectories
  - Relative paths for CSS/JS must resolve correctly from subdirectories
  - SEO meta tags mandatory (150-160 char descriptions with Monaco/Monte-Carlo keywords)
  - hreflang tags required for cross-language page relationships
**Scale/Scope**: 12 total pages (6 French + 6 English), 2 languages, ~5 existing pages to migrate + 1 new page type to create

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Simplicity First
- **Status**: PASS
- **Rationale**: Solution uses directory structure and HTML duplication—no frameworks, build tools, or complexity. Static files remain independently deployable. Internationalization via simple directory organization aligns with "Plain HTML, CSS, and vanilla JavaScript are preferred."

### ✅ Principle II: User Experience
- **Status**: PASS
- **Rationale**: French-speaking parents (primary audience) and English-speaking expatriates get native-language content without barriers. Contact methods remain instantly accessible. No broken links after redirect implementation. Page load performance maintained (static files, same ImageKit CDN).

### ✅ Principle III: Performance & Accessibility
- **Status**: PASS with conditions
- **Rationale**: Static pages maintain <2s load time. ImageKit CDN works from subdirectories with relative paths (`../images/` or absolute URLs). SEO meta tags mandatory in both languages. hreflang tags required for search engine language discovery.
- **Conditions to verify in Phase 0**:
  - Confirm ImageKit CDN URLs work from `/FR/` and `/EN/` subdirectories
  - Verify hreflang tag implementation best practices for static sites
  - Document meta tag translation requirements (150-160 chars, Monaco/Monte-Carlo keywords in both languages)

### ✅ Principle IV: Visual Consistency
- **Status**: PASS
- **Rationale**: Visual design unchanged. Rainbow styling, centered layout, joyful aesthetic preserved across all language versions. CSS and design assets shared between languages.

### ✅ Principle V: Mobile-First Design
- **Status**: PASS
- **Rationale**: Mobile functionality unaffected. Touch targets, responsive layouts, tap-to-call/email maintained. Navigation from language subdirectories works identically to current root-level navigation.

### Constitution Compliance Summary
**Overall Status**: ✅ PASS - No violations detected. Feature aligns with all five principles. Static HTML approach maintains simplicity while expanding accessibility to bilingual audience.

## Project Structure

### Documentation (this feature)

```text
specs/002-multilingual/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - redirect mechanisms, hreflang, path resolution
├── data-model.md        # Phase 1 output - page mappings and translation structure
├── quickstart.md        # Phase 1 output - developer guide for adding new languages/pages
├── contracts/           # Phase 1 output - not applicable (no APIs)
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec validation checklist (completed)
└── spec.md              # Feature specification (input to this plan)
```

### Source Code (repository root)

```text
# Current structure (root level)
/
├── .github/
│   └── workflows/
│       └── static.yml       # GitHub Pages deployment (no changes needed)
├── .specify/                # SpecKit workflow files (no changes needed)
├── images/                  # May remain at root or be relocated (research needed)
│   └── mamanclown.webp
├── specs/                   # Feature documentation (no changes to code)
├── index.html               # MIGRATE → /FR/accueil.html + /EN/home.html
├── birthdays.html           # MIGRATE → /FR/anniversaire.html + /EN/birthday-party.html
├── contact.html             # MIGRATE → /FR/contact.html + /EN/contact.html
├── shows.html               # MIGRATE → /FR/spectacles.html + /EN/shows.html
├── characters.html          # MIGRATE → /FR/personnages.html + /EN/characters.html
├── header.css               # SHARED - no changes needed (accessible from subdirs)
├── header.js                # UPDATE - modify page URLs for language dirs
└── favicon.svg              # SHARED - no changes needed

# New structure (after implementation)
/
├── EN/                      # English language directory
│   ├── home.html            # Translated from index.html
│   ├── birthday-party.html  # Translated from birthdays.html
│   ├── contact.html         # Translated content, EN metadata
│   ├── shows.html           # Translated content, EN metadata
│   ├── characters.html      # Translated content, EN metadata
│   └── workshops.html       # NEW page - English version
├── FR/                      # French language directory
│   ├── accueil.html         # Migrated from index.html with FR metadata
│   ├── anniversaire.html    # Migrated from birthdays.html
│   ├── contact.html         # Migrated with FR metadata
│   ├── spectacles.html      # Migrated from shows.html
│   ├── personnages.html     # Migrated from characters.html
│   └── ateliers.html        # NEW page - French version
├── header.css               # SHARED (accessed via ../header.css)
├── header.js                # UPDATED (page configs per language)
├── favicon.svg              # SHARED (accessed via ../favicon.svg)
├── .htaccess OR _redirects  # CREATED - 301 redirects for legacy URLs
└── [root legacy files]      # DEPRECATED - redirect to /FR/ equivalents
```

**Structure Decision**: Static HTML with language subdirectories. Shared assets (CSS, JS, images, favicon) remain at root level and are referenced relatively (`../header.css`) from language subdirectories. No build process or asset duplication required. Redirects handled via `.htaccess` (Apache) or `_redirects` (Netlify/Cloudflare Pages) or meta refresh fallback in legacy HTML files if static host doesn't support redirects.

## Complexity Tracking

> No Constitution violations detected. This section remains empty.

---

## Phase 0: Outline & Research

### Research Tasks

The following unknowns from Technical Context require investigation:

#### RT-001: Redirect Implementation for Static Sites
- **Unknown**: Which redirect mechanism works with GitHub Pages static hosting?
- **Research needed**: 
  - GitHub Pages redirect support (meta refresh, client-side JS, or requires DNS/hosting change)
  - `.htaccess` support (Apache-based hosts)
  - `_redirects` file support (Netlify, Cloudflare Pages)
  - Meta refresh fallback approach
  - SEO implications of each method (301 permanent redirect preferred)
- **Decision required**: Concrete redirect implementation approach for the current hosting environment

#### RT-002: hreflang Tag Implementation
- **Unknown**: Best practices for hreflang tags on static HTML sites with language subdirectories
- **Research needed**:
  - hreflang syntax for bidirectional language links (`<link rel="alternate" hreflang="en" href="/EN/page.html">`)
  - Should tags be in `<head>` of every page or centralized?
  - Google Search Console validation requirements
  - x-default language designation (should `/` redirect to FR as default?)
- **Decision required**: hreflang tag structure template for all pages

#### RT-003: Resource Path Resolution from Subdirectories
- **Unknown**: Confirm relative paths for CSS, JS, images work correctly from `/EN/` and `/FR/` subdirectories
- **Research needed**:
  - Verify `<link rel="stylesheet" href="../header.css">` works from subdirs
  - Verify `<script src="../header.js">` works from subdirs
  - Verify ImageKit CDN URLs remain absolute (no path change needed)
  - Verify favicon path resolution: `<link rel="icon" href="../favicon.svg">`
  - Test font preconnect URLs (absolute, no change needed)
- **Decision required**: Path patterns to use in language subdirectory pages

#### RT-004: Navigation Menu Language Awareness
- **Unknown**: How to make `header.js` language-aware without duplication
- **Research needed**:
  - Should `header.js` detect language from URL path?
  - Should pages pass language context via data attribute (`data-lang="fr"`)?
  - How to build menu links with correct language directory prefix?
  - Page configuration: single shared config vs. per-language configs
- **Decision required**: Approach for language-aware navigation in shared JavaScript

#### RT-005: Meta Tag Translation Patterns
- **Unknown**: Concrete translation requirements for SEO meta tags in both languages
- **Research needed**:
  - French meta description keywords (anniversaire, spectacle, Monaco, Monte-Carlo, enfants, Côte d'Azur)
  - English meta description keywords (birthday party, show, children, entertainment)
  - Character count validation (150-160 chars)
  - Open Graph image URLs (absolute or relative from subdir?)
  - Twitter Card tag requirements
- **Decision required**: Meta tag templates with translation placeholders for both languages

#### RT-006: Content Translation Scope
- **Unknown**: Full list of translatable content elements beyond visible text
- **Research needed**:
  - Button labels (e.g., "Ajouter aux contacts" vs. "Add to contacts")
  - Aria labels for accessibility (`aria-label="Menu"` vs. `aria-label="Menu"`)
  - vCard download filenames (`maman_clown.vcf` - keep or translate?)
  - Email subject lines in mailto: links
  - Alt text for all images (logo, hero image, character images if applicable)
- **Decision required**: Comprehensive translation checklist

### Research Output

**Output Artifact**: `research.md` containing:
- Decision for each research task
- Rationale for chosen approach
- Alternatives considered and why rejected
- Code examples or configuration templates
- References to documentation or best practices sources

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all RT-001 through RT-006 resolved

### Data Model

**Artifact**: `data-model.md`

Although this is a static HTML site with no backend database, document the logical data model:

#### Entity: Language Directory
- **Attributes**:
  - `code`: Two-letter language code (EN, FR)
  - `path`: URL path prefix (`/EN/`, `/FR/`)
  - `defaultLanguage`: Boolean (FR is default)
  - `hreflangCode`: Language code for hreflang tags (`en`, `fr`)

#### Entity: Localized Page
- **Attributes**:
  - `languageCode`: Associated language (EN or FR)
  - `filename`: Language-specific filename (e.g., `accueil.html` for FR Home, `home.html` for EN Home)
  - `pageTitle`: Browser title bar text in language
  - `headerTitle`: Header `<h1>` text in language
  - `metaDescription`: SEO description (150-160 chars, includes Monaco/Monte-Carlo keywords)
  - `openGraphTitle`: Social sharing title
  - `openGraphDescription`: Social sharing description
  - `twitterCardTitle`: Twitter card title
  - `twitterCardDescription`: Twitter card description
  - `imageAltText`: Array of image alt attributes in language
  - `contentText`: All visible page text in language
  - `buttonLabels`: Interactive element labels in language

#### Entity: Page Mapping
- **Attributes**:
  - `pageId`: Unique identifier (e.g., `home`, `birthdays`, `contact`)
  - `frenchFilename`: French page filename (e.g., `accueil.html`)
  - `englishFilename`: English page filename (e.g., `home.html`)
  - `legacyFilename`: Root-level filename for redirects (e.g., `index.html`)

**Page Mapping Table**:

| Page ID      | Legacy File       | French File (FR/)  | English File (EN/)     |
|--------------|-------------------|--------------------|------------------------|
| home         | index.html        | accueil.html       | home.html              |
| birthdays    | birthdays.html    | anniversaire.html  | birthday-party.html    |
| contact      | contact.html      | contact.html       | contact.html           |
| shows        | shows.html        | spectacles.html    | shows.html             |
| characters   | characters.html   | personnages.html   | characters.html        |
| workshops    | (new)             | ateliers.html      | workshops.html         |

### API Contracts

**Artifact**: `contracts/` directory

Not applicable for this feature. This is a static HTML site with no backend APIs. All "contracts" are document structure contracts (HTML templates, meta tag patterns) documented in `data-model.md` and `quickstart.md`.

### Developer Quickstart

**Artifact**: `quickstart.md`

Document developer workflow for:
1. Adding a new page in both languages
2. Updating existing page translations
3. Testing language-specific pages locally
4. Validating hreflang tags and redirects
5. Checking meta tag translations
6. Running manual browser tests per Constitution Review Gates

### Agent Context Update

After Phase 1 design completion, update agent context:

```bash
.specify/scripts/bash/update-agent-context.sh opencode
```

This will:
- Detect OpenCode agent in use
- Update `.opencode/context.md` (or equivalent agent file)
- Add multilingual architecture details (language directories, page mappings)
- Preserve any manual additions between markers

---

## Phase 2: Task Breakdown (Not Generated by /speckit.plan)

**Note**: Phase 2 (task generation) is handled by the `/speckit.tasks` command, which is NOT part of this plan command. The plan command stops after Phase 1.

The tasks will be generated in `tasks.md` when `/speckit.tasks` is executed, based on:
- Functional requirements from `spec.md`
- Research decisions from `research.md`
- Data model from `data-model.md`
- Developer workflow from `quickstart.md`

Expected task categories (preview):
1. **Setup & Preparation**: Create directory structure, backup existing files
2. **French Pages (Priority 1)**: Migrate 5 existing pages + create 1 new page (Ateliers)
3. **English Pages (Priority 2)**: Translate and create 6 English pages
4. **Shared Asset Updates**: Update `header.js` for language awareness
5. **Redirects**: Implement legacy URL redirects to French versions
6. **SEO & Metadata**: Add hreflang tags, validate meta descriptions
7. **Testing**: Manual browser testing per Constitution Review Gates
8. **Documentation**: Update README if applicable

---

## Notes

- **No backend required**: This is pure frontend restructuring with static HTML
- **No build process**: HTML files are hand-authored and directly deployed
- **Translation responsibility**: Assumes content translations are provided or already exist in current pages (most current pages already have French content)
- **Hosting agnostic**: Solution works with any static hosting (GitHub Pages, Netlify, Cloudflare Pages, Apache)
- **Backwards compatibility**: Legacy URLs redirect to French (default language) to maintain SEO value and avoid broken bookmarks
