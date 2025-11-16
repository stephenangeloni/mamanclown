# Feature Specification: Multilingual Website Support

**Feature Branch**: `002-multilingual`  
**Created**: November 16, 2025  
**Status**: Draft  
**Input**: User description: "I want the website to be multilingual. We'll start with english and french. The page language will have the name of the page in the language itself and all the pages in a given language must be beneath a directory corresponding to the language such as EN and FR. the meta data of the pages, the alt of image, everything will be in the corresponding language. There are existing pages and they will need to be moved and renamed according to the following pages which are the french followed by english name of the pages Home, Accueil
Birthday Party, Anniversaire
Contact, Contact
Shows, Spectacles
Characters, Personnages
Ateliers, workshops"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - French Visitor Accessing Native Content (Priority: P1)

A French-speaking parent visits the website to book a birthday party and expects to see all content in French without having to translate or navigate through language barriers.

**Why this priority**: This is the most critical user journey as the primary audience (Monaco/Monte-Carlo) is French-speaking. The entire site must be accessible in French with proper metadata, page titles, and image descriptions for a complete native experience.

**Independent Test**: Can be fully tested by navigating to any FR page URL (e.g., `/FR/anniversaire.html`) and verifying that all visible text, metadata, image alt attributes, and page titles are in French. Delivers immediate value by making the site fully accessible to French speakers.

**Acceptance Scenarios**:

1. **Given** a French-speaking visitor arrives at the website, **When** they navigate to `/FR/accueil.html`, **Then** they see the homepage with all content in French including page title "Accueil", metadata descriptions in French, and image alt text in French
2. **Given** a visitor is on the French birthday party page `/FR/anniversaire.html`, **When** they view the page source, **Then** the HTML lang attribute is "fr" and all meta tags are in French
3. **Given** a visitor navigates through multiple French pages, **When** they check the browser title bar, **Then** each page displays its French page name (Accueil, Anniversaire, Contact, Spectacles, Personnages, Ateliers)

---

### User Story 2 - English Visitor Accessing Native Content (Priority: P2)

An English-speaking expatriate or tourist in Monaco wants to learn about the entertainment services and needs to access all information in English.

**Why this priority**: Secondary but essential for the international audience in Monaco. Ensures the business can serve English-speaking clients without language barriers.

**Independent Test**: Can be fully tested by navigating to any EN page URL (e.g., `/EN/birthday-party.html`) and verifying that all content is in English. Delivers value by opening the business to English-speaking customers.

**Acceptance Scenarios**:

1. **Given** an English-speaking visitor arrives at the website, **When** they navigate to `/EN/home.html`, **Then** they see the homepage with all content in English including page title "Home", metadata descriptions in English, and image alt text in English
2. **Given** a visitor is on the English workshops page `/EN/workshops.html`, **When** they view the page source, **Then** the HTML lang attribute is "en" and all meta tags are in English
3. **Given** a visitor browses the English character gallery, **When** they hover over images, **Then** they see English alt text describing each character

---

### User Story 3 - Search Engine Discovery by Language (Priority: P3)

A parent searches Google in French for "anniversaire enfants Monaco" or in English for "children birthday party Monaco" and finds the appropriate language version of the site.

**Why this priority**: Essential for organic discovery and SEO. Proper language structure and metadata ensure search engines index and present the correct language version to users based on their search language.

**Independent Test**: Can be tested by verifying that each language directory contains proper hreflang tags, language-specific URLs, and localized metadata that search engines can index. Delivers value by improving discoverability in both languages.

**Acceptance Scenarios**:

1. **Given** a search engine crawler accesses `/FR/anniversaire.html`, **When** it parses the page metadata, **Then** it finds French language indicators (lang="fr", French meta descriptions, French Open Graph tags)
2. **Given** a search engine crawler accesses `/EN/birthday-party.html`, **When** it parses the page metadata, **Then** it finds English language indicators (lang="en", English meta descriptions, English Open Graph tags)
3. **Given** both language versions exist for the same content, **When** a crawler accesses either version, **Then** it finds hreflang link tags indicating alternate language versions

---

### Edge Cases

- What happens when a user directly accesses a root-level page (e.g., `/index.html`)? Root URLs redirect to French version (default language) using permanent redirects (HTTP 301), maintaining SEO value while directing existing French-speaking audience to appropriate content
- How does the system handle internal links between pages within the same language directory? Links must be updated to reflect the new directory structure (e.g., `contact.html` becomes `../FR/contact.html` or `/FR/contact.html`)
- What happens when a visitor bookmarks an old page URL? Links will break unless redirects are implemented from old URLs to new language-specific URLs
- How does the navigation menu reflect the language structure? The menu should link to pages within the same language directory to maintain language consistency

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST organize all pages into language-specific directories named `/EN/` for English and `/FR/` for French
- **FR-002**: System MUST use language-specific filenames where the filename matches the page name in that language (e.g., `accueil.html` for French Home, `home.html` for English Home)
- **FR-003**: Each page MUST have its HTML lang attribute set to the appropriate language code ("en" for English, "fr" for French)
- **FR-004**: Each page MUST have all metadata (title, description, Open Graph tags, Twitter Card tags) in the corresponding language
- **FR-005**: All images MUST have alt attributes translated to the corresponding page language
- **FR-006**: Page header/title displays MUST show the page name in the corresponding language (e.g., "Accueil" on French pages, "Home" on English pages)
- **FR-007**: Navigation menus MUST link to pages within the same language directory to maintain language consistency throughout user sessions
- **FR-008**: Existing pages MUST be migrated from root directory to appropriate language directories according to the mapping:
  - `index.html` → `/FR/accueil.html` and `/EN/home.html`
  - `birthdays.html` → `/FR/anniversaire.html` and `/EN/birthday-party.html`
  - `contact.html` → `/FR/contact.html` and `/EN/contact.html`
  - `shows.html` → `/FR/spectacles.html` and `/EN/shows.html`
  - `characters.html` → `/FR/personnages.html` and `/EN/characters.html`
  - Create new: `/FR/ateliers.html` and `/EN/workshops.html`
- **FR-009**: All page content (text, buttons, labels, error messages) MUST be translated to the corresponding language
- **FR-010**: External links and shared resources (CSS, JS, images) MUST be accessible from both language directories
- **FR-011**: Root-level URLs MUST redirect to French language versions using permanent redirects (e.g., `/index.html` → `/FR/accueil.html`, `/birthdays.html` → `/FR/anniversaire.html`)

### Key Entities

- **Language Directory**: Represents a collection of pages in a single language, identified by two-letter code (EN, FR). Contains all pages for that language with translated filenames and content.
- **Localized Page**: A page instance in a specific language. Attributes include: language code, localized filename, localized page title, localized metadata, localized content, localized image alt text.
- **Page Mapping**: The relationship between equivalent pages across languages. Maps French page names to English equivalents (e.g., Accueil ↔ Home, Anniversaire ↔ Birthday Party).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: French-speaking visitors can access all site content in French with 100% of text, metadata, and image descriptions translated
- **SC-002**: English-speaking visitors can access all site content in English with 100% of text, metadata, and image descriptions translated
- **SC-003**: Search engines can properly index both language versions with correct language indicators in metadata (verified by checking indexed pages have correct lang attributes and localized content)
- **SC-004**: Users can navigate an entire session within one language without encountering content in the other language (except for cases where language switching is explicitly implemented)
- **SC-005**: All 6 page types exist in both languages with proper translations and structure (12 total pages: 6 FR + 6 EN)

## Assumptions

- The default language for the Monaco/Monte-Carlo audience is French, as indicated by existing content
- Users will access language-specific URLs directly or through language selection (language switching mechanism details are out of scope for this specification)
- Shared assets (CSS, JavaScript, images) can be referenced from language subdirectories without requiring duplication
- The website currently has 5 existing pages that need migration, plus 1 new page type (Workshops/Ateliers) to be created
- All content translations will be provided or are already available in the existing pages
- URL structure change is acceptable (existing bookmarks and external links may break without redirect implementation)
