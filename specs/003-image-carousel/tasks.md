# Tasks: Image Carousel with ImageKit.io Integration

**Input**: Design documents from `/specs/003-image-carousel/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual testing only (no automated tests - constitution specifies manual testing on real devices)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Static HTML site structure - files at repository root:
- `carousel.css` - Shared carousel styles
- `carousel.js` - Shared carousel logic
- `FR/`, `EN/` - Language-specific HTML pages
- `images/` - Image directory structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and ImageKit account setup

- [x] T001 Create carousel.css file at repository root
- [x] T002 Create carousel.js file at repository root
- [x] T003 [P] Create image directory structure: images/FR/ and images/EN/ subdirectories
- [x] T004 [P] Create ImageKit account at https://imagekit.io and obtain ImageKit ID from dashboard (ImageKit ID: 6b4fz9a3u - already in use)
- [x] T005 [P] Create sample manifest JSON structure documentation in quickstart.md (already complete from plan phase)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core carousel infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement buildImagekitUrl() function in carousel.js for URL construction with transformation parameters (w-[width],q-[quality],f-jpg,pr-true)
- [x] T007 Implement buildImagekitUrlSet() function in carousel.js for responsive srcset generation (640px mobile, 1024px tablet, 1920px desktop)
- [x] T008 Implement discoverImages() function in carousel.js to parse page path and read JSON manifest from DOM (<script type="application/json" id="carousel-images">)
- [x] T009 Implement initCarousel(options) public API function in carousel.js accepting {imagekitId, containerSelector} parameters
- [x] T010 Implement CarouselInstance data structure in carousel.js with properties: containerId, imagekitId, pagePath, imageDirectory, images[], currentIndex, isAnimating
- [x] T011 Implement ImageMetadata data structure in carousel.js with properties: filename, fullPath, imagekitUrls, loadStatus, index, altText

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Images on Page with Navigation (Priority: P1) 🎯 MVP

**Goal**: Display functional carousel with images and navigation buttons on pages with images

**Independent Test**: Navigate to any page with images in corresponding directory (e.g., FR/anniversaire.html with images in images/FR/anniversaire/) and verify images display with working navigation buttons

### Implementation for User Story 1

- [x] T012 [US1] Implement renderCarousel() function in carousel.js to generate HTML structure (radio inputs, article cards, navigation labels)
- [x] T013 [US1] Implement CSS for .carousel container in carousel.css with grid layout for stacked cards (grid-area: 1/1)
- [x] T014 [US1] Implement CSS for .carousel-card in carousel.css with rotation angles (--angle CSS variable) and z-index stacking
- [x] T015 [US1] Implement CSS for .carousel-img in carousel.css with auto height (adapts to image), white background, 600px wide (800px desktop, 90vw mobile)
- [x] T016 [US1] Implement CSS for hidden radio inputs in carousel.css using clip pattern (not display:none) for accessibility
- [x] T017 [US1] Implement CSS horizontal sliding animation in carousel.css using translateX transforms
- [x] T018 [US1] Implement CSS for clickable images in carousel.css with cursor pointer and larger size (300-500px responsive)
- [x] T019 [US1] Implement handleNavigation() function in carousel.js with debouncing logic (.is-animating class) and 600ms timeout
- [x] T020 [US1] Implement attachEventListeners() function in carousel.js for navigation button clicks and radio button state changes
- [x] T021 [US1] Implement navigation wrap-around logic in carousel.js (last→first, first→last) in handleNavigation()
- [x] T022 [US1] Add ARIA labels to clickable image labels in renderCarousel() ("View next image")
- [x] T023 [US1] Generate alt text for images in renderCarousel() using pattern "[page-name] example photo [N]"

**Checkpoint**: At this point, User Story 1 should be fully functional - carousel displays images with working navigation on pages with images

---

## Phase 4: User Story 2 - Fast Initial Page Load (Priority: P2)

**Goal**: Optimize carousel for fast first paint with lazy loading

**Independent Test**: Load page with multiple images and measure time-to-first-paint; verify only first image loads immediately and subsequent images lazy load

**Dependencies**: User Story 1 must be complete (requires functional carousel)

### Implementation for User Story 2

- [x] T024 [US2] Modify renderCarousel() in carousel.js to add fetchpriority="high" and loading="eager" to first image only
- [x] T025 [US2] Modify renderCarousel() in carousel.js to add loading="lazy" attribute to all images after first
- [x] T026 [US2] Update buildImagekitUrl() in carousel.js to include pr-true parameter for progressive JPEG rendering (LQIP)
- [ ] T027 [US2] Test lazy loading behavior: open DevTools Network tab and verify only first image loads on page load (TESTING - deferred to Phase 10)

**Checkpoint**: At this point, User Story 2 should work - first image loads fast, rest lazy load, no performance degradation

---

## Phase 5: User Story 3 - Responsive Images for Different Devices (Priority: P2)

**Goal**: Serve appropriately sized images for different devices

**Independent Test**: Access pages on different devices/screen sizes and verify appropriate image sizes loaded (check Network tab for image dimensions/file sizes)

**Dependencies**: User Story 1 must be complete (requires functional carousel)

### Implementation for User Story 3

- [x] T028 [US3] Modify renderCarousel() in carousel.js to generate srcset attribute using buildImagekitUrlSet() for each image
- [x] T029 [US3] Modify renderCarousel() in carousel.js to add sizes attribute: "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
- [x] T030 [US3] Update CSS in carousel.css to set responsive aspect ratios: mobile (1/1), tablet (4/3), desktop (16/9) using media queries
- [ ] T031 [US3] Test responsive behavior: use DevTools device toolbar to verify mobile loads 640px images, desktop loads 1920px images (TESTING - deferred to Phase 10)

**Checkpoint**: At this point, User Story 3 should work - responsive images load based on device viewport

---

## Phase 6: User Story 4 - Pages Without Images Show No Carousel (Priority: P3)

**Goal**: Gracefully handle pages without images (no carousel rendering, no errors)

**Independent Test**: Navigate to pages without images in directories and verify no carousel elements appear and no console errors

**Dependencies**: User Story 1 must be complete (requires initCarousel logic)

### Implementation for User Story 4

- [x] T032 [US4] Modify initCarousel() in carousel.js to check if manifest exists in DOM; return null if missing
- [x] T033 [US4] Modify initCarousel() in carousel.js to check if parsed manifest is empty array; return null if empty
- [x] T034 [US4] Modify initCarousel() in carousel.js to verify container element exists; throw error if missing (development aid)
- [ ] T035 [US4] Test no-carousel scenario: create page without manifest and verify no carousel renders, no errors in console (TESTING - deferred to Phase 10)

**Checkpoint**: At this point, User Story 4 should work - pages without images display normally without carousel

---

## Phase 7: Edge Cases & Error Handling

**Purpose**: Implement edge case behaviors from spec clarifications

### Edge Case: Failed Image Handling

- [x] T036 [P] Implement hideFailedImage() function in carousel.js to hide card and radio button when image fails
- [x] T037 [P] Add img.onerror event listener in attachEventListeners() in carousel.js with fallback to local /images/ path before hiding
- [x] T038 [P] Add img.onload event listener in attachEventListeners() in carousel.js to update loadStatus="loaded"
- [ ] T039 Test failed image handling: use invalid ImageKit URL and verify image is skipped, carousel shows remaining images (TESTING - deferred to Phase 10)

### Edge Case: Single Image Display

- [x] T040 [P] Modify renderCarousel() in carousel.js to detect images.length === 1 and hide navigation buttons (add .carousel-single-image class)
- [x] T041 [P] Add CSS for .carousel-single-image in carousel.css to hide navigation buttons (display: none on .carousel-nav)
- [ ] T042 Test single image: create page with one image in manifest and verify image displays without navigation buttons (TESTING - deferred to Phase 10)

### Edge Case: Variable Aspect Ratios (Letterboxing)

- [x] T043 [P] Verify CSS aspect-ratio and object-fit: contain implementation in carousel.css maintains letterboxing for mismatched ratios
- [ ] T044 Test letterboxing: add images with different aspect ratios (square, landscape, portrait) and verify all visible without cropping (TESTING - deferred to Phase 10)

### Edge Case: Rapid Navigation Debouncing

- [x] T045 [P] Add CSS for .is-animating state in carousel.css to disable pointer-events and reduce opacity on navigation buttons
- [ ] T046 Test debouncing: rapidly click navigation buttons and verify only one animation plays at a time, clicks during animation ignored (TESTING - deferred to Phase 10)

### Edge Case: Progressive Loading on Slow Connections

- [ ] T047 Test progressive loading: use DevTools Network throttling (Slow 3G) and verify first image loads with low-quality placeholder that progressively sharpens (TESTING - deferred to Phase 10)

---

## Phase 8: Integration with HTML Pages

**Purpose**: Add carousel to all FR and EN pages with images

### FR Pages Integration

- [x] T048 [P] Add carousel to FR/anniversaire.html: add manifest JSON, carousel assets includes, initCarousel() call, container div
- [x] T049 [P] Add carousel to FR/ateliers.html: add manifest JSON, carousel assets includes, initCarousel() call, container div
- [x] T050 [P] Add carousel to FR/spectacles.html: add manifest JSON, carousel assets includes, initCarousel() call, container div

### EN Pages Integration

- [x] T051 [P] Add carousel to EN/birthday-party.html: add manifest JSON, carousel assets includes, initCarousel() call, container div
- [x] T052 [P] Add carousel to EN/workshops.html: add manifest JSON, carousel assets includes, initCarousel() call, container div
- [x] T053 [P] Add carousel to EN/shows.html: add manifest JSON, carousel assets includes, initCarousel() call, container div

**Note**: Pages without images (contact, home, characters) intentionally skip carousel integration per User Story 4

**Checkpoint**: All pages with images should now have functional carousels

---

## Phase 9: Image Upload & Configuration

**Purpose**: Upload images to ImageKit and verify configuration

- [x] T054 Create placeholder images for FR/anniversaire: 3-5 sample images in images/FR/anniversaire/ directory (4 WebP images added: Atelier, Dinosaur, MamanClown, Mice)
- [ ] T055 [P] Create placeholder images for FR/ateliers: 3-5 sample images in images/FR/ateliers/ directory (TODO - add images)
- [ ] T056 [P] Create placeholder images for FR/spectacles: 3-5 sample images in images/FR/spectacles/ directory (TODO - add images)
- [ ] T057 [P] Create placeholder images for EN/birthday-party: 3-5 sample images in images/EN/birthday-party/ directory (TODO - add images)
- [ ] T058 [P] Create placeholder images for EN/workshops: 3-5 sample images in images/EN/workshops/ directory (TODO - add images)
- [ ] T059 [P] Create placeholder images for EN/shows: 3-5 sample images in images/EN/shows/ directory (TODO - add images)
- [ ] T060 Upload all placeholder images to ImageKit dashboard matching directory structure (OPTIONAL - fallback to local images works, ImageKit upload improves performance)
- [x] T061 Test ImageKit URLs: verify sample URL loads with transformations (ImageKit ID 6b4fz9a3u confirmed working - used for logo)

---

## Phase 10: Testing & Validation

**Purpose**: Manual testing on real devices per constitution requirements

### Desktop Browser Testing

- [ ] T062 Test carousel on Chrome desktop: verify images load, navigation works, animations smooth, no console errors
- [ ] T063 [P] Test carousel on Firefox desktop: verify images load, navigation works, animations smooth, no console errors
- [ ] T064 [P] Test carousel on Safari desktop: verify images load, navigation works, animations smooth, no console errors

### Mobile Device Testing

- [ ] T065 Test carousel on iPhone Safari: verify images load, navigation buttons tap-friendly (44x44px), mobile images load (640px), no errors
- [ ] T066 [P] Test carousel on Android Chrome: verify images load, navigation buttons tap-friendly, mobile images load (640px), no errors

### Performance Testing

- [ ] T067 Test first paint performance: use Lighthouse or DevTools Performance tab to verify first image visible within 2 seconds on simulated 3G
- [ ] T068 Test FMP impact: compare page with carousel vs without carousel; verify <200ms difference in first meaningful paint
- [ ] T069 Test mobile file sizes: use DevTools Network tab to verify mobile loads images 60-70% smaller than desktop (640px ~300KB vs 1920px ~800KB)
- [ ] T070 Test animation performance: verify transitions complete in 300-600ms using DevTools Performance recording

### Accessibility Testing

- [ ] T071 Test keyboard navigation: verify tab order includes navigation buttons, Enter/Space activates buttons, focus visible
- [ ] T072 Test screen reader: use VoiceOver (macOS/iOS) or NVDA (Windows) to verify image alt text announced, navigation button labels clear
- [ ] T073 Test color contrast: use DevTools Accessibility inspector to verify navigation buttons meet WCAG AA standards

### Edge Case Validation

- [ ] T074 Test failed image: modify manifest to include non-existent image filename and verify carousel skips it gracefully
- [ ] T075 Test single image: create page with only one image in manifest and verify no navigation buttons displayed
- [ ] T076 Test no images: navigate to page without manifest and verify no carousel elements, no console errors
- [ ] T077 Test rapid clicking: rapidly click navigation buttons and verify debouncing prevents animation glitches
- [ ] T078 Test aspect ratio variety: add images with different ratios (square, landscape, portrait) and verify letterboxing works

### Cross-Page Testing

- [ ] T079 Test FR/anniversaire.html carousel: verify all images load, navigation works, meets acceptance criteria
- [ ] T080 [P] Test FR/ateliers.html carousel: verify all images load, navigation works, meets acceptance criteria
- [ ] T081 [P] Test FR/spectacles.html carousel: verify all images load, navigation works, meets acceptance criteria
- [ ] T082 [P] Test EN/birthday-party.html carousel: verify all images load, navigation works, meets acceptance criteria
- [ ] T083 [P] Test EN/workshops.html carousel: verify all images load, navigation works, meets acceptance criteria
- [ ] T084 [P] Test EN/shows.html carousel: verify all images load, navigation works, meets acceptance criteria

---

## Phase 11: Polish & Documentation

**Purpose**: Final refinements and documentation updates

- [ ] T085 [P] Review carousel.css for code quality: remove unused styles, add comments for complex animations
- [ ] T086 [P] Review carousel.js for code quality: add JSDoc comments for public functions, remove console.logs
- [ ] T087 [P] Validate HTML: use W3C validator on all pages with carousels to ensure valid HTML5
- [ ] T088 [P] Update quickstart.md with real ImageKit ID placeholder and tested instructions
- [ ] T089 Verify constitution compliance: review all checklist items from plan.md Constitution Check section
- [ ] T090 Create debugging helpers: add window.carouselDebug global object (as specified in carousel-interface.md contract) for manual testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1 - MVP): Can start immediately after Foundational
  - User Story 2 (P2): Depends on User Story 1 (modifies existing carousel)
  - User Story 3 (P2): Depends on User Story 1 (adds to existing carousel)
  - User Story 4 (P3): Depends on User Story 1 (modifies initCarousel logic)
- **Edge Cases (Phase 7)**: Can start in parallel with User Stories after Foundational, but should complete before Integration
- **Integration (Phase 8)**: Depends on User Story 1 being complete
- **Image Upload (Phase 9)**: Can happen in parallel with Implementation phases
- **Testing (Phase 10)**: Depends on Integration being complete
- **Polish (Phase 11)**: Depends on Testing validation passing

### User Story Dependencies

- **User Story 1 (P1)**: Independent - only needs Foundational phase
- **User Story 2 (P2)**: Depends on User Story 1 (modifies renderCarousel and buildImagekitUrl)
- **User Story 3 (P2)**: Depends on User Story 1 (adds srcset to existing structure)
- **User Story 4 (P3)**: Depends on User Story 1 (modifies initCarousel)

### Within Each User Story

- CSS and JavaScript functions can be implemented in parallel if working on different files
- Within carousel.js, functions with dependencies must be completed in order:
  - buildImagekitUrl before buildImagekitUrlSet
  - Data structures before functions using them
  - renderCarousel before handleNavigation (depends on DOM structure)

### Parallel Opportunities

- **Phase 1 Setup**: T001, T002, T003, T004, T005 all parallelizable (different files/services)
- **Phase 2 Foundational**: T006-T011 must be sequential (all in carousel.js with dependencies)
- **Phase 3 User Story 1**: T013-T018 CSS tasks parallelizable (all in carousel.css, different rule sets)
- **Phase 7 Edge Cases**: All sub-phases (Failed Image, Single Image, Aspect Ratio, Debouncing) parallelizable
- **Phase 8 Integration**: All FR pages (T048-T050) parallel, all EN pages (T051-T053) parallel
- **Phase 9 Image Upload**: T055-T059 (placeholder creation) all parallel, T060-T061 after placeholders exist
- **Phase 10 Testing**: Desktop browser tests (T063-T064) parallel, mobile tests (T065-T066) parallel, cross-page tests (T080-T084) parallel

---

## Parallel Example: User Story 1 CSS

```bash
# Launch all CSS tasks for User Story 1 together (different rule sets in carousel.css):
Task: "Implement CSS for .carousel container in carousel.css" (T013)
Task: "Implement CSS for .carousel-card in carousel.css" (T014)
Task: "Implement CSS for .carousel-img in carousel.css" (T015)
Task: "Implement CSS for hidden radio inputs in carousel.css" (T016)
Task: "Implement CSS for .carousel-nav-btn in carousel.css" (T018)
# Note: T017 (animation keyframes) should complete before others to define animation referenced
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011) - CRITICAL
3. Complete Phase 3: User Story 1 (T012-T023)
4. Complete minimal Integration: Add carousel to FR/anniversaire.html only (T048)
5. **STOP and VALIDATE**: Test carousel on FR/anniversaire.html
6. If working: Proceed to User Story 2

**MVP Scope**: User Story 1 + one page (FR/anniversaire.html) delivers functional carousel with navigation

### Incremental Delivery

1. **Foundation Release** (T001-T011): Carousel infrastructure ready
2. **MVP Release** (+ T012-T023 + T048): One page with working carousel
3. **Performance Release** (+ T024-T027): Fast loading carousel
4. **Responsive Release** (+ T028-T031): Device-optimized images
5. **Robust Release** (+ T032-T047): Edge cases handled
6. **Full Release** (+ T048-T061): All pages with images
7. **Validated Release** (+ T062-T084): Tested and polished

### Parallel Team Strategy

With 2-3 developers:

**Week 1**: All together
- Setup + Foundational (T001-T011)

**Week 2**: Split work after Foundational complete
- Developer A: User Story 1 (T012-T023)
- Developer B: Edge Cases prep (T036-T046)
- Developer C: Image uploads (T054-T061)

**Week 3**: Integration and testing
- Developer A: FR pages (T048-T050)
- Developer B: EN pages (T051-T053)
- Developer C: Testing (T062-T078)

---

## Notes

- [P] tasks = different files or independent sections, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable after completion
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- Constitution compliance: No build tools, vanilla JS only, manual testing on real devices
- ImageKit ID must be obtained before testing (T004) but can be placeholder during development
- All file paths are relative to repository root (static site structure)

---

## Success Metrics

### User Story 1 Success
- ✅ Carousel displays on pages with images
- ✅ Navigation buttons work (next, previous, wrap-around)
- ✅ Animations smooth (300-600ms)
- ✅ No console errors

### User Story 2 Success
- ✅ First image loads within 2 seconds on 3G
- ✅ FMP impact < 200ms
- ✅ Progressive JPEG visible on slow connections

### User Story 3 Success
- ✅ Mobile loads 60-70% smaller images
- ✅ Srcset attributes working (check Network tab)
- ✅ Images crisp on all devices

### User Story 4 Success
- ✅ Pages without images show no carousel
- ✅ No console errors on pages without images
- ✅ No visual artifacts

### Edge Cases Success
- ✅ Failed images skipped gracefully
- ✅ Single image displays without navigation
- ✅ Different aspect ratios letterboxed correctly
- ✅ Rapid clicking debounced

### Overall Success
- ✅ All 12 pages with carousels functional
- ✅ Constitution compliant (all 5 principles)
- ✅ Manual testing passed on real devices
- ✅ Performance targets met (SC-001 through SC-008)
