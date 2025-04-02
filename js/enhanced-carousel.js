// Optimized Testimonial Carousel
document.addEventListener('DOMContentLoaded', function() {
    // Throttle function to limit execution frequency
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Detect if device is likely low-performance
    const isLowPerformanceDevice = () => {
        // Check for hardware concurrency (CPU cores)
        const lowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        // Check for mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return lowConcurrency || isMobile || prefersReducedMotion;
    };
    
    // Initialize testimonial carousel with performance optimizations
    const initEnhancedCarousel = () => {
        const testimonialContainer = document.querySelector('.testimonial-container');
        if (!testimonialContainer) return;
        
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const dotsContainer = document.querySelector('.testimonial-dots');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (testimonialCards.length === 0) return;
        
        let currentSlide = 0;
        let autoSlideInterval;
        let isAnimating = false;
        let touchStartX = 0;
        let touchEndX = 0;
        const lowPerformance = isLowPerformanceDevice();
        
        // Simplified transition for low-performance devices
        const transitionDuration = lowPerformance ? 300 : 500; // ms
        const transitionStyle = lowPerformance ? 'ease' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Create a more efficient dots navigation if it doesn't exist
        if (dotsContainer) {
            // Use document fragment for better performance
            const fragment = document.createDocumentFragment();
            
            // Create new dots
            testimonialCards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot' + (index === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Testimonial ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                fragment.appendChild(dot);
            });
            
            // Clear existing dots and append all at once
            dotsContainer.innerHTML = '';
            dotsContainer.appendChild(fragment);
        }
        
        // Optimized show slide function with better performance
        function showSlide(index, direction = null) {
            if (isAnimating) return;
            isAnimating = true;
            
            // Update dots efficiently
            const dots = document.querySelectorAll('.dot');
            const activeIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
            if (activeIndex >= 0) dots[activeIndex].classList.remove('active');
            dots[index].classList.add('active');
            
            // Get current visible slide
            const currentVisibleSlide = document.querySelector('.testimonial-card.active');
            
            // Prepare the new slide
            const newSlide = testimonialCards[index];
            
            // Use simpler animations for low-performance devices
            if (lowPerformance) {
                // Simple fade transition
                if (currentVisibleSlide) currentVisibleSlide.style.opacity = '0';
                newSlide.style.display = 'block';
                newSlide.style.opacity = '0';
                
                // Use requestAnimationFrame for smoother transitions
                requestAnimationFrame(() => {
                    newSlide.style.opacity = '1';
                    newSlide.classList.add('active');
                    
                    if (currentVisibleSlide) {
                        // Hide the old slide after transition
                        setTimeout(() => {
                            currentVisibleSlide.style.display = 'none';
                            currentVisibleSlide.classList.remove('active');
                            isAnimating = false;
                        }, transitionDuration);
                    } else {
                        isAnimating = false;
                    }
                });
            } else {
                // Full animation for high-performance devices
                // Set initial positions based on direction
                if (currentVisibleSlide) {
                    if (direction === 'next' || direction === null) {
                        newSlide.style.transform = 'translateX(100%) scale(0.95)';
                        newSlide.style.opacity = '0';
                    } else if (direction === 'prev') {
                        newSlide.style.transform = 'translateX(-100%) scale(0.95)';
                        newSlide.style.opacity = '0';
                    }
                }
                
                // Display the new slide
                newSlide.style.display = 'block';
                
                // Use requestAnimationFrame for smoother transitions
                requestAnimationFrame(() => {
                    newSlide.style.opacity = '1';
                    newSlide.style.transform = 'translateX(0) scale(1)';
                    newSlide.classList.add('active');
                    
                    // Animate the current slide out if it exists
                    if (currentVisibleSlide) {
                        if (direction === 'next' || direction === null) {
                            currentVisibleSlide.style.transform = 'translateX(-100%) scale(0.95)';
                        } else if (direction === 'prev') {
                            currentVisibleSlide.style.transform = 'translateX(100%) scale(0.95)';
                        }
                        currentVisibleSlide.style.opacity = '0';
                        
                        // Hide the old slide after animation completes
                        setTimeout(() => {
                            currentVisibleSlide.style.display = 'none';
                            currentVisibleSlide.classList.remove('active');
                            isAnimating = false;
                        }, transitionDuration);
                    } else {
                        isAnimating = false;
                    }
                });
            }
        }
        
        // Go to specific slide - optimized
        function goToSlide(index) {
            if (currentSlide === index || isAnimating) return;
            
            stopAutoSlide();
            const direction = index > currentSlide ? 'next' : 'prev';
            currentSlide = index;
            showSlide(currentSlide, direction);
            startAutoSlide();
        }
        
        // Next slide function - throttled
        const nextSlide = throttle(function() {
            if (isAnimating) return;
            stopAutoSlide();
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            showSlide(currentSlide, 'next');
            startAutoSlide();
        }, 300);
        
        // Previous slide function - throttled
        const prevSlide = throttle(function() {
            if (isAnimating) return;
            stopAutoSlide();
            currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
            showSlide(currentSlide, 'prev');
            startAutoSlide();
        }, 300);
        
        // Auto slide functions - optimized
        function startAutoSlide() {
            // Use longer interval for low-performance devices
            const interval = lowPerformance ? 8000 : 6000;
            autoSlideInterval = setInterval(nextSlide, interval);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Optimized touch events for mobile swipe
        const handleTouchStart = throttle(e => {
            touchStartX = e.changedTouches[0].screenX;
        }, 100);
        
        const handleTouchEnd = throttle(e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, 100);
        
        testimonialContainer.addEventListener('touchstart', handleTouchStart, {passive: true});
        testimonialContainer.addEventListener('touchend', handleTouchEnd, {passive: true});
        
        function handleSwipe() {
            // Increase threshold for low-performance devices
            const threshold = lowPerformance ? 70 : 50;
            
            if (touchEndX < touchStartX - threshold) {
                // Swipe left - next slide
                nextSlide();
            }
            if (touchEndX > touchStartX + threshold) {
                // Swipe right - previous slide
                prevSlide();
            }
        }
        
        // Button event listeners with throttling
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Pause auto slide on hover - only on high-performance devices
        if (!lowPerformance) {
            testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
            testimonialContainer.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Initialize with optimized transitions
        testimonialCards.forEach(card => {
            card.style.transition = `all ${transitionDuration}ms ${transitionStyle}`;
            card.style.display = 'none';
            
            // Add will-change for better performance
            card.style.willChange = 'transform, opacity';
            
            // Use transform3d for hardware acceleration
            card.style.transform = 'translate3d(0, 0, 0)';
        });
        
        showSlide(currentSlide);
        startAutoSlide();
    };
    
    // Initialize the optimized carousel
    initEnhancedCarousel();
});