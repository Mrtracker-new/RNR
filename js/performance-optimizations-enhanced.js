// Enhanced Performance Optimizations for Mobile Devices
document.addEventListener('DOMContentLoaded', function() {
    // Improved throttle function with better performance characteristics
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Enhanced debounce function
    function debounce(func, wait, immediate = false) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // More comprehensive device detection for better performance optimization
    function detectDeviceCapabilities() {
        // Basic device detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // CPU cores detection
        const cpuCores = navigator.hardwareConcurrency || 2;
        const isLowCPU = cpuCores <= 4;
        
        // Memory detection (where available)
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Check for battery status if available
        let isBatteryLow = false;
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                isBatteryLow = battery.level <= 0.2 && !battery.charging;
            });
        }
        
        // Check for connection type if available
        const isSlowConnection = navigator.connection && 
            (navigator.connection.saveData || 
             navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g' ||
             navigator.connection.effectiveType === '3g');
        
        // Check for device pixel ratio (higher values can indicate higher-end devices)
        const isLowResolution = window.devicePixelRatio <= 1;
        
        // Combine factors to determine overall device capability
        const isLowPerformance = isLowCPU || isLowMemory || prefersReducedMotion || isBatteryLow || isSlowConnection;
        
        return {
            isMobile,
            isLowPerformance,
            prefersReducedMotion,
            isSlowConnection,
            isLowResolution,
            // Create performance tiers for more granular optimizations
            performanceTier: isLowPerformance ? 
                (prefersReducedMotion ? 'minimal' : 'low') : 
                (isMobile ? 'medium' : 'high')
        };
    }

    // Get device capabilities
    const deviceCapabilities = detectDeviceCapabilities();
    
    // Add device capability classes to the body for CSS targeting
    document.body.classList.add(
        deviceCapabilities.isMobile ? 'mobile-device' : 'desktop-device',
        `performance-${deviceCapabilities.performanceTier}`
    );

    // Optimize images based on device capabilities
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Ensure all images have loading="lazy" attribute
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Add decoding="async" for better performance
            img.decoding = 'async';
            
            // For low-performance devices, use lower quality images if available
            if (deviceCapabilities.isLowPerformance && img.dataset.lowSrc) {
                img.src = img.dataset.lowSrc;
            }
            
            // Prevent layout shifts by setting dimensions if not already set
            if (img.width && img.height && !img.hasAttribute('width') && !img.hasAttribute('height')) {
                img.setAttribute('width', img.width);
                img.setAttribute('height', img.height);
            }
        });
    }

    // Optimize animations based on device capabilities
    function optimizeAnimations() {
        // Get all elements with animations
        const animatedElements = document.querySelectorAll('[data-aos], .stagger-animation, .project-card, .testimonial-card');
        
        if (deviceCapabilities.performanceTier === 'minimal') {
            // Disable all animations for minimal performance tier
            animatedElements.forEach(el => {
                el.removeAttribute('data-aos');
                el.removeAttribute('data-aos-delay');
                el.removeAttribute('data-aos-duration');
                el.classList.add('no-animation');
            });
            
            // Disable AOS completely
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    disable: true
                });
            }
        } else if (deviceCapabilities.performanceTier === 'low') {
            // Simplify animations for low performance tier
            animatedElements.forEach(el => {
                // Reduce animation duration
                if (el.hasAttribute('data-aos-duration')) {
                    el.setAttribute('data-aos-duration', '400');
                }
                // Remove delays to speed up page rendering
                el.removeAttribute('data-aos-delay');
                // Add simplified animations class
                el.classList.add('simplified-animations');
            });
            
            // Configure AOS for low performance
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 400,
                    easing: 'ease',
                    once: true
                });
            }
        } else if (deviceCapabilities.performanceTier === 'medium') {
            // Moderate animations for medium performance tier
            animatedElements.forEach(el => {
                // Reduce animation duration
                if (el.hasAttribute('data-aos-duration')) {
                    const currentDuration = parseInt(el.getAttribute('data-aos-duration'));
                    el.setAttribute('data-aos-duration', Math.min(currentDuration, 600).toString());
                }
                // Reduce delays
                if (el.hasAttribute('data-aos-delay')) {
                    const currentDelay = parseInt(el.getAttribute('data-aos-delay'));
                    el.setAttribute('data-aos-delay', Math.min(currentDelay, 200).toString());
                }
            });
            
            // Configure AOS for medium performance
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 600,
                    easing: 'ease-out',
                    once: true
                });
            }
        }
    }

    // Optimize scroll events
    function optimizeScrollEvents() {
        const navbar = document.querySelector('.navbar');
        const backToTop = document.querySelector('.back-to-top');
        const heroSection = document.querySelector('.hero');
        
        // Use more efficient scroll handler with appropriate throttling
        const handleScroll = throttle(function() {
            const scrollY = window.scrollY;
            
            // Navbar background change on scroll
            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            // Back to top button visibility
            if (backToTop) {
                if (scrollY > 500) {
                    backToTop.classList.add('active');
                } else {
                    backToTop.classList.remove('active');
                }
            }
            
            // Disable parallax effects on low and minimal performance tiers
            if (heroSection && deviceCapabilities.performanceTier === 'high') {
                const heroImage = heroSection.querySelector('.hero-image');
                const heroContent = heroSection.querySelector('.hero-content');
                
                if (heroImage && scrollY < window.innerHeight) {
                    heroImage.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
                }
                
                if (heroContent && scrollY < window.innerHeight) {
                    heroContent.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
                }
            }
        }, deviceCapabilities.performanceTier === 'high' ? 16 : 50); // Adjust throttle based on performance tier
        
        // Use passive event listener for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Optimize project filtering for better performance
    function optimizeProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterBtns.length === 0 || projectCards.length === 0) return;
        
        // Use more efficient filtering with debounce
        filterBtns.forEach(btn => {
            btn.addEventListener('click', debounce(function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Batch DOM operations for better performance
                requestAnimationFrame(() => {
                    // Prepare changes in memory before applying to DOM
                    const changes = [];
                    
                    projectCards.forEach(card => {
                        const shouldShow = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                        changes.push({ card, shouldShow });
                    });
                    
                    // Apply all visibility changes at once
                    changes.forEach(({ card, shouldShow }) => {
                        if (shouldShow) {
                            card.style.display = 'block';
                            // Use a separate frame for the opacity change
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                // Use simpler transform for better performance
                                card.style.transform = deviceCapabilities.performanceTier === 'high' ? 
                                    'translateY(0) scale(1)' : 'translateY(0)';
                            });
                        } else {
                            card.style.opacity = '0';
                            // Use simpler transform for better performance
                            card.style.transform = deviceCapabilities.performanceTier === 'high' ? 
                                'translateY(20px) scale(0.8)' : 'translateY(20px)';
                            setTimeout(() => {
                                if (card.style.opacity === '0') { // Check if still hidden
                                    card.style.display = 'none';
                                }
                            }, 300);
                        }
                    });
                });
            }, deviceCapabilities.performanceTier === 'high' ? 50 : 100));
        });
    }

    // Optimize testimonial slider for better performance
    function optimizeTestimonialSlider() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (testimonialCards.length === 0) return;
        
        // Simplify transitions based on device capabilities
        testimonialCards.forEach(card => {
            // Use simpler transitions for better performance
            if (deviceCapabilities.performanceTier === 'minimal' || deviceCapabilities.performanceTier === 'low') {
                card.style.transition = 'opacity 0.3s ease';
                // Remove transform transitions for better performance
                card.style.transform = 'none';
            } else if (deviceCapabilities.performanceTier === 'medium') {
                card.style.transition = 'all 0.3s ease';
            }
        });
    }

    // Add simplified animation styles dynamically based on device capabilities
    function addOptimizedStyles() {
        const style = document.createElement('style');
        
        // Create styles based on performance tier
        let styleContent = '';
        
        if (deviceCapabilities.performanceTier === 'minimal') {
            // Minimal animations for lowest performance devices
            styleContent = `
                .no-animation {
                    transition: none !important;
                    transform: none !important;
                    animation: none !important;
                }
                
                /* Disable all animations */
                @keyframes neonFlicker, @keyframes textGlitch, @keyframes cardHoverEffect, 
                @keyframes testimonialHoverEffect, @keyframes enhancedBorderGlow, 
                @keyframes scanline, @keyframes imageGlitch, @keyframes pulse {
                    0%, 100% { opacity: 1; transform: none; filter: none; box-shadow: none; }
                }
                
                /* Remove shadows and effects */
                .project-card, .testimonial-card, .btn, .card {
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
                    transform: none !important;
                }
                
                /* Remove text shadows */
                h1, h2, h3, h4, .highlight {
                    text-shadow: none !important;
                }
                
                /* Simplify hover effects */
                .project-card:hover, .testimonial-card:hover, .btn:hover {
                    transform: none !important;
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
                }
                
                /* Disable pseudo-elements with animations */
                .project-card::before, .project-card::after,
                .testimonial-card::before, .testimonial-card::after {
                    display: none !important;
                }
            `;
        } else if (deviceCapabilities.performanceTier === 'low') {
            // Low animations for low performance devices
            styleContent = `
                .simplified-animations {
                    transition: all 0.3s ease !important;
                    transform: none !important;
                    animation: none !important;
                }
                
                .simplified-animations:hover {
                    transform: translateY(-5px) !important;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1) !important;
                }
                
                /* Simplify animations */
                @keyframes neonFlicker, @keyframes textGlitch, @keyframes cardHoverEffect, 
                @keyframes testimonialHoverEffect, @keyframes enhancedBorderGlow, 
                @keyframes scanline, @keyframes imageGlitch {
                    0%, 100% { opacity: 1; transform: none; filter: none; box-shadow: none; }
                }
                
                /* Simplify shadows */
                .project-card, .testimonial-card, .btn, .card {
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
                }
                
                /* Simplify hover effects */
                .project-card:hover, .testimonial-card:hover {
                    transform: translateY(-5px) !important;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
                }
                
                /* Simplify pseudo-elements */
                .project-card::before, .project-card::after,
                .testimonial-card::before, .testimonial-card::after {
                    opacity: 0.3 !important;
                    animation: none !important;
                }
            `;
        } else if (deviceCapabilities.performanceTier === 'medium') {
            // Medium animations for medium performance devices
            styleContent = `
                /* Moderate animations */
                .project-card, .testimonial-card {
                    transition: all 0.4s ease !important;
                    will-change: transform, opacity !important;
                }
                
                .project-card:hover, .testimonial-card:hover {
                    transform: translateY(-10px) !important;
                    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15) !important;
                }
                
                /* Simplify complex animations */
                @keyframes neonFlicker {
                    0%, 100% { text-shadow: 0 0 5px rgba(0, 240, 255, 0.3); }
                }
                
                @keyframes textGlitch {
                    0%, 90%, 100% { text-shadow: 0 0 5px rgba(0, 240, 255, 0.3); transform: none; }
                    95% { text-shadow: -1px 0 rgba(255, 0, 160, 0.5), 1px 0 rgba(0, 240, 255, 0.5); transform: translateX(2px); }
                }
                
                /* Optimize pseudo-elements */
                .project-card::before, .project-card::after,
                .testimonial-card::before, .testimonial-card::after {
                    animation-duration: 6s !important;
                }
            `;
        }
        
        style.textContent = styleContent;
        document.head.appendChild(style);
    }

    // Run all optimizations
    function runAllOptimizations() {
        optimizeImages();
        optimizeAnimations();
        optimizeScrollEvents();
        optimizeProjectFiltering();
        optimizeTestimonialSlider();
        addOptimizedStyles();
        
        // Log optimization level for debugging
        console.log('Performance optimizations applied:', {
            performanceTier: deviceCapabilities.performanceTier,
            isMobile: deviceCapabilities.isMobile,
            isLowPerformance: deviceCapabilities.isLowPerformance
        });
    }

    // Run optimizations when DOM is loaded
    runAllOptimizations();
    
    // Re-run device-specific optimizations on resize with appropriate debounce
    window.addEventListener('resize', debounce(() => {
        // Update device capabilities on resize
        Object.assign(deviceCapabilities, detectDeviceCapabilities());
        // Re-run optimizations
        runAllOptimizations();
    }, 250), { passive: true });
});