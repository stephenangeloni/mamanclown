# Quickstart: Adding Images to Pages

**Feature**: 003-image-carousel  
**Date**: 2025-11-16  
**Status**: Complete

---

## Prerequisites

- ImageKit account created at https://imagekit.io
- ImageKit ID obtained from dashboard (format: `abc123xyz`)
- Images prepared and organized locally

---

## Step 1: Organize Images Locally

Create directory structure matching your page paths:

```text
images/
├── FR/
│   ├── anniversaire/
│   │   ├── party1.jpg
│   │   ├── party2.jpg
│   │   └── party3.jpg
│   ├── ateliers/
│   │   ├── workshop1.jpg
│   │   └── workshop2.jpg
│   └── spectacles/
│       ├── show1.jpg
│       └── show2.jpg
└── EN/
    ├── birthday-party/
    │   ├── party1.jpg
    │   ├── party2.jpg
    │   └── party3.jpg
    ├── workshops/
    │   ├── workshop1.jpg
    │   └── workshop2.jpg
    └── shows/
        ├── show1.jpg
        └── show2.jpg
```

**Naming Convention**:
- Use lowercase filenames
- Avoid spaces (use hyphens: `party-photo.jpg` not `party photo.jpg`)
- Use standard image formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Keep filenames descriptive but short

**Directory Mapping**:
- `FR/anniversaire.html` → `images/FR/anniversaire/`
- `EN/birthday-party.html` → `images/EN/birthday-party/`
- Pattern: `[lang]/[page-name].html` → `images/[lang]/[page-name]/`

---

## Step 2: Upload Images to ImageKit

1. **Log in to ImageKit Dashboard**: https://imagekit.io/dashboard

2. **Navigate to Media Library**: Click "Media Library" in left sidebar

3. **Create Directory Structure**:
   - Click "New Folder"
   - Create `images` folder
   - Inside `images`, create `FR` and `EN` folders
   - Inside each language folder, create page-specific folders

4. **Upload Images**:
   - Navigate to desired folder (e.g., `images/FR/anniversaire/`)
   - Click "Upload" button
   - Select all images for that page
   - Wait for upload to complete (progress bar shows status)

5. **Verify Upload**:
   - Check that file names match exactly (case-sensitive)
   - Test sample URL: `https://ik.imagekit.io/[YOUR_ID]/images/FR/anniversaire/party1.jpg`
   - Should display image in browser

**Important**: Maintain exact directory structure and filenames between local and ImageKit.

---

## Step 3: Add Carousel to HTML Page

### 3.1: Add Image Manifest

In your HTML file (e.g., `FR/anniversaire.html`), add before closing `</body>` tag:

```html
<!-- Image manifest for carousel -->
<script type="application/json" id="carousel-images">
[
  "party1.jpg",
  "party2.jpg",
  "party3.jpg"
]
</script>
```

**Notes**:
- List images in desired display order
- Use only filenames (not full paths)
- Valid JSON array format (commas between items, no trailing comma)

### 3.2: Add Carousel Assets

Add CSS and JS includes (before closing `</body>` tag, after manifest):

```html
<!-- Carousel assets -->
<link rel="stylesheet" href="../carousel.css">
<script src="../carousel.js" defer></script>
```

**Path Notes**:
- For pages in `FR/` or `EN/` subdirectories, use `../` to go up one level
- If carousel files in different location, adjust path accordingly

### 3.3: Add Carousel Container

Add carousel container div where you want carousel to appear:

```html
<div id="carousel-container"></div>
```

**Placement Options**:
- After page header, before main content (hero carousel)
- Within main content section (inline gallery)
- Before footer (portfolio showcase)

### 3.4: Initialize Carousel

Add initialization script (after carousel.js include):

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel({
      imagekitId: 'YOUR_IMAGEKIT_ID',  // Replace with actual ImageKit ID
      containerSelector: '#carousel-container'
    });
  });
</script>
```

**Replace** `YOUR_IMAGEKIT_ID` with your actual ImageKit account ID (found in dashboard).

### Complete Example

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anniversaire - Maman Clown</title>
  <link rel="stylesheet" href="../header.css">
  <link rel="stylesheet" href="../carousel.css">
</head>
<body>
  <!-- Header (existing) -->
  <header>
    <!-- ... existing header content ... -->
  </header>

  <!-- Main content -->
  <main>
    <h1>Anniversaire</h1>
    
    <!-- Carousel container -->
    <div id="carousel-container"></div>
    
    <p>Description of birthday party services...</p>
  </main>

  <!-- Footer (existing) -->
  <footer>
    <!-- ... existing footer content ... -->
  </footer>

  <!-- Carousel setup -->
  <script type="application/json" id="carousel-images">
  [
    "party1.jpg",
    "party2.jpg",
    "party3.jpg",
    "party4.jpg"
  ]
  </script>

  <script src="../header.js" defer></script>
  <script src="../carousel.js" defer></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      initCarousel({
        imagekitId: 'abc123xyz',
        containerSelector: '#carousel-container'
      });
    });
  </script>
</body>
</html>
```

---

## Step 4: Test Locally

### 4.1: Serve Files Locally

**Option A: Python HTTP Server** (if Python installed):
```bash
cd /path/to/mamanclown
python3 -m http.server 8000
```

**Option B: Node HTTP Server** (if Node.js installed):
```bash
npx http-server -p 8000
```

**Option C: VS Code Live Server** (if using VS Code):
- Install "Live Server" extension
- Right-click HTML file → "Open with Live Server"

### 4.2: Open in Browser

Navigate to: `http://localhost:8000/FR/anniversaire.html`

### 4.3: Verify Carousel

**Visual Checks**:
- ✅ Images display in carousel container
- ✅ First image visible immediately
- ✅ Navigation buttons present and visible
- ✅ Hover over buttons changes styling

**Functional Checks**:
- ✅ Click "next" button → advances to next image with animation
- ✅ Click "previous" button → goes to previous image with animation
- ✅ Navigation wraps around (last → first, first → last)
- ✅ Rapid clicking doesn't break animation (debouncing works)

**Browser Console Checks**:
- ✅ No JavaScript errors (open DevTools → Console tab)
- ✅ Images loading from ImageKit URLs (Network tab → filter by "ik.imagekit")
- ✅ Responsive srcsets loading correct sizes (Network tab → check image dimensions)

### 4.4: Test Responsive Behavior

**Mobile (320px - 640px)**:
- Open DevTools → Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
- Select "iPhone SE" or set width to 375px
- Verify: Small images loading (~640px width in Network tab)
- Verify: Navigation buttons are 44×44px minimum (tap-friendly)

**Tablet (641px - 1024px)**:
- Set width to 768px (iPad)
- Verify: Medium images loading (~1024px width)

**Desktop (1025px+)**:
- Set width to 1920px
- Verify: Large images loading (~1920px width)

### 4.5: Test Performance

**3G Throttling** (simulates slow connection):
- DevTools → Network tab → Throttling dropdown → "Slow 3G"
- Reload page
- Verify: First image loads within 2-3 seconds
- Verify: Progressive JPEG effect visible (image starts blurry, sharpens)
- Verify: Subsequent images lazy load (not all loading simultaneously)

---

## Step 5: Deploy to Production

### 5.1: Commit Changes

```bash
git add FR/anniversaire.html
git add images/FR/anniversaire/
git commit -m "Add image carousel to FR/anniversaire.html with 4 photos"
git push origin 003-image-carousel
```

### 5.2: Test on Live Site

After deploying to production:
- Visit live URL (e.g., https://yourdomain.com/FR/anniversaire.html)
- Repeat verification steps from Step 4
- Test on real mobile device (not just emulator)

---

## Troubleshooting

### Issue: No Carousel Appears

**Symptom**: Page loads but carousel container is empty

**Diagnosis**:
1. Open browser console (F12)
2. Check for errors (red text)

**Common Causes**:

**Cause 1: Manifest Missing**
- **Check**: Does page have `<script type="application/json" id="carousel-images">`?
- **Fix**: Add manifest script tag with image filenames

**Cause 2: Invalid JSON**
- **Check**: Console error "Unexpected token" or "JSON.parse error"
- **Fix**: Validate JSON syntax (no trailing commas, proper quotes)
  ```json
  // ❌ Invalid (trailing comma)
  ["image1.jpg", "image2.jpg",]
  
  // ✅ Valid
  ["image1.jpg", "image2.jpg"]
  ```

**Cause 3: Wrong Container Selector**
- **Check**: `initCarousel({ containerSelector: '#carousel-container' })`
- **Check**: HTML has `<div id="carousel-container"></div>` (matching ID)
- **Fix**: Ensure IDs match exactly (case-sensitive)

**Cause 4: JavaScript Not Loaded**
- **Check**: Console error "initCarousel is not defined"
- **Fix**: Verify `<script src="../carousel.js" defer></script>` path is correct
- **Fix**: Remove `defer` temporarily to test

---

### Issue: Images Not Loading

**Symptom**: Carousel appears but images show broken icons or don't load

**Diagnosis**:
1. Open DevTools → Network tab
2. Filter by "images" or "ik.imagekit"
3. Look for failed requests (red status codes: 404, 403, 500)

**Common Causes**:

**Cause 1: Wrong ImageKit ID**
- **Check**: URL in Network tab shows `https://ik.imagekit.io/[YOUR_ID]/...`
- **Check**: `[YOUR_ID]` matches your ImageKit dashboard ID
- **Fix**: Update `imagekitId` in `initCarousel()` call

**Cause 2: Images Not Uploaded to ImageKit**
- **Check**: Try accessing URL directly: `https://ik.imagekit.io/[YOUR_ID]/images/FR/anniversaire/party1.jpg`
- **Fix**: Upload missing images to ImageKit (Step 2)

**Cause 3: Wrong Image Path**
- **Check**: Manifest lists `"party1.jpg"` but file is actually `"Party1.jpg"` (case mismatch)
- **Fix**: Rename files to match manifest exactly (case-sensitive)

**Cause 4: ImageKit Account Inactive**
- **Check**: ImageKit dashboard shows account status
- **Fix**: Verify email, activate account, or check billing status

---

### Issue: Slow Loading on Mobile

**Symptom**: Images take >5 seconds to load on mobile devices

**Diagnosis**:
1. DevTools → Network tab → Check image file sizes
2. Look for images >1MB on mobile (too large)

**Common Causes**:

**Cause 1: Not Using ImageKit Transformations**
- **Check**: URLs have `?tr=w-640,q-80,f-jpg,pr-true` parameters
- **Check**: Network tab shows transformed sizes (640px width, not original size)
- **Fix**: Verify `buildImagekitUrl()` function includes transformations

**Cause 2: First Image Not Prioritized**
- **Check**: First `<img>` has `fetchpriority="high"` and `loading="eager"`
- **Fix**: Ensure render logic prioritizes first image differently

**Cause 3: All Images Loading at Once**
- **Check**: Network tab shows all images loading simultaneously
- **Fix**: Verify subsequent images have `loading="lazy"` attribute

---

### Issue: Animation Glitches

**Symptom**: Carousel jumps, flickers, or shows multiple images at once

**Common Causes**:

**Cause 1: Rapid Clicking**
- **Check**: Click buttons rapidly → does it break?
- **Expected**: Clicks during animation should be ignored (debouncing)
- **Fix**: Verify `.is-animating` class logic in `handleNavigation()`

**Cause 2: CSS Timing Mismatch**
- **Check**: CSS transition duration (e.g., `transition: all 600ms`)
- **Check**: JavaScript timeout duration (e.g., `setTimeout(..., 600)`)
- **Fix**: Ensure durations match exactly

**Cause 3: Z-Index Issues**
- **Check**: Multiple images visible at once
- **Fix**: Verify CSS z-index rules for `.carousel-card` stacking

---

### Issue: Single Image Shows Navigation

**Symptom**: Page with only 1 image shows prev/next buttons

**Expected Behavior**: Single image should display without navigation buttons

**Fix**:
- Check: carousel.js logic for `images.length === 1` case
- Ensure: Navigation buttons hidden when only one image

**Workaround**: Remove extra images from manifest, leaving only one filename

---

### Issue: Console Errors

**Error**: `"Cannot read property 'checked' of null"`
- **Cause**: Radio button ID mismatch
- **Fix**: Verify radio button IDs match label `for` attributes

**Error**: `"Failed to fetch"`
- **Cause**: ImageKit URL unreachable (network issue or wrong URL)
- **Fix**: Check internet connection, verify ImageKit URL in browser

**Error**: `"Unexpected end of JSON input"`
- **Cause**: Empty or malformed manifest JSON
- **Fix**: Validate JSON syntax, ensure array not empty

---

## Adding Carousel to Multiple Pages

### Batch Setup Workflow

For adding carousels to all pages at once:

1. **Create All Image Directories**:
   ```bash
   mkdir -p images/FR/{anniversaire,ateliers,spectacles}
   mkdir -p images/EN/{birthday-party,workshops,shows}
   ```

2. **Organize Images**:
   - Place images in respective directories
   - Use consistent naming convention

3. **Upload All to ImageKit**:
   - Use ImageKit bulk upload
   - Maintain directory structure

4. **Template HTML Snippet**:
   ```html
   <!-- Copy this to each page, update manifest filenames -->
   <script type="application/json" id="carousel-images">
   ["image1.jpg", "image2.jpg"]
   </script>
   <link rel="stylesheet" href="../carousel.css">
   <script src="../carousel.js" defer></script>
   <script>
     document.addEventListener('DOMContentLoaded', () => {
       initCarousel({
         imagekitId: 'abc123xyz',
         containerSelector: '#carousel-container'
       });
     });
   </script>
   <div id="carousel-container"></div>
   ```

5. **Customize Per Page**:
   - Update manifest with correct filenames
   - Adjust container placement if needed

---

## Best Practices

### Image Quality

- **Source Images**: High resolution (2000px+ width), good lighting
- **File Size**: 1-3MB originals OK (ImageKit optimizes)
- **Aspect Ratio**: Consistent ratios preferred (4:3 or 16:9)
- **Format**: JPEG for photos, PNG for graphics/logos

### Naming Conventions

- **Descriptive**: `birthday-cake-setup.jpg` not `IMG_1234.jpg`
- **Sequential**: `party1.jpg`, `party2.jpg` for easy ordering
- **No Spaces**: Use hyphens (`party-photo.jpg`) not spaces

### Manifest Ordering

- **First Image**: Most important/compelling photo (loaded first)
- **Variety**: Show different aspects (setup, kids, entertainment, results)
- **Limit**: 5-10 images per page (optimal, unlimited supported)

### Performance

- **Test on Real Devices**: Emulators don't reflect real mobile performance
- **Monitor File Sizes**: Check Network tab to verify optimization working
- **Throttle Testing**: Always test with 3G throttling enabled

---

## Getting Help

**Browser Console Logs**:
- Carousel logs initialization info and errors
- Check console first when issues arise

**ImageKit Support**:
- Dashboard: https://imagekit.io/dashboard
- Docs: https://docs.imagekit.io/
- Support: support@imagekit.io

**Debugging**:
- Use `window.carouselDebug.logState()` in console to inspect state
- Check Network tab for image load failures
- Validate JSON manifest at https://jsonlint.com/

---

**Status**: Quickstart complete. Ready for use by content editors.
