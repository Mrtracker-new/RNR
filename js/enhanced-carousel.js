// Testimonial Carousel
document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonial carousel
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
        
        // Create a more dynamic dots navigation if it doesn't exist
        if (dotsContainer) {
            // Clear existing dots
            dotsContainer.innerHTML = '';
            
            // Create new dots
            testimonialCards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot' + (index === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Testimonial ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        // Enhanced show slide function with better transitions
        function showSlide(index, direction = null) {
            if (isAnimating) return;
            isAnimating = true;
            
            // Update dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            // Get current visible slide
            const currentVisibleSlide = document.querySelector('.testimonial-card.active');
            
            // Prepare the new slide
            const newSlide = testimonialCards[index];
            
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
            
            // Force reflow
            void newSlide.offsetWidth;
            
            // Animate the new slide in
            setTimeout(() => {
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
                    }, 500);
                } else {
                    isAnimating = false;
                }
            }, 50);
        }
        
        // Go to specific slide
        function goToSlide(index) {
            if (currentSlide === index) return;
            
            stopAutoSlide();
            const direction = index > currentSlide ? 'next' : 'prev';
            currentSlide = index;
            showSlide(currentSlide, direction);
            startAutoSlide();
        }
        
        // Next slide function
        function nextSlide() {
            stopAutoSlide();
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            showSlide(currentSlide, 'next');
            startAutoSlide();
        }
        
        // Previous slide function
        function prevSlide() {
            stopAutoSlide();
            currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
            showSlide(currentSlide, 'prev');
            startAutoSlide();
        }
        
        // Auto slide functions
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 6000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Touch events for mobile swipe
        testimonialContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        testimonialContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left - next slide
                nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right - previous slide
                prevSlide();
            }
        }
        
        // Button event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Pause auto slide on hover
        testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
        testimonialContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Initialize
        testimonialCards.forEach(card => {
            card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.display = 'none';
        });
        
        showSlide(currentSlide);
        startAutoSlide();
    };
    
    // Initialize the enhanced carousel
    initEnhancedCarousel();
});