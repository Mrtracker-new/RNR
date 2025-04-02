// Optimized Smooth Section Transitions
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
    
    // Initialize smooth section transitions with performance optimizations
    const initSmoothTransitions = () => {
        // Get all sections
        const sections = document.querySelectorAll('section');
        const lowPerformance = isLowPerformanceDevice();
        
        // Create intersection observer for sections with optimized options
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add special animation when section enters viewport
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    
                    // Add staggered animations to children elements with performance considerations
                    const animElements = entry.target.querySelectorAll('.stagger-animation');
                    
                    if (lowPerformance) {
                        // For low-performance devices, add all elements at once
                        animElements.forEach(el => {
                            el.classList.add('element-visible');
                        });
                    } else {
                        // For high-performance devices, use staggered animations but with fewer delays
                        animElements.forEach((el, index) => {
                            // Process in batches of 5 for better performance
                            const batchIndex = Math.floor(index / 5);
                            setTimeout(() => {
                                el.classList.add('element-visible');
                            }, 50 * batchIndex); // Reduced delay from 100ms to 50ms per batch
                        });
                    }
                }
            });
        }, {
            threshold: 0.1, // Reduced threshold for earlier triggering
            rootMargin: '0px 0px' // Simplified rootMargin
        });
        
        // Observe all sections
        sections.forEach(section => {
            sectionObserver.observe(section);
            
            // Add stagger animation class to key elements
            const keyElements = section.querySelectorAll('.skill-item, .project-card, .testimonial-card, .tech-icon');
            keyElements.forEach(el => {
                el.classList.add('stagger-animation');
            });
        });
        
        // Add parallax effect to hero section only on high-performance devices
        if (!lowPerformance) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                // Use throttled scroll handler for better performance
                const handleParallax = throttle(() => {
                    const scrollPosition = window.scrollY;
                    if (scrollPosition < window.innerHeight) {
                        const heroImage = heroSection.querySelector('.hero-image');
                        const heroContent = heroSection.querySelector('.hero-content');
                        
                        if (heroImage) {
                            // Use transform3d for hardware acceleration
                            heroImage.style.transform = `translate3d(0, ${scrollPosition * 0.1}px, 0)`;
                        }
                        
                        if (heroContent) {
                            heroContent.style.transform = `translate3d(0, ${scrollPosition * 0.05}px, 0)`;
                        }
                    }
                }, 16); // ~60fps
                
                window.addEventListener('scroll', handleParallax, { passive: true });
            }
        }
        
        // Add scroll-triggered animations to project cards with performance considerations
        const projectCards = document.querySelectorAll('.project-card');
        if (lowPerformance) {
            // Remove transition delays on low-performance devices
            projectCards.forEach(card => {
                card.style.transitionDelay = '0s';
            });
        } else {
            // Use fewer transition delays on high-performance devices
            projectCards.forEach((card, index) => {
                // Group cards into batches for fewer unique delays
                const batchIndex = Math.floor(index / 3);
                card.style.transitionDelay = `${batchIndex * 0.1}s`;
            });
        }
        
        // Add hover effects to buttons - simplified for all devices
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.classList.add('btn-hover');
            });
            
            btn.addEventListener('mouseleave', function() {
                this.classList.remove('btn-hover');
            });
        });
        
        // Add magnetic effect to social icons only on high-performance devices
        if (!lowPerformance) {
            const socialIcons = document.querySelectorAll('.social-icons a');
            socialIcons.forEach(icon => {
                // Use throttled mousemove handler
                const handleMouseMove = throttle(function(e) {
                    const position = this.getBoundingClientRect();
                    const x = e.clientX - position.left - position.width / 2;
                    const y = e.clientY - position.top - position.height / 2;
                    
                    // Use requestAnimationFrame for smoother animations
                    requestAnimationFrame(() => {
                        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                    });
                }, 16);
                
                icon.addEventListener('mousemove', handleMouseMove);
                
                icon.addEventListener('mouseleave', function() {
                    this.style.transform = 'translate(0, 0)';
                });
            });
        }
    };
    
    // Initialize smooth transitions
    initSmoothTransitions();
});