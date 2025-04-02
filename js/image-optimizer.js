// Image Optimizer for Mobile Performance
document.addEventListener('DOMContentLoaded', function() {
    // Helper functions
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Detect device capabilities
    function detectDeviceCapabilities() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const isSlowConnection = navigator.connection && 
            (navigator.connection.saveData || 
             navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g' ||
             navigator.connection.effectiveType === '3g');
        
        return {
            isMobile,
            isLowPerformance,
            isSlowConnection
        };
    }

    const deviceCapabilities = detectDeviceCapabilities();

    // Enhanced image loading and optimization
    function optimizeImages() {
        // Get all images on the page
        const images = document.querySelectorAll('img');
        
        // Process each image
        images.forEach(img => {
            // Skip images that have already been processed
            if (img.classList.contains('optimized')) return;
            
            // Add loading="lazy" attribute for native lazy loading
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Add decoding="async" for better performance
            img.decoding = 'async';
            
            // Set proper width and height attributes to prevent layout shifts
            if (img.naturalWidth && img.naturalHeight && !img.hasAttribute('width') && !img.hasAttribute('height')) {
                // Calculate aspect ratio
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                
                // If image is already loaded and has dimensions
                if (img.width && img.height) {
                    img.setAttribute('width', img.width);
                    img.setAttribute('height', img.height);
                } else {
                    // Set a default width based on container and maintain aspect ratio
                    const container = img.parentElement;
                    if (container) {
                        const containerWidth = container.offsetWidth;
                        img.setAttribute('width', containerWidth);
                        img.setAttribute('height', Math.round(containerWidth / aspectRatio));
                    }
                }
            }
            
            // For mobile or low-performance devices, use smaller images if available
            if ((deviceCapabilities.isMobile || deviceCapabilities.isLowPerformance) && img.dataset.mobileSrc) {
                img.src = img.dataset.mobileSrc;
            }
            
            // Mark image as optimized
            img.classList.add('optimized');
        });
    }

    // Optimize background images in CSS
    function optimizeBackgroundImages() {
        // Get elements with background images
        const elementsWithBg = document.querySelectorAll('.hero, .about-image, .project-card, .testimonial-card');
        
        // For mobile devices, add a class to use smaller background images
        if (deviceCapabilities.isMobile || deviceCapabilities.isLowPerformance) {
            elementsWithBg.forEach(el => {
                el.classList.add('mobile-bg');
            });
        }
    }

    // Defer non-critical images
    function deferNonCriticalImages() {
        // Get all images that are not in the viewport
        const images = document.querySelectorAll('img:not(.critical-image):not([src^="data:"])');
        
        // Create intersection observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            // Load the image
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            // Stop observing the image
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe each image
            images.forEach(img => {
                // Only observe images that have a data-src attribute
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }

    // Optimize hero image specifically
    function optimizeHeroImage() {
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            // Mark as critical image
            heroImage.classList.add('critical-image');
            
            // Ensure it's loaded with high priority
            if (heroImage.dataset.src) {
                heroImage.src = heroImage.dataset.src;
            }
            
            // For mobile devices, use a smaller version if available
            if ((deviceCapabilities.isMobile || deviceCapabilities.isLowPerformance) && heroImage.dataset.mobileSrc) {
                heroImage.src = heroImage.dataset.mobileSrc;
            }
        }
    }

    // Run all image optimizations
    function runImageOptimizations() {
        // Optimize hero image first for better perceived performance
        optimizeHeroImage();
        
        // Optimize all images
        optimizeImages();
        
        // Optimize background images
        optimizeBackgroundImages();
        
        // Defer non-critical images
        deferNonCriticalImages();
    }

    // Run optimizations when DOM is loaded
    runImageOptimizations();
    
    // Re-run optimizations on resize with debounce
    window.addEventListener('resize', debounce(() => {
        optimizeImages();
    }, 250), { passive: true });
    
    // Add CSS for image optimizations
    const style = document.createElement('style');
    style.textContent = `
        /* Prevent layout shifts during image loading */
        img {
            transition: opacity 0.3s ease;
        }
        
        /* Fade in effect for lazy-loaded images */
        img.loaded {
            opacity: 1;
        }
        
        /* Mobile background image optimizations */
        @media (max-width: 768px) {
            .mobile-bg {
                background-size: cover !important;
                background-attachment: scroll !important;
            }
        }
    `;
    document.head.appendChild(style);
});