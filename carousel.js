/**
 * Carousel JavaScript - Image Carousel with ImageKit.io Integration
 * Feature: 003-image-carousel
 * 
 * This file provides the core carousel functionality including:
 * - Image discovery from page path and JSON manifest
 * - ImageKit URL construction with responsive transformations
 * - HTML structure generation with rotation effects
 * - Navigation handling with debouncing
 * - Image load state management and error handling
 */

(function() {
  'use strict';

  /* =========================================================================
     ImageKit URL Construction
     ========================================================================= */

  /**
   * Build a single ImageKit URL with transformation parameters
   * @param {string} imagekitId - ImageKit account ID
   * @param {string} imagePath - Path to image (e.g., "images/FR/anniversaire/photo1.jpg")
   * @param {number} width - Target width in pixels
   * @param {number} quality - Quality percentage (default: 80)
   * @param {boolean} progressive - Enable progressive rendering (default: true)
   * @returns {string} Complete ImageKit URL
   */
  function buildImagekitUrl(imagekitId, imagePath, width, quality = 80, progressive = true) {
    // Strip "images/" prefix from path for ImageKit URL
    // Local: images/FR/anniversaire/photo.webp → ImageKit: FR/anniversaire/photo.webp
    const imagekitPath = imagePath.replace(/^images\//, '');
    
    const baseUrl = `https://ik.imagekit.io/${imagekitId}/${imagekitPath}`;
    const transforms = [
      `w-${width}`,
      `q-${quality}`,
      'f-auto', // Auto format - serves WebP to supporting browsers, JPEG fallback
      progressive ? 'pr-true' : null
    ].filter(Boolean).join(',');
    
    return `${baseUrl}?tr=${transforms}`;
  }

  /**
   * Build responsive URL set for srcset attribute
   * @param {string} imagekitId - ImageKit account ID
   * @param {string} imagePath - Path to image
   * @returns {Object} Object with mobile, tablet, desktop, srcset, and sizes properties
   */
  function buildImagekitUrlSet(imagekitId, imagePath) {
    const mobile = buildImagekitUrl(imagekitId, imagePath, 640, 80, true);
    const tablet = buildImagekitUrl(imagekitId, imagePath, 1024, 80, true);
    const desktop = buildImagekitUrl(imagekitId, imagePath, 1920, 85, true);
    
    const srcset = [
      `${mobile} 640w`,
      `${tablet} 1024w`,
      `${desktop} 1920w`
    ].join(', ');
    
    const sizes = "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px";
    
    return { mobile, tablet, desktop, srcset, sizes };
  }

  /* =========================================================================
     Image Discovery
     ========================================================================= */

  /**
   * Parse image manifest from DOM and compute full paths
   * Reads <script type="application/json" id="carousel-images"> from page
   * @returns {string[]} Array of full image paths or empty array if no manifest
   */
  function discoverImages() {
    // Read manifest from DOM
    const manifestEl = document.getElementById('carousel-images');
    if (!manifestEl) {
      console.info('Carousel: No manifest found (no <script id="carousel-images">)');
      return [];
    }
    
    let filenames;
    try {
      filenames = JSON.parse(manifestEl.textContent);
    } catch (error) {
      console.error('Carousel: Invalid JSON in manifest', error);
      return [];
    }
    
    if (!Array.isArray(filenames) || filenames.length === 0) {
      console.info('Carousel: Empty manifest');
      return [];
    }
    
    // Compute image directory from page path
    const pagePath = window.location.pathname;
    const parts = pagePath.split('/').filter(Boolean);
    
    if (parts.length < 2) {
      console.warn('Carousel: Invalid page path format', pagePath);
      return [];
    }
    
    const lang = parts[0]; // "FR" or "EN"
    const page = parts[1]?.replace('.html', ''); // "anniversaire"
    
    if (!lang || !page) {
      console.warn('Carousel: Cannot parse language/page from path', pagePath);
      return [];
    }
    
    const imageDir = `images/${lang}/${page}/`;
    
    // Build full paths
    return filenames.map(filename => imageDir + filename);
  }

  /* =========================================================================
     Data Structures
     ========================================================================= */

  /**
   * Create CarouselInstance data structure
   * @param {string} containerId - DOM element ID
   * @param {string} imagekitId - ImageKit account ID
   * @param {string[]} imagePaths - Array of image paths
   * @returns {Object} CarouselInstance
   */
  function createCarouselInstance(containerId, imagekitId, imagePaths) {
    const pagePath = window.location.pathname;
    const parts = pagePath.split('/').filter(Boolean);
    const lang = parts[0] || '';
    const page = parts[1]?.replace('.html', '') || '';
    const imageDirectory = `images/${lang}/${page}/`;
    
    return {
      containerId,
      imagekitId,
      pagePath,
      imageDirectory,
      images: imagePaths.map((path, index) => createImageMetadata(path, index, imagekitId, page)),
      currentIndex: 0,
      isAnimating: false
    };
  }

  /**
   * Create ImageMetadata data structure
   * @param {string} fullPath - Full image path
   * @param {number} index - Position in carousel
   * @param {string} imagekitId - ImageKit account ID
   * @param {string} pageName - Page name for alt text
   * @returns {Object} ImageMetadata
   */
  function createImageMetadata(fullPath, index, imagekitId, pageName) {
    const filename = fullPath.split('/').pop();
    const formattedPageName = pageName.replace(/-/g, ' ');
    const altText = `${formattedPageName} example photo ${index + 1}`;
    
    return {
      filename,
      fullPath,
      imagekitUrls: buildImagekitUrlSet(imagekitId, fullPath),
      loadStatus: 'pending',
      index,
      altText
    };
  }

  /* =========================================================================
     HTML Generation
     ========================================================================= */

  /**
   * Generate HTML structure for carousel (simple horizontal slider)
   * @param {Object} carouselInstance - CarouselInstance data
   * @returns {string} HTML string
   */
  function renderCarousel(carouselInstance) {
    const { images } = carouselInstance;
    
    if (images.length === 0) {
      return '';
    }
    
    // Single image special case (no interaction)
    const singleImageClass = images.length === 1 ? ' carousel-single-image' : '';
    
    let html = `<div class="carousel${singleImageClass}" id="carousel-main">\n`;
    
    // Generate radio inputs (hidden, for state management)
    images.forEach((image, index) => {
      const checked = index === 0 ? ' checked' : '';
      html += `  <input type="radio" id="carousel-radio-${index}" name="carousel-nav"${checked}>\n`;
    });
    
    // Generate slides container (horizontal strip)
    html += `  <div class="carousel-slides">\n`;
    
    images.forEach((image, index) => {
      const isFirst = index === 0;
      const loading = isFirst ? 'eager' : 'lazy';
      const fetchpriority = isFirst ? ' fetchpriority="high"' : '';
      
      const nextIndex = index === images.length - 1 ? 0 : index + 1;
      
      html += `    <div class="carousel-slide">\n`;
      
      // Make image clickable to navigate to next image (if more than one)
      if (images.length > 1) {
        html += `      <label for="carousel-radio-${nextIndex}" class="carousel-img-label" aria-label="View next image">\n`;
      }
      
      html += `        <img\n`;
      html += `          class="carousel-img"\n`;
      html += `          src="${image.imagekitUrls.mobile}"\n`;
      html += `          srcset="${image.imagekitUrls.srcset}"\n`;
      html += `          sizes="${image.imagekitUrls.sizes}"\n`;
      html += `          loading="${loading}"\n`;
      html += `${fetchpriority}`;
      html += `          alt="${image.altText}"\n`;
      html += `          data-index="${index}"\n`;
      html += `        >\n`;
      
      if (images.length > 1) {
        html += `      </label>\n`;
      }
      
      html += `    </div>\n`;
    });
    
    html += `  </div>\n`;
    html += `</div>`;
    
    return html;
  }

  /* =========================================================================
     Event Handling
     ========================================================================= */

  /**
   * Handle navigation button click with debouncing
   * @param {Event} event - Click event
   * @param {Object} carouselInstance - CarouselInstance data
   */
  function handleNavigation(event, carouselInstance) {
    // Check if animation in progress (debounce)
    if (carouselInstance.isAnimating) {
      return;
    }
    
    // Mark as animating
    carouselInstance.isAnimating = true;
    const carouselEl = document.getElementById('carousel-main');
    if (carouselEl) {
      carouselEl.classList.add('is-animating');
    }
    
    // Get target radio ID from label's "for" attribute
    const targetRadioId = event.currentTarget.getAttribute('for');
    const targetRadio = document.getElementById(targetRadioId);
    
    if (targetRadio) {
      // Check radio (triggers CSS animation)
      targetRadio.checked = true;
      
      // Update currentIndex
      const newIndex = parseInt(targetRadioId.split('-').pop(), 10);
      carouselInstance.currentIndex = newIndex;
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('carousel:navigate', {
        detail: {
          fromIndex: carouselInstance.currentIndex,
          toIndex: newIndex,
          totalImages: carouselInstance.images.length
        }
      }));
    }
    
    // Re-enable after animation completes
    setTimeout(() => {
      carouselInstance.isAnimating = false;
      if (carouselEl) {
        carouselEl.classList.remove('is-animating');
      }
    }, 600); // Match CSS animation duration
  }

  /**
   * Hide carousel card when image fails to load
   * @param {HTMLImageElement} imgElement - Failed image element
   */
  function hideFailedImage(imgElement) {
    const card = imgElement.closest('.carousel-card');
    if (!card) return;
    
    // Hide card
    card.style.display = 'none';
    
    // Also hide corresponding radio button
    const index = imgElement.dataset.index;
    const radio = document.getElementById(`carousel-radio-${index}`);
    if (radio) {
      radio.disabled = true;
      radio.style.display = 'none';
    }
    
    console.warn(`Carousel: Image ${index} failed to load, hidden from carousel`);
  }

  /**
   * Attach event listeners for navigation and image loading
   * @param {HTMLElement} carouselEl - Carousel container element
   * @param {Object} carouselInstance - CarouselInstance data
   */
  function attachEventListeners(carouselEl, carouselInstance) {
    // Image click/touch to navigate (debouncing)
    carouselEl.querySelectorAll('.carousel-img-label').forEach(label => {
      label.addEventListener('click', (e) => {
        // Check if animation in progress
        if (carouselInstance.isAnimating) {
          e.preventDefault(); // Block the label click
          return;
        }
        
        // Mark as animating
        carouselInstance.isAnimating = true;
        carouselEl.classList.add('is-animating');
        
        // Get target index from label's "for" attribute
        const targetRadioId = label.getAttribute('for');
        const newIndex = parseInt(targetRadioId.split('-').pop(), 10);
        
        // Update current index
        carouselInstance.currentIndex = newIndex;
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('carousel:navigate', {
          detail: {
            fromIndex: carouselInstance.currentIndex,
            toIndex: newIndex,
            totalImages: carouselInstance.images.length
          }
        }));
        
        // Re-enable after animation completes
        setTimeout(() => {
          carouselInstance.isAnimating = false;
          carouselEl.classList.remove('is-animating');
        }, 600);
        
        // Let the label click proceed to check the radio (native behavior)
      });
    });
    
    // Image load success
    carouselEl.querySelectorAll('.carousel-img').forEach(img => {
      img.addEventListener('load', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        const imageData = carouselInstance.images[index];
        
        if (imageData) {
          // Mark as loaded (whether from ImageKit or fallback)
          imageData.loadStatus = 'loaded';
          
          // Log if loaded from fallback
          const isLocalPath = !e.target.src.includes('ik.imagekit.io');
          if (isLocalPath) {
            console.info(`Carousel: Image ${index} loaded from local fallback`);
          }
          
          // Dispatch custom event
          document.dispatchEvent(new CustomEvent('carousel:imageload', {
            detail: {
              index,
              url: e.target.src,
              width: e.target.naturalWidth,
              height: e.target.naturalHeight
            }
          }));
        }
      });
    });
    
    // Image load failure with fallback to local path
    carouselEl.querySelectorAll('.carousel-img').forEach(img => {
      img.addEventListener('error', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        const imageData = carouselInstance.images[index];
        
        if (!imageData) return;
        
        // Check if this was an ImageKit URL (not already a fallback)
        const isImagekitUrl = e.target.src.includes('ik.imagekit.io');
        
        if (isImagekitUrl && imageData.fullPath) {
          // Try fallback to local path
          console.warn(`Carousel: ImageKit URL failed for image ${index}, trying local fallback: /${imageData.fullPath}`);
          
          // Update src and srcset to use local paths
          e.target.src = `/${imageData.fullPath}`;
          e.target.removeAttribute('srcset'); // Remove srcset on fallback (no responsive sizes)
          
          // Mark as attempting fallback (not yet failed)
          imageData.loadStatus = 'fallback-attempt';
        } else {
          // Fallback also failed, or already on fallback - hide the image
          imageData.loadStatus = 'failed';
          hideFailedImage(e.target);
          
          // Dispatch custom event
          document.dispatchEvent(new CustomEvent('carousel:imageerror', {
            detail: {
              index,
              url: e.target.src,
              error: 'Image failed to load from both ImageKit and local path'
            }
          }));
        }
      });
    });
  }

  /* =========================================================================
     Public API
     ========================================================================= */

  /**
   * Initialize carousel component on a page
   * @param {Object} options - Configuration options
   * @param {string} options.imagekitId - Required: ImageKit account ID
   * @param {string} options.containerSelector - Required: CSS selector for carousel container
   * @returns {Object|null} CarouselInstance object or null if initialization fails
   */
  function initCarousel(options) {
    // Validate options
    if (!options || !options.imagekitId || !options.containerSelector) {
      console.error('Carousel: Missing required options (imagekitId, containerSelector)');
      return null;
    }
    
    // Find container element
    const containerEl = document.querySelector(options.containerSelector);
    if (!containerEl) {
      console.error(`Carousel: Container not found: ${options.containerSelector}`);
      return null;
    }
    
    // Discover images from manifest
    const imagePaths = discoverImages();
    if (imagePaths.length === 0) {
      console.info('Carousel: No images found, carousel not initialized');
      return null;
    }
    
    // Create carousel instance
    const carouselInstance = createCarouselInstance(
      options.containerSelector,
      options.imagekitId,
      imagePaths
    );
    
    // Render HTML
    const html = renderCarousel(carouselInstance);
    containerEl.innerHTML = html;
    
    // Attach event listeners
    const carouselEl = document.getElementById('carousel-main');
    if (carouselEl) {
      attachEventListeners(carouselEl, carouselInstance);
    }
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('carousel:ready', {
      detail: {
        imageCount: carouselInstance.images.length,
        loadedCount: 0,
        failedCount: 0
      }
    }));
    
    console.info(`Carousel: Initialized with ${carouselInstance.images.length} images`);
    
    return carouselInstance;
  }

  /* =========================================================================
     Global Exports & Debugging
     ========================================================================= */

  // Export initCarousel to global scope
  window.initCarousel = initCarousel;
  
  // Debug helper (only in non-production)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.carouselDebug = {
      buildImagekitUrl,
      buildImagekitUrlSet,
      discoverImages
    };
  }

})();
