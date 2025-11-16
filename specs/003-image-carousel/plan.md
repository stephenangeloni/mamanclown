# Implementation Plan: Image Carousel with ImageKit.io Integration

**Branch**: `003-image-carousel` | **Date**: 2025-11-16 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-image-carousel/spec.md`

## Summary

Implement an image carousel component that automatically displays images from page-specific directories (e.g., `images/FR/anniversaire/` for `FR/anniversaire.html`). Images are served through ImageKit.io CDN with responsive sizing, progressive loading (LQIP), and lazy loading for optimal performance. The carousel features a playful rotation/card-flip animation matching the entertainment theme, with navigation buttons that debounce during transitions. Failed images are skipped gracefully, and pages without images show no carousel.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: ImageKit.io CDN (external service, no client library needed)  
**Storage**: Static file system (images stored in `images/[lang]/[page-name]/` directories)  
**Testing**: Manual testing on real devices (iPhone Safari, Android Chrome, desktop browsers)  
**Target Platform**: Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)  
**Project Type**: Static HTML site with shared CSS/JS assets  
**Performance Goals**: 
- First image visible within 2 seconds on 3G
- First meaningful paint <200ms impact vs no carousel
- Mobile images 60-70% smaller than desktop
- Animation transitions 300-600ms
- No performance degradation with unlimited images  

**Constraints**: 
- No build tools or frameworks (constitution: Simplicity First)
- Must work on 3G connections (constitution: Performance & Accessibility)
- Touch targets minimum 44×44px (constitution: Mobile-First Design)
- Images must use ImageKit CDN with responsive srcsets (constitution: Asset Management)  

**Scale/Scope**: 
- 12 HTML pages (6 FR + 6 EN)
- Unlimited images per page supported
- 1 shared carousel.js file
- 1 shared carousel.css file
- Progressive enhancement approach

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity First ✅

**Status**: COMPLIANT

- Using vanilla JavaScript with no frameworks or build tools
- Single shared carousel.js and carousel.css files
- No external libraries beyond ImageKit CDN (image delivery service, not a JavaScript dependency)
- HTML structure uses native `<input type="radio">` for state management (CSS-only carousel pattern from user's example)
- Directory-based image discovery requires no manual configuration per page

**Justification**: The carousel enhances user experience (showing portfolio of work) with clear booking value. Implementation uses minimal, maintainable vanilla code.

### Principle II: User Experience ✅

**Status**: COMPLIANT

- Smooth rotation/card-flip animations (300-600ms) provide delightful interaction
- Navigation buttons always visible with hover feedback
- Progressive loading (LQIP) ensures immediate visual feedback even on slow connections
- Failed images skipped gracefully (no broken placeholders)
- Single image displays cleanly without unnecessary navigation UI
- Pages without images show no broken elements

**Justification**: Parents viewing the site can immediately see examples of the performer's work, building trust and confidence for booking decisions.

### Principle III: Performance & Accessibility ✅

**Status**: COMPLIANT

- **ImageKit CDN Integration**: All images served through ImageKit with:
  - Responsive srcsets for mobile/tablet/desktop
  - WebP format with fallbacks (`f-auto`)
  - Progressive JPEG (`f-jpg,pr-true`) for LQIP
  - Quality optimization (`q-80` or similar)
  - Width transformations matching display sizes
- **Lazy Loading**: First image loads immediately (`fetchpriority="high"`), subsequent images lazy-loaded
- **SEO**: Carousel pages will maintain existing meta tags (no removal)
- **Accessibility**: 
  - Navigation buttons have proper `aria-label` attributes
  - Radio inputs hidden accessibly (not `display:none`, using clip pattern)
  - Image alt text for screen readers
  - Keyboard navigation via focus states

**Performance Targets**:
- First image visible <2s on 3G: ✅ (first image prioritized, lazy load rest)
- FMP impact <200ms: ✅ (carousel CSS/JS deferred, first image prioritized)
- Mobile file size 60-70% smaller: ✅ (ImageKit responsive transformations)

### Principle IV: Visual Consistency ✅

**Status**: COMPLIANT

- Rotation/card-flip animation matches playful, entertainment theme
- Navigation buttons styled with existing site colors (can use rainbow theme accents)
- Letterboxing for aspect ratio consistency maintains clean visual layout
- Carousel integrates seamlessly into existing page structure without disrupting layout

### Principle V: Mobile-First Design ✅

**Status**: COMPLIANT

- Navigation buttons sized 44×44px minimum (tap-friendly)
- Touch events supported alongside mouse events
- Responsive images prioritize mobile optimization (smallest sizes loaded first)
- Carousel container responsive from 320px to 1920px viewport widths
- Debouncing prevents rapid-tap issues on mobile

**No Violations**: This feature fully complies with all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/003-image-carousel/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output: ImageKit URL patterns, lazy loading strategies
├── data-model.md        # Phase 1 output: Carousel state, Image metadata
├── quickstart.md        # Phase 1 output: How to add images to pages
├── contracts/           # Phase 1 output: ImageKit URL schema, Carousel API
│   ├── imagekit-url-schema.md
│   └── carousel-interface.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Static HTML site structure (existing)
FR/
├── accueil.html
├── anniversaire.html
├── ateliers.html
├── contact.html
├── personnages.html
└── spectacles.html

EN/
├── home.html
├── birthday-party.html
├── workshops.html
├── contact.html
├── characters.html
└── shows.html

# NEW: Carousel assets
carousel.css             # Shared carousel styles (rotation animation, navigation buttons)
carousel.js              # Shared carousel logic (image discovery, lazy loading, navigation)

# NEW: Image directory structure (per page)
images/
├── FR/
│   ├── anniversaire/    # Images for FR/anniversaire.html
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── ateliers/        # Images for FR/ateliers.html
│   └── spectacles/      # Images for FR/spectacles.html
├── EN/
│   ├── birthday-party/  # Images for EN/birthday-party.html
│   ├── workshops/       # Images for EN/workshops.html
│   └── shows/           # Images for EN/shows.html
└── mamanclown.webp      # Existing site logo

# Existing shared assets (unchanged)
header.css               # Existing header styles
header.js                # Existing header logic
favicon.svg              # Existing favicon
```

**Structure Decision**: Static HTML site with shared CSS/JS assets. Each page includes `carousel.css` and `carousel.js` via `<link>` and `<script>` tags. Carousel automatically discovers images from `images/[lang]/[page-name]/` directory based on current page path. No build process required—files are edited directly and committed.

## Complexity Tracking

> **No violations requiring justification. This section intentionally left empty.**

---

## Phase 0: Research & Technical Decisions

### Research Tasks

1. **ImageKit URL Construction Patterns**
   - Research: How to construct ImageKit URLs with transformation parameters
   - Goal: Document URL pattern for responsive images with progressive loading
   - Output: `research.md` section with URL examples for mobile/tablet/desktop

2. **Lazy Loading Strategies**
   - Research: Native lazy loading (`loading="lazy"`) vs Intersection Observer API
   - Goal: Determine best approach for first image priority + lazy loading rest
   - Output: `research.md` section with chosen strategy and browser support notes

3. **Directory-Based Image Discovery**
   - Research: JavaScript patterns for inferring image directory from page path
   - Goal: Algorithm to map `FR/anniversaire.html` → `images/FR/anniversaire/`
   - Output: `research.md` section with path parsing logic

4. **CSS Animation Performance**
   - Research: CSS transforms vs transitions for rotation/card-flip effect
   - Goal: Ensure 300-600ms animation doesn't cause jank or layout shifts
   - Output: `research.md` section with animation approach and GPU acceleration notes

5. **Aspect Ratio Containers**
   - Research: CSS techniques for fixed aspect ratio with letterboxing
   - Goal: Contain images without cropping, maintain consistent carousel height
   - Output: `research.md` section with CSS pattern (e.g., padding-top hack or aspect-ratio property)

6. **Navigation Debouncing**
   - Research: JavaScript patterns for disabling buttons during animations
   - Goal: Prevent rapid clicks from breaking animation state
   - Output: `research.md` section with debounce implementation approach

### Expected Outcomes

**File**: `specs/003-image-carousel/research.md`

**Contents**:
- ImageKit URL pattern with transformation parameters (`tr=w-XXX,q-80,f-jpg,pr-true`)
- Lazy loading strategy (likely native `loading="lazy"` with `fetchpriority="high"` for first image)
- Path parsing algorithm for image directory discovery
- CSS animation approach using `transform: rotate()` with GPU acceleration
- Aspect ratio container CSS using `aspect-ratio` property or padding-top technique
- Debounce pattern using class-based state (add `.is-animating` class during transitions)

---

## Phase 1: Design & Contracts

### Data Model

**File**: `specs/003-image-carousel/data-model.md`

**Entities**:

1. **CarouselInstance**
   - `pagePath`: string (e.g., "FR/anniversaire.html")
   - `imageDirectory`: string (computed: "images/FR/anniversaire/")
   - `images`: Array<ImageMetadata>
   - `currentIndex`: number (0-based)
   - `isAnimating`: boolean (debounce flag)
   
2. **ImageMetadata**
   - `filename`: string (e.g., "image1.jpg")
   - `imagekitUrl`: string (computed from filename + transformations)
   - `loadStatus`: "pending" | "loaded" | "failed"
   - `aspectRatio`: number (optional, for layout hints)

**State Transitions**:
- `pending` → `loaded`: Image successfully loaded from ImageKit
- `pending` → `failed`: Image failed to load (404, timeout, etc.)
- Failed images are filtered out of carousel display

**Relationships**:
- One CarouselInstance per page
- CarouselInstance has many ImageMetadata entries
- ImageMetadata linked to physical files in filesystem

### API Contracts

**File**: `specs/003-image-carousel/contracts/imagekit-url-schema.md`

**ImageKit URL Pattern**:

```text
Base URL: https://ik.imagekit.io/[your-imagekit-id]/[image-path]

Transformation Parameters (query string):
- tr=w-[width]           # Responsive width (e.g., w-640 for mobile, w-1920 for desktop)
- tr=q-[quality]         # Quality (e.g., q-80 for 80% quality)
- tr=f-[format]          # Format (f-auto for automatic WebP/JPEG, f-jpg for progressive JPEG)
- tr=pr-true             # Progressive rendering (LQIP support)

Example URLs:
Mobile:  https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-640,q-80,f-jpg,pr-true
Tablet:  https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-1024,q-80,f-jpg,pr-true
Desktop: https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-1920,q-80,f-jpg,pr-true

Srcset Example:
<img 
  src="https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-640,q-80,f-jpg,pr-true"
  srcset="
    https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-640,q-80,f-jpg,pr-true 640w,
    https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-1024,q-80,f-jpg,pr-true 1024w,
    https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-1920,q-80,f-jpg,pr-true 1920w
  "
  sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
  loading="lazy"
  alt="Birthday party entertainment example"
>
```

**File**: `specs/003-image-carousel/contracts/carousel-interface.md`

**JavaScript Interface**:

```javascript
// Carousel initialization (called on DOMContentLoaded)
function initCarousel(options) {
  // options: { imagekitId: string, containerSelector: string }
  // Returns: CarouselInstance
}

// Image discovery (internal)
function discoverImages(imagePath) {
  // Input: "images/FR/anniversaire/"
  // Output: Array<string> (filenames)
  // Note: Requires server-side directory listing or manifest file
}

// ImageKit URL builder (internal)
function buildImagekitUrl(imagePath, width, quality = 80) {
  // Input: "images/FR/anniversaire/image1.jpg", 640, 80
  // Output: "https://ik.imagekit.io/[id]/images/FR/anniversaire/image1.jpg?tr=w-640,q-80,f-jpg,pr-true"
}

// Navigation (user-facing)
function navigateNext() {
  // Advances to next image (with debouncing)
}

function navigatePrev() {
  // Goes to previous image (with debouncing)
}

// Event listeners
carousel.addEventListener('imageLoad', (event) => {
  // Fired when image loads successfully
  // event.detail: { index: number, url: string }
});

carousel.addEventListener('imageFail', (event) => {
  // Fired when image fails to load
  // event.detail: { index: number, url: string, error: Error }
});
```

### Quickstart Guide

**File**: `specs/003-image-carousel/quickstart.md`

**Contents**:

```markdown
# Adding Images to Pages

## Step 1: Organize Images in Directory Structure

Create a directory matching your page path:

- For `FR/anniversaire.html`, create `images/FR/anniversaire/`
- For `EN/birthday-party.html`, create `images/EN/birthday-party/`

Place your images in these directories:

```text
images/
├── FR/
│   └── anniversaire/
│       ├── photo1.jpg
│       ├── photo2.jpg
│       └── photo3.jpg
└── EN/
    └── birthday-party/
        ├── photo1.jpg
        ├── photo2.jpg
        └── photo3.jpg
```

## Step 2: Upload Images to ImageKit

1. Log in to ImageKit dashboard
2. Upload images to match the directory structure
3. Verify images are accessible at: `https://ik.imagekit.io/[your-id]/images/FR/anniversaire/photo1.jpg`

## Step 3: Add Carousel to Page

In your HTML file (e.g., `FR/anniversaire.html`), add before the closing `</body>` tag:

```html
<link rel="stylesheet" href="../carousel.css">
<script src="../carousel.js" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel({
      imagekitId: 'YOUR_IMAGEKIT_ID',
      containerSelector: '#carousel-container'
    });
  });
</script>

<div id="carousel-container"></div>
```

## Step 4: Test Locally

1. Open the page in a browser
2. Verify carousel appears with images
3. Test navigation buttons
4. Check browser console for errors
5. Test on mobile device or using browser DevTools responsive mode

## Troubleshooting

**No carousel appears**: Check browser console for errors. Verify image directory exists and contains images.

**Images not loading**: Verify ImageKit URLs are correct. Check ImageKit dashboard for upload status.

**Slow loading**: Ensure ImageKit transformation parameters are active (check Network tab for `?tr=...` in URLs).
```

### Agent Context Update

**Action**: Run `.specify/scripts/bash/update-agent-context.sh opencode` to update `AGENTS.md`

**Expected Changes**:
- Add "ImageKit.io CDN integration" to Active Technologies
- Note carousel.js and carousel.css as new shared assets
- Document image directory structure convention

---

## Phase 2: Task Breakdown

**Note**: Task breakdown is created by the `/speckit.tasks` command, NOT by this plan.

**Expected Task Categories** (for reference, actual tasks generated later):

1. **Setup Tasks** (P1)
   - Create carousel.css and carousel.js files
   - Create image directory structure
   - Configure ImageKit account and obtain credentials

2. **Core Carousel Implementation** (P1)
   - Implement image discovery logic (path parsing)
   - Implement ImageKit URL builder function
   - Implement HTML structure generation (radio inputs + cards)
   - Implement CSS rotation/card-flip animation
   - Implement navigation button handlers with debouncing

3. **Performance Optimization** (P2)
   - Implement lazy loading for non-first images
   - Implement progressive JPEG loading (LQIP)
   - Add `fetchpriority="high"` to first image
   - Implement responsive srcsets for mobile/tablet/desktop

4. **Edge Case Handling** (P2)
   - Implement failed image skipping logic
   - Implement single-image display (no navigation buttons)
   - Implement letterboxing for aspect ratio consistency
   - Handle pages with no images (no carousel rendering)

5. **Integration** (P3)
   - Add carousel to all FR pages with images
   - Add carousel to all EN pages with images
   - Update header.css/header.js if needed for layout integration

6. **Testing & Validation** (P3)
   - Manual testing on iPhone Safari
   - Manual testing on Android Chrome
   - Manual testing on desktop browsers
   - Performance testing on throttled 3G connection
   - Accessibility testing (keyboard navigation, screen reader)

---

## Implementation Notes

### ImageKit Configuration

**Required Setup**:
1. ImageKit account must be created at https://imagekit.io
2. Obtain ImageKit ID from dashboard (visible in URL: `ik.imagekit.io/[YOUR_ID]`)
3. Upload all images from local `images/` directory to ImageKit (mirroring directory structure)
4. Test sample ImageKit URL to verify transformations work

**Security**: ImageKit ID is public (appears in image URLs). No authentication required for public image delivery.

### Image Discovery Strategy

**Approach**: JavaScript infers image directory from page path:

```javascript
// Current page: FR/anniversaire.html
const pagePath = window.location.pathname; // "/FR/anniversaire.html"
const parts = pagePath.split('/').filter(Boolean); // ["FR", "anniversaire.html"]
const lang = parts[0]; // "FR"
const page = parts[1].replace('.html', ''); // "anniversaire"
const imageDir = `images/${lang}/${page}/`; // "images/FR/anniversaire/"
```

**Limitation**: JavaScript cannot list files in a directory (browser security restriction).

**Solutions**:
1. **Option A (Preferred)**: Hardcode image filenames in carousel.js or generate manifest
2. **Option B**: Server-side directory listing (requires build step or server endpoint)
3. **Option C**: Naming convention (e.g., image1.jpg, image2.jpg, ...) and try loading until 404

**Decision**: Use Option A or C based on research phase findings. Document in `research.md`.

### CSS Animation Performance

**GPU Acceleration**: Use `transform: rotate()` instead of `rotate` property for hardware acceleration.

**Example**:
```css
.card-img {
  transform: rotate(var(--angle, 0deg));
  will-change: transform; /* Hint to browser for GPU layer */
}
```

**Avoid**: Layout-triggering properties like `width`, `height`, `top`, `left` during animation.

### Accessibility Considerations

**Radio Input Pattern**: Hidden radio inputs manage state (from user's example CSS). Ensure they are:
- Hidden accessibly (using clip pattern, not `display:none`)
- Properly associated with labels (navigation buttons)
- Keyboard focusable (tab order)

**Image Alt Text**: Generate descriptive alt text:
```javascript
const altText = `${pageName} example photo ${index + 1}`;
// e.g., "Birthday party example photo 3"
```

**ARIA Labels**: Navigation buttons must have clear labels:
```html
<label for="radio-prev" aria-label="View previous image">◀</label>
<label for="radio-next" aria-label="View next image">▶</label>
```

---

## Success Validation

**Phase 1 Complete When**:
- ✅ `research.md` contains all technical decisions
- ✅ `data-model.md` documents entities and state transitions
- ✅ `contracts/imagekit-url-schema.md` provides URL construction examples
- ✅ `contracts/carousel-interface.md` documents JavaScript API
- ✅ `quickstart.md` provides clear instructions for adding images to pages
- ✅ `AGENTS.md` updated with ImageKit and carousel assets

**Ready for Phase 2** (`/speckit.tasks`):
- All technical unknowns resolved
- API contracts defined
- Constitution compliance verified (✅ no violations)
- Agent context updated

---

**Next Command**: Continue with Phase 0 research to generate `research.md`.
