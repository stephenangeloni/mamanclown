# ImageKit URL Schema Contract

**Feature**: 003-image-carousel  
**Date**: 2025-11-16  
**Status**: Complete

---

## Base URL Pattern

```text
https://ik.imagekit.io/[IMAGEKIT_ID]/[IMAGE_PATH]?tr=[TRANSFORMATIONS]
```

**Components**:
- `IMAGEKIT_ID`: Account identifier (obtained from ImageKit dashboard)
- `IMAGE_PATH`: Path to image file relative to ImageKit storage root
- `TRANSFORMATIONS`: Comma-separated transformation parameters

---

## Transformation Parameters

### Width (`w-[pixels]`)

Resize image to specified width in pixels, maintaining aspect ratio.

**Syntax**: `w-640`, `w-1024`, `w-1920`

**Examples**:
- `w-640`: Image width 640px (mobile)
- `w-1024`: Image width 1024px (tablet)
- `w-1920`: Image width 1920px (desktop)

**Behavior**:
- Height auto-calculated to maintain aspect ratio
- Upscaling allowed if source image smaller than requested width
- ImageKit returns cached version if available

### Quality (`q-[percentage]`)

Adjust image quality (compression level).

**Syntax**: `q-1` to `q-100`

**Recommended Values**:
- `q-80`: Standard quality (good balance, 60-70% file size reduction)
- `q-85`: High quality (for desktop/large displays)
- `q-70`: Lower quality (for very slow connections, rarely needed)

**Behavior**:
- Higher quality = larger file size, better visual fidelity
- ImageKit applies smart compression (perceptually optimized)

### Format (`f-[format]`)

Specify output image format.

**Syntax**: `f-auto`, `f-jpg`, `f-webp`, `f-png`

**Carousel Usage**: `f-jpg` (progressive JPEG for LQIP support)

**Behavior**:
- `f-auto`: ImageKit serves WebP to supporting browsers, JPEG otherwise
- `f-jpg`: Force JPEG output (required for progressive rendering)
- Must use `f-jpg` with `pr-true` for LQIP effect

### Progressive Rendering (`pr-true`)

Enable progressive JPEG rendering (low-quality placeholder that sharpens progressively).

**Syntax**: `pr-true` or omitted (default: `false`)

**Carousel Usage**: Always use `pr-true` for LQIP support

**Behavior**:
- Image renders at low quality initially (fast, small file)
- Progressively refines as more data loads (better quality)
- Only works with `f-jpg` format (JPEG progressive scan)
- Improves perceived performance on slow connections

---

## URL Construction Examples

### Single Image (No Responsive)

```text
https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1024,q-80,f-jpg,pr-true
```

**Use Case**: Fixed-size image, no srcset

### Responsive Image Set (Mobile, Tablet, Desktop)

**Mobile (640px)**:
```text
https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-640,q-80,f-jpg,pr-true
```

**Tablet (1024px)**:
```text
https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1024,q-80,f-jpg,pr-true
```

**Desktop (1920px)**:
```text
https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1920,q-85,f-jpg,pr-true
```

### Complete HTML Example

```html
<img 
  src="https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-640,q-80,f-jpg,pr-true"
  srcset="
    https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-640,q-80,f-jpg,pr-true 640w,
    https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1024,q-80,f-jpg,pr-true 1024w,
    https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-1920,q-85,f-jpg,pr-true 1920w
  "
  sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
  loading="lazy"
  alt="Birthday party example photo 1"
>
```

---

## JavaScript API

### `buildImagekitUrl(imagekitId, imagePath, width, quality, progressive)`

Construct a single ImageKit URL with transformations.

**Parameters**:
- `imagekitId` (string, required): ImageKit account ID
- `imagePath` (string, required): Path to image (e.g., "images/FR/anniversaire/party1.jpg")
- `width` (number, required): Target width in pixels
- `quality` (number, optional): Quality percentage (default: 80)
- `progressive` (boolean, optional): Enable progressive rendering (default: true)

**Returns**: string (complete ImageKit URL)

**Example**:
```javascript
const url = buildImagekitUrl('abc123xyz', 'images/FR/anniversaire/party1.jpg', 640, 80, true);
// Result: https://ik.imagekit.io/abc123xyz/images/FR/anniversaire/party1.jpg?tr=w-640,q-80,f-jpg,pr-true
```

**Implementation**:
```javascript
function buildImagekitUrl(imagekitId, imagePath, width, quality = 80, progressive = true) {
  const baseUrl = `https://ik.imagekit.io/${imagekitId}/${imagePath}`;
  const transforms = [
    `w-${width}`,
    `q-${quality}`,
    'f-jpg', // Always JPEG for progressive support
    progressive ? 'pr-true' : null
  ].filter(Boolean).join(',');
  
  return `${baseUrl}?tr=${transforms}`;
}
```

### `buildImagekitUrlSet(imagekitId, imagePath)`

Construct responsive URL set for srcset attribute.

**Parameters**:
- `imagekitId` (string, required): ImageKit account ID
- `imagePath` (string, required): Path to image

**Returns**: object with `{ mobile, tablet, desktop, srcset, sizes }`

**Example**:
```javascript
const urls = buildImagekitUrlSet('abc123xyz', 'images/FR/anniversaire/party1.jpg');
// Result:
// {
//   mobile: "https://ik.imagekit.io/.../party1.jpg?tr=w-640,q-80,f-jpg,pr-true",
//   tablet: "https://ik.imagekit.io/.../party1.jpg?tr=w-1024,q-80,f-jpg,pr-true",
//   desktop: "https://ik.imagekit.io/.../party1.jpg?tr=w-1920,q-85,f-jpg,pr-true",
//   srcset: "https://ik.imagekit.io/.../party1.jpg?tr=w-640,q-80,f-jpg,pr-true 640w, ...",
//   sizes: "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
// }
```

**Implementation**:
```javascript
function buildImagekitUrlSet(imagekitId, imagePath) {
  const mobile = buildImagekitUrl(imagekitId, imagePath, 640, 80, true);
  const tablet = buildImagekitUrl(imagekitId, imagePath, 1024, 80, true);
  const desktop = buildImagekitUrl(imagekitId, imagePath, 1920, 85, true);
  
  const srcset = [
    `${mobile} 640w`,
    `${tablet} 1024w`,
    `${desktop} 1920w`
  ].join(', ');
  
  const sizes = "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px";
  
  return { mobile, tablet, desktop, srcset, sizes };
}
```

---

## Validation Rules

### URL Validation

**Valid URL**:
- Must start with `https://ik.imagekit.io/`
- Must contain ImageKit ID (alphanumeric, typically 8-12 chars)
- Must contain image path (valid file path characters)
- Transformation parameters must follow `?tr=` pattern

**Invalid Examples**:
- `http://ik.imagekit.io/...` (not HTTPS)
- `https://other-cdn.com/...` (not ImageKit)
- `https://ik.imagekit.io/abc/image.jpg` (missing transformations)

### Transformation Validation

**Valid Transformations**:
- `w-[positive integer]`: Width 1-10000px
- `q-[1-100]`: Quality percentage
- `f-jpg`, `f-webp`, `f-png`, `f-auto`: Format
- `pr-true`: Progressive rendering flag

**Invalid Transformations**:
- `w-0`, `w--100`: Non-positive width
- `q-0`, `q-101`: Quality out of range
- `f-bmp`: Unsupported format
- `pr-false`: Incorrect syntax (omit parameter instead)

---

## Error Handling

### Scenario 1: Invalid ImageKit ID

**Detection**: URL returns 404 or 403

**Fallback**: Use direct image path without ImageKit
```javascript
if (imagekitUrlFails) {
  fallbackUrl = imagePath; // Direct path: /images/FR/anniversaire/party1.jpg
}
```

**User Impact**: Images load but without optimization (larger file sizes)

### Scenario 2: Image Not Found on ImageKit

**Detection**: URL returns 404 (image doesn't exist in ImageKit storage)

**Fallback**: Mark image as `failed`, skip in carousel
```javascript
img.onerror = () => {
  imageMetadata.loadStatus = "failed";
  // Carousel skips this image
};
```

**User Impact**: Image not displayed, carousel shows remaining images

### Scenario 3: Malformed Transformation Parameters

**Detection**: ImageKit returns error or default image

**Fallback**: Retry with simpler transformations
```javascript
// If complex URL fails:
// https://ik.imagekit.io/abc/image.jpg?tr=w-640,q-80,f-jpg,pr-true
// Try simpler:
// https://ik.imagekit.io/abc/image.jpg?tr=w-640
```

**User Impact**: Image loads but may not be optimized

---

## Performance Considerations

### URL Length

- Keep transformation parameters minimal (only required ones)
- ImageKit supports up to ~2000 character URLs (well above typical usage)

### Caching

- ImageKit caches transformed images (CDN edge servers)
- First request generates transformation (may take 100-500ms)
- Subsequent requests served from cache (<50ms)
- Cache key includes full URL (including transformations)

### Bandwidth Optimization

**Mobile (640px, q-80)**:
- Original 3MB JPEG → ~300KB optimized (~90% reduction)

**Desktop (1920px, q-85)**:
- Original 3MB JPEG → ~800KB optimized (~73% reduction)

**Progressive Loading**:
- Initial scan (~10% of file) loads quickly (perceived performance)
- Full image loads progressively without blocking

---

## Testing Checklist

- [ ] Construct URL with all parameters
- [ ] Verify HTTPS protocol
- [ ] Verify ImageKit ID in URL
- [ ] Verify image path in URL
- [ ] Verify transformation parameters (`w-`, `q-`, `f-`, `pr-`)
- [ ] Test mobile URL (640px) loads smaller file than desktop
- [ ] Test progressive rendering visible on throttled connection
- [ ] Test srcset attribute selects appropriate URL based on viewport
- [ ] Test image failure handling (invalid URL returns error)
- [ ] Test fallback to direct path if ImageKit unavailable

---

**Status**: Contract complete. URL schema ready for implementation.
