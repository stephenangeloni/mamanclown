/**
 * Maman Clown - Sprinkles Background Effect
 * Creates colorful confetti-like sprinkles across the page background
 */

(function() {
    'use strict';

    // Sprinkle color palette - vibrant and playful
    const SPRINKLE_COLORS = [
        '#FF6B6B', // Red
        '#FFA94D', // Orange
        '#FFD43B', // Yellow
        '#69DB7C', // Green
        '#4DABF7', // Blue
        '#9775FA', // Violet
        '#F783AC'  // Pink
    ];

    // Configuration
    const CONFIG = {
        density: 1 / 7000,     // One sprinkle per 7000 square pixels
        minSize: 6,            // Minimum sprinkle size in pixels
        maxSize: 13,           // Maximum sprinkle size in pixels
        animatedPercent: 0.3,  // 30% of sprinkles will be animated
        containerId: 'sprinkles'
    };

    /**
     * Create a single sprinkle element
     * @param {boolean} animated - Whether this sprinkle should float
     * @returns {HTMLElement} The sprinkle element
     */
    function createSprinkle(animated) {
        const sprinkle = document.createElement('div');
        sprinkle.className = 'sprinkle' + (animated ? ' sprinkle-animated' : '');

        // Random position across viewport
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random color from palette
        const color = SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)];

        // Random rotation
        const rotation = Math.random() * 360;

        // Random size within range
        const size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);

        // Random animation delay for animated sprinkles
        const delay = Math.random() * 3;

        // Random opacity for variety
        const opacity = 0.35 + Math.random() * 0.35;

        // One in three is a short ribbon instead of a dot
        const ribbon = Math.random() < 0.33;

        // Set styles using safe property assignments
        sprinkle.style.left = x + '%';
        sprinkle.style.top = y + '%';
        sprinkle.style.backgroundColor = color;
        sprinkle.style.width = (ribbon ? size * 2.4 : size) + 'px';
        sprinkle.style.height = (ribbon ? size * 0.7 : size) + 'px';
        if (ribbon) {
            sprinkle.style.borderRadius = size + 'px';
        }
        sprinkle.style.setProperty('--rotation', rotation + 'deg');
        sprinkle.style.setProperty('--delay', delay + 's');
        sprinkle.style.opacity = opacity;

        return sprinkle;
    }

    /**
     * Remove all child elements from container safely
     * @param {HTMLElement} container - The container to clear
     */
    function clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    /**
     * Create all sprinkles based on viewport size
     */
    function createSprinkles() {
        const container = document.getElementById(CONFIG.containerId);
        if (!container) return;

        // Clear existing sprinkles safely
        clearContainer(container);

        // Calculate number based on viewport area
        const viewportArea = window.innerWidth * window.innerHeight;
        const numberOfSprinkles = Math.floor(viewportArea * CONFIG.density);

        // Create document fragment for performance
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < numberOfSprinkles; i++) {
            const animated = Math.random() < CONFIG.animatedPercent;
            fragment.appendChild(createSprinkle(animated));
        }

        container.appendChild(fragment);
    }

    /**
     * Debounce function for resize handler
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Initialize sprinkles
     */
    function init() {
        // Check if container exists, if not create it
        let container = document.getElementById(CONFIG.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = CONFIG.containerId;
            container.className = 'sprinkles';
            document.body.insertBefore(container, document.body.firstChild);
        }

        // Create initial sprinkles
        createSprinkles();

        // Recreate on window resize (debounced)
        window.addEventListener('resize', debounce(createSprinkles, 250));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.sprinklesDebug = {
            refresh: createSprinkles,
            config: CONFIG
        };
    }
})();
