// Optimized Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    const initLazyLoading = () => {
        // Check if browser supports native lazy loading
        const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;
        
        // Get all images that should be lazy loaded
        let lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) {
            // If no images with data-src attribute found, add them programmatically
            const images = document.querySelectorAll('img:not([data-src])');
            images.forEach(img => {
                if (!img.classList.contains('lazy-loaded') && !img.dataset.src) {
                    // Store original src in data-src
                    img.dataset.src = img.src;
                    
                    // Set width and height attributes if they don't exist to prevent layout shifts
                    if (img.width && img.height && !img.hasAttribute('width') && !img.hasAttribute('height')) {
                        img.setAttribute('width', img.width);
                        img.setAttribute('height', img.height);
                    }
                    
                    // Use a tiny transparent gif as placeholder
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    img.classList.add('lazy-image');
                    
                    // Add native lazy loading if supported
                    if (supportsNativeLazy) {
                        img.loading = 'lazy';
                    }
                }
            });
            
            // Update lazyImages collection
            lazyImages = document.querySelectorAll('.lazy-image');
        } else {
            // Add native lazy loading to existing lazy images if supported
            if (supportsNativeLazy) {
                lazyImages.forEach(img => {
                    img.loading = 'lazy';
                });
            }
        }
        
        // If browser supports native lazy loading and not a low-end device, use it exclusively
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        if (supportsNativeLazy && !isLowEndDevice) {
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('lazy-loaded');
                    img.classList.remove('lazy-image');
                }
            });
            return; // Exit early as we're using native lazy loading
        }
        
        // Create intersection observer with optimized options
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the actual image
                        if (img.dataset.src) {
                            // Create a new image object to preload
                            const tempImage = new Image();
                            tempImage.src = img.dataset.src;
                            
                            // When the image is loaded, update the visible image
                            tempImage.onload = () => {
                                img.src = img.dataset.src;
                                
                                // Use requestAnimationFrame for smoother transitions
                                requestAnimationFrame(() => {
                                    // Simplified animation for better performance
                                    img.style.transition = 'opacity 0.3s ease';
                                    img.style.opacity = '1';
                                    img.classList.add('lazy-loaded');
                                    img.classList.remove('lazy-image');
                                });
                            };
                            
                            // Handle loading errors
                            tempImage.onerror = () => {
                                img.src = img.dataset.src; // Try direct loading as fallback
                                img.classList.add('lazy-loaded');
                                img.classList.remove('lazy-image');
                            };
                        }
                        
                        // Stop observing the image
                        observer.unobserve(img);
                    }
                });
            }, {
                // Increased rootMargin for earlier loading
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            // Observe all lazy images
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Optimized fallback for browsers that don't support IntersectionObserver
            const lazyLoad = () => {
                // Use throttling to improve performance
                if (lazyLoad.throttleTimeout) {
                    return;
                }
                
                lazyLoad.throttleTimeout = setTimeout(() => {
                    const scrollTop = window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    
                    // Process images in batches for better performance
                    const processImageBatch = (startIndex, batchSize) => {
                        const endIndex = Math.min(startIndex + batchSize, lazyImages.length);
                        let loadedCount = 0;
                        
                        for (let i = startIndex; i < endIndex; i++) {
                            const img = lazyImages[i];
                            if (img.offsetTop < viewportHeight + scrollTop + 200) { // Added 200px buffer
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    img.classList.add('lazy-loaded');
                                    img.classList.remove('lazy-image');
                                    loadedCount++;
                                }
                            }
                        }
                        
                        // Remove processed images from the array
                        if (loadedCount > 0) {
                            lazyImages = document.querySelectorAll('img.lazy-image');
                        }
                        
                        // Process next batch if needed
                        if (endIndex < lazyImages.length) {
                            setTimeout(() => {
                                processImageBatch(endIndex, batchSize);
                            }, 0);
                        }
                    };
                    
                    // Start processing in batches of 5 images
                    processImageBatch(0, 5);
                    
                    // If all images have been loaded, remove the event listeners
                    if (lazyImages.length === 0) {
                        window.removeEventListener('scroll', lazyLoad);
                        window.removeEventListener('resize', lazyLoad);
                        window.removeEventListener('orientationchange', lazyLoad);
                    }
                    
                    lazyLoad.throttleTimeout = null;
                }, 200);
            };
            
            // Add event listeners with passive flag for better performance
            window.addEventListener('scroll', lazyLoad, { passive: true });
            window.addEventListener('resize', lazyLoad, { passive: true });
            window.addEventListener('orientationchange', lazyLoad, { passive: true });
            
            // Initial load
            lazyLoad();
        }
    };
    
    // Initialize lazy loading
    initLazyLoading();
});