# Research: Image Carousel Technical Decisions

**Feature**: 003-image-carousel  
**Date**: 2025-11-16  
**Status**: Complete

---

## 1. ImageKit URL Construction Patterns

### Decision

Use ImageKit transformation parameters in URL query string with the following pattern:

```text
https://ik.imagekit.io/[IMAGEKIT_ID]/[image-path]?tr=[transformations]
```

**Transformation Parameters**:
- `w-[width]`: Responsive width in pixels
- `q-[quality]`: Quality percentage (1-100)
- `f-[format]`: Format (auto, jpg, webp, png)
- `pr-true`: Progressive rendering for LQIP support

### Rationale

- **URL-based transformations**: No client library required, works with standard `<img>` tags
- **Progressive JPEG**: `f-jpg,pr-true` enables low-quality placeholder that progressively sharpens
- **Responsive widths**: Single base URL with different width transformations for srcset
- **Auto format**: `f-auto` lets ImageKit serve WebP to supporting browsers, JPEG to others

### Implementation Pattern

```javascript
function buildImagekitUrl(imagekitId, imagePath, width, quality = 80, progressive = true) {
  const baseUrl = `https://ik.imagekit.io/${imagekitId}/${imagePath}`;
  const transforms = [
    `w-${width}`,
    `q-${quality}`,
    'f-jpg', // Progressive JPEG format
    progressive ? 'pr-true' : null
  ].filter(Boolean).join(',');
  
  return `${baseUrl}?tr=${transforms}`;
}

// Usage
const mobileUrl = buildImagekitUrl('abc123', 'images/FR/anniversaire/photo1.jpg', 640);
// Result: https://ik.imagekit.io/abc123/images/FR/anniversaire/photo1.jpg?tr=w-640,q-80,f-jpg,pr-true
```

### Responsive Breakpoints

| Device | Width | Quality | Use Case |
|--------|-------|---------|----------|
| Mobile | 640px | 80% | Small screens, 3G connections |
| Tablet | 1024px | 80% | Medium screens |
| Desktop | 1920px | 85% | Large screens, better connections |
| Retina Desktop | 3840px | 85% | 2x DPI displays (optional) |

### Alternatives Considered

- **Client-side library**: ImageKit provides a JavaScript SDK, but adds dependency and violates Simplicity First principle
- **Server-side proxying**: Would add backend complexity for a static site
- **Manual image optimization**: Would require build step and doesn't adapt to device dynamically

---

## 2. Lazy Loading Strategies

### Decision

Use **native lazy loading** with `loading="lazy"` attribute, combined with `fetchpriority="high"` for the first image.

### Rationale

- **Browser support**: Native lazy loading supported in Chrome 76+, Firefox 75+, Safari 15.4+, Edge 79+ (covers >95% of modern browsers)
- **No JavaScript required**: Browser handles loading based on viewport proximity
- **Performance**: First image loads immediately with `fetchpriority="high"`, rest load lazily
- **Simplicity**: No IntersectionObserver code or external libraries needed

### Implementation Pattern

```html
<!-- First image: prioritized loading -->
<img 
  src="[imagekit-url]" 
  srcset="[responsive-srcset]"
  fetchpriority="high"
  loading="eager"
  alt="Birthday party example 1"
  class="carousel-img first"
>

<!-- Subsequent images: lazy loaded -->
<img 
  src="[imagekit-url]" 
  srcset="[responsive-srcset]"
  loading="lazy"
  alt="Birthday party example 2"
  class="carousel-img"
>
```

### Progressive Enhancement

For browsers without native lazy loading support (<5% users), images will load normally (no lazy behavior). This is acceptable as:
- Performance still good with ImageKit optimization
- Progressive JPEG provides LQIP effect regardless
- Older browsers likely on desktop with better connections

### Alternatives Considered

- **Intersection Observer API**: More complex, requires JavaScript, provides no benefit over native lazy loading
- **Data attribute pattern**: Common in older libraries (data-src), requires JavaScript to swap src attribute
- **Load all images upfront**: Violates performance requirements (would block first paint with 20+ images)

---

## 3. Directory-Based Image Discovery

### Decision

Use **hardcoded image manifest** per page, embedded in HTML as a `<script type="application/json">` block.

### Rationale

JavaScript cannot list directory contents due to browser security restrictions. Options were:

1. **Server-side directory listing**: Requires backend/build process (violates static site principle)
2. **Naming convention + trial loading**: Fragile, generates 404 errors, poor UX
3. **Hardcoded manifest**: Simple, explicit, easy to maintain

### Implementation Pattern

**In HTML page** (e.g., `FR/anniversaire.html`):

```html
<script type="application/json" id="carousel-images">
[
  "photo1.jpg",
  "photo2.jpg",
  "photo3.jpg",
  "photo4.jpg"
]
</script>

<link rel="stylesheet" href="../carousel.css">
<script src="../carousel.js" defer></script>
<div id="carousel-container"></div>
```

**In carousel.js**:

```javascript
function discoverImages() {
  // Get current page path
  const pagePath = window.location.pathname;
  const parts = pagePath.split('/').filter(Boolean);
  const lang = parts[0]; // "FR"
  const page = parts[1].replace('.html', ''); // "anniversaire"
  
  // Read manifest
  const manifestEl = document.getElementById('carousel-images');
  if (!manifestEl) return []; // No carousel on this page
  
  const filenames = JSON.parse(manifestEl.textContent);
  
  // Build full paths
  const imageDir = `images/${lang}/${page}/`;
  return filenames.map(filename => imageDir + filename);
}
```

### Maintenance Workflow

When adding new images:
1. Upload images to `images/[lang]/[page]/` directory
2. Upload to ImageKit with same path structure
3. Update `<script type="application/json" id="carousel-images">` in HTML with new filenames

### Alternatives Considered

- **Build-time manifest generation**: Requires build tool (violates Simplicity First)
- **Glob pattern on server**: Requires server-side code for static site
- **Trial loading (image1.jpg, image2.jpg, ...)**: Generates 404s, limits flexibility in naming

---

## 4. CSS Animation Performance

### Decision

Use **CSS transforms** with `transform: rotate()` and `translate()` for GPU-accelerated animations.

### Rationale

- **GPU acceleration**: `transform` properties trigger GPU compositing (fast, smooth)
- **No layout reflow**: Transform changes don't trigger layout recalculation
- **CSS variables**: Use `--angle` custom property for dynamic rotation values
- **Animation timing**: CSS transitions for smooth 300-600ms easing

### Implementation Pattern

```css
.card-img {
  /* Initial tilted state */
  rotate: var(--angle, 0deg);
  transform-origin: center;
  transition: all 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform; /* Hint for GPU layer creation */
}

/* Animation when card is selected */
input:checked + .card > .card-img {
  animation: straighten-and-reveal 600ms forwards;
}

@keyframes straighten-and-reveal {
  0% {
    rotate: var(--angle, 0deg);
    translate: 0 0;
  }
  50% {
    rotate: 0deg;
    translate: -150% 0; /* Slide effect */
  }
  100% {
    rotate: 0deg;
    translate: 0 0;
  }
}
```

### Performance Optimization

- **will-change**: Applied to animating elements to create GPU layer upfront
- **Avoid**: `top`, `left`, `width`, `height` changes during animation (trigger layout)
- **Easing function**: Custom cubic-bezier for playful bounce effect (from user's example)

### Browser Compatibility

- `transform`: Supported in all modern browsers (IE11+, Chrome, Firefox, Safari)
- `rotate` property: Newer syntax, but fallback to `transform: rotate()` if needed
- CSS custom properties: Supported in all target browsers (ES6+ requirement aligns)

### Alternatives Considered

- **JavaScript animation**: More complex, requires requestAnimationFrame, harder to maintain
- **CSS `rotate` property without `transform`**: Limited browser support, no GPU hint
- **SVG animations**: Overkill for simple rotation effect, adds complexity

---

## 5. Aspect Ratio Containers

### Decision

Use **CSS `aspect-ratio` property** with `object-fit: contain` for letterboxing effect.

### Rationale

- **Modern browsers**: `aspect-ratio` supported in Chrome 88+, Firefox 89+, Safari 15+ (covers target audience)
- **Simplicity**: Single property vs padding-top hack
- **Flexibility**: Easy to adjust ratio (e.g., `aspect-ratio: 4/3` or `16/9`)
- **Letterboxing**: `object-fit: contain` ensures full image visible with black bars for mismatched ratios

### Implementation Pattern

```css
.carousel-container {
  /* Fixed aspect ratio for all images */
  aspect-ratio: 4 / 3; /* Can be adjusted based on typical image ratios */
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #000; /* Black background for letterboxing */
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Letterbox if aspect ratio doesn't match */
  object-position: center; /* Center image in container */
}
```

### Responsive Adjustments

```css
/* Mobile: More square ratio */
@media (max-width: 640px) {
  .carousel-container {
    aspect-ratio: 1 / 1;
  }
}

/* Desktop: Wider ratio */
@media (min-width: 1024px) {
  .carousel-container {
    aspect-ratio: 16 / 9;
  }
}
```

### Fallback for Older Browsers

For browsers without `aspect-ratio` support, use padding-top hack:

```css
.carousel-container {
  aspect-ratio: 4 / 3;
  /* Fallback for older browsers */
  position: relative;
  padding-top: 75%; /* 4:3 ratio = 3/4 = 75% */
}

/* Feature detection: remove padding if aspect-ratio supported */
@supports (aspect-ratio: 4 / 3) {
  .carousel-container {
    padding-top: 0;
  }
}

.card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

### Alternatives Considered

- **Padding-top hack**: Works everywhere but less intuitive, harder to adjust
- **Fixed height**: Doesn't scale responsively
- **Object-fit: cover**: Crops images (violates FR-017 requirement for letterboxing)

---

## 6. Navigation Debouncing

### Decision

Use **class-based state management** with CSS pointer-events control.

### Rationale

- **Simplicity**: Add `.is-animating` class during transition, remove when complete
- **CSS enforcement**: `pointer-events: none` on buttons during animation
- **Accessibility**: Doesn't remove buttons from DOM or tab order
- **Visual feedback**: Can style buttons differently during disabled state

### Implementation Pattern

**JavaScript**:

```javascript
function navigateToImage(index) {
  const carousel = document.querySelector('.carousel');
  
  // Prevent navigation if already animating
  if (carousel.classList.contains('is-animating')) {
    return; // Ignore click
  }
  
  // Mark as animating
  carousel.classList.add('is-animating');
  
  // Update radio button state
  const radio = document.getElementById(`carousel-radio-${index}`);
  radio.checked = true;
  
  // Re-enable after animation completes (600ms from CSS)
  setTimeout(() => {
    carousel.classList.remove('is-animating');
  }, 600); // Match CSS animation duration
}

// Attach to navigation buttons
document.querySelectorAll('.carousel-nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const direction = e.currentTarget.dataset.direction; // "next" or "prev"
    const currentIndex = getCurrentIndex();
    const nextIndex = calculateNextIndex(currentIndex, direction);
    navigateToImage(nextIndex);
  });
});
```

**CSS**:

```css
/* Disable pointer events during animation */
.carousel.is-animating .carousel-nav-btn {
  pointer-events: none;
  opacity: 0.5; /* Visual feedback */
  cursor: not-allowed;
}

/* Normal state */
.carousel-nav-btn {
  pointer-events: auto;
  opacity: 1;
  cursor: pointer;
  transition: opacity 200ms ease;
}
```

### Animation Duration Sync

Animation duration must be consistent:
- CSS transition: `transition: all 600ms cubic-bezier(...)`
- JavaScript timeout: `setTimeout(..., 600)`
- Consider extracting to CSS variable: `--animation-duration: 600ms`

### Alternatives Considered

- **Disabled attribute**: Doesn't work on `<label>` elements (user's example uses labels)
- **Flag variable only**: Works but requires manual pointer-events management
- **Throttle function**: More complex than needed, adds timing logic complexity
- **Event.preventDefault()**: Doesn't prevent multiple events queued rapidly

---

## Summary of Decisions

| Topic | Decision | Key Technology |
|-------|----------|----------------|
| ImageKit URLs | Query string transformations | `?tr=w-XXX,q-80,f-jpg,pr-true` |
| Lazy Loading | Native `loading="lazy"` | HTML attribute + `fetchpriority="high"` |
| Image Discovery | Hardcoded JSON manifest | `<script type="application/json">` |
| Animation | CSS transforms with GPU | `transform: rotate()` + `will-change` |
| Aspect Ratio | CSS `aspect-ratio` property | `aspect-ratio: 4/3` + `object-fit: contain` |
| Debouncing | Class-based state | `.is-animating` class + CSS `pointer-events: none` |

**All decisions prioritize**:
- ✅ Simplicity (vanilla JS, no dependencies)
- ✅ Performance (GPU acceleration, lazy loading, responsive images)
- ✅ Accessibility (native HTML, ARIA labels, keyboard support)
- ✅ Browser compatibility (modern browsers, graceful fallbacks)

**No unresolved NEEDS CLARIFICATION items remain.**

---

**Status**: Research complete. Ready for Phase 1 (Design & Contracts).
