# Research: Optimal HTML Page Structure for Content Pages

**Date**: 2025-11-15  
**Feature**: Multi-Page Navigation (001)  
**Context**: Building 4 new content pages (Birthdays, Contact, Shows, Characters) with shared header

---

## Executive Summary

This document provides research-based recommendations for structuring the new content pages while maintaining the existing brand identity and performance characteristics of the Maman Clown website.

**Key Findings**:
- Semantic HTML5 structure improves SEO and accessibility
- Fixed header pattern with auto-hide optimizes mobile reading experience
- 375px centered content container should be maintained across all pages
- Each page type requires different content layout patterns
- Shared header components can be standardized via template pattern

---

## 1. Semantic HTML Structure Recommendations

### 1.1 Overall Page Structure

Based on HTML5 semantic elements and existing site patterns:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[Page-specific 150-160 char description]">
    
    <!-- Open Graph for Monaco/Monte-Carlo social sharing -->
    <meta property="og:title" content="[Page Title] - Maman Clown">
    <meta property="og:description" content="[Page description]">
    <meta property="og:image" content="[ImageKit URL]">
    <meta property="og:url" content="https://mamanclown.com/[page].html">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="fr_FR">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="[Page Title] - Maman Clown">
    <meta name="twitter:description" content="[Page description]">
    <meta name="twitter:image" content="[ImageKit URL]">
    
    <!-- Favicon and fonts -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" 
          rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet"></noscript>
    
    <title>[Page Title] - Maman Clown</title>
    
    <style>
        /* Shared styles + page-specific styles */
    </style>
</head>

<body>
    <!-- Background sprinkles decoration (from home page) -->
    <div class="sprinkles" id="sprinkles" aria-hidden="true"></div>
    
    <!-- Shared header with auto-hide behavior -->
    <header class="site-header" id="site-header">
        <!-- Logo (reduced size, top left) -->
        <a href="index.html" class="header-logo" aria-label="Maman Clown home">
            <img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80" 
                 alt="Maman Clown logo" 
                 width="80" 
                 height="80">
        </a>
        
        <!-- Page title (center) -->
        <h1 class="page-title">[Page Title]</h1>
        
        <!-- Hamburger menu (top right) -->
        <button class="hamburger-menu" 
                id="hamburger-btn" 
                aria-label="Open navigation menu"
                aria-expanded="false"
                aria-controls="nav-menu">
            <span class="hamburger-icon" aria-hidden="true"></span>
        </button>
    </header>
    
    <!-- Slide-over navigation menu -->
    <nav class="nav-menu" id="nav-menu" aria-label="Main navigation">
        <div class="nav-backdrop" aria-hidden="true"></div>
        <div class="nav-content" role="dialog" aria-modal="true" aria-labelledby="nav-title">
            <h2 id="nav-title" class="visually-hidden">Navigation Menu</h2>
            <button class="nav-close" aria-label="Close navigation menu">×</button>
            <ul class="nav-links">
                <!-- Dynamically exclude current page -->
                <li><a href="index.html">Home</a></li>
                <li><a href="birthdays.html">Birthdays</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="shows.html">Shows</a></li>
                <li><a href="characters.html">Characters</a></li>
            </ul>
        </div>
    </nav>
    
    <!-- Main content area -->
    <main class="main-content">
        <!-- Page-specific content sections -->
    </main>
    
    <!-- Optional footer -->
    <footer class="site-footer">
        <!-- Contact links, social media, copyright -->
    </footer>
    
    <script>
        /* Shared navigation and header behavior scripts */
    </script>
</body>
</html>
```

### 1.2 Rationale for Semantic Structure

**Header Element** (`<header>`):
- Contains logo, page title, and navigation trigger
- Identifies introductory/navigational content
- Improves screen reader navigation with landmark role

**Nav Element** (`<nav>`):
- Semantic landmark for navigation links
- Helps assistive technology users skip to navigation
- Should include `aria-label` for clarity

**Main Element** (`<main>`):
- Identifies dominant content of the page
- Only one `<main>` per page
- Excludes repeated content (header, nav, footer)

**Section Elements** (`<section>`):
- Groups thematically related content
- Each should have a heading (h2, h3, etc.)
- Better than generic `<div>` for content blocks

**Article Elements** (`<article>`):
- For self-contained, reusable content
- Best for character profiles, show listings
- Can be syndicated independently

---

## 2. Shared Header Structure

### 2.1 Header Layout Pattern

The header must accommodate three elements in a fixed-height container:

```
┌──────────────────────────────────────────┐
│  [Logo]     [Page Title]     [☰ Menu]   │
│  (80x80)    (centered)       (44x44)    │
└──────────────────────────────────────────┐
```

**CSS Layout Strategy**:
```css
.site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
}

/* Auto-hide when scrolling down */
.site-header.hidden {
    transform: translateY(-100%);
}

.header-logo {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
}

.header-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.page-title {
    flex-grow: 1;
    text-align: center;
    font-family: "Comic Neue", cursive;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0.75rem;
    /* Rainbow gradient text effect */
    background: linear-gradient(90deg, 
        #FF0000 0%, #FF7F00 14%, #FFB700 28%, 
        #00FF00 42%, #0000FF 57%, #4B0082 71%, 
        #9400D3 85%, #FF0000 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 100%;
}

.hamburger-menu {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    min-width: 44px; /* Touch target WCAG requirement */
    min-height: 44px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
}
```

### 2.2 Logo Sizing Strategy

**Current Home Page**: 375px hero image (full width of content container)  
**Content Pages**: 60-80px reduced logo in header

**ImageKit Transformation**:
```html
<!-- Header logo (80x80) -->
<img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80" 
     srcset="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80,dpr-1 1x,
             https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80,dpr-2 2x,
             https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80,dpr-3 3x"
     alt="Maman Clown logo" 
     width="80" 
     height="80"
     loading="eager">
```

**Fallback Strategy** (if image fails to load):
```css
.header-logo img {
    background: linear-gradient(135deg, #FFB6D9 0%, #C2F0FC 100%);
    border: 2px solid #00a700;
    border-radius: 8px;
}

/* Show alt text with styling */
.header-logo img[alt]:after {
    content: attr(alt);
    display: block;
    text-align: center;
    font-family: "Comic Neue", cursive;
    font-size: 0.75rem;
    color: #333;
    padding: 0.5rem;
}
```

### 2.3 Scroll Behavior Implementation

**JavaScript Pattern**:
```javascript
let lastScrollY = window.scrollY;
let ticking = false;

function updateHeaderVisibility() {
    const header = document.getElementById('site-header');
    const currentScrollY = window.scrollY;
    
    // Show header at top or when scrolling up
    if (currentScrollY < 10) {
        header.classList.remove('hidden');
    } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        header.classList.remove('hidden');
    } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        header.classList.add('hidden');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
    }
});
```

---

## 3. Page-Specific Content Layouts

### 3.1 Birthdays Page Layout

**Content Type**: Service information, features, pricing, booking CTA  
**Recommended Pattern**: Feature cards + CTA sections

```html
<main class="main-content">
    <!-- Hero section with engaging image -->
    <section class="page-hero">
        <div class="content-container">
            <img src="[ImageKit birthday party photo]" 
                 alt="Maman Clown birthday party entertainment"
                 class="hero-image">
            <h2 class="section-heading">Magical Birthday Celebrations</h2>
            <p class="hero-description">
                Unforgettable entertainment for children ages 2-8 in Monaco and Monte-Carlo
            </p>
        </div>
    </section>
    
    <!-- Features/Services section -->
    <section class="services-section">
        <div class="content-container">
            <h2 class="section-heading">What's Included</h2>
            <ul class="features-list">
                <li class="feature-item">
                    <span class="feature-icon" aria-hidden="true">🎉</span>
                    <h3 class="feature-title">Interactive Entertainment</h3>
                    <p class="feature-description">Engaging shows tailored to your child's age group</p>
                </li>
                <!-- More features -->
            </ul>
        </div>
    </section>
    
    <!-- Call to action -->
    <section class="cta-section">
        <div class="content-container">
            <h2 class="section-heading">Book Your Party</h2>
            <a href="contact.html" class="contact-button">
                Get Started
            </a>
        </div>
    </section>
</main>
```

**CSS Layout**:
```css
.content-container {
    width: 375px;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 0.75rem;
}

.features-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
}

.feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #FFF9F0 0%, #F0F9FF 100%);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.section-heading {
    font-family: "Comic Neue", cursive;
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
    margin: 2rem 0 1.5rem;
    /* Rainbow text effect */
    background: linear-gradient(90deg, 
        #FF0000 0%, #FF7F00 14%, #FFB700 28%, 
        #00FF00 42%, #0000FF 57%, #4B0082 71%, 
        #9400D3 85%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### 3.2 Contact Page Layout

**Content Type**: Contact methods, booking form, location info  
**Recommended Pattern**: Contact cards + embedded form

```html
<main class="main-content">
    <section class="contact-intro">
        <div class="content-container">
            <h2 class="section-heading">Get in Touch</h2>
            <p class="intro-text">
                Ready to bring magic to your child's special day? 
                Contact us to discuss your event!
            </p>
        </div>
    </section>
    
    <!-- Contact methods (reuse from home page) -->
    <section class="contact-methods">
        <div class="content-container">
            <a href="tel:0672242512" class="contact-card">
                <svg class="contact-icon" viewBox="0 0 512 512">...</svg>
                <div class="rainbow-characters">
                    <span style="color: #FF0000;">0</span>
                    <!-- Phone number with rainbow effect -->
                </div>
            </a>
            
            <a href="mailto:contact@mamanclown.com" class="contact-card">
                <svg class="contact-icon" viewBox="0 0 512 512">...</svg>
                <div class="rainbow-characters">
                    <!-- Email with rainbow effect -->
                </div>
            </a>
        </div>
    </section>
    
    <!-- Social media -->
    <section class="social-section">
        <div class="content-container">
            <h2 class="section-heading">Follow Our Adventures</h2>
            <div class="social-links">
                <a href="https://www.facebook.com/..." class="social-card">
                    <!-- Facebook icon + handle -->
                </a>
                <a href="https://www.instagram.com/..." class="social-card">
                    <!-- Instagram icon + handle -->
                </a>
            </div>
        </div>
    </section>
    
    <!-- Service area -->
    <section class="location-section">
        <div class="content-container">
            <h2 class="section-heading">Service Area</h2>
            <p class="location-text">
                Serving Monaco, Monte-Carlo, and surrounding areas
            </p>
        </div>
    </section>
    
    <!-- vCard download -->
    <section class="vcard-section">
        <div class="content-container">
            <a href="[vCard data URI]" download="maman_clown.vcf" class="contact-button">
                Add to Contacts
            </a>
        </div>
    </section>
</main>
```

**CSS Layout**:
```css
.contact-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.25rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    margin-bottom: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.contact-card:hover,
.contact-card:focus {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.contact-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #00a700;
}

.social-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
```

### 3.3 Shows Page Layout

**Content Type**: Performance schedule, show descriptions, venues  
**Recommended Pattern**: Card-based list layout

```html
<main class="main-content">
    <section class="shows-intro">
        <div class="content-container">
            <h2 class="section-heading">Upcoming Shows</h2>
            <p class="intro-text">
                Join us for captivating performances across Monaco and Monte-Carlo
            </p>
        </div>
    </section>
    
    <!-- Show listings -->
    <section class="shows-list">
        <div class="content-container">
            <article class="show-card">
                <div class="show-image">
                    <img src="[ImageKit show photo]" 
                         alt="Show title">
                </div>
                <div class="show-content">
                    <h3 class="show-title">Show Title</h3>
                    <time class="show-date" datetime="2025-12-15">
                        Saturday, December 15, 2025 at 3:00 PM
                    </time>
                    <p class="show-venue">
                        <span class="venue-icon" aria-hidden="true">📍</span>
                        Venue Name, Monaco
                    </p>
                    <p class="show-description">
                        Brief description of the show and what to expect...
                    </p>
                    <a href="#" class="show-cta">Learn More</a>
                </div>
            </article>
            <!-- More show cards -->
        </div>
    </section>
    
    <!-- Private shows CTA -->
    <section class="private-shows-cta">
        <div class="content-container">
            <h2 class="section-heading">Private Shows Available</h2>
            <p>Book Maman Clown for your event</p>
            <a href="contact.html" class="contact-button">
                Book Now
            </a>
        </div>
    </section>
</main>
```

**CSS Layout**:
```css
.show-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 1.5rem;
}

.show-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.show-content {
    padding: 1.5rem;
}

.show-title {
    font-family: "Comic Neue", cursive;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #333;
}

.show-date {
    display: block;
    font-weight: 700;
    color: #00a700;
    margin-bottom: 0.5rem;
}

.show-venue {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: #666;
}

.show-cta {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #00a700;
    color: white;
    text-decoration: none;
    border-radius: 19px;
    font-family: "Comic Neue", cursive;
    font-weight: 700;
    transition: background-color 0.2s;
}

.show-cta:hover,
.show-cta:focus {
    background-color: #008800;
}
```

### 3.4 Characters Page Layout

**Content Type**: Character profiles, descriptions, photos  
**Recommended Pattern**: Grid/card layout with profiles

```html
<main class="main-content">
    <section class="characters-intro">
        <div class="content-container">
            <h2 class="section-heading">Meet Our Characters</h2>
            <p class="intro-text">
                Each character brings their own magic and personality to your event
            </p>
        </div>
    </section>
    
    <!-- Character profiles -->
    <section class="characters-grid">
        <div class="content-container">
            <article class="character-card">
                <div class="character-image">
                    <img src="[ImageKit character photo]" 
                         alt="Character name">
                </div>
                <div class="character-content">
                    <h3 class="character-name">Character Name</h3>
                    <p class="character-tagline">
                        "A magical tagline or catchphrase"
                    </p>
                    <p class="character-description">
                        Description of the character's personality, 
                        what makes them special, and what they bring to events...
                    </p>
                    <ul class="character-features">
                        <li>Perfect for ages 2-8</li>
                        <li>Interactive storytelling</li>
                        <li>Games and activities</li>
                    </ul>
                </div>
            </article>
            <!-- More character cards -->
        </div>
    </section>
    
    <!-- CTA to book -->
    <section class="characters-cta">
        <div class="content-container">
            <h2 class="section-heading">Request Your Favorite Character</h2>
            <a href="contact.html" class="contact-button">
                Book Now
            </a>
        </div>
    </section>
</main>
```

**CSS Layout**:
```css
.character-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
}

.character-image img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.character-content {
    padding: 1.5rem;
}

.character-name {
    font-family: "Comic Neue", cursive;
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    /* Rainbow gradient */
    background: linear-gradient(90deg, 
        #FF0000 0%, #FF7F00 14%, #FFB700 28%, 
        #00FF00 42%, #0000FF 57%, #4B0082 71%, 
        #9400D3 85%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.character-tagline {
    font-style: italic;
    color: #666;
    margin-bottom: 1rem;
}

.character-features {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
}

.character-features li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
}

.character-features li:before {
    content: "✨";
    position: absolute;
    left: 0;
}

/* Tablet/Desktop: 2-column grid */
@media (min-width: 768px) {
    .characters-grid .content-container {
        width: 100%;
        max-width: 800px;
    }
    
    .character-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
    }
    
    .character-image img {
        height: 100%;
        min-height: 300px;
    }
}
```

---

## 4. CSS Considerations

### 4.1 Shared Stylesheet Structure

**Strategy**: Inline CSS in each page to minimize HTTP requests and maintain simplicity (no build process).

**Organization**:
```css
/* ===========================
   1. CSS RESET & BASE STYLES
   =========================== */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: white;
    font-family: system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    padding-top: 60px; /* Account for fixed header */
}

/* ===========================
   2. UTILITY CLASSES
   =========================== */
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.content-container {
    width: 375px;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 0.75rem;
}

/* ===========================
   3. HEADER COMPONENTS
   =========================== */
.site-header { /* ... */ }
.header-logo { /* ... */ }
.page-title { /* ... */ }
.hamburger-menu { /* ... */ }

/* ===========================
   4. NAVIGATION MENU
   =========================== */
.nav-menu { /* ... */ }
.nav-backdrop { /* ... */ }
.nav-content { /* ... */ }
.nav-links { /* ... */ }

/* ===========================
   5. SHARED COMPONENTS
   =========================== */
.section-heading { /* ... */ }
.contact-button { /* ... */ }
.rainbow-characters { /* ... */ }

/* ===========================
   6. BACKGROUND DECORATION
   =========================== */
.sprinkles { /* ... */ }
.sprinkle { /* ... */ }

/* ===========================
   7. PAGE-SPECIFIC STYLES
   =========================== */
/* (Birthdays, Contact, Shows, Characters) */

/* ===========================
   8. RESPONSIVE BREAKPOINTS
   =========================== */
@media (min-width: 768px) { /* ... */ }
@media (min-width: 1024px) { /* ... */ }
```

### 4.2 Rainbow Text Effect Pattern

**Reusable Rainbow Text** (used throughout site):
```css
.rainbow-text {
    font-family: "Comic Neue", cursive;
    font-weight: 700;
    background: linear-gradient(90deg, 
        #FF0000 0%,   /* Red */
        #FF7F00 14%,  /* Orange */
        #FFB700 28%,  /* Yellow */
        #00FF00 42%,  /* Green */
        #0000FF 57%,  /* Blue */
        #4B0082 71%,  /* Indigo */
        #9400D3 85%,  /* Violet */
        #FF0000 100%  /* Back to red for seamless loop */
    );
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Individual colored spans (for precise control like phone/email) */
.rainbow-characters span:nth-child(7n+1) { color: #FF0000; }
.rainbow-characters span:nth-child(7n+2) { color: #FF7F00; }
.rainbow-characters span:nth-child(7n+3) { color: #FFB700; }
.rainbow-characters span:nth-child(7n+4) { color: #00FF00; }
.rainbow-characters span:nth-child(7n+5) { color: #0000FF; }
.rainbow-characters span:nth-child(7n+6) { color: #4B0082; }
.rainbow-characters span:nth-child(7n+7) { color: #9400D3; }
```

### 4.3 Green Accent Color Usage

**Consistent use of `#00a700`** (from existing site):
- Contact buttons background
- Icons (phone, email, social)
- Interactive element hover states
- Links and CTAs
- Show dates/times (for emphasis)

```css
.contact-button {
    background-color: #00a700;
    color: white;
    text-decoration: none;
    border-radius: 19px;
    padding: 11px 22px;
    font-family: "Comic Neue", cursive;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 1.5px 3.75px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s, transform 0.2s;
}

.contact-button:hover,
.contact-button:focus {
    background-color: #008800;
    transform: translateY(-1px);
}
```

### 4.4 Responsive Strategy

**Mobile-First Approach** (320px base):
```css
/* Base styles: 320px - 767px (mobile) */
.content-container {
    width: 375px;
    max-width: 100%;
    padding: 0 0.75rem;
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) {
    .content-container {
        width: 600px;
    }
    
    /* 2-column layouts where appropriate */
    .features-list {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .feature-item {
        flex: 0 0 calc(50% - 0.75rem);
    }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
    .content-container {
        width: 800px;
    }
    
    /* 3-column layouts for larger screens */
    .feature-item {
        flex: 0 0 calc(33.333% - 1rem);
    }
}

/* Large desktop: 1920px */
@media (min-width: 1920px) {
    .content-container {
        width: 1000px;
    }
}
```

---

## 5. Maintaining Brand Identity

### 5.1 Visual Consistency Checklist

**Typography**:
- ✅ Comic Neue 700 for headings and rainbow text
- ✅ system-ui for body text
- ✅ Consistent font sizing: 1.3rem for contact elements, 1.75rem for section headings

**Colors**:
- ✅ Rainbow gradient: #FF0000 → #FF7F00 → #FFB700 → #00FF00 → #0000FF → #4B0082 → #9400D3
- ✅ Green accent: #00a700 for CTAs and icons
- ✅ White background with pastel gradients for cards
- ✅ Sprinkles decoration: #FF69B4, #FFD700, #00CED1, #FF6347, #98FB98, #DDA0DD

**Layout**:
- ✅ 375px centered content container
- ✅ Consistent spacing: 0.75rem gaps, 1.5rem margins
- ✅ Border radius: 12px for cards, 19px for buttons
- ✅ Box shadows: 0 2px 8px rgba(0, 0, 0, 0.1) for cards

**Icons**:
- ✅ Inline SVG icons (matching home page pattern)
- ✅ 1.3rem size for contact icons
- ✅ #00a700 color fill

### 5.2 ImageKit CDN Pattern

**Standard Image Loading**:
```html
<img src="https://ik.imagekit.io/6b4fz9a3u/[image-name].webp?tr=w-375,f-auto,q-80" 
     srcset="https://ik.imagekit.io/6b4fz9a3u/[image-name].webp?tr=w-200,f-auto,q-80 200w,
             https://ik.imagekit.io/6b4fz9a3u/[image-name].webp?tr=w-300,f-auto,q-80 300w,
             https://ik.imagekit.io/6b4fz9a3u/[image-name].webp?tr=w-375,f-auto,q-80 375w,
             https://ik.imagekit.io/6b4fz9a3u/[image-name].webp?tr=w-600,f-auto,q-80 600w,
             https://ik.imagekit.io/6b4fz9a3u/[image-name].webp?tr=w-800,f-auto,q-80 800w"
     sizes="(max-width: 375px) 100vw, 
            (max-width: 768px) 600px, 
            800px"
     alt="[Descriptive alt text]"
     width="375"
     height="[aspect-ratio-height]"
     loading="lazy">
```

**ImageKit Transformations Used**:
- `w-[width]`: Responsive width
- `f-auto`: Automatic format (WebP with fallback)
- `q-80`: Quality 80% (balance between size and quality)
- `dpr-[1|2|3]`: Device pixel ratio for retina displays
- `ar-[ratio]`: Aspect ratio cropping if needed

### 5.3 SEO Meta Tags Template

**Per-Page Meta Tags**:
```html
<!-- Birthdays Page Example -->
<meta name="description" content="Magical birthday party entertainment for children ages 2-8 in Monaco and Monte-Carlo. Professional performer services with interactive shows and character appearances.">

<meta property="og:title" content="Birthday Parties - Maman Clown">
<meta property="og:description" content="Unforgettable birthday celebrations with professional entertainment in Monaco and Monte-Carlo.">
<meta property="og:image" content="https://ik.imagekit.io/6b4fz9a3u/birthdays-og.webp?tr=w-1200,h-630,f-auto">
<meta property="og:url" content="https://mamanclown.com/birthdays.html">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="fr_FR">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Birthday Parties - Maman Clown">
<meta name="twitter:description" content="Unforgettable birthday celebrations with professional entertainment in Monaco and Monte-Carlo.">
<meta name="twitter:image" content="https://ik.imagekit.io/6b4fz9a3u/birthdays-twitter.webp?tr=w-1200,h-600,f-auto">

<!-- Local SEO -->
<meta name="geo.region" content="MC">
<meta name="geo.placename" content="Monaco">
<meta name="geo.position" content="43.7384;7.4246">
<meta name="ICBM" content="43.7384, 7.4246">
```

**Keywords Strategy** (Monaco/Monte-Carlo focus):
- Birthday parties Monaco
- Children's entertainment Monte-Carlo
- Clown performer Monaco
- Kids party services Monte-Carlo
- Character entertainment Monaco

---

## 6. HTML Template Recommendation

### 6.1 Base Template Structure

**File**: `_template.html` (copy for each new page)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[PAGE-SPECIFIC DESCRIPTION 150-160 chars]">
    
    <!-- Open Graph -->
    <meta property="og:title" content="[PAGE TITLE] - Maman Clown">
    <meta property="og:description" content="[PAGE DESCRIPTION]">
    <meta property="og:image" content="https://ik.imagekit.io/6b4fz9a3u/[page]-og.webp?tr=w-1200,h-630,f-auto">
    <meta property="og:url" content="https://mamanclown.com/[page].html">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="fr_FR">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="[PAGE TITLE] - Maman Clown">
    <meta name="twitter:description" content="[PAGE DESCRIPTION]">
    <meta name="twitter:image" content="https://ik.imagekit.io/6b4fz9a3u/[page]-twitter.webp?tr=w-1200,h-600,f-auto">
    
    <!-- Local SEO -->
    <meta name="geo.region" content="MC">
    <meta name="geo.placename" content="Monaco">
    
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" 
          rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet"></noscript>
    
    <title>[PAGE TITLE] - Maman Clown</title>
    
    <style>
        /* ============================================
           SHARED STYLES (copy to all pages)
           ============================================ */
        
        /* 1. Reset */
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: white;
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            padding-top: 70px; /* Fixed header clearance */
            line-height: 1.6;
            color: #333;
        }
        
        /* 2. Utility classes */
        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .content-container {
            width: 375px;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 0.75rem;
        }
        
        /* 3. Fixed header */
        .site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.75rem;
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transition: transform 0.3s ease-in-out;
        }
        
        .site-header.hidden {
            transform: translateY(-100%);
        }
        
        .header-logo {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            text-decoration: none;
        }
        
        .header-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .page-title {
            flex-grow: 1;
            text-align: center;
            font-family: "Comic Neue", cursive;
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0 0.75rem;
            background: linear-gradient(90deg, 
                #FF0000 0%, #FF7F00 14%, #FFB700 28%, 
                #00FF00 42%, #0000FF 57%, #4B0082 71%, 
                #9400D3 85%, #FF0000 100%);
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .hamburger-menu {
            flex-shrink: 0;
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        .hamburger-icon,
        .hamburger-icon::before,
        .hamburger-icon::after {
            display: block;
            width: 28px;
            height: 3px;
            background: #00a700;
            border-radius: 2px;
            transition: all 0.3s ease-in-out;
        }
        
        .hamburger-icon {
            position: relative;
        }
        
        .hamburger-icon::before,
        .hamburger-icon::after {
            content: '';
            position: absolute;
            left: 0;
        }
        
        .hamburger-icon::before {
            top: -8px;
        }
        
        .hamburger-icon::after {
            bottom: -8px;
        }
        
        /* Hamburger animation when menu is open */
        .hamburger-menu[aria-expanded="true"] .hamburger-icon {
            background: transparent;
        }
        
        .hamburger-menu[aria-expanded="true"] .hamburger-icon::before {
            transform: rotate(45deg);
            top: 0;
        }
        
        .hamburger-menu[aria-expanded="true"] .hamburger-icon::after {
            transform: rotate(-45deg);
            bottom: 0;
        }
        
        /* 4. Navigation menu */
        .nav-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            pointer-events: none;
        }
        
        .nav-menu.open {
            pointer-events: all;
        }
        
        .nav-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            transition: background 0.3s ease-in-out;
        }
        
        .nav-menu.open .nav-backdrop {
            background: rgba(0, 0, 0, 0.5);
        }
        
        .nav-content {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 280px;
            max-width: 85vw;
            background: white;
            box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            overflow-y: auto;
            padding: 2rem 1.5rem;
        }
        
        .nav-menu.open .nav-content {
            transform: translateX(0);
        }
        
        .nav-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 44px;
            height: 44px;
            border: none;
            background: transparent;
            font-size: 2rem;
            line-height: 1;
            cursor: pointer;
            color: #666;
        }
        
        .nav-links {
            list-style: none;
            padding: 0;
            margin-top: 3rem;
        }
        
        .nav-links li {
            margin-bottom: 0.5rem;
        }
        
        .nav-links a {
            display: block;
            padding: 1rem;
            font-family: "Comic Neue", cursive;
            font-size: 1.25rem;
            font-weight: 700;
            color: #333;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.2s;
        }
        
        .nav-links a:hover,
        .nav-links a:focus {
            background: linear-gradient(135deg, #FFF9F0 0%, #F0F9FF 100%);
        }
        
        /* Hide current page in navigation */
        .nav-links li.current-page {
            display: none;
        }
        
        /* 5. Rainbow text utilities */
        .rainbow-characters {
            display: inline-block;
            white-space: nowrap;
            letter-spacing: -0.1em;
        }
        
        .rainbow-characters span {
            display: inline-block;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
            letter-spacing: -0.1em;
        }
        
        .section-heading {
            font-family: "Comic Neue", cursive;
            font-size: 1.75rem;
            font-weight: 700;
            text-align: center;
            margin: 2rem 0 1.5rem;
            background: linear-gradient(90deg, 
                #FF0000 0%, #FF7F00 14%, #FFB700 28%, 
                #00FF00 42%, #0000FF 57%, #4B0082 71%, 
                #9400D3 85%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        /* 6. Contact button (shared CTA style) */
        .contact-button {
            display: inline-block;
            margin: 15px auto;
            padding: 11px 22px;
            background-color: #00a700;
            color: white;
            text-decoration: none;
            border-radius: 19px;
            font-family: "Comic Neue", Arial, sans-serif;
            font-size: 18px;
            font-weight: 700;
            box-shadow: 0 1.5px 3.75px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s, transform 0.2s;
        }
        
        .contact-button:hover,
        .contact-button:focus {
            background-color: #008800;
            transform: translateY(-1px);
        }
        
        /* 7. Sprinkles decoration */
        .sprinkles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .sprinkle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            transform: rotate(var(--rotation));
            box-shadow: 0 0 1.5px rgba(0, 0, 0, 0.2);
        }
        
        /* 8. Main content spacing */
        .main-content {
            position: relative;
            z-index: 2;
            padding-bottom: 2rem;
        }
        
        /* ============================================
           PAGE-SPECIFIC STYLES
           ============================================ */
        
        /* [Insert page-specific styles here] */
        
        /* ============================================
           RESPONSIVE BREAKPOINTS
           ============================================ */
        
        @media (min-width: 768px) {
            .content-container {
                width: 600px;
            }
            
            .page-title {
                font-size: 1.5rem;
            }
        }
        
        @media (min-width: 1024px) {
            .content-container {
                width: 800px;
            }
        }
        
        @media (min-width: 1920px) {
            .content-container {
                width: 1000px;
            }
        }
    </style>
</head>

<body>
    <!-- Background decoration -->
    <div class="sprinkles" id="sprinkles" aria-hidden="true"></div>
    
    <!-- Fixed header -->
    <header class="site-header" id="site-header">
        <a href="index.html" class="header-logo" aria-label="Maman Clown home">
            <img src="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80" 
                 srcset="https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80,dpr-1 1x,
                         https://ik.imagekit.io/6b4fz9a3u/mamanclown.webp?tr=w-80,h-80,f-auto,q-80,dpr-2 2x"
                 alt="Maman Clown logo" 
                 width="80" 
                 height="80"
                 loading="eager">
        </a>
        
        <h1 class="page-title">[PAGE TITLE]</h1>
        
        <button class="hamburger-menu" 
                id="hamburger-btn" 
                aria-label="Open navigation menu"
                aria-expanded="false"
                aria-controls="nav-menu">
            <span class="hamburger-icon" aria-hidden="true"></span>
        </button>
    </header>
    
    <!-- Navigation menu -->
    <nav class="nav-menu" id="nav-menu" aria-label="Main navigation">
        <div class="nav-backdrop" aria-hidden="true"></div>
        <div class="nav-content" role="dialog" aria-modal="true" aria-labelledby="nav-title">
            <h2 id="nav-title" class="visually-hidden">Navigation Menu</h2>
            <button class="nav-close" aria-label="Close navigation menu">×</button>
            <ul class="nav-links">
                <li data-page="index"><a href="index.html">Home</a></li>
                <li data-page="birthdays"><a href="birthdays.html">Birthdays</a></li>
                <li data-page="contact"><a href="contact.html">Contact</a></li>
                <li data-page="shows"><a href="shows.html">Shows</a></li>
                <li data-page="characters"><a href="characters.html">Characters</a></li>
            </ul>
        </div>
    </nav>
    
    <!-- Main content -->
    <main class="main-content">
        <!-- [PAGE-SPECIFIC CONTENT HERE] -->
    </main>
    
    <!-- Shared JavaScript -->
    <script>
        // ============================================
        // 1. Sprinkles decoration
        // ============================================
        const colors = ['#FF69B4', '#FFD700', '#00CED1', '#FF6347', '#98FB98', '#DDA0DD'];
        const sprinklesContainer = document.getElementById('sprinkles');
        
        function createSprinkles() {
            sprinklesContainer.innerHTML = '';
            const viewportArea = window.innerWidth * window.innerHeight;
            const sprinkleDensity = 1 / 1500;
            const numberOfSprinkles = Math.floor(viewportArea * sprinkleDensity);
            
            for (let i = 0; i < numberOfSprinkles; i++) {
                const sprinkle = document.createElement('div');
                sprinkle.className = 'sprinkle';
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const rotation = Math.random() * 360;
                
                sprinkle.style.cssText = `
                    left: ${x}%;
                    top: ${y}%;
                    background-color: ${color};
                    --rotation: ${rotation}deg;
                `;
                
                sprinklesContainer.appendChild(sprinkle);
            }
        }
        
        createSprinkles();
        window.addEventListener('resize', createSprinkles);
        
        // ============================================
        // 2. Header auto-hide on scroll
        // ============================================
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateHeaderVisibility() {
            const header = document.getElementById('site-header');
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < 10) {
                header.classList.remove('hidden');
            } else if (currentScrollY < lastScrollY) {
                header.classList.remove('hidden');
            } else if (currentScrollY > lastScrollY) {
                header.classList.add('hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeaderVisibility);
                ticking = true;
            }
        });
        
        // ============================================
        // 3. Navigation menu toggle
        // ============================================
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const navMenu = document.getElementById('nav-menu');
        const navClose = navMenu.querySelector('.nav-close');
        const navBackdrop = navMenu.querySelector('.nav-backdrop');
        const navLinks = navMenu.querySelectorAll('.nav-links a');
        let isAnimating = false;
        
        function openMenu() {
            if (isAnimating) return;
            isAnimating = true;
            navMenu.classList.add('open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');
            
            // Focus trap
            const firstLink = navMenu.querySelector('.nav-links a');
            if (firstLink) firstLink.focus();
            
            setTimeout(() => { isAnimating = false; }, 300);
        }
        
        function closeMenu() {
            if (isAnimating) return;
            isAnimating = true;
            navMenu.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
            hamburgerBtn.focus();
            
            setTimeout(() => { isAnimating = false; }, 300);
        }
        
        hamburgerBtn.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        navClose.addEventListener('click', closeMenu);
        navBackdrop.addEventListener('click', closeMenu);
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu when navigating
                closeMenu();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });
        
        // Focus trap when menu is open
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu.classList.contains('open')) {
                const focusableElements = navMenu.querySelectorAll(
                    'button, a, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // ============================================
        // 4. Hide current page from navigation
        // ============================================
        const currentPage = '[PAGE_NAME]'; // e.g., 'birthdays', 'contact'
        const currentPageItem = document.querySelector(`[data-page="${currentPage}"]`);
        if (currentPageItem) {
            currentPageItem.classList.add('current-page');
        }
    </script>
</body>
</html>
```

### 6.2 Usage Instructions

**For each new page**:

1. Copy `_template.html` to `[pagename].html`
2. Replace `[PAGE TITLE]` with actual page title (3 locations)
3. Replace `[PAGE-SPECIFIC DESCRIPTION]` in meta tags
4. Replace `[PAGE DESCRIPTION]` in Open Graph tags
5. Update `[page]` in Open Graph image URLs
6. Replace `[PAGE_NAME]` in JavaScript (line for current page hiding)
7. Add page-specific content in `<main>` section
8. Add page-specific CSS in designated section

**Example for Birthdays page**:
- `[PAGE TITLE]` → `Birthdays`
- `[PAGE_NAME]` → `birthdays`
- Meta description → "Magical birthday party entertainment for children ages 2-8 in Monaco and Monte-Carlo. Professional clown services with interactive shows and memorable experiences."

---

## 7. Key Recommendations Summary

### 7.1 HTML Structure

✅ **Use semantic HTML5 elements** (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)  
✅ **Fixed header pattern** with logo (left), title (center), menu (right)  
✅ **Slide-over navigation** from right side with backdrop  
✅ **WCAG-compliant** keyboard navigation (Tab, Enter, Escape, focus trap)  
✅ **Page-specific content** in `<main>` with appropriate sectioning

### 7.2 Content Layout Patterns

**Birthdays**: Feature cards + CTA sections (service-oriented)  
**Contact**: Contact method cards + social links + vCard (action-oriented)  
**Shows**: Timeline/list cards with dates and venues (event-oriented)  
**Characters**: Profile cards with images and descriptions (portfolio-oriented)

### 7.3 CSS Approach

✅ **Inline CSS** in `<style>` tags (no external stylesheet, simplest for 5 pages)  
✅ **Mobile-first** responsive design (320px base → 768px → 1024px → 1920px)  
✅ **375px centered container** maintained across all pages  
✅ **Rainbow gradient text** for headings and brand elements  
✅ **Green accent (#00a700)** for CTAs and interactive elements  
✅ **Sprinkles decoration** from home page carried through

### 7.4 Maintaining Brand Identity

✅ **Typography**: Comic Neue 700 for headings, system-ui for body  
✅ **Colors**: Rainbow gradients + green accent + pastel card backgrounds  
✅ **Spacing**: Consistent 0.75rem gaps, 1.5rem margins  
✅ **Border radius**: 12px cards, 19px buttons  
✅ **ImageKit CDN**: Responsive images with srcset and WebP  
✅ **SEO meta tags**: Description, Open Graph, Twitter Card, local SEO for Monaco

### 7.5 Performance Considerations

✅ **Font loading**: Async with `media="print" onload="this.media='all'"`  
✅ **Image optimization**: ImageKit transformations (w, f-auto, q-80, dpr)  
✅ **Lazy loading**: `loading="lazy"` for below-fold images  
✅ **Animation performance**: CSS transforms (not position) for smooth 60fps  
✅ **Header auto-hide**: RequestAnimationFrame for scroll performance  
✅ **No external dependencies**: Pure HTML/CSS/JS (except existing confetti on home)

---

## 8. Next Steps

1. **Phase 1**: Create data model and contracts document (page structure definitions)
2. **Phase 1**: Create quickstart guide (implementation workflow)
3. **Phase 2**: Generate tasks.md (step-by-step implementation tasks)
4. **Implementation**: Build pages using template and content patterns from this research

---

**Research completed**: 2025-11-15  
**Ready for**: Phase 1 (Data Model & Contracts, Quickstart Guide)
