# Data Model: Image Carousel

**Feature**: 003-image-carousel  
**Date**: 2025-11-16  
**Status**: Complete

---

## Entities

### 1. CarouselInstance

Represents a single carousel component instance on a page.

**Attributes**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `containerId` | string | DOM element ID for carousel container | Required, must match existing element |
| `imagekitId` | string | ImageKit account ID for URL construction | Required, alphanumeric |
| `pagePath` | string | Current page pathname (e.g., "/FR/anniversaire.html") | Auto-derived from `window.location.pathname` |
| `imageDirectory` | string | Computed image directory path (e.g., "images/FR/anniversaire/") | Computed from `pagePath` |
| `images` | Array\<ImageMetadata\> | Collection of images in carousel | Minimum 0 (no carousel if empty) |
| `currentIndex` | number | Index of currently displayed image (0-based) | >= 0, < images.length |
| `isAnimating` | boolean | Flag indicating animation in progress | Defaults to false |

**Computed Fields**:

```javascript
// imageDirectory computation
const pathParts = pagePath.split('/').filter(Boolean);
const lang = pathParts[0]; // "FR" or "EN"
const page = pathParts[1].replace('.html', ''); // "anniversaire"
const imageDirectory = `images/${lang}/${page}/`;
```

**Lifecycle**:

1. **Initialization**: Created on DOMContentLoaded
   - Read manifest from DOM (`<script type="application/json" id="carousel-images">`)
   - Parse image filenames
   - Build `ImageMetadata` objects
   - Render HTML structure

2. **Active**: User interacts with carousel
   - Navigation updates `currentIndex`
   - Animation toggles `isAnimating` flag
   - Image load events update `ImageMetadata.loadStatus`

3. **Destroyed**: Page unload
   - Event listeners cleaned up
   - DOM references cleared

**Relationships**:
- Has many: `ImageMetadata` (0 to unlimited)
- Contained in: Single DOM element (`containerId`)

---

### 2. ImageMetadata

Represents a single image in the carousel with loading state and URLs.

**Attributes**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `filename` | string | Original filename (e.g., "photo1.jpg") | Required, must be valid filename |
| `fullPath` | string | Full path relative to site root | Computed: `imageDirectory + filename` |
| `imagekitUrls` | ImagekitUrlSet | Responsive URLs for different sizes | Generated on init |
| `loadStatus` | "pending" \| "loaded" \| "failed" | Current load state | Defaults to "pending" |
| `index` | number | Position in carousel (0-based) | >= 0 |
| `altText` | string | Accessibility description | Computed from page name + index |

**Computed Fields**:

```javascript
// altText computation
const pageName = pageDirectory.split('/').pop(); // "anniversaire"
const formattedName = pageName.replace(/-/g, ' '); // "birthday party"
const altText = `${formattedName} example photo ${index + 1}`;
// Result: "anniversaire example photo 3"
```

**State Transitions**:

```text
pending ──(image.onload)──> loaded
       └─(image.onerror)──> failed

loaded: Image successfully loaded from ImageKit, displayed in carousel
failed: Image failed to load, skipped in carousel display
```

**State Transition Rules**:
- Once `loaded` or `failed`, state does not change
- `failed` images are filtered out before rendering carousel
- If all images `failed`, carousel not rendered (same as 0 images)

**Relationships**:
- Belongs to: One `CarouselInstance`
- Referenced by: DOM `<img>` element (if `loadStatus === "loaded"`)

---

### 3. ImagekitUrlSet

Represents responsive URLs for a single image at different sizes.

**Attributes**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `mobile` | string | 640px width URL | `https://ik.imagekit.io/.../photo.jpg?tr=w-640,q-80,f-jpg,pr-true` |
| `tablet` | string | 1024px width URL | `https://ik.imagekit.io/.../photo.jpg?tr=w-1024,q-80,f-jpg,pr-true` |
| `desktop` | string | 1920px width URL | `https://ik.imagekit.io/.../photo.jpg?tr=w-1920,q-85,f-jpg,pr-true` |
| `srcset` | string | Combined srcset attribute value | `"...w-640... 640w, ...w-1024... 1024w, ...w-1920... 1920w"` |
| `sizes` | string | Sizes attribute value | `"(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"` |

**Generation Logic**:

```javascript
function buildImagekitUrlSet(imagekitId, imagePath) {
  const baseUrl = `https://ik.imagekit.io/${imagekitId}/${imagePath}`;
  
  const mobile = `${baseUrl}?tr=w-640,q-80,f-jpg,pr-true`;
  const tablet = `${baseUrl}?tr=w-1024,q-80,f-jpg,pr-true`;
  const desktop = `${baseUrl}?tr=w-1920,q-85,f-jpg,pr-true`;
  
  const srcset = [
    `${mobile} 640w`,
    `${tablet} 1024w`,
    `${desktop} 1920w`
  ].join(', ');
  
  const sizes = "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px";
  
  return { mobile, tablet, desktop, srcset, sizes };
}
```

**Immutable**: Once generated, URLs do not change during carousel lifecycle.

---

## Entity Relationships

```text
CarouselInstance (1)
  ├─ has many ─> ImageMetadata (0..*)
  │              └─ has one ─> ImagekitUrlSet (1)
  └─ rendered in ─> DOM Element (1)
```

**Cardinality**:
- 1 CarouselInstance per page (even if multiple carousel containers theoretically possible, spec assumes single carousel per page)
- 0 to unlimited ImageMetadata per CarouselInstance
- 1 ImagekitUrlSet per ImageMetadata (always generated, even if image fails to load)

---

## Validation Rules

### CarouselInstance Validation

1. **Container Existence**: `document.getElementById(containerId)` must return an element
2. **ImageKit ID**: Must be non-empty string
3. **Page Path**: Must be valid pathname matching `/[lang]/[page].html` pattern
4. **Current Index**: Must be within bounds `0 <= currentIndex < images.length`

**Error Handling**:
- Missing container: Log error, abort carousel initialization
- Invalid ImageKit ID: Log error, abort initialization
- Invalid page path: Log warning, attempt best-guess image directory
- Invalid current index: Reset to 0

### ImageMetadata Validation

1. **Filename**: Must not be empty, must be valid filename (no `/`, `\`, null bytes)
2. **Index**: Must be >= 0
3. **Load Status**: Must be one of `"pending"`, `"loaded"`, `"failed"`

**Error Handling**:
- Invalid filename: Skip image, log warning
- Negative index: Log error, skip image
- Invalid load status: Default to `"pending"`

### ImagekitUrlSet Validation

1. **URLs**: Must be valid HTTPS URLs
2. **Srcset**: Must follow `[url] [width]w` format
3. **Sizes**: Must follow media query syntax

**Error Handling**:
- Invalid URL: Log error, use fallback (direct path without ImageKit)
- Malformed srcset: Fall back to single URL in `src` attribute
- Invalid sizes: Use default `100vw`

---

## State Management

### Carousel State

**Initial State**:
```javascript
{
  currentIndex: 0,
  isAnimating: false,
  images: [
    { loadStatus: "pending", ... },
    { loadStatus: "pending", ... },
    // ...
  ]
}
```

**State Transitions**:

```text
User clicks "next" button:
  1. Check: isAnimating === false? (if true, ignore click)
  2. Set: isAnimating = true
  3. Calculate: nextIndex = (currentIndex + 1) % images.length (wrap around)
  4. Update: currentIndex = nextIndex
  5. Update DOM: Check radio button for nextIndex
  6. Wait: 600ms (animation duration)
  7. Set: isAnimating = false

Image loads successfully:
  1. Find: ImageMetadata by index
  2. Update: loadStatus = "loaded"
  3. Check: All images loaded? If yes, mark carousel ready

Image fails to load:
  1. Find: ImageMetadata by index
  2. Update: loadStatus = "failed"
  3. Filter: Remove from display (hide corresponding card)
  4. Re-index: Adjust currentIndex if needed
```

### Persistence

**No persistence required**. Carousel state is ephemeral:
- Resets on page reload
- No localStorage or cookies
- No URL hash for current image (could be future enhancement)

---

## Data Flow

### Initialization Flow

```text
1. DOMContentLoaded event fires
   ↓
2. Read manifest from DOM (JSON script tag)
   ↓
3. Parse filenames array
   ↓
4. For each filename:
   - Create ImageMetadata
   - Build ImagekitUrlSet
   - Add to CarouselInstance.images
   ↓
5. Check: images.length > 0?
   ├─ No: Abort, no carousel rendered
   └─ Yes: Continue
   ↓
6. Render HTML structure:
   - Radio inputs (hidden)
   - Card elements (one per image)
   - Navigation buttons
   ↓
7. Attach event listeners:
   - Image onload/onerror events
   - Navigation button click events
   ↓
8. Set first radio checked (currentIndex = 0)
   ↓
9. Load first image (eager + fetchpriority="high")
   ↓
10. Lazy load remaining images (loading="lazy")
```

### Navigation Flow

```text
User clicks navigation button
   ↓
Check: isAnimating?
├─ Yes: Ignore click, return
└─ No: Continue
   ↓
Set: isAnimating = true
   ↓
Calculate next index (wrap if needed)
   ↓
Update: currentIndex
   ↓
Update DOM: Check corresponding radio button
   ↓
Browser triggers CSS animation (600ms)
   ↓
setTimeout: 600ms
   ↓
Set: isAnimating = false
```

### Image Load Flow

```text
Browser fetches image URL
   ↓
Success? ─┬─ Yes: Fire img.onload event
          │     ↓
          │   Update: loadStatus = "loaded"
          │     ↓
          │   Display: Image visible in carousel
          │
          └─ No: Fire img.onerror event
                ↓
              Update: loadStatus = "failed"
                ↓
              Hide: Card element (display:none)
                ↓
              Check: Any images still loaded?
                ├─ Yes: Carousel continues with remaining
                └─ No: Hide entire carousel
```

---

## Example Data Structure

**JavaScript Representation**:

```javascript
const carousel = {
  containerId: "carousel-container",
  imagekitId: "abc123xyz",
  pagePath: "/FR/anniversaire.html",
  imageDirectory: "images/FR/anniversaire/",
  currentIndex: 2, // Showing third image
  isAnimating: false,
  images: [
    {
      filename: "party1.jpg",
      fullPath: "images/FR/anniversaire/party1.jpg",
      imagekitUrls: {
        mobile: "https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-640,q-80,f-jpg,pr-true",
        tablet: "https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1024,q-80,f-jpg,pr-true",
        desktop: "https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1920,q-85,f-jpg,pr-true",
        srcset: "https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-640,q-80,f-jpg,pr-true 640w, ...",
        sizes: "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
      },
      loadStatus: "loaded",
      index: 0,
      altText: "anniversaire example photo 1"
    },
    {
      filename: "party2.jpg",
      fullPath: "images/FR/anniversaire/party2.jpg",
      imagekitUrls: { /* ... */ },
      loadStatus: "loaded",
      index: 1,
      altText: "anniversaire example photo 2"
    },
    {
      filename: "party3.jpg",
      fullPath: "images/FR/anniversaire/party3.jpg",
      imagekitUrls: { /* ... */ },
      loadStatus: "loaded",
      index: 2,
      altText: "anniversaire example photo 3"
    }
  ]
};
```

**JSON Manifest (in HTML)**:

```json
[
  "party1.jpg",
  "party2.jpg",
  "party3.jpg"
]
```

---

## Data Integrity

### Invariants

1. **Index bounds**: `0 <= currentIndex < images.length` (always true after init)
2. **Unique indices**: Each ImageMetadata has unique index within CarouselInstance
3. **Load status progression**: Status never regresses (loaded/failed are terminal states)
4. **Animation exclusivity**: Only one animation active at a time (isAnimating flag)

### Error Recovery

**Scenario 1**: All images fail to load
- **Detection**: Check if `images.filter(img => img.loadStatus === "loaded").length === 0`
- **Recovery**: Hide carousel, show no content (same as 0 images case)
- **User Impact**: Page displays without carousel (graceful degradation)

**Scenario 2**: Some images fail to load
- **Detection**: `loadStatus === "failed"` for subset of images
- **Recovery**: Skip failed images, display only loaded ones
- **User Impact**: Carousel works with fewer images (transparent to user)

**Scenario 3**: Invalid currentIndex
- **Detection**: `currentIndex >= images.length` after filtering failed images
- **Recovery**: Reset to `currentIndex = 0`
- **User Impact**: Carousel jumps to first image (minor UX glitch)

---

**Status**: Data model complete. Ready for contracts definition.
