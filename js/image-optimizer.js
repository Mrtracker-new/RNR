// Image optimization utility
const ImageOptimizer = {
    /**
     * Optimizes images by lazy loading and responsive sizing
     * @param {string} selector - CSS selector for target images
     */
    init: function(selector = 'img[data-src]') {
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll(selector);
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-src');
                            img.removeAttribute('data-srcset');
                            observer.unobserve(img);
                        }
                    });
                }, { rootMargin: '200px 0px' });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for browsers without IntersectionObserver
                images.forEach(img => {
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                });
            }
        });
    },
    
    /**
     * Converts images to WebP format when supported
     */
    convertToWebP: function() {
        // Implementation would depend on server-side processing
        console.log('WebP conversion would be handled server-side');
    }
};

// Initialize with default settings
ImageOptimizer.init();