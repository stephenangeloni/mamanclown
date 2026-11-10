/**
 * Maman Clown Website - Multilingual Header Component
 * Handles navigation menu, scroll detection, and keyboard accessibility
 */

(function() {
    'use strict';
    
    // Language detection (priority: data attribute > URL path > default)
    function detectLanguage() {
        const declaredLang = document.body.dataset.lang;
        if (declaredLang) {
            return declaredLang.toLowerCase();
        }
        
        const path = window.location.pathname;
        if (path.includes('/EN/')) return 'en';
        if (path.includes('/FR/')) return 'fr';
        
        return 'fr'; // Default to French (primary audience)
    }
    
    // Supported languages configuration
    const languages = [
        { code: 'fr', label: 'FR', name: 'Français' },
        { code: 'en', label: 'EN', name: 'English' }
        // Future: Add { code: 'it', label: 'IT', name: 'Italiano' }
    ];
    
    // Centralized page configuration
    const pageConfigs = {
        home: {
            titles: { fr: 'Accueil', en: 'Home' },
            urls: { fr: '/FR/accueil.html', en: '/EN/home.html' }
        },
        birthdays: {
            titles: { fr: 'Anniversaire', en: 'Birthday Party' },
            urls: { fr: '/FR/anniversaire.html', en: '/EN/birthday-party.html' }
        },
        shows: {
            titles: { fr: 'Spectacles', en: 'Shows' },
            urls: { fr: '/FR/spectacles.html', en: '/EN/shows.html' }
        },
        characters: {
            titles: { fr: 'Personnages', en: 'Characters' },
            urls: { fr: '/FR/personnages.html', en: '/EN/characters.html' }
        },
        workshops: {
            titles: { fr: 'Ateliers', en: 'Workshops' },
            urls: { fr: '/FR/ateliers.html', en: '/EN/workshops.html' }
        },
        contact: {
            titles: { fr: 'Contact', en: 'Contact' },
            urls: { fr: '/FR/contact.html', en: '/EN/contact.html' }
        }
    };
    
    // Build pages array for current language
    function buildPagesForLanguage(lang) {
        return Object.entries(pageConfigs).map(([id, config]) => ({
            id: id,
            title: config.titles[lang] || config.titles['fr'],
            url: config.urls[lang] || config.urls['fr']
        }));
    }
    
    // Get current page from body data attribute
    const currentPage = document.body.dataset.page || 'home';
    const currentLang = detectLanguage();
    const pages = buildPagesForLanguage(currentLang);
    
    // Build language switcher
    function initLanguageSwitcher() {
        const switcher = document.getElementById('language-switcher');
        if (!switcher) return;
        
        languages.forEach(lang => {
            const link = document.createElement('a');
            const pageConfig = pageConfigs[currentPage];
            
            if (pageConfig && pageConfig.urls[lang.code]) {
                link.href = pageConfig.urls[lang.code];
                link.textContent = lang.label;
                link.className = 'lang-link';
                link.title = lang.name;
                
                // Mark current language as active
                if (lang.code === currentLang) {
                    link.classList.add('active');
                }
                
                switcher.appendChild(link);
            }
        });
    }
    
    // Build menu (the current page is marked, not left out)
    function initMenu() {
        const menu = document.getElementById('menu');
        if (!menu) return;
        
        pages.forEach(page => {
            const link = document.createElement('a');
            link.href = page.url;
            link.textContent = page.title;
            link.className = 'menu-link';
            if (page.id === 'contact') {
                link.classList.add('menu-link--cta');
            }
            if (page.id === currentPage) {
                link.setAttribute('aria-current', 'page');
            }
            menu.appendChild(link);
        });
    }
    
    // Footer: contact shortcuts and service area, added to every page.
    // The home and contact pages already list the contacts, so they get the text only.
    const footerText = {
        fr: { area: "Maman Clown · Monaco, Monte-Carlo et Côte d'Azur", phone: 'Téléphone', email: 'E-mail' },
        en: { area: 'Maman Clown · Monaco, Monte-Carlo and the French Riviera', phone: 'Phone', email: 'Email' }
    };
    
    const footerLinks = [
        { id: 'phone', href: 'tel:+33672242512',
          icon: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>` },
        { id: 'email', href: 'mailto:contact@mamanclown.com',
          icon: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>` },
        { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61570633046088',
          icon: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>` },
        { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/maman.clown/',
          icon: `<svg viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>` }
    ];
    
    function initFooter() {
        const text = footerText[currentLang] || footerText.fr;
        const footer = document.createElement('footer');
        footer.className = 'site-footer';
        
        if (currentPage !== 'home' && currentPage !== 'contact') {
            const list = document.createElement('ul');
            list.className = 'footer-links';
            footerLinks.forEach(item => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.className = 'footer-link footer-link--' + item.id;
                link.href = item.href;
                link.setAttribute('aria-label', item.label || text[item.id]);
                if (item.href.startsWith('https:')) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
                link.innerHTML = item.icon;
                link.firstElementChild.setAttribute('aria-hidden', 'true');
                li.appendChild(link);
                list.appendChild(li);
            });
            footer.appendChild(list);
        }
        
        const area = document.createElement('p');
        area.className = 'footer-area';
        area.textContent = text.area;
        footer.appendChild(area);
        
        document.body.appendChild(footer);
    }
    
    // Hamburger menu functionality
    function initHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger');
        const menu = document.getElementById('menu');
        const menuOverlay = document.getElementById('menu-overlay');
        let isAnimating = false;
        let lastFocusedElement = null;
        
        if (!hamburger || !menu || !menuOverlay) return;
        
        // On wide screens header.css shows the menu as a row of links in the
        // header, so it is always visible and never "open".
        const wideScreen = window.matchMedia('(min-width: 1000px)');
        
        function syncWithScreenWidth() {
            if (wideScreen.matches) {
                menu.classList.remove('open');
                menuOverlay.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'false');
            } else {
                menu.setAttribute('aria-hidden', String(!menu.classList.contains('open')));
            }
        }
        
        syncWithScreenWidth();
        wideScreen.addEventListener('change', syncWithScreenWidth);
        
        function openMenu() {
            if (isAnimating) return;
            isAnimating = true;
            
            lastFocusedElement = document.activeElement;
            
            menu.classList.add('open');
            menuOverlay.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
            
            // Focus first menu link
            const firstLink = menu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
            
            setTimeout(() => { isAnimating = false; }, 500);
        }
        
        function closeMenu() {
            if (isAnimating) return;
            isAnimating = true;
            
            menu.classList.remove('open');
            menuOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            
            // Return focus to hamburger
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
            
            setTimeout(() => { isAnimating = false; }, 500);
        }
        
        // Click handlers
        hamburger.addEventListener('click', () => {
            if (menu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        menuOverlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking a link
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
        
        // Focus trap
        menu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && menu.classList.contains('open')) {
                const focusableElements = Array.from(menu.querySelectorAll('a'));
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab: moving backward
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab: moving forward
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Scroll direction detection (hide header on scroll down, show on scroll up)
    function initScrollDetection() {
        let lastScrollY = window.pageYOffset;
        const header = document.getElementById('site-header');
        
        if (!header) return;
        
        let ticking = false;
        
        function updateHeader() {
            const currentScrollY = window.pageYOffset;
            const scrollDifference = currentScrollY - lastScrollY;
            
            // Hide header when scrolling down (past 100px threshold)
            if (scrollDifference > 5 && currentScrollY > 100) {
                header.classList.add('hidden');
            }
            // Show header when scrolling up
            else if (scrollDifference < -5 || currentScrollY < 100) {
                header.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Initialize when DOM is ready
    function init() {
        initLanguageSwitcher();
        initMenu();
        initHamburgerMenu();
        initScrollDetection();
        initFooter();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
