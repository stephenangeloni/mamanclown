# Implementation Plan: Multi-Page Website with Navigation

**Branch**: `001-multi-page-navigation` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-multi-page-navigation/spec.md`

## Summary

Expand the existing single-page Maman Clown website into a multi-page structure with five pages (Home, Birthdays, Contact, Shows, Characters). Implement a consistent header across all pages featuring a reduced-size logo (top left), page title (top center), and hamburger menu (top right) that slides over from the right with a semi-transparent backdrop. The header should hide when scrolling down and reappear immediately on any upward scroll. Navigation menu dynamically excludes the current page and supports full WCAG keyboard accessibility.

## Technical Context

**Language/Version**: Vanilla HTML5, CSS3, JavaScript ES6+  
**Primary Dependencies**: None (canvas-confetti for existing home page effects only)  
**Storage**: N/A (static content website)  
**Testing**: Manual testing on real devices (iPhone Safari iOS 15+, Android Chrome, Desktop browsers)  
**Target Platform**: Web (mobile-first, responsive 320px-1920px)  
**Project Type**: Static website (single HTML files per page, no build process)  
**Performance Goals**: <2 seconds load time on 3G, <0.5s menu animation, <0.3s header hide/show  
**Constraints**: ImageKit CDN for all images, WCAG AA accessibility, valid W3C HTML  
**Scale/Scope**: 5 total pages, shared header component pattern, no backend/database

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity First ✅ PASS
- No frameworks or build tools introduced
- Plain HTML, CSS, vanilla JavaScript maintained
- Each page is a standalone HTML file (simplest possible multi-page structure)
- Shared header pattern reused via copy-paste (acceptable for 5 pages, no templating system needed)

### Principle II: User Experience ✅ PASS
- Interactive hamburger menu with smooth animations (<0.5s)
- Smart header hide/show for better reading experience (<0.3s)
- Keyboard navigation fully supported (WCAG standards)
- All existing contact methods preserved and functional
- Page titles clearly indicate location

### Principle III: Performance & Accessibility ✅ PASS
- Images continue using ImageKit CDN with responsive srcsets and WebP
- No new external dependencies (menu is pure CSS/JS)
- WCAG AA keyboard navigation implemented (Tab, Enter, Escape, focus trap)
- Semantic HTML maintained for screen readers
- Meta tags required for all new pages (description, Open Graph, Twitter Card)
- Local SEO keywords included for Monaco/Monte-Carlo region

### Principle IV: Visual Consistency ✅ PASS
- Existing rainbow theme maintained across all pages
- Logo size and position consistent (top left, reduced from hero size)
- Comic Neue font family preserved for brand identity
- Hamburger menu uses existing green accent color (#00a700)

### Principle V: Mobile-First Design ✅ PASS
- Header behavior optimized for mobile reading (auto-hide on scroll)
- Hamburger menu pattern is mobile-native UX
- Touch targets meet 44×44px minimum
- Responsive layout tested 320px-1920px

### Review Gates Checklist
- [ ] All links work (internal navigation + existing phone/email/social/vCard)
- [ ] All images load correctly via ImageKit CDN (reduced logo on all pages)
- [ ] Page loads in under 2 seconds on 3G
- [ ] Interactions work on mobile (tap hamburger, scroll hide/show)
- [ ] Visual consistency maintained (rainbow theme, fonts, colors)
- [ ] No console errors
- [ ] HTML validates (W3C)
- [ ] Meta description present and accurate (150-160 chars) on all pages
- [ ] Open Graph and Twitter Card tags present on all pages
- [ ] ImageKit transformations working (WebP, srcset, quality)
- [ ] Keyboard navigation works (Tab, Enter, Escape, focus trap)
- [ ] Header hide/show responds correctly to scroll direction

**Gate Status**: ✅ PASS - No constitution violations. Static multi-page structure is the simplest approach for this requirement.

## Project Structure

### Documentation (this feature)

```text
specs/001-multi-page-navigation/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already exists)
├── research.md          # Phase 0 output (generated below)
├── data-model.md        # Phase 1 output (generated below)
├── quickstart.md        # Phase 1 output (generated below)
├── contracts/           # Phase 1 output (API contracts - N/A for static site, will document page structure)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Static website structure (no src/ directory, files at root)
/
├── index.html           # Home page (existing, minimal modifications)
├── birthdays.html       # NEW: Birthdays page
├── contact.html         # NEW: Contact page
├── shows.html           # NEW: Shows page
├── characters.html      # NEW: Characters page
├── favicon.svg          # Existing favicon (unchanged)
├── images/              # NEW: Directory for reduced logo and page-specific images
│   └── mamanclown.webp  # Copy from ImageKit for local fallback (optional)
└── .specify/            # Specification directory (existing)
```

**Structure Decision**: Static HTML files at repository root. This is the simplest multi-page structure for a 5-page website with no backend. Each page is self-contained with shared header HTML/CSS/JS duplicated across files. For 5 pages, this is simpler than introducing a templating system or build process.

## Complexity Tracking

No violations - constitution check passed. No complexity justification needed.

---

# Phase 0: Research & Technical Decisions

## Research Questions

1. **Header Component Pattern**: How to implement consistent header across 5 pages without templating?
2. **Scroll Detection**: Best practice for detecting scroll direction in vanilla JavaScript?
3. **Hamburger Menu Animation**: CSS-only vs. JavaScript approach for slide-over overlay?
4. **Focus Trap Implementation**: WCAG-compliant keyboard navigation without libraries?
5. **Page Structure**: Optimal HTML structure for new content pages (birthdays, contact, shows, characters)?

---

*Research findings will be documented in `research.md` after Phase 0 completion.*
