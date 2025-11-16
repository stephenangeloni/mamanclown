# Feature Specification: Image Carousel with ImageKit.io Integration

**Feature Branch**: `003-image-carousel`  
**Created**: 2025-11-16  
**Status**: Draft  
**Input**: User description: "I want a type of image carousel to be on each page if there are images in the images directory in the equivalent subdirectory then put the carousel or whatever image display we've chosen and show the images. The images for FR/anniversaire.html will be in images/FR/anniversaire. The images need to all be served via an imagekit.io link with optimisations for various screen sizes and lazy loading for images that are not the first one so as to keep the first paint very quick. I'd like the images to show without any text around, just navigation buttons. I found this example approach which has text, but maybe you can find a way of suppressing it."

## Clarifications

### Session 2025-11-16

- Q: When ImageKit.io service is temporarily unavailable or an individual image fails to load through ImageKit.io, what should the carousel do? → A: Skip failed images entirely and show only successfully loaded images in the carousel
- Q: When a page's directory contains only one image, should the carousel show navigation buttons? → A: Show the single image without navigation buttons (hide navigation UI when only one image)
- Q: How should the carousel handle images with different aspect ratios (square, landscape, portrait, panoramic)? → A: Contain images within a fixed aspect ratio container, centered with letterboxing (black bars) for images that don't match
- Q: When users rapidly click navigation buttons, how should the carousel handle it? → A: Debounce navigation (ignore additional clicks while animation is in progress, only the current animation completes)
- Q: On very slow network connections, how should images load? → A: Progressive loading with low-quality placeholder (LQIP) that sharpens when full image loads, using ImageKit's f-jpg,pr-true transformation parameters for progressive JPEG output

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Images on Page with Navigation (Priority: P1)

A visitor lands on a page (e.g., FR/anniversaire.html) that has images available. They see a visually appealing image carousel displaying images without text overlays, with only navigation buttons to move between images.

**Why this priority**: This is the core value proposition - displaying images to visitors in an engaging way. Without this, the feature provides no value.

**Independent Test**: Can be fully tested by navigating to any page with images in its corresponding directory (e.g., FR/anniversaire.html with images in images/FR/anniversaire/) and verifying that images display with working navigation buttons.

**Acceptance Scenarios**:

1. **Given** a page has images in its corresponding directory, **When** a visitor loads the page, **Then** the carousel displays with the first image visible and navigation buttons present
2. **Given** the carousel is displaying, **When** the visitor clicks the next button, **Then** the next image is displayed with smooth animation
3. **Given** the carousel is displaying, **When** the visitor clicks the previous button, **Then** the previous image is displayed with smooth animation
4. **Given** the carousel is on the last image, **When** the visitor clicks next, **Then** the carousel wraps to the first image
5. **Given** the carousel is on the first image, **When** the visitor clicks previous, **Then** the carousel wraps to the last image

---

### User Story 2 - Fast Initial Page Load (Priority: P2)

A visitor accesses a page with multiple images. The page loads quickly with the first image visible, while remaining images load in the background without blocking the initial paint.

**Why this priority**: Page load performance directly impacts user experience and SEO. First paint speed is critical for user retention.

**Independent Test**: Can be tested by loading a page with multiple images and measuring time-to-first-paint. Subsequent images should load lazily without impacting initial load time.

**Acceptance Scenarios**:

1. **Given** a page has 10 images in the carousel, **When** the page loads, **Then** only the first image is loaded immediately and subsequent images load on demand or in background
2. **Given** the carousel loads the first image, **When** the page finishes loading, **Then** the time to first meaningful paint includes only the first image
3. **Given** subsequent images are lazy loaded, **When** a user navigates to the second image, **Then** it is already loaded or loads quickly without noticeable delay

---

### User Story 3 - Responsive Images for Different Devices (Priority: P2)

A visitor accesses the site from various devices (mobile phone, tablet, desktop). The carousel serves appropriately sized images optimized for their screen size and resolution, ensuring fast load times and good visual quality.

**Why this priority**: Mobile users represent a significant portion of web traffic. Serving oversized images wastes bandwidth and slows load times, while undersized images look poor on high-resolution displays.

**Independent Test**: Can be tested by accessing pages with carousels on different devices/screen sizes and verifying that appropriate image sizes are loaded (check network tab for image dimensions/file sizes).

**Acceptance Scenarios**:

1. **Given** a visitor accesses the page on a mobile device, **When** the carousel loads, **Then** images are served at mobile-optimized dimensions and file sizes
2. **Given** a visitor accesses the page on a desktop, **When** the carousel loads, **Then** images are served at desktop-optimized dimensions and file sizes
3. **Given** a visitor has a high-DPI display (Retina), **When** the carousel loads, **Then** images are served at appropriate resolution for crisp display
4. **Given** image optimization is active, **When** images are served, **Then** they maintain visual quality while minimizing file size

---

### User Story 4 - Pages Without Images Show No Carousel (Priority: P3)

A visitor accesses a page that has no images in its corresponding directory (e.g., contact page). The page displays normally without a carousel or any placeholder elements.

**Why this priority**: Clean user experience - no broken or empty components. This is lower priority because it's about polish rather than core functionality.

**Independent Test**: Can be tested by navigating to pages without images in their directories and verifying no carousel elements appear.

**Acceptance Scenarios**:

1. **Given** a page has no images in its corresponding directory, **When** the page loads, **Then** no carousel element is rendered
2. **Given** a page has an empty images directory, **When** the page loads, **Then** no carousel element is rendered
3. **Given** a page's images directory doesn't exist, **When** the page loads, **Then** no carousel element is rendered and no errors occur

---

### Edge Cases

- **Single image**: When only one image exists in the directory or only one image successfully loads, the image is displayed without navigation buttons
- **Image load failures**: When an image fails to load from ImageKit.io, the system skips that image and displays only successfully loaded images in the carousel
- **ImageKit.io service unavailable**: If ImageKit.io service is temporarily unavailable, affected images are skipped and only successfully loaded images are shown
- **Variable aspect ratios**: Images with different aspect ratios (square, landscape, portrait, panoramic) are contained within a fixed aspect ratio container with letterboxing to ensure all content is visible without cropping
- **Rapid navigation clicks**: Navigation buttons are disabled during animation transitions to prevent glitches and state inconsistencies, re-enabling when animation completes
- **Slow network connections**: Images use progressive loading (LQIP) via ImageKit.io's progressive JPEG transformation (f-jpg,pr-true), displaying low quality initially and progressively sharpening as more data loads
- What happens when image filenames contain special characters or spaces?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display image carousel on pages that have images in their corresponding directory path (e.g., FR/anniversaire.html looks for images in images/FR/anniversaire/)
- **FR-002**: System MUST NOT display carousel or any carousel elements on pages without images in their corresponding directory
- **FR-003**: Carousel MUST display images without text overlays, titles, descriptions, or captions
- **FR-004**: Carousel MUST provide navigation buttons for moving to previous and next images
- **FR-005**: Carousel MUST wrap navigation (next from last image goes to first, previous from first goes to last)
- **FR-006**: System MUST serve all carousel images via ImageKit.io URLs for optimization
- **FR-007**: System MUST lazy-load images beyond the first image to optimize initial page load
- **FR-008**: System MUST load the first image immediately for fast first paint
- **FR-009**: System MUST serve responsive images optimized for different screen sizes (mobile, tablet, desktop)
- **FR-010**: System MUST serve appropriate resolution images for standard and high-DPI displays
- **FR-011**: Carousel MUST support smooth animated transitions between images using the rotation/card-flip effect (images display at tilted angles and rotate to flat when selected)
- **FR-012**: System MUST automatically discover images in the directory structure without manual configuration per page
- **FR-013**: Navigation buttons MUST be always visible with subtle styling, becoming more prominent on hover/focus for better user feedback
- **FR-014**: Carousel MUST support common image formats (JPEG, PNG, WebP, GIF) with no limit on the number of images per carousel
- **FR-015**: System MUST skip images that fail to load from ImageKit.io and display only successfully loaded images in the carousel (no placeholder images for failed loads)
- **FR-016**: When only one image exists or only one image successfully loads, the carousel MUST display that single image without navigation buttons
- **FR-017**: Carousel MUST display images contained within a fixed aspect ratio container, centered with letterboxing for images that don't match the container aspect ratio (no cropping, all image content visible)
- **FR-018**: Navigation buttons MUST be disabled during animation transitions to prevent rapid clicking issues (debouncing), re-enabling after animation completes
- **FR-019**: System MUST use progressive loading with low-quality placeholders (LQIP) for slow network connections, utilizing ImageKit.io's progressive JPEG transformation (f-jpg,pr-true parameters) so images render at low quality and progressively sharpen as they load

### Key Entities

- **Page**: Represents an HTML page in the site (FR/anniversaire.html, EN/birthday-party.html, etc.). Each page has a corresponding directory path where its images should be located.
- **Image**: Visual content file stored in the images directory structure. Each image has a filename, format, dimensions, and is served through ImageKit.io optimization.
- **Carousel Instance**: The visual component displayed on a page. Links to a specific set of images from the page's directory, maintains current image index, and handles navigation state.
- **ImageKit.io URL**: Optimized image delivery URL that includes transformation parameters for responsive sizing, format conversion, quality optimization, and progressive JPEG rendering (f-jpg,pr-true for LQIP support).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pages with images display carousel with first image visible within 2 seconds on standard broadband connection
- **SC-002**: First meaningful paint time is not significantly impacted by presence of multiple images (less than 200ms difference vs. single image)
- **SC-003**: Mobile devices load images that are 60-70% smaller file size compared to full desktop versions
- **SC-004**: Users can navigate between images with smooth transitions (animation completes in 300-600ms)
- **SC-005**: Images maintain visual quality score above 80% while achieving file size reduction through ImageKit.io optimization
- **SC-006**: Carousel supports unlimited images with lazy loading ensuring no performance degradation regardless of image count
- **SC-007**: Navigation buttons are usable within 3 seconds of page load (even if all images not yet loaded)
- **SC-008**: Pages without images load without any console errors or visual artifacts related to missing carousel

## Assumptions

- ImageKit.io account is already set up or will be set up before implementation
- ImageKit.io API credentials and configuration are available
- Image files are already organized or will be organized in the directory structure (images/[lang]/[page-name]/)
- Images are in standard web formats (JPEG, PNG, WebP, GIF)
- The carousel will use the rotation/card-flip animation style to match the playful, entertainment theme of the site
- Navigation should work on both mouse/click and touch interfaces
- Browser support targets modern browsers with ES6+ support
- Site has existing navigation structure and the carousel is an addition, not a replacement for any existing functionality

## Dependencies

- ImageKit.io service availability and API access
- Existing site structure (FR/ and EN/ directories with HTML pages)
- Image content being available in proper directory structure
- Shared CSS/JS assets capability (as mentioned in AGENTS.md for multilingual feature)

## Out of Scope

- Uploading or managing images (assumed to be handled separately)
- Image editing or manipulation beyond ImageKit.io optimization
- Video content or animated GIFs as carousel items (unless specifically decided in clarification)
- Touch gesture support (swipe to navigate) - can be future enhancement
- Keyboard navigation (arrow keys) - can be future enhancement
- Automatic slideshow/autoplay functionality - can be future enhancement
- Image zoom or lightbox functionality - can be future enhancement
- Image metadata display (EXIF, descriptions, credits) - explicitly excluded per requirements
- Analytics tracking of image views or interactions - can be future enhancement
