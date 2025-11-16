# Tasks: Multilingual Website Support

**Input**: Design documents from `/specs/002-multilingual/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Manual browser testing per Constitution Review Gates (no automated tests)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Static HTML site at repository root - all pages directly in language subdirectories (`/FR/`, `/EN/`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and backup existing files

- [x] T001 Create `/FR/` directory for French pages
- [x] T002 Create `/EN/` directory for English pages
- [x] T003 [P] Backup existing root-level HTML files (index.html, birthdays.html, contact.html, shows.html, characters.html) to `/backup/` directory for reference

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update shared JavaScript navigation to support language awareness

**⚠️ CRITICAL**: This must be complete before any user story pages can work properly

- [x] T004 Update `/header.js` with language detection function (detectLanguage() that checks data-lang attribute and URL path)
- [x] T005 Update `/header.js` with centralized pageConfigs object mapping page IDs to French/English titles and URLs per research.md RT-004
- [x] T006 Update `/header.js` buildPagesForLanguage() function to generate language-specific navigation menus
- [x] T007 Test header.js language detection works correctly (verify menu builds for FR and EN)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - French Visitor Accessing Native Content (Priority: P1) 🎯 MVP

**Goal**: French-speaking parents can access all site content in French with proper metadata, page titles, and image descriptions for a complete native experience

**Independent Test**: Navigate to any FR page URL (e.g., `/FR/anniversaire.html`) and verify all visible text, metadata, image alt attributes, and page titles are in French. Check browser title bar displays French page names (Accueil, Anniversaire, Contact, Spectacles, Personnages, Ateliers).

### Implementation for User Story 1

#### French Home Page (Accueil)

- [x] T008 [P] [US1] Create `/FR/accueil.html` by migrating content from `/index.html` with French metadata (meta description: "Maman Clown - Spectacles captivants pour enfants 2-8 ans à Monaco. Anniversaires magiques et inoubliables. Divertissement professionnel à Monte-Carlo.")
- [x] T009 [US1] Add hreflang tags to `/FR/accueil.html` (fr, en, x-default pointing to FR) per research.md RT-002
- [x] T010 [US1] Update `/FR/accueil.html` resource paths to use relative paths (../header.css, ../header.js, ../favicon.svg) per research.md RT-003
- [x] T011 [US1] Add data attributes to `/FR/accueil.html` body tag (data-page="home" data-lang="fr")
- [x] T012 [US1] Update `/FR/accueil.html` page title to "Accueil" in header h1 element
- [x] T013 [US1] Verify `/FR/accueil.html` image alt text is in French (logo: "Maman Clown", hero: "Maman Clown")

#### French Birthdays Page (Anniversaire)

- [x] T014 [P] [US1] Create `/FR/anniversaire.html` by migrating content from `/birthdays.html` with French metadata (meta description: "Anniversaires magiques avec Maman Clown à Monaco et Monte-Carlo. Spectacles interactifs pour enfants 2-8 ans. Réservez maintenant pour une fête inoubliable!")
- [x] T015 [US1] Add hreflang tags to `/FR/anniversaire.html` (fr, en, x-default) with absolute URLs
- [x] T016 [US1] Update `/FR/anniversaire.html` resource paths to use relative paths (../header.css, ../header.js, ../favicon.svg)
- [x] T017 [US1] Add data attributes to `/FR/anniversaire.html` body tag (data-page="birthdays" data-lang="fr")
- [x] T018 [US1] Update `/FR/anniversaire.html` page title to "Anniversaire" in header h1 element
- [x] T019 [US1] Update `/FR/anniversaire.html` button labels and link text to French

#### French Contact Page

- [x] T020 [P] [US1] Create `/FR/contact.html` by migrating content from `/contact.html` with French metadata (meta description: "Contactez Maman Clown pour anniversaires et spectacles à Monaco Monte-Carlo. Téléphone, email, réseaux sociaux. Réponse rapide garantie!")
- [x] T021 [US1] Add hreflang tags to `/FR/contact.html` (fr, en, x-default) with absolute URLs
- [x] T022 [US1] Update `/FR/contact.html` resource paths to use relative paths
- [x] T023 [US1] Add data attributes to `/FR/contact.html` body tag (data-page="contact" data-lang="fr")
- [x] T024 [US1] Update `/FR/contact.html` page title to "Contact" in header h1 element
- [x] T025 [US1] Update `/FR/contact.html` email subject line in mailto: link to French (subject=Demande%20de%20réservation%20Maman%20Clown)

#### French Shows Page (Spectacles)

- [x] T026 [P] [US1] Create `/FR/spectacles.html` by migrating content from `/shows.html` with French metadata (meta description including Monaco/Monte-Carlo keywords)
- [x] T027 [US1] Add hreflang tags to `/FR/spectacles.html` (fr, en, x-default) with absolute URLs
- [x] T028 [US1] Update `/FR/spectacles.html` resource paths to use relative paths
- [x] T029 [US1] Add data attributes to `/FR/spectacles.html` body tag (data-page="shows" data-lang="fr")
- [x] T030 [US1] Update `/FR/spectacles.html` page title to "Spectacles" in header h1 element

#### French Characters Page (Personnages)

- [x] T031 [P] [US1] Create `/FR/personnages.html` by migrating content from `/characters.html` with French metadata (meta description including Monaco/Monte-Carlo keywords)
- [x] T032 [US1] Add hreflang tags to `/FR/personnages.html` (fr, en, x-default) with absolute URLs
- [x] T033 [US1] Update `/FR/personnages.html` resource paths to use relative paths
- [x] T034 [US1] Add data attributes to `/FR/personnages.html` body tag (data-page="characters" data-lang="fr")
- [x] T035 [US1] Update `/FR/personnages.html` page title to "Personnages" in header h1 element

#### French Workshops Page (Ateliers) - NEW PAGE

- [x] T036 [P] [US1] Create `/FR/ateliers.html` as new page with French content and metadata (meta description including Monaco/Monte-Carlo keywords)
- [x] T037 [US1] Add hreflang tags to `/FR/ateliers.html` (fr, en, x-default) with absolute URLs
- [x] T038 [US1] Add resource paths to `/FR/ateliers.html` using relative paths (../header.css, ../header.js, ../favicon.svg)
- [x] T039 [US1] Add data attributes to `/FR/ateliers.html` body tag (data-page="workshops" data-lang="fr")
- [x] T040 [US1] Add page structure to `/FR/ateliers.html` with header h1 "Ateliers", navigation menu, and main content
- [x] T041 [US1] Add Open Graph and Twitter Card tags to `/FR/ateliers.html` with French descriptions

#### Manual Testing for User Story 1

- [x] T042 [US1] Test `/FR/accueil.html` in browser - verify French content, navigation menu shows French page names, all links work
- [x] T043 [US1] Test `/FR/anniversaire.html` in browser - verify HTML lang="fr", meta tags in French, navigation stays in /FR/ directory
- [x] T044 [US1] Test all 6 French pages navigation flow - click through menu links, verify no cross-language navigation
- [x] T045 [US1] Test `/FR/` pages on mobile Safari iOS - verify responsive layout, touch targets, tap-to-call/email work
- [x] T046 [US1] Test browser title bar displays correct French names for all 6 pages (Accueil, Anniversaire, Contact, Spectacles, Personnages, Ateliers)

**Checkpoint**: At this point, User Story 1 should be fully functional - all French pages accessible with proper metadata and navigation

---

## Phase 4: User Story 2 - English Visitor Accessing Native Content (Priority: P2)

**Goal**: English-speaking expatriates and tourists can access all site content in English with proper translations and metadata

**Independent Test**: Navigate to any EN page URL (e.g., `/EN/birthday-party.html`) and verify all content is in English. Check browser title bar displays English page names (Home, Birthday Party, Contact, Shows, Characters, Workshops).

### Implementation for User Story 2

#### English Home Page

- [ ] T047 [P] [US2] Create `/EN/home.html` with English translation of index.html content and English metadata (meta description: "Maman Clown - Captivating children's entertainment ages 2-8 in Monaco. Magical unforgettable birthday parties. Professional shows in Monte-Carlo.")
- [ ] T048 [US2] Add hreflang tags to `/EN/home.html` (fr, en, x-default) with absolute URLs - IDENTICAL to French version
- [ ] T049 [US2] Add resource paths to `/EN/home.html` using relative paths (../header.css, ../header.js, ../favicon.svg)
- [ ] T050 [US2] Add data attributes to `/EN/home.html` body tag (data-page="home" data-lang="en")
- [ ] T051 [US2] Update `/EN/home.html` page title to "Home" in header h1 element
- [ ] T052 [US2] Update `/EN/home.html` image alt text to English (logo: "Maman Clown", hero: "Maman Clown")
- [ ] T053 [US2] Update `/EN/home.html` button labels to English (e.g., "Add to contacts")

#### English Birthday Party Page

- [ ] T054 [P] [US2] Create `/EN/birthday-party.html` with English translation and metadata (meta description: "Magical birthday parties with Maman Clown in Monaco and Monte-Carlo. Interactive shows for children ages 2-8. Book now for unforgettable celebration!")
- [ ] T055 [US2] Add hreflang tags to `/EN/birthday-party.html` (fr, en, x-default) - IDENTICAL to French anniversaire.html
- [ ] T056 [US2] Add resource paths to `/EN/birthday-party.html` using relative paths
- [ ] T057 [US2] Add data attributes to `/EN/birthday-party.html` body tag (data-page="birthdays" data-lang="en")
- [ ] T058 [US2] Update `/EN/birthday-party.html` page title to "Birthday Party" in header h1 element
- [ ] T059 [US2] Update `/EN/birthday-party.html` all text content to English including button labels

#### English Contact Page

- [ ] T060 [P] [US2] Create `/EN/contact.html` with English translation and metadata (meta description including Monaco keywords in English)
- [ ] T061 [US2] Add hreflang tags to `/EN/contact.html` (fr, en, x-default) - IDENTICAL to French contact.html
- [ ] T062 [US2] Add resource paths to `/EN/contact.html` using relative paths
- [ ] T063 [US2] Add data attributes to `/EN/contact.html` body tag (data-page="contact" data-lang="en")
- [ ] T064 [US2] Update `/EN/contact.html` page title to "Contact" in header h1 element
- [ ] T065 [US2] Update `/EN/contact.html` email subject line in mailto: link to English (subject=Booking%20Request%20Maman%20Clown)

#### English Shows Page

- [ ] T066 [P] [US2] Create `/EN/shows.html` with English translation and metadata (meta description including Monaco/Monte-Carlo keywords in English)
- [ ] T067 [US2] Add hreflang tags to `/EN/shows.html` (fr, en, x-default) - IDENTICAL to French spectacles.html
- [ ] T068 [US2] Add resource paths to `/EN/shows.html` using relative paths
- [ ] T069 [US2] Add data attributes to `/EN/shows.html` body tag (data-page="shows" data-lang="en")
- [ ] T070 [US2] Update `/EN/shows.html` page title to "Shows" in header h1 element

#### English Characters Page

- [ ] T071 [P] [US2] Create `/EN/characters.html` with English translation and metadata (meta description including Monaco keywords in English)
- [ ] T072 [US2] Add hreflang tags to `/EN/characters.html` (fr, en, x-default) - IDENTICAL to French personnages.html
- [ ] T073 [US2] Add resource paths to `/EN/characters.html` using relative paths
- [ ] T074 [US2] Add data attributes to `/EN/characters.html` body tag (data-page="characters" data-lang="en")
- [ ] T075 [US2] Update `/EN/characters.html` page title to "Characters" in header h1 element

#### English Workshops Page - NEW PAGE

- [ ] T076 [P] [US2] Create `/EN/workshops.html` as new page with English content and metadata (meta description including Monaco keywords in English)
- [ ] T077 [US2] Add hreflang tags to `/EN/workshops.html` (fr, en, x-default) - IDENTICAL to French ateliers.html
- [ ] T078 [US2] Add resource paths to `/EN/workshops.html` using relative paths
- [ ] T079 [US2] Add data attributes to `/EN/workshops.html` body tag (data-page="workshops" data-lang="en")
- [ ] T080 [US2] Add page structure to `/EN/workshops.html` with header h1 "Workshops", navigation menu, and main content
- [ ] T081 [US2] Add Open Graph and Twitter Card tags to `/EN/workshops.html` with English descriptions

#### Manual Testing for User Story 2

- [ ] T082 [US2] Test `/EN/home.html` in browser - verify English content, navigation menu shows English page names, all links work
- [ ] T083 [US2] Test `/EN/birthday-party.html` in browser - verify HTML lang="en", meta tags in English, navigation stays in /EN/ directory
- [ ] T084 [US2] Test all 6 English pages navigation flow - click through menu links, verify no cross-language navigation
- [ ] T085 [US2] Test `/EN/` pages on mobile Chrome Android - verify responsive layout, touch targets work
- [ ] T086 [US2] Test browser title bar displays correct English names for all 6 pages (Home, Birthday Party, Contact, Shows, Characters, Workshops)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - French and English visitors can navigate complete site in their language

---

## Phase 5: User Story 3 - Search Engine Discovery by Language (Priority: P3)

**Goal**: Search engines can properly index both language versions with correct language indicators, enabling users to find the appropriate language version based on their search language

**Independent Test**: Verify each language directory contains proper hreflang tags, language-specific URLs, and localized metadata. Use Google Search Console International Targeting report or third-party hreflang validator to confirm bidirectional tags are correct.

### Implementation for User Story 3

#### Legacy URL Redirects

- [ ] T087 [P] [US3] Create redirect page at `/index.html` with JavaScript redirect to `/FR/accueil.html` per research.md RT-001 (includes window.location.replace(), meta refresh fallback, noindex, canonical tag)
- [ ] T088 [P] [US3] Create redirect page at `/birthdays.html` with JavaScript redirect to `/FR/anniversaire.html`
- [ ] T089 [P] [US3] Create redirect page at `/contact.html` with JavaScript redirect to `/FR/contact.html`
- [ ] T090 [P] [US3] Create redirect page at `/shows.html` with JavaScript redirect to `/FR/spectacles.html`
- [ ] T091 [P] [US3] Create redirect page at `/characters.html` with JavaScript redirect to `/FR/personnages.html`

#### SEO Metadata Validation

- [ ] T092 [US3] Validate all French page meta descriptions are 150-160 characters with Monaco/Monte-Carlo keywords (check all 6 /FR/ pages)
- [ ] T093 [US3] Validate all English page meta descriptions are 150-160 characters with Monaco/Monte-Carlo keywords (check all 6 /EN/ pages)
- [ ] T094 [US3] Verify all 12 pages (6 FR + 6 EN) have Open Graph tags with correct language-specific URLs (og:url matches page URL)
- [ ] T095 [US3] Verify all 12 pages have Twitter Card tags with correct language-specific URLs

#### hreflang Bidirectionality Check

- [ ] T096 [US3] Verify hreflang tags are IDENTICAL on each page pair (FR/accueil.html and EN/home.html have same tags)
- [ ] T097 [US3] Verify x-default hreflang points to French version on all 12 pages
- [ ] T098 [US3] Verify all hreflang URLs are absolute (start with https://mamanclown.com/)
- [ ] T099 [US3] Verify self-referential hreflang tag present on all 12 pages

#### Manual SEO Testing

- [ ] T100 [US3] Test redirect pages work correctly - navigate to `/index.html` and verify instant redirect to `/FR/accueil.html`
- [ ] T101 [US3] Test all 5 legacy URLs redirect properly (index.html, birthdays.html, contact.html, shows.html, characters.html)
- [ ] T102 [US3] Use Facebook Sharing Debugger to validate Open Graph tags on 2-3 sample pages (FR and EN)
- [ ] T103 [US3] Use Twitter Card Validator to validate Twitter Card tags on 2-3 sample pages (FR and EN)
- [ ] T104 [US3] Use HTML validator (validator.w3.org) to validate markup on 2-3 sample pages from each language
- [ ] T105 [US3] Verify canonical tags point to self on all new language-specific pages (not to redirects)

**Checkpoint**: All user stories should now be independently functional - SEO optimized for bilingual discovery

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, performance testing, and documentation

#### Cross-Browser Testing

- [ ] T106 [P] Test all French pages on Safari Desktop (macOS) - verify rendering, fonts load, ImageKit CDN images display
- [ ] T107 [P] Test all English pages on Firefox Desktop - verify navigation, no console errors
- [ ] T108 [P] Test sample pages on Chrome Desktop - verify page load time <2 seconds on throttled 3G (DevTools Network tab)

#### Accessibility Testing

- [ ] T109 Test keyboard navigation on French pages - Tab through menu, Escape closes menu, focus trap works
- [ ] T110 Test screen reader on sample French page (VoiceOver on macOS or NVDA on Windows) - verify lang="fr" announced correctly
- [ ] T111 Test screen reader on sample English page - verify lang="en" announced correctly
- [ ] T112 Verify all interactive elements have proper aria-labels (hamburger menu aria-label="Menu")

#### Performance Validation

- [ ] T113 Test ImageKit CDN URLs work from subdirectories (verify hero images load on /FR/ and /EN/ pages)
- [ ] T114 Measure page load time on 3G throttled connection for 3 sample pages - must be <2 seconds per Constitution
- [ ] T115 Verify no console errors on any of the 12 pages across browsers
- [ ] T116 Check Network tab - verify header.css and header.js load without 404 errors from both /FR/ and /EN/ pages

#### Constitution Review Gates Validation

Per Constitution "Review Gates" section, verify:

- [ ] T117 All links work (phone, email, social, vCard download) on both French and English pages
- [ ] T118 All images load correctly via ImageKit CDN on both language versions
- [ ] T119 Page loads in under 2 seconds on 3G throttled connection (test 3 sample pages)
- [ ] T120 Interactions work on mobile devices - test tap targets, scroll, menu open/close on iPhone Safari
- [ ] T121 Visual consistency maintained - verify rainbow styling, centered layout, joyful aesthetic preserved across all 12 pages
- [ ] T122 No console errors in browser DevTools on any of the 12 pages
- [ ] T123 HTML validates on validator.w3.org for sample pages (2-3 pages from each language)
- [ ] T124 Meta descriptions present and accurate (150-160 chars) on all 12 pages
- [ ] T125 Open Graph and Twitter Card tags present on all 12 pages
- [ ] T126 ImageKit transformations working (WebP format, srcset, quality settings) - verify in Network tab

#### Documentation

- [ ] T127 Review quickstart.md developer guide is accurate for the implemented structure
- [ ] T128 Document any deviations from plan in implementation notes (if any)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (French pages) can proceed independently
  - User Story 2 (English pages) can proceed in parallel with US1
  - User Story 3 (SEO/redirects) depends on US1 and US2 pages existing
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 (parallel work possible)
- **User Story 3 (P3)**: Depends on US1 and US2 completion (needs pages to exist for redirects and hreflang validation)

### Within Each User Story

**User Story 1 (French Pages)**:
- T008-T013 (Accueil page) can run in parallel with T014-T019 (Anniversaire), T020-T025 (Contact), etc.
- Each page group is independent until testing phase
- Manual testing (T042-T046) must wait for all pages complete

**User Story 2 (English Pages)**:
- T047-T053 (Home page) can run in parallel with T054-T059 (Birthday Party), T060-T065 (Contact), etc.
- Each page group is independent until testing phase
- Manual testing (T082-T086) must wait for all pages complete

**User Story 3 (SEO)**:
- Redirect pages (T087-T091) can all run in parallel
- Validation tasks (T092-T099) depend on all pages from US1 and US2 existing
- Manual SEO testing (T100-T105) depends on redirects and pages complete

### Parallel Opportunities

#### Phase 1 (Setup)
- T001 and T002 can run in parallel (creating FR/ and EN/ directories)
- T003 backup can run in parallel with directory creation

#### Phase 2 (Foundational)
- All header.js updates (T004-T006) must be done sequentially (same file)
- T007 testing must wait for T004-T006

#### Phase 3 (User Story 1 - French Pages)
```bash
# All page creation tasks can launch together:
T008 (accueil.html) || T014 (anniversaire.html) || T020 (contact.html) || 
T026 (spectacles.html) || T031 (personnages.html) || T036 (ateliers.html)
```

#### Phase 4 (User Story 2 - English Pages)
```bash
# All page creation tasks can launch together:
T047 (home.html) || T054 (birthday-party.html) || T060 (contact.html) || 
T066 (shows.html) || T071 (characters.html) || T076 (workshops.html)
```

#### Phase 5 (User Story 3 - SEO)
```bash
# All redirect pages can launch together:
T087 (index.html) || T088 (birthdays.html) || T089 (contact.html) || 
T090 (shows.html) || T091 (characters.html)
```

#### Phase 6 (Polish)
```bash
# Cross-browser testing can run in parallel:
T106 (Safari) || T107 (Firefox) || T108 (Chrome)
```

---

## Parallel Example: User Story 1 (French Pages)

```bash
# Launch all French page creations together:
Task: "Create /FR/accueil.html by migrating content from /index.html with French metadata"
Task: "Create /FR/anniversaire.html by migrating content from /birthdays.html with French metadata"
Task: "Create /FR/contact.html by migrating content from /contact.html with French metadata"
Task: "Create /FR/spectacles.html by migrating content from /shows.html with French metadata"
Task: "Create /FR/personnages.html by migrating content from /characters.html with French metadata"
Task: "Create /FR/ateliers.html as new page with French content and metadata"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007) - CRITICAL for navigation
3. Complete Phase 3: User Story 1 (T008-T046) - All French pages
4. **STOP and VALIDATE**: Test French pages independently per T042-T046
5. Deploy French version - MVP ready for primary audience!

**MVP Delivers**: Complete French website accessible to Monaco/Monte-Carlo primary audience

### Incremental Delivery

1. **MVP (US1)**: French pages → Test → Deploy
   - Value: Primary French-speaking audience can access full site
2. **+US2**: Add English pages → Test → Deploy
   - Value: Expands to English-speaking expatriates/tourists
3. **+US3**: Add SEO/redirects → Test → Deploy
   - Value: Search engine discovery + legacy URL compatibility

### Parallel Team Strategy

With multiple developers:

1. **Together**: Complete Setup (Phase 1) + Foundational (Phase 2)
2. **Parallel Split** (after Foundational done):
   - **Developer A**: User Story 1 (T008-T046) - All French pages
   - **Developer B**: User Story 2 (T047-T086) - All English pages
   - **Developer C**: Can start on User Story 3 redirects once pages exist
3. **Convergence**: Phase 6 Polish together

**Timeline Estimate** (single developer):
- Phase 1-2: 2-4 hours
- Phase 3 (US1): 6-8 hours (6 pages with full metadata)
- Phase 4 (US2): 6-8 hours (6 translated pages)
- Phase 5 (US3): 3-4 hours (redirects + SEO validation)
- Phase 6: 2-3 hours (testing)
- **Total**: ~20-27 hours

---

## Task Summary

**Total Tasks**: 128

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (User Story 1 - French): 39 tasks (6 pages × ~6 tasks + testing)
- Phase 4 (User Story 2 - English): 40 tasks (6 pages × ~6 tasks + testing)
- Phase 5 (User Story 3 - SEO): 19 tasks (redirects + validation)
- Phase 6 (Polish): 23 tasks (testing + documentation)

**Parallelizable Tasks**: 36 marked with [P]

**Independent Test Criteria**:
- **US1**: Navigate to /FR/ pages, verify all French content
- **US2**: Navigate to /EN/ pages, verify all English content
- **US3**: Verify hreflang tags, test redirects, validate SEO metadata

**Suggested MVP Scope**: User Story 1 only (French pages) - delivers value to primary audience

---

## Notes

- [P] tasks = different files, no dependencies (can run in parallel)
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing is mandatory per Constitution (no automated tests required for static HTML)
- Commit after each page or logical group of related tasks
- Stop at any checkpoint to validate story independently
- Meta descriptions must include Monaco/Monte-Carlo keywords per Constitution III
- All hreflang tags must be bidirectional and identical across page pairs per research.md RT-002
- Resource paths must use relative parent directory references (../) per research.md RT-003
