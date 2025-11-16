# Carousel JavaScript Interface Contract

**Feature**: 003-image-carousel  
**Date**: 2025-11-16  
**Status**: Complete

---

## Public API

### `initCarousel(options)`

Initialize carousel component on a page.

**Parameters**:
```javascript
{
  imagekitId: string,        // Required: ImageKit account ID
  containerSelector: string  // Required: CSS selector for carousel container
}
```

**Returns**: `CarouselInstance` object or `null` if initialization fails

**Example**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const carousel = initCarousel({
    imagekitId: 'abc123xyz',
    containerSelector: '#carousel-container'
  });
  
  if (carousel) {
    console.log(`Carousel initialized with ${carousel.images.length} images`);
  } else {
    console.warn('No carousel initialized (no images found)');
  }
});
```

**Behavior**:
1. Read manifest from DOM (`<script type="application/json" id="carousel-images">`)
2. Parse image filenames
3. Build ImageKit URLs for each image
4. Render HTML structure in container
5. Attach event listeners
6. Load first image (eager), lazy load rest
7. Return CarouselInstance object

**Errors**:
- Throws if `containerSelector` does not match any element
- Throws if `imagekitId` is empty or null
- Returns `null` if manifest missing or empty (no carousel needed)

---

## Internal Functions

### `discoverImages()`

Parse image manifest from DOM and compute full paths.

**Parameters**: None (reads from DOM)

**Returns**: `string[]` (array of full image paths)

**Example**:
```javascript
// Assuming page is FR/anniversaire.html
// And manifest contains ["party1.jpg", "party2.jpg"]
const images = discoverImages();
// Result: ["images/FR/anniversaire/party1.jpg", "images/FR/anniversaire/party2.jpg"]
```

**Algorithm**:
```javascript
function discoverImages() {
  // 1. Read manifest from DOM
  const manifestEl = document.getElementById('carousel-images');
  if (!manifestEl) return [];
  
  const filenames = JSON.parse(manifestEl.textContent);
  
  // 2. Compute image directory from page path
  const pagePath = window.location.pathname;
  const parts = pagePath.split('/').filter(Boolean);
  const lang = parts[0]; // "FR" or "EN"
  const page = parts[1]?.replace('.html', ''); // "anniversaire"
  
  if (!lang || !page) return [];
  
  const imageDir = `images/${lang}/${page}/`;
  
  // 3. Build full paths
  return filenames.map(filename => imageDir + filename);
}
```

**Error Handling**:
- Missing manifest element: Return empty array (no carousel)
- Invalid JSON: Log error, return empty array
- Invalid page path: Log warning, attempt best-guess directory

---

### `renderCarousel(containerEl, images, imagekitId)`

Generate and inject carousel HTML structure into container.

**Parameters**:
- `containerEl` (HTMLElement): Target container element
- `images` (ImageMetadata[]): Array of image metadata objects
- `imagekitId` (string): ImageKit account ID

**Returns**: void (mutates DOM)

**Generated HTML Structure**:
```html
<div class="carousel" id="carousel-main">
  <!-- Hidden radio buttons for state management -->
  <input type="radio" id="carousel-radio-0" name="carousel-nav" checked>
  <input type="radio" id="carousel-radio-1" name="carousel-nav">
  <input type="radio" id="carousel-radio-2" name="carousel-nav">
  
  <!-- Image cards (one per image) -->
  <article class="carousel-card" style="--angle: 4deg">
    <img 
      class="carousel-img"
      src="[imagekit-mobile-url]"
      srcset="[imagekit-srcset]"
      sizes="[sizes-attribute]"
      fetchpriority="high"
      loading="eager"
      alt="anniversaire example photo 1"
      data-index="0"
    >
    <div class="carousel-nav">
      <label for="carousel-radio-2" aria-label="Previous image">◀</label>
      <label for="carousel-radio-1" aria-label="Next image">▶</label>
    </div>
  </article>
  
  <!-- Additional cards for other images (loading="lazy") -->
  <!-- ... -->
</div>
```

**Behavior**:
- First image: `fetchpriority="high"`, `loading="eager"`
- Other images: `loading="lazy"`
- Random rotation angles: `--angle: [4, -8, -7, 11, 13, -17, 20]deg` (cycles)
- Navigation buttons link to previous/next radio inputs (wrap around)

---

### `attachEventListeners(carouselEl, carouselInstance)`

Attach event listeners for navigation and image loading.

**Parameters**:
- `carouselEl` (HTMLElement): Carousel container element
- `carouselInstance` (CarouselInstance): Carousel state object

**Returns**: void (attaches listeners)

**Events Attached**:

1. **Navigation Button Clicks**:
```javascript
carouselEl.querySelectorAll('.carousel-nav label').forEach(label => {
  label.addEventListener('click', (e) => {
    handleNavigation(e, carouselInstance);
  });
});
```

2. **Image Load Success**:
```javascript
carouselEl.querySelectorAll('.carousel-img').forEach(img => {
  img.addEventListener('load', (e) => {
    const index = parseInt(e.target.dataset.index);
    carouselInstance.images[index].loadStatus = "loaded";
  });
});
```

3. **Image Load Failure**:
```javascript
carouselEl.querySelectorAll('.carousel-img').forEach(img => {
  img.addEventListener('error', (e) => {
    const index = parseInt(e.target.dataset.index);
    carouselInstance.images[index].loadStatus = "failed";
    hideFailedImage(e.target);
  });
});
```

---

### `handleNavigation(event, carouselInstance)`

Handle navigation button click with debouncing.

**Parameters**:
- `event` (Event): Click event from navigation label
- `carouselInstance` (CarouselInstance): Carousel state

**Returns**: void (updates DOM and state)

**Algorithm**:
```javascript
function handleNavigation(event, carouselInstance) {
  // 1. Check if animation in progress
  if (carouselInstance.isAnimating) {
    return; // Ignore click (debounce)
  }
  
  // 2. Mark as animating
  carouselInstance.isAnimating = true;
  const carouselEl = document.getElementById('carousel-main');
  carouselEl.classList.add('is-animating');
  
  // 3. Get target radio ID from label's "for" attribute
  const targetRadioId = event.currentTarget.getAttribute('for');
  const targetRadio = document.getElementById(targetRadioId);
  
  // 4. Check radio (triggers CSS animation)
  targetRadio.checked = true;
  
  // 5. Update currentIndex
  const newIndex = parseInt(targetRadioId.split('-').pop());
  carouselInstance.currentIndex = newIndex;
  
  // 6. Re-enable after animation completes
  setTimeout(() => {
    carouselInstance.isAnimating = false;
    carouselEl.classList.remove('is-animating');
  }, 600); // Match CSS animation duration
}
```

**Debouncing**: `isAnimating` flag prevents multiple simultaneous navigations

---

### `hideFailedImage(imgElement)`

Hide carousel card when image fails to load.

**Parameters**:
- `imgElement` (HTMLImageElement): Failed image element

**Returns**: void (mutates DOM)

**Algorithm**:
```javascript
function hideFailedImage(imgElement) {
  // Find parent card
  const card = imgElement.closest('.carousel-card');
  if (!card) return;
  
  // Hide card (remove from layout)
  card.style.display = 'none';
  
  // Also hide corresponding radio button
  const index = imgElement.dataset.index;
  const radio = document.getElementById(`carousel-radio-${index}`);
  if (radio) {
    radio.disabled = true;
    radio.style.display = 'none';
  }
  
  // Log for debugging
  console.warn(`Image ${index} failed to load, hidden from carousel`);
}
```

**Cascade Effect**: If all images fail, carousel appears empty (same as 0 images case)

---

## Custom Events

### `carousel:ready`

Fired when carousel initialization completes.

**Event Detail**:
```javascript
{
  imageCount: number,       // Total images in carousel
  loadedCount: number,      // Images successfully loaded
  failedCount: number       // Images that failed to load
}
```

**Example Usage**:
```javascript
document.addEventListener('carousel:ready', (e) => {
  console.log(`Carousel ready: ${e.detail.imageCount} images total`);
  console.log(`Loaded: ${e.detail.loadedCount}, Failed: ${e.detail.failedCount}`);
});
```

### `carousel:navigate`

Fired when user navigates to a different image.

**Event Detail**:
```javascript
{
  fromIndex: number,    // Previous image index
  toIndex: number,      // New image index
  totalImages: number   // Total images in carousel
}
```

**Example Usage**:
```javascript
document.addEventListener('carousel:navigate', (e) => {
  console.log(`Navigated from ${e.detail.fromIndex} to ${e.detail.toIndex}`);
  // Could be used for analytics tracking (future enhancement)
});
```

### `carousel:imageload`

Fired when an individual image loads successfully.

**Event Detail**:
```javascript
{
  index: number,        // Image index
  url: string,          // ImageKit URL
  width: number,        // Natural width
  height: number        // Natural height
}
```

**Example Usage**:
```javascript
document.addEventListener('carousel:imageload', (e) => {
  console.log(`Image ${e.detail.index} loaded: ${e.detail.width}x${e.detail.height}`);
});
```

### `carousel:imageerror`

Fired when an image fails to load.

**Event Detail**:
```javascript
{
  index: number,        // Image index
  url: string,          // ImageKit URL that failed
  error: string         // Error message
}
```

**Example Usage**:
```javascript
document.addEventListener('carousel:imageerror', (e) => {
  console.error(`Image ${e.detail.index} failed: ${e.detail.error}`);
  // Could trigger fallback or retry logic
});
```

---

## State Queries

### `carousel.getCurrentIndex()`

Get the index of currently displayed image.

**Returns**: `number` (0-based index)

**Example**:
```javascript
const current = carousel.getCurrentIndex();
console.log(`Showing image ${current + 1} of ${carousel.images.length}`);
```

### `carousel.getLoadedImageCount()`

Get count of successfully loaded images.

**Returns**: `number` (count of images with `loadStatus === "loaded"`)

**Example**:
```javascript
const loaded = carousel.getLoadedImageCount();
const total = carousel.images.length;
console.log(`${loaded}/${total} images loaded`);
```

### `carousel.isReady()`

Check if carousel is fully initialized and ready for interaction.

**Returns**: `boolean`

**Example**:
```javascript
if (carousel.isReady()) {
  console.log('Carousel ready for user interaction');
}
```

---

## Configuration Options (Future Enhancement)

These options are not implemented in initial version but reserved for future:

```javascript
{
  animationDuration: 600,       // Animation duration in ms
  autoplay: false,              // Auto-advance to next image
  autoplayInterval: 3000,       // Time between auto-advances (ms)
  enableKeyboard: false,        // Arrow key navigation
  enableSwipe: false,           // Touch gesture support
  aspectRatio: "4/3",           // Container aspect ratio
  showIndicators: false,        // Dot indicators below carousel
  loop: true                    // Wrap navigation (always true in v1)
}
```

---

## Error Codes

### Initialization Errors

| Code | Message | Resolution |
|------|---------|------------|
| `E_NO_CONTAINER` | Container element not found | Check `containerSelector` matches DOM |
| `E_NO_IMAGEKIT_ID` | ImageKit ID missing or empty | Provide valid ImageKit account ID |
| `E_NO_MANIFEST` | Image manifest not found | Add `<script id="carousel-images">` to HTML |
| `E_INVALID_MANIFEST` | Manifest JSON parse error | Verify JSON syntax in manifest |
| `E_EMPTY_MANIFEST` | Manifest contains no images | Add image filenames to manifest array |

### Runtime Errors

| Code | Message | Resolution |
|------|---------|------------|
| `E_INVALID_INDEX` | Current index out of bounds | Reset to index 0 (handled automatically) |
| `E_ALL_FAILED` | All images failed to load | Check ImageKit URLs and network connectivity |
| `E_ANIMATION_STUCK` | Animation flag stuck at true | Force reset `isAnimating = false` after 1s timeout |

---

## Testing Interface

### Manual Testing Helpers

```javascript
// Expose carousel instance globally for manual testing
window.carouselDebug = {
  instance: carousel,
  
  // Force navigate to specific index
  goToIndex(index) {
    const radio = document.getElementById(`carousel-radio-${index}`);
    radio.checked = true;
    carousel.currentIndex = index;
  },
  
  // Simulate image load failure
  simulateFailure(index) {
    const img = document.querySelector(`[data-index="${index}"]`);
    img.dispatchEvent(new Event('error'));
  },
  
  // Log current state
  logState() {
    console.log('Carousel State:', {
      currentIndex: carousel.currentIndex,
      isAnimating: carousel.isAnimating,
      imageCount: carousel.images.length,
      loaded: carousel.images.filter(img => img.loadStatus === "loaded").length,
      failed: carousel.images.filter(img => img.loadStatus === "failed").length
    });
  }
};
```

**Usage**:
```javascript
// In browser console:
carouselDebug.logState();
carouselDebug.goToIndex(5);
carouselDebug.simulateFailure(2);
```

---

## Performance Monitoring

### Load Time Tracking

```javascript
// Measure time to first image visible
const startTime = performance.now();
document.addEventListener('carousel:imageload', (e) => {
  if (e.detail.index === 0) {
    const firstImageTime = performance.now() - startTime;
    console.log(`First image loaded in ${firstImageTime}ms`);
    
    // Target: < 2000ms on 3G
    if (firstImageTime > 2000) {
      console.warn('First image load time exceeds target (2s)');
    }
  }
}, { once: true });
```

### Animation Performance

```javascript
// Monitor animation smoothness
let animationStart;
document.querySelector('.carousel').addEventListener('transitionstart', () => {
  animationStart = performance.now();
});

document.querySelector('.carousel').addEventListener('transitionend', () => {
  const duration = performance.now() - animationStart;
  console.log(`Animation completed in ${duration}ms`);
  
  // Target: 300-600ms
  if (duration < 300 || duration > 700) {
    console.warn('Animation duration outside target range');
  }
});
```

---

**Status**: Interface contract complete. Ready for implementation.
