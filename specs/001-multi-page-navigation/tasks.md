# Tasks: Multi-Page Website with Navigation

**Input**: Design documents from `/specs/001-multi-page-navigation/`  
**Prerequisites**: plan.md (✓ complete), spec.md (✓ complete)

**Tests**: Manual testing only (per Constitution - no automated testing required)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- Include exact file paths in descriptions

## Path Conventions

Static website structure - all files at repository root (no src/ directory needed per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared header component that will be used across all pages

- [x] T001 [P] Create `header.js` with menu, scroll detection, and keyboard navigation logic
- [x] T002 [P] Create `header.css` with header, hamburger, menu, and backdrop styles (or decide to inline per constitution)
- [x] T003 [P] Prepare reduced logo from ImageKit CDN (60x80px transformations for header use)

---

## Phase 2: Foundational (Core Header & Navigation)

**Purpose**: Core navigation infrastructure that MUST be complete before any page can be implemented

**⚠️ CRITICAL**: No page creation can begin until header component is fully functional

### Implementation

- [x] T004 Implement hamburger button HTML structure with ARIA attributes (aria-expanded, aria-label, aria-controls)
- [x] T005 Implement menu overlay backdrop with semi-transparent styling (rgba(0,0,0,0.5))
- [x] T006 Implement slide-over menu container (300px width, slides from right, CSS transform)
- [x] T007 Implement menu open/close JavaScript with click animation prevention (ignore clicks during 0.5s transition)
- [x] T008 Implement scroll direction detection JavaScript (hide header on scroll down, show on scroll up)
- [x] T009 Implement keyboard navigation: Tab focus, Enter activate, Escape close
- [x] T010 Implement focus trap in menu (Tab wraps from last to first link, Shift+Tab wraps reverse)
- [x] T011 Implement focus management (save focus on open, return focus to hamburger on close)
- [x] T012 Implement dynamic menu population (read data-page attribute, exclude current page from links)
- [x] T013 Test header component standalone (verify all interactions before page integration)

**Checkpoint**: Header component ready - page creation can now begin

---

## Phase 3: User Story 1 - Navigate Between Website Pages (Priority: P1) 🎯 MVP

**Goal**: Enable visitors to navigate between all 5 pages using hamburger menu

**Independent Test**: Click hamburger menu on any page, verify all other pages appear as links, click link to navigate

### Update Existing Home Page

- [x] T014 [US1] Add header HTML to `index.html` (logo, "Home" title, hamburger button)
- [x] T015 [US1] Add menu overlay and container HTML to `index.html`
- [x] T016 [US1] Link `header.js` script in `index.html`
- [x] T017 [US1] Add `data-page="home"` attribute to body in `index.html`
- [x] T018 [US1] Add CSS for header positioning (fixed top, with padding-top on main content)
- [x] T019 [US1] Test home page: menu opens, shows Birthdays/Contact/Shows/Characters links, scroll hide/show works

### Create Birthdays Page

- [x] T020 [P] [US1] Create `birthdays.html` with complete structure (HTML5 doctype, meta tags, title)
- [x] T021 [US1] Add header HTML to `birthdays.html` (logo, "Birthdays" title, hamburger button)
- [x] T022 [US1] Add `data-page="birthdays"` attribute to body
- [x] T023 [US1] Link `header.js` script
- [x] T024 [US1] Add SEO meta tags (description with "Monaco/Monte-Carlo", Open Graph, Twitter Card)
- [x] T025 [US1] Add placeholder birthday content section (will be filled in US4)
- [x] T026 [US1] Test birthdays page: navigation works, menu excludes "Birthdays" link

### Create Contact Page

- [x] T027 [P] [US1] Create `contact.html` with complete structure
- [x] T028 [US1] Add header HTML to `contact.html` (logo, "Contact" title, hamburger button)
- [x] T029 [US1] Add `data-page="contact"` attribute to body
- [x] T030 [US1] Link `header.js` script
- [x] T031 [US1] Add SEO meta tags (description with "Monaco/Monte-Carlo", Open Graph, Twitter Card)
- [x] T032 [US1] Add placeholder contact content section (will be filled in US5)
- [x] T033 [US1] Test contact page: navigation works, menu excludes "Contact" link

### Create Shows Page

- [x] T034 [P] [US1] Create `shows.html` with complete structure
- [x] T035 [US1] Add header HTML to `shows.html` (logo, "Shows" title, hamburger button)
- [x] T036 [US1] Add `data-page="shows"` attribute to body
- [x] T037 [US1] Link `header.js` script
- [x] T038 [US1] Add SEO meta tags (description with "Monaco/Monte-Carlo", Open Graph, Twitter Card)
- [x] T039 [US1] Add placeholder shows content section (will be filled in US6)
- [x] T040 [US1] Test shows page: navigation works, menu excludes "Shows" link

### Create Characters Page

- [x] T041 [P] [US1] Create `characters.html` with complete structure
- [x] T042 [US1] Add header HTML to `characters.html` (logo, "Characters" title, hamburger button)
- [x] T043 [US1] Add `data-page="characters"` attribute to body
- [x] T044 [US1] Link `header.js` script
- [x] T045 [US1] Add SEO meta tags (description with "Monaco/Monte-Carlo", Open Graph, Twitter Card)
- [x] T046 [US1] Add placeholder characters content section (will be filled in US7)
- [x] T047 [US1] Test characters page: navigation works, menu excludes "Characters" link

### Integration Testing

- [x] T048 [US1] Test complete navigation flow: Home → Birthdays → Contact → Shows → Characters → Home
- [x] T049 [US1] Test menu on each page excludes current page correctly
- [x] T050 [US1] Test all links work (phone, email, social, vCard still functional on home)

**Checkpoint**: All 5 pages exist with working navigation - MVP is functional!

---

## Phase 4: User Story 2 - Smart Header Visibility During Scrolling (Priority: P2)

**Goal**: Header hides on scroll down to maximize reading space, reappears immediately on scroll up

**Independent Test**: On any page with scrollable content, scroll down to verify header hides, scroll up slightly to verify header reappears

### Scroll Behavior Implementation

- [ ] T051 [US2] Verify scroll detection JavaScript in `header.js` (should already exist from T008)
- [ ] T052 [US2] Verify CSS transition for header hide/show (transform: translateY(-100%), 0.3s duration)
- [ ] T053 [US2] Test scroll threshold (header doesn't hide until scrolled >100px from top)
- [ ] T054 [US2] Test rapid scroll direction changes (debouncing works, no jank)
- [ ] T055 [US2] Test scroll on mobile devices (touch scrolling works smoothly)

### Edge Cases

- [ ] T056 [US2] Test: Header visible when at top of page (scroll position 0)
- [ ] T057 [US2] Test: Menu remains open and functional if header hides while menu is open
- [ ] T058 [US2] Test: Header responds within 0.3 seconds of scroll direction change

**Checkpoint**: Smart header scroll behavior works on all pages

---

## Phase 5: User Story 3 - Visual Brand Consistency Across Pages (Priority: P2)

**Goal**: All pages maintain consistent rainbow theme, fonts, and header layout

**Independent Test**: Visit each page and verify logo size/position, font usage, color scheme match

### Visual Consistency Tasks

- [ ] T059 [P] [US3] Verify logo displays at 60x80px in header on all 5 pages (consistent sizing)
- [ ] T060 [P] [US3] Verify page titles use Comic Neue font on all pages
- [ ] T061 [P] [US3] Verify rainbow color scheme applied to content on all pages
- [ ] T062 [P] [US3] Verify hamburger icon uses #00a700 green on all pages
- [ ] T063 [US3] Test responsive behavior: header remains consistent 320px-1920px viewport
- [ ] T064 [US3] Test logo alt text displays if image fails to load (with placeholder border)

**Checkpoint**: Visual consistency verified across all pages

---

## Phase 6: User Story 4 - Access Birthdays Information (Priority: P3)

**Goal**: Provide birthday party service information

**Independent Test**: Navigate to Birthdays page, verify content loads with header elements

### Content Implementation

- [ ] T065 [US4] Create birthday service hero section in `birthdays.html`
- [ ] T066 [P] [US4] Add birthday package descriptions (cards layout, 375px centered container)
- [ ] T067 [P] [US4] Add birthday party features list
- [ ] T068 [P] [US4] Add birthday-specific images via ImageKit CDN (with responsive srcsets)
- [ ] T069 [US4] Add "Book Birthday Party" CTA button (green #00a700, links to contact)
- [ ] T070 [US4] Apply rainbow text effects to headings (match home page style)
- [ ] T071 [US4] Test birthdays page content on mobile and desktop

**Checkpoint**: Birthdays page fully functional with content

---

## Phase 7: User Story 5 - Access Contact Information (Priority: P3)

**Goal**: Provide contact information and booking methods

**Independent Test**: Navigate to Contact page, verify contact methods are accessible

### Content Implementation

- [ ] T072 [US5] Reuse existing contact elements from home page (phone, email, rainbow styling)
- [ ] T073 [P] [US5] Create contact method cards layout in `contact.html` (375px centered)
- [ ] T074 [P] [US5] Add phone contact card with tap-to-call link (0672242512)
- [ ] T075 [P] [US5] Add email contact card with mailto link (contact@mamanclown.com)
- [ ] T076 [P] [US5] Add social media cards (Facebook, Instagram links with icons)
- [ ] T077 [US5] Add vCard download button (reuse from home page)
- [ ] T078 [US5] Apply rainbow text effects to contact labels
- [ ] T079 [US5] Test all contact links work (phone, email, social, vCard)

**Checkpoint**: Contact page fully functional with all contact methods

---

## Phase 8: User Story 6 - View Shows Information (Priority: P3)

**Goal**: Display public performance schedule and show descriptions

**Independent Test**: Navigate to Shows page, verify show listings display

### Content Implementation

- [ ] T080 [US6] Create shows listing section in `shows.html` (timeline or card layout)
- [ ] T081 [P] [US6] Add show entry template (date, venue, description, image)
- [ ] T082 [P] [US6] Add show-specific images via ImageKit CDN (with responsive srcsets)
- [ ] T083 [US6] Add "Book Private Show" CTA button (links to contact page)
- [ ] T084 [US6] Apply rainbow text effects to show titles
- [ ] T085 [US6] Style show cards with 375px centered container pattern
- [ ] T086 [US6] Test shows page content on mobile and desktop

**Checkpoint**: Shows page fully functional with content

---

## Phase 9: User Story 7 - Explore Characters Information (Priority: P3)

**Goal**: Display character profiles and entertainment offerings

**Independent Test**: Navigate to Characters page, verify character profiles display

### Content Implementation

- [ ] T087 [US7] Create character profile cards layout in `characters.html`
- [ ] T088 [P] [US7] Add character profile template (image, name, description, personality highlights)
- [ ] T089 [P] [US7] Add character images via ImageKit CDN (with responsive srcsets)
- [ ] T090 [P] [US7] Add character feature lists (what each character offers)
- [ ] T091 [US7] Apply rainbow text effects to character names
- [ ] T092 [US7] Style character cards with 375px centered container pattern
- [ ] T093 [US7] Test characters page content on mobile and desktop

**Checkpoint**: Characters page fully functional with content

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and constitution compliance verification

### Accessibility Validation

- [ ] T094 [P] Test keyboard navigation on all pages (Tab, Enter, Escape, focus trap)
- [ ] T095 [P] Test with screen reader (VoiceOver or NVDA) - verify ARIA attributes work
- [ ] T096 [P] Verify color contrast meets WCAG AA on all pages
- [ ] T097 [P] Verify touch targets are 44x44px minimum on all interactive elements

### Performance Validation

- [ ] T098 [P] Test page load time on 3G connection (target: <2 seconds)
- [ ] T099 [P] Test menu animation performance (target: <0.5 seconds)
- [ ] T100 [P] Test header hide/show animation (target: <0.3 seconds)
- [ ] T101 [P] Verify ImageKit transformations working (WebP format, responsive srcsets)

### SEO & Meta Tags Validation

- [ ] T102 [P] Verify meta descriptions on all pages (150-160 chars, includes Monaco/Monte-Carlo)
- [ ] T103 [P] Verify Open Graph tags present on all pages
- [ ] T104 [P] Verify Twitter Card tags present on all pages
- [ ] T105 [P] Test social media link previews (Facebook, Twitter)

### HTML & Functionality Validation

- [ ] T106 [P] Run W3C HTML validator on all 5 pages
- [ ] T107 [P] Test all internal navigation links work
- [ ] T108 [P] Test all external links work (phone, email, social, vCard)
- [ ] T109 [P] Verify no console errors on any page

### Constitution Review Gates Checklist

- [ ] T110 All links work (internal navigation + existing phone/email/social/vCard)
- [ ] T111 All images load correctly via ImageKit CDN (reduced logo on all pages)
- [ ] T112 Page loads in under 2 seconds on 3G
- [ ] T113 Interactions work on mobile (tap hamburger, scroll hide/show)
- [ ] T114 Visual consistency maintained (rainbow theme, fonts, colors)
- [ ] T115 No console errors
- [ ] T116 HTML validates (W3C)
- [ ] T117 Meta description present and accurate (150-160 chars) on all pages
- [ ] T118 Open Graph and Twitter Card tags present on all pages
- [ ] T119 ImageKit transformations working (WebP, srcset, quality)
- [ ] T120 Keyboard navigation works (Tab, Enter, Escape, focus trap)
- [ ] T121 Header hide/show responds correctly to scroll direction

### Direct URL Navigation Testing

- [ ] T127 [P] Test direct URL access by typing URLs in browser address bar (index.html, birthdays.html, contact.html, shows.html, characters.html) - verify each page loads correctly without navigation

### Manual Device Testing

- [ ] T122 Test on iPhone Safari (iOS 15+)
- [ ] T123 Test on Android Chrome (latest)
- [ ] T124 Test on Desktop Chrome
- [ ] T125 Test on Desktop Firefox
- [ ] T126 Test on Desktop Safari

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all page creation
- **User Story 1 (Phase 3)**: Depends on Foundational - creates all 5 pages with navigation (MVP)
- **User Stories 2-3 (Phases 4-5)**: Depend on US1 - enhance existing pages
- **User Stories 4-7 (Phases 6-9)**: Depend on US1 - add content to existing pages (can run in parallel)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: MUST complete first - creates all pages (MVP)
- **User Story 2 (P2)**: Can start after US1 - adds scroll behavior
- **User Story 3 (P2)**: Can start after US1 - validates visual consistency
- **User Stories 4-7 (P3)**: Can ALL start after US1 - independent content pages (can run in parallel)

### Within Each User Story

- Foundation tasks (T001-T013) must complete before any page creation
- Home page update (T014-T019) should complete before other pages
- New page creation tasks within US1 marked [P] can run in parallel (T020, T027, T034, T041)
- Content addition for US4-US7 can all run in parallel if team capacity allows

### Parallel Opportunities

- **Phase 1 (Setup)**: All 3 tasks [P] can run in parallel
- **Phase 3 (US1)**: Creating birthdays/contact/shows/characters pages (T020, T027, T034, T041 can run in parallel)
- **Phases 6-9 (US4-US7)**: All content implementation can run in parallel (different files)
- **Phase 10 (Polish)**: Most validation tasks [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1-2)

1. Complete Phase 1: Setup (header component)
2. Complete Phase 2: Foundational (CRITICAL - header working)
3. Complete Phase 3: User Story 1 (all 5 pages with navigation - MVP!)
4. **STOP and VALIDATE**: Test navigation independently across all pages
5. Complete Phase 4: User Story 2 (scroll behavior)
6. Deploy MVP with navigation and scroll behavior

### Incremental Delivery

1. Phases 1-2: Foundation ready
2. Phase 3 (US1): All pages navigable → Deploy (MVP!)
3. Phase 4 (US2): Smart scroll → Deploy
4. Phase 5 (US3): Visual consistency verified → Deploy
5. Phases 6-9 (US4-US7): Add content to each page → Deploy after each

### Parallel Team Strategy

With multiple developers:

1. Team completes Phases 1-2 together (foundation)
2. One developer completes Phase 3 (US1) - all pages must exist first
3. Once US1 is done:
   - Developer A: User Story 4 (Birthdays content)
   - Developer B: User Story 5 (Contact content)
   - Developer C: User Story 6 (Shows content)
   - Developer D: User Story 7 (Characters content)
4. Team runs Phase 10 (Polish) together

---

## Notes

- **Constitution compliance**: Manual testing only (no automated tests required per constitution)
- **Simplicity first**: Copy-paste header HTML across all 5 pages (acceptable for this scale)
- **ImageKit CDN**: All images must use ImageKit with responsive srcsets and WebP transformations
- **WCAG AA**: Full keyboard navigation and accessibility required
- **Performance**: <2s load on 3G, <0.5s menu animation, <0.3s header animation
- **[P] tasks**: Different files, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
