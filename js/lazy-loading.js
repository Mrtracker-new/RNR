// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    const initLazyLoading = () => {
        // Get all images that should be lazy loaded
        let lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) {
            // If no images with data-src attribute found, add them programmatically
            const images = document.querySelectorAll('img:not([data-src])');
            images.forEach(img => {
                if (!img.classList.contains('lazy-loaded') && !img.dataset.src) {
                    // Store original src in data-src
                    img.dataset.src = img.src;
                    
                    // Create a low-quality placeholder or use a tiny transparent gif
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    img.classList.add('lazy-image');
                }
            });
            
            // Update lazyImages collection
            lazyImages = document.querySelectorAll('.lazy-image');
        }
        
        // Create intersection observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the actual image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            
                            // Add loading animation
                            img.style.opacity = '0';
                            img.style.transform = 'scale(0.9)';
                            
                            img.onload = () => {
                                // Animate image in when loaded
                                img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                                img.style.opacity = '1';
                                img.style.transform = 'scale(1)';
                                img.classList.add('lazy-loaded');
                                img.classList.remove('lazy-image');
                            };
                        }
                        
                        // Stop observing the image
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe all lazy images
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyLoad = () => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('lazy-loaded');
                            img.classList.remove('lazy-image');
                        }
                    }
                });
                
                // If all images have been loaded, remove the scroll event listener
                if (lazyImages.length === 0) {
                    window.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationchange', lazyLoad);
                }
            };
            
            // Add event listeners
            window.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            
            // Initial load
            lazyLoad();
        }
    };
    
    // Initialize lazy loading
    initLazyLoading();
});