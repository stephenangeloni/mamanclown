# Maman Clown Website Constitution

<!--
Sync Impact Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERSION: 1.1.0 (Minor - expanded performance & SEO guidance)
CHANGE TYPE: Material expansion of Principle III and Technical Standards
RATIFICATION: 2025-11-15
LAST AMENDED: 2025-11-15

PRINCIPLES MODIFIED:
- III. Performance & Accessibility → expanded with ImageKit requirement and SEO meta tags

SECTIONS MODIFIED:
- Technical Standards → added Asset Management subsection for ImageKit guidance
- Technical Standards → expanded with SEO Meta Tags subsection
- Review Gates → added SEO validation checkpoint

TEMPLATE SYNC STATUS:
✅ plan-template.md - Constitution Check section aligns with expanded principles
✅ spec-template.md - Requirements alignment supports SEO and performance goals
✅ tasks-template.md - Task categorization ready for performance/SEO work
⚠️  Command files (.specify/scripts/) - May need updates for SEO validation

CHANGES IN v1.1.0:
- Expanded Principle III with explicit ImageKit CDN requirement for images
- Added SEO meta tags as mandatory requirement (description, Open Graph, Twitter Card)
- Strengthened asset management guidance with ImageKit integration details
- Added SEO validation to Review Gates checklist
- Clarified that meta tags are critical for Monaco/Monte-Carlo local SEO positioning

RATIONALE FOR MINOR BUMP:
This is a MINOR version bump because:
1. We are materially expanding Principle III (Performance & Accessibility)
2. We are adding new mandatory technical standards (SEO meta tags)
3. No existing principles removed or fundamentally redefined
4. Changes are additive and enhance existing performance/accessibility focus
5. Project scope remains static website but requirements are more specific

FOLLOW-UP ITEMS:
- None (all placeholders resolved)

NOTES:
ImageKit CDN is the chosen solution for image optimization to ensure fast
loading on 3G connections. SEO meta tags are critical for local discovery
in Monaco/Monte-Carlo region where the performer operates. Both changes
reinforce existing User Experience and Performance principles with concrete
implementation requirements.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

## Core Principles

### I. Simplicity First

Every feature and change MUST prioritize simplicity over complexity. The website is a single-page digital business card for a performing artist offering birthdays, shows, and performances—any additions MUST have clear user value that drives bookings or builds trust. No frameworks, build tools, or dependencies unless absolutely justified. Plain HTML, CSS, and vanilla JavaScript are preferred. Complexity requires explicit rationale documenting why simpler alternatives were insufficient.

**Rationale**: The project is a static contact page for a performer. The goal is conversion (contact/booking), not technical complexity. Introducing unnecessary tooling creates maintenance burden without proportional benefit. Keeping the codebase simple ensures anyone can understand, modify, and deploy it quickly.

### II. User Experience

All changes MUST enhance or maintain user experience. Interactive elements MUST be delightful and performant. Loading speed MUST remain under 2 seconds on 3G connections. Visual feedback for interactions MUST be immediate and intuitive. Contact methods (phone, email, social media, vCard download) MUST be instantly accessible and functional. Dead links, broken images, or non-functional features are strictly prohibited before deployment.

**Rationale**: The website represents a professional performer offering birthdays, shows, and performances. First impressions directly impact booking decisions. Parents searching for entertainment need immediate confidence that this performer is professional, reliable, and easy to contact. Users expect instant, joyful interactions that mirror the entertainment experience itself.

### III. Performance & Accessibility

Pages MUST load efficiently with minimal resource consumption. Images MUST be optimized using ImageKit CDN with responsive srcsets, WebP format, and appropriate quality settings to ensure fast loading even on 3G connections. External dependencies (fonts, libraries) MUST be evaluated for impact on load time and loaded with performance best practices (preconnect, font-display: swap, defer/async). All interactive elements MUST be keyboard accessible. Color contrast MUST meet WCAG AA standards. Semantic HTML MUST be used for screen reader compatibility.

**SEO & Discoverability**: Meta tags are MANDATORY for search engine positioning. Every page MUST include accurate meta descriptions, Open Graph tags, and Twitter Card metadata optimized for local search (Monaco/Monte-Carlo region) and multilingual audiences (French/English). Meta descriptions MUST be compelling, accurate, and within 150-160 characters for optimal display in search results.

**Rationale**: Fast, accessible sites reach wider audiences, improve SEO rankings, and demonstrate professional quality. ImageKit CDN is used specifically to deliver optimized images without manual compression workflows. SEO meta tags are critical for local discovery—parents searching for "birthday entertainment Monaco" or "animateur anniversaire Monte-Carlo" must find this site. Accessibility is not optional—it's a baseline requirement for inclusive service delivery.

### IV. Visual Consistency

Design changes MUST maintain consistent visual language: colors, fonts, spacing, and iconography. Rainbow-themed styling MUST remain coherent across all elements. Layout MUST preserve the centered, playful aesthetic. Any new visual elements MUST align with the existing "joyful, professional performer" brand identity that appeals to families booking birthdays, shows, and performances.

**Rationale**: Brand consistency builds trust with parents and event organizers. Visual coherence ensures users immediately understand the site's purpose (performer for hire) and feel confident contacting the service for their events.

### V. Mobile-First Design

All features MUST work perfectly on mobile devices first. Layout MUST be responsive and tested on viewport widths from 320px to 1920px. Touch targets MUST be minimum 44×44px. Text MUST remain readable without zooming. Desktop enhancements are secondary to mobile functionality. Contact actions (tap to call, tap to email) MUST work seamlessly on mobile.

**Rationale**: Most users will access the site from mobile devices when urgently searching for birthday entertainers or performance services. Parents planning parties often browse on phones. Mobile-first ensures the primary audience (event planners on-the-go) can instantly contact and book the performer.

## Technical Standards

### Code Quality

- HTML MUST be valid (W3C validator)
- CSS MUST avoid redundancy and use clear naming conventions
- JavaScript MUST be vanilla ES6+ (no transpilation unless justified)
- Comments MUST explain "why," not "what"
- Indentation MUST be consistent (4 spaces for HTML/CSS/JS)

### Asset Management

- Images MUST use ImageKit CDN with:
  - Responsive srcsets for multiple viewport sizes
  - WebP format with fallbacks (`?tr=f-auto`)
  - Appropriate quality settings (`?tr=q-80` or similar)
  - Width transformations matching actual display sizes (`?tr=w-XXX`)
  - Lazy loading for below-the-fold images (use `loading="lazy"` or defer)
- Hero/above-the-fold images MUST use `fetchpriority="high"` for immediate loading
- External libraries MUST use CDN with integrity hashes (if used at all)
- Fonts MUST use `font-display: swap` for performance
- Font preconnect MUST be used for external font services
- Favicon MUST be provided in multiple formats (SVG preferred, with fallbacks)

### SEO Meta Tags

Every page MUST include the following meta tags:

- **Description**: `<meta name="description" content="[150-160 chars, compelling, accurate, includes Monaco/Monte-Carlo keywords]">`
- **Open Graph**: Basic tags for social sharing
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **Language**: `<html lang="[primary-language]">` (e.g., "fr" or "en")
- **Viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Character Set**: `<meta charset="UTF-8">`

**Local SEO Optimization**:
- Meta descriptions MUST reference Monaco, Monte-Carlo, or Côte d'Azur for regional targeting
- Content MUST be bilingual-friendly (French primary, English secondary) where applicable
- Keywords MUST align with search intent: birthday entertainment, children's parties, professional performer

### Version Control

- Commits MUST have descriptive messages explaining intent
- Commits MUST be atomic (one logical change per commit)
- Breaking changes MUST be flagged in commit messages

## Development Workflow

### Change Process

1. **Verify Intent**: Clearly define what user need the change addresses
2. **Validate Simplicity**: Confirm no simpler solution exists
3. **Test Locally**: Verify on multiple devices/browsers before committing
4. **Document Changes**: Update comments/documentation if behavior changes
5. **Commit Atomically**: One logical unit per commit with clear message

### Review Gates

Before any change goes live:

- [ ] All links work (phone, email, social, vCard)
- [ ] All images load correctly via ImageKit CDN
- [ ] Page loads in under 2 seconds on 3G
- [ ] Interactions work on mobile (tap, scroll)
- [ ] Visual consistency maintained
- [ ] No console errors
- [ ] HTML validates
- [ ] Meta description present and accurate (150-160 chars)
- [ ] Open Graph and Twitter Card tags present
- [ ] ImageKit transformations working (WebP, srcset, quality)

### Testing Expectations

Automated testing is NOT required for this project. Manual testing on real devices is MANDATORY. Specifically test:

- iPhone Safari (iOS 15+)
- Android Chrome (latest)
- Desktop Chrome, Firefox, Safari
- Keyboard navigation
- Screen reader compatibility (VoiceOver or NVDA)
- Google Search preview (meta description display)
- Social media link preview (Facebook, Twitter)

## Governance

This constitution supersedes all other development practices for this project. All changes MUST comply with the principles above.

### Amendment Process

1. Propose change with clear rationale
2. Document which principle conflicts or needs expansion
3. Update constitution with version bump per semantic versioning:
   - **MAJOR**: Remove or redefine core principles
   - **MINOR**: Add new principles or expand guidance
   - **PATCH**: Clarify wording or fix documentation
4. Propagate changes to templates and command files

### Compliance Review

Any pull request or commit that violates these principles MUST be rejected or reverted. Complexity MUST be justified in writing. When principles conflict, prioritize in this order: User Experience > Simplicity > Performance > Visual Consistency > Mobile-First.

### Living Document

This constitution evolves with the project. If the project scope expands (e.g., adding a booking system, CMS, or backend), principles MUST be re-evaluated and amended accordingly.

**Version**: 1.1.0 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-15
