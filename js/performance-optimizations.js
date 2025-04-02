// Performance Optimizations
// This file contains optimizations to improve website performance across all devices

document.addEventListener('DOMContentLoaded', function() {
    // Throttle and debounce functions for performance optimization
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

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Optimize scroll events
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');
    
    // Throttled scroll handler for better performance
    const handleScroll = throttle(function() {
        // Navbar background change on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Optimize animations by reducing their complexity on mobile devices
    function optimizeForDevice() {
        const isMobile = window.innerWidth < 768;
        const isLowPerfDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        
        // Get all elements with animations
        const animatedElements = document.querySelectorAll('[data-aos]');
        const projectCards = document.querySelectorAll('.project-card');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (isMobile || isLowPerfDevice) {
            // Simplify animations for mobile/low-performance devices
            animatedElements.forEach(el => {
                // Reduce animation duration
                el.setAttribute('data-aos-duration', '600');
                // Remove delays to speed up page rendering
                el.removeAttribute('data-aos-delay');
            });
            
            // Simplify project card animations
            projectCards.forEach(card => {
                card.classList.add('simplified-animations');
            });
            
            // Simplify testimonial card animations
            testimonialCards.forEach(card => {
                card.classList.add('simplified-animations');
            });
            
            // Disable parallax effects on mobile/low-performance devices
            disableParallaxEffects();
        }
    }
    
    // Disable heavy parallax effects on mobile/low-performance devices
    function disableParallaxEffects() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroImage = heroSection.querySelector('.hero-image');
            const heroContent = heroSection.querySelector('.hero-content');
            
            if (heroImage) heroImage.style.transform = 'none';
            if (heroContent) heroContent.style.transform = 'none';
            
            // Remove the scroll event listener for parallax
            window.removeEventListener('scroll', handleParallax);
        }
    }
    
    // Optimize image loading
    function optimizeImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        // Use native lazy loading where supported
        images.forEach(img => {
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
        });
    }
    
    // Optimize AOS animations
    function optimizeAOS() {
        if (typeof AOS !== 'undefined') {
            // Configure AOS for better performance
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true, // Only animate elements once
                disable: window.innerWidth < 768 ? 'phone' : false // Disable on mobile for better performance
            });
        }
    }
    
    // Optimize project filtering
    function optimizeProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', debounce(function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Use requestAnimationFrame for smoother UI updates
                requestAnimationFrame(() => {
                    projectCards.forEach(card => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                            // Use a separate frame for the opacity change
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            });
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px) scale(0.8)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300); // Reduced from 400ms for faster response
                        }
                    });
                });
            }, 50)); // Small debounce for better performance
        });
    }
    
    // Optimize testimonial slider
    function optimizeTestimonialSlider() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        // Reduce animation complexity
        testimonialCards.forEach(card => {
            card.style.transition = 'all 0.3s ease'; // Simplified transition
        });
    }
    
    // Run all optimizations
    function runOptimizations() {
        optimizeForDevice();
        optimizeImageLoading();
        optimizeAOS();
        optimizeProjectFiltering();
        optimizeTestimonialSlider();
        
        // Add simplified animation classes to CSS
        addSimplifiedAnimationStyles();
    }
    
    // Add simplified animation styles dynamically
    function addSimplifiedAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .simplified-animations {
                transition: all 0.3s ease !important;
                transform: none !important;
                animation: none !important;
            }
            
            .simplified-animations:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
                animation: none !important;
            }
            
            @media (max-width: 768px) {
                .stagger-animation {
                    transition: opacity 0.3s ease, transform 0.3s ease !important;
                }
                
                .project-card, .testimonial-card {
                    transition: all 0.3s ease !important;
                }
                
                .project-card:hover, .testimonial-card:hover {
                    transform: translateY(-5px) !important;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
                    animation: none !important;
                }
                
                .skill-level {
                    transition: width 0.5s ease-out !important;
                }
                
                /* Disable complex animations on mobile */
                @keyframes neonFlicker, @keyframes textGlitch, @keyframes cardHoverEffect, 
                @keyframes testimonialHoverEffect, @keyframes enhancedBorderGlow, 
                @keyframes scanline, @keyframes imageGlitch {
                    0%, 100% {
                        opacity: 1;
                        transform: none;
                        filter: none;
                        box-shadow: none;
                    }
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Run optimizations when DOM is loaded
    runOptimizations();
    
    // Re-run device-specific optimizations on resize
    window.addEventListener('resize', debounce(optimizeForDevice, 250), { passive: true });
});