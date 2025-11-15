# Maman Clown Website Constitution

<!--
Sync Impact Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERSION: 1.0.1 (Patch - clarification update)
CHANGE TYPE: Business context clarification
RATIFICATION: 2025-11-15
LAST AMENDED: 2025-11-15

PRINCIPLES ESTABLISHED:
- I. Simplicity First
- II. User Experience
- III. Performance & Accessibility
- IV. Visual Consistency
- V. Mobile-First Design

SECTIONS ESTABLISHED:
- Technical Standards
- Development Workflow
- Governance

TEMPLATE SYNC STATUS:
✅ plan-template.md - Constitution Check section ready for gates
✅ spec-template.md - Requirements alignment ready for simple web features
✅ tasks-template.md - Task categorization ready (simplified for static site)
⚠️  Command files (.opencode/command/*.md) - May reference generic workflows

CHANGES IN v1.0.1:
- Clarified business context: performer offering birthdays, shows, performances
- Enhanced User Experience rationale with booking context
- Added business goals to principles where relevant

FOLLOW-UP ITEMS:
- None (all placeholders resolved)

NOTES:
This constitution is tailored for Maman Clown's digital business card.
The performer offers entertainment services for birthdays, shows, and
other performances. Principles prioritize conversion (contact/booking)
while maintaining simplicity for a static website.
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

Pages MUST load efficiently with minimal resource consumption. Images MUST be optimized (WebP preferred). External dependencies (fonts, libraries) MUST be evaluated for impact on load time. All interactive elements MUST be keyboard accessible. Color contrast MUST meet WCAG AA standards. Semantic HTML MUST be used for screen reader compatibility.

**Rationale**: Fast, accessible sites reach wider audiences, improve SEO, and demonstrate professional quality. Accessibility is not optional—it's a baseline requirement.

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

- Images MUST be compressed (WebP with fallbacks)
- External libraries MUST use CDN with integrity hashes
- Fonts MUST use `font-display: swap` for performance
- Favicon MUST be provided in multiple formats

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
- [ ] All images load correctly
- [ ] Page loads in under 2 seconds on 3G
- [ ] Interactions work on mobile (tap, scroll)
- [ ] Visual consistency maintained
- [ ] No console errors
- [ ] HTML validates

### Testing Expectations

Automated testing is NOT required for this project. Manual testing on real devices is MANDATORY. Specifically test:

- iPhone Safari (iOS 15+)
- Android Chrome (latest)
- Desktop Chrome, Firefox, Safari
- Keyboard navigation
- Screen reader compatibility (VoiceOver or NVDA)

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

**Version**: 1.0.1 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-15
