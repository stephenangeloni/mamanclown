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
        contact: {
            titles: { fr: 'Contact', en: 'Contact' },
            urls: { fr: '/FR/contact.html', en: '/EN/contact.html' }
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
    
    // Build menu (exclude current page)
    function initMenu() {
        const menu = document.getElementById('menu');
        if (!menu) return;
        
        const menuLinks = pages.filter(p => p.id !== currentPage);
        
        menuLinks.forEach(page => {
            const link = document.createElement('a');
            link.href = page.url;
            link.textContent = page.title;
            link.className = 'menu-link';
            menu.appendChild(link);
        });
    }
    
    // Hamburger menu functionality
    function initHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger');
        const menu = document.getElementById('menu');
        const menuOverlay = document.getElementById('menu-overlay');
        let isAnimating = false;
        let lastFocusedElement = null;
        
        if (!hamburger || !menu || !menuOverlay) return;
        
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
            if (e.key === 'Tab') {
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
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
