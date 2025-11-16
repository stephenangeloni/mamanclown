# GitHub Pages Redirect Implementation Research

**Date:** November 16, 2025  
**Project:** Maman Clown Website - Multilingual Migration  
**Context:** Migrating from root-level pages to language-specific subdirectories

## Executive Summary

**GitHub Pages does NOT support native server-side 301 redirects** for static sites. Neither `.htaccess` files nor `_redirects` files are supported. This research evaluates all available redirect options and provides a recommended implementation strategy.

## Key Findings

### 1. GitHub Pages Redirect Capabilities

**Does GitHub Pages support `.htaccess` files?**
- **NO** - GitHub Pages does not use Apache web server
- `.htaccess` files are ignored completely
- GitHub Pages uses a custom static file server

**Does GitHub Pages support `_redirects` files?**
- **NO** - This is a Netlify/Cloudflare Pages feature
- Not supported on GitHub Pages infrastructure

**What redirect mechanisms ARE available?**
1. Client-side JavaScript redirects
2. HTML meta refresh redirects
3. Jekyll redirect plugins (requires Jekyll setup)
4. Custom 404 page with smart routing

### 2. Comparison of Available Options

#### Option A: Client-Side JavaScript Redirect
**Implementation:**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Page déplacée - Maman Clown</title>
    <script>
        // Immediate redirect
        window.location.replace('/FR/accueil.html');
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=/FR/accueil.html">
    </noscript>
</head>
<body>
    <p>Cette page a été déplacée vers <a href="/FR/accueil.html">/FR/accueil.html</a></p>
</body>
</html>
```

**Pros:**
- Fast redirect (near-instant)
- Works without server configuration
- Fallback with `<noscript>` meta refresh
- Simple to implement and maintain
- No build process required

**Cons:**
- **NOT a true 301 redirect** (SEO implications)
- Requires JavaScript enabled (though fallback exists)
- Search engines may take longer to update
- Does not pass HTTP status code

**SEO Impact:**
- Google explicitly states JavaScript redirects are followed and understood
- May take longer for search engines to recognize (weeks vs. days)
- No PageRank loss if implemented correctly
- `window.location.replace()` prevents back button issues

#### Option B: HTML Meta Refresh (0-Second)
**Implementation:**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=/FR/accueil.html">
    <link rel="canonical" href="https://yoursite.com/FR/accueil.html">
    <title>Redirection - Maman Clown</title>
</head>
<body>
    <p>Si vous n'êtes pas redirigé automatiquement, <a href="/FR/accueil.html">cliquez ici</a>.</p>
</body>
</html>
```

**Pros:**
- Works without JavaScript
- Simple HTML-only solution
- Canonical tag helps with SEO
- Widely supported by all browsers

**Cons:**
- **NOT a 301 redirect** (treated as soft redirect)
- Google treats it similar to 301, but slower to process
- Visible redirect delay even at 0 seconds
- Less control over redirect behavior

**SEO Impact:**
- Google treats 0-second meta refresh similar to 301
- Not as fast as JavaScript for crawlers
- Canonical tag helps establish preferred URL
- No guarantee of PageRank transfer

#### Option C: Jekyll with `jekyll-redirect-from` Plugin
**Implementation:**

**1. Setup Jekyll** (if not already using):
```yaml
# _config.yml
plugins:
  - jekyll-redirect-from
```

**2. Add redirect frontmatter to new pages:**
```yaml
---
redirect_from:
  - /index.html
  - /
---
# French Homepage Content
```

**Pros:**
- Generates proper redirect pages automatically
- Clean, declarative configuration
- Integrates with Jekyll ecosystem
- Uses JavaScript + meta refresh combo

**Cons:**
- **Requires Jekyll setup** (site is currently static HTML)
- **Still not a true 301 redirect** (client-side)
- Adds build complexity
- Migration overhead for entire site

**SEO Impact:**
- Same as Option A (JavaScript + meta refresh)
- No SEO advantage over manual implementation
- Added complexity not justified for static site

#### Option D: Custom 404 Page with Smart Routing
**Implementation:**
```html
<!-- 404.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Redirection - Maman Clown</title>
    <script>
        // Map old URLs to new French URLs
        const redirectMap = {
            '/index.html': '/FR/accueil.html',
            '/birthdays.html': '/FR/anniversaires.html',
            '/shows.html': '/FR/spectacles.html',
            '/characters.html': '/FR/personnages.html',
            '/contact.html': '/FR/contact.html'
        };
        
        const currentPath = window.location.pathname;
        const newPath = redirectMap[currentPath];
        
        if (newPath) {
            window.location.replace(newPath);
        }
    </script>
</head>
<body>
    <h1>Page déplacée</h1>
    <p>Cette page a été déplacée. Vous allez être redirigé...</p>
</body>
</html>
```

**Pros:**
- Centralized redirect logic
- One file to maintain
- Handles 404s gracefully
- Can add logging/analytics

**Cons:**
- Relies on 404 errors being triggered
- **May affect crawl budget** (404s first, then redirect)
- Search engines see 404 before redirect
- Poor SEO compared to other options

**SEO Impact:**
- **Worst option for SEO**
- 404 status code sent to crawlers
- JavaScript redirect happens after 404
- May lose PageRank
- Can confuse search engines

### 3. SEO Best Practices for Static Site Redirects

Since true 301 redirects aren't available, follow these practices:

1. **Use Canonical Tags**
   - Add canonical tags to new pages pointing to themselves
   - Helps search engines understand preferred URL

2. **Update External Links**
   - Update sitemap.xml with new URLs
   - Submit updated sitemap to Google Search Console
   - Update backlinks where possible

3. **Google Search Console**
   - Submit change of address if using custom domain
   - Monitor crawl errors
   - Use URL removal tool for old pages

4. **Rel="alternate" hreflang Tags**
   - Implement for multilingual content
   - Helps search engines serve correct language

5. **Keep Redirects Long-Term**
   - Don't remove redirect pages quickly
   - Keep for at least 6-12 months
   - Monitor traffic to determine removal

## Recommended Solution

### Primary Recommendation: **Option A - JavaScript Redirect with Meta Refresh Fallback**

**Rationale:**
1. **No infrastructure changes needed** - Works with existing static HTML setup
2. **Best user experience** - Instant redirect for 99%+ of users
3. **Graceful degradation** - Meta refresh fallback for rare no-JS scenarios
4. **SEO-friendly** - Google follows and credits JavaScript redirects
5. **Simple maintenance** - Easy to understand and modify
6. **No build process** - Keep current deployment workflow

### Implementation Strategy

#### Phase 1: Create Redirect Pages (Immediate)

For each legacy URL, create a redirect page:

**File: `/index.html` (root)**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex">
    <link rel="canonical" href="https://yoursite.com/FR/accueil.html">
    <title>Redirection - Maman Clown</title>
    <script>
        window.location.replace('/FR/accueil.html');
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=/FR/accueil.html">
    </noscript>
</head>
<body>
    <p>Cette page a été déplacée vers <a href="/FR/accueil.html">notre nouvelle page d'accueil</a>.</p>
</body>
</html>
```

**File: `/birthdays.html`**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex">
    <link rel="canonical" href="https://yoursite.com/FR/anniversaires.html">
    <title>Redirection - Maman Clown</title>
    <script>
        window.location.replace('/FR/anniversaires.html');
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=/FR/anniversaires.html">
    </noscript>
</head>
<body>
    <p>Cette page a été déplacée vers <a href="/FR/anniversaires.html">notre nouvelle page anniversaires</a>.</p>
</body>
</html>
```

**Repeat for:**
- `/shows.html` → `/FR/spectacles.html`
- `/characters.html` → `/FR/personnages.html`
- `/contact.html` → `/FR/contact.html`

#### Phase 2: Update Canonical Tags on New Pages

On all new language pages, add self-referencing canonical:

```html
<!-- /FR/accueil.html -->
<head>
    <link rel="canonical" href="https://yoursite.com/FR/accueil.html">
    <link rel="alternate" hreflang="fr" href="https://yoursite.com/FR/accueil.html">
    <link rel="alternate" hreflang="en" href="https://yoursite.com/EN/home.html">
    <link rel="alternate" hreflang="x-default" href="https://yoursite.com/FR/accueil.html">
</head>
```

#### Phase 3: Update Sitemap and Submit to Search Engines

Create `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://yoursite.com/FR/accueil.html</loc>
        <xhtml:link rel="alternate" hreflang="fr" href="https://yoursite.com/FR/accueil.html"/>
        <xhtml:link rel="alternate" hreflang="en" href="https://yoursite.com/EN/home.html"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="https://yoursite.com/FR/accueil.html"/>
        <lastmod>2025-11-16</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <!-- Repeat for all pages -->
</urlset>
```

Submit to:
- Google Search Console
- Bing Webmaster Tools

#### Phase 4: Monitor and Maintain

1. **Keep redirect pages for 12 months minimum**
2. **Monitor Google Search Console for crawl errors**
3. **Track traffic to old URLs** (should decrease over time)
4. **Update backlinks** where possible
5. **Consider removing redirects after 12 months** if traffic is negligible

## Alternative Options (Not Recommended)

### Why Not Jekyll?
- **Current site is static HTML** - No Jekyll infrastructure
- **Migration overhead** - Would need to convert entire site
- **No SEO benefit** - Still client-side redirects
- **Adds complexity** - Build process, Ruby dependencies
- **Overkill for use case** - Simple redirect needs

### Why Not Move to Netlify/Cloudflare Pages?
- **Out of scope** - Would require infrastructure migration
- **Potential downtime** - DNS changes, deployment changes
- **Learning curve** - New platform, new workflows
- **Not necessary** - Current solution works well

### Why Not Custom 404 Routing?
- **Poor SEO** - 404 status codes sent first
- **Confusing for search engines** - Mixed signals
- **Crawl budget impact** - Wastes crawler resources
- **User experience** - Flickers, delays

## SEO Timeline Expectations

With JavaScript + Meta Refresh approach:

- **Week 1-2:** Search engines discover new structure
- **Week 2-4:** New URLs begin appearing in search results
- **Week 4-8:** Old URLs gradually replaced by new URLs
- **Week 8-12:** Majority of traffic shifted to new URLs
- **Month 6-12:** Keep redirects active, monitor stragglers

## Code Examples Repository Structure

```
/
├── index.html              (redirect to /FR/accueil.html)
├── birthdays.html          (redirect to /FR/anniversaires.html)
├── shows.html              (redirect to /FR/spectacles.html)
├── characters.html         (redirect to /FR/personnages.html)
├── contact.html            (redirect to /FR/contact.html)
├── sitemap.xml             (updated with new URLs)
├── robots.txt              (allow all)
├── FR/
│   ├── accueil.html
│   ├── anniversaires.html
│   ├── spectacles.html
│   ├── personnages.html
│   └── contact.html
└── EN/
    ├── home.html
    ├── birthdays.html
    ├── shows.html
    ├── characters.html
    └── contact.html
```

## Testing Checklist

Before deploying:

- [ ] Test redirects in Chrome, Firefox, Safari
- [ ] Test with JavaScript disabled (meta refresh works)
- [ ] Verify canonical tags on all new pages
- [ ] Check sitemap.xml validates
- [ ] Test hreflang attributes with validator
- [ ] Verify mobile experience
- [ ] Check redirect doesn't create loop
- [ ] Ensure old URLs don't return 404
- [ ] Test with curl/wget to see HTML source
- [ ] Verify analytics tracking on new pages

## References

### Official Documentation
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Custom Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 404 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
- [Jekyll Redirect From Plugin](https://github.com/jekyll/jekyll-redirect-from)

### SEO Resources
- [Google: JavaScript Redirects](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics#use-javascript-redirects)
- [Google: International SEO](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: Change Page URLs with 301 Redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Moz: Meta Refresh vs. 301 Redirects](https://moz.com/blog/meta-refresh-vs-301-redirect)

### Community Resources
- [Stack Overflow: GitHub Pages Redirects](https://stackoverflow.com/questions/tagged/github-pages+redirect)
- [GitHub Community: Pages Discussions](https://github.com/orgs/community/discussions/categories/pages)

## Conclusion

For a static HTML site on GitHub Pages:

1. **True 301 redirects are impossible** without moving platforms
2. **JavaScript + meta refresh is the best available option**
3. **SEO impact is minimal** with proper implementation
4. **Timeline: 2-3 months** for full search engine transition
5. **Keep redirects active for 12 months** minimum

The recommended approach balances:
- Simplicity (no infrastructure changes)
- User experience (instant redirects)
- SEO considerations (search engine friendly)
- Maintainability (easy to understand and modify)

**Decision: Implement JavaScript redirects with meta refresh fallback and proper canonical tags.**
