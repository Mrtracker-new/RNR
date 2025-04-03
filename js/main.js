// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization helper functions
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
    
    const lowPerformance = isLowPerformanceDevice();
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const body = document.body;
    
    // Toggle mobile menu - optimized
    menuBtn.addEventListener('click', function() {
        // Use requestAnimationFrame for smoother UI updates
        requestAnimationFrame(() => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    });
    
    // Close menu when clicking outside - debounced
    document.addEventListener('click', debounce(function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    }, 50));
    
    // Initialize AOS with performance considerations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: lowPerformance ? 600 : 800,
            easing: 'ease-out',
            once: true,
            disable: lowPerformance ? 'mobile' : false // Disable on low-performance devices
        });
    }
    
    // Close mobile menu when clicking on a nav link - optimized
    const navLinksArray = document.querySelectorAll('.nav-links a');
    if (navLinksArray.length > 0) {
        const closeMenu = () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        };
        
        navLinksArray.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // Testimonial slider functionality is handled in new-testimonials.js
    
    // Optimized scroll handler with throttling
    const handleScroll = throttle(function() {
        const scrollY = window.scrollY;
        
        // Batch DOM operations together
        const navbarUpdate = scrollY > 50;
        const backToTopUpdate = scrollY > 500;
        
        // Use requestAnimationFrame for smoother UI updates
        requestAnimationFrame(() => {
            // Navbar background change on scroll
            if (navbarUpdate) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Back to top button visibility
            if (backToTopUpdate) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        // Animate skill bars when in viewport
        animateSkillBars();
    }, lowPerformance ? 150 : 100); // Increase throttle time for low-performance devices
    
    // Add optimized scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Enhanced Project filtering with animations - optimized for performance
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');
    
    // Optimize project filtering based on device performance
    const optimizeProjectFiltering = () => {
        // Simplified animations for low-performance devices
        if (lowPerformance) {
            projectCards.forEach(card => {
                card.style.transition = 'all 0.3s ease';
            });
        }
        
        // Use event delegation for better performance
        const filterContainer = document.querySelector('.projects-filter');
        if (!filterContainer) return;
        
        filterContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            
            // Debounce the filter operation
            debounce(() => {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                // Use requestAnimationFrame for smoother UI updates
                requestAnimationFrame(() => {
                    // Add transition class to grid for smoother layout changes
                    projectsGrid.classList.add('filtering');
                    
                    // Batch DOM operations and reduce timeouts
                    const matchingCards = [];
                    const nonMatchingCards = [];
                    
                    // Separate cards into matching and non-matching groups
                    projectCards.forEach(card => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            matchingCards.push(card);
                        } else {
                            nonMatchingCards.push(card);
                        }
                    });
                    
                    // Process non-matching cards first (hide them)
                    nonMatchingCards.forEach(card => {
                        card.classList.remove('card-visible');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.8)';
                    });
                    
                    // Use a single timeout for hiding non-matching cards
                    setTimeout(() => {
                        nonMatchingCards.forEach(card => {
                            card.style.display = 'none';
                        });
                    }, lowPerformance ? 200 : 300);
                    
                    // Process matching cards (show them)
                    if (lowPerformance) {
                        // For low-performance devices, show all cards at once
                        matchingCards.forEach(card => {
                            card.style.display = 'block';
                            // Force reflow
                            void card.offsetWidth;
                            card.classList.add('card-visible');
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        });
                    } else {
                        // For high-performance devices, use staggered animations but with fewer batches
                        matchingCards.forEach((card, index) => {
                            // Group cards into batches of 3 for fewer timeouts
                            const batchIndex = Math.floor(index / 3);
                            const delay = batchIndex * 50; // Reduced delay
                            
                            card.style.display = 'block';
                            
                            setTimeout(() => {
                                card.classList.add('card-visible');
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, delay);
                        });
                    }
                    
                    // Remove the transition class after animations complete
                    setTimeout(() => {
                        projectsGrid.classList.remove('filtering');
                    }, lowPerformance ? 300 : 500);
                });
            }, 50)();
        });
    };
    
    // Initialize all cards as visible on page load - optimized
    const initializeCards = () => {
        if (lowPerformance) {
            // For low-performance devices, show all cards at once
            requestAnimationFrame(() => {
                projectCards.forEach(card => {
                    card.classList.add('card-visible');
                });
            });
        } else {
            // For high-performance devices, use batched animations
            setTimeout(() => {
                // Process cards in batches for better performance
                const batchSize = 3;
                for (let i = 0; i < Math.ceil(projectCards.length / batchSize); i++) {
                    const startIndex = i * batchSize;
                    const endIndex = Math.min(startIndex + batchSize, projectCards.length);
                    
                    setTimeout(() => {
                        for (let j = startIndex; j < endIndex; j++) {
                            projectCards[j].classList.add('card-visible');
                        }
                    }, i * 100);
                }
            }, 300);
        }
    };
    
    // Run optimized functions
    optimizeProjectFiltering();
    initializeCards();
    
    // Testimonial slider functionality is handled in new-testimonials.js
    
    // Optimized function to animate skill bars using IntersectionObserver
    function setupSkillBarsAnimation() {
        const skillSection = document.querySelector('.skills');
        if (!skillSection) return;
        
        // Function to animate the skill bars
        const animateSkillBars = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevels = document.querySelectorAll('.skill-level');
                    const percentages = document.querySelectorAll('.skill-info p:last-child');
                    
                    // Check if animations have already been applied
                    if (skillSection.dataset.animated === 'true') return;
                    
                    // Detect if it's a mobile device or low performance
                    const isMobile = window.innerWidth < 768;
                    const useSimpleAnimation = isMobile || lowPerformance;
                    
                    // Reset all skill levels to 0 width first
                    skillLevels.forEach(level => {
                        level.style.width = '0%';
                    });
                    
                    // Use requestAnimationFrame for smoother animations
                    requestAnimationFrame(() => {
                        // For mobile/low-performance devices, animate with minimal delay
                        if (useSimpleAnimation) {
                            skillLevels.forEach((level, i) => {
                                // Get percentage directly from the DOM
                                const percentText = level.closest('.skill-item').querySelector('.skill-info p:last-child').textContent;
                                const percent = percentText.replace('%', '');
                                
                                // Small delay even on mobile for a slight staggered effect but not too much
                                setTimeout(() => {
                                    level.style.width = percent + '%';
                                    
                                    // Brief highlight effect
                                    const percentElement = level.closest('.skill-item').querySelector('.skill-info p:last-child');
                                    percentElement.classList.add('highlight-percent');
                                    
                                    setTimeout(() => {
                                        percentElement.classList.remove('highlight-percent');
                                    }, 1000);
                                }, useSimpleAnimation ? 30 * i : 80 * i);
                            });
                        } else {
                            // More elaborate animation for high-performance devices
                            skillLevels.forEach((level, i) => {
                                const percentText = level.closest('.skill-item').querySelector('.skill-info p:last-child').textContent;
                                const percent = percentText.replace('%', '');
                                
                                // Staggered animation with longer delays
                                setTimeout(() => {
                                    // Apply hardware-accelerated animation
                                    level.style.width = percent + '%';
                                    
                                    // Add highlight effect to percentage
                                    const percentElement = level.closest('.skill-item').querySelector('.skill-info p:last-child');
                                    percentElement.classList.add('highlight-percent');
                                    
                                    setTimeout(() => {
                                        percentElement.classList.remove('highlight-percent');
                                    }, 1500);
                                }, 100 * i);
                            });
                        }
                        
                        // Mark as animated to avoid unnecessary reprocessing
                        skillSection.dataset.animated = 'true';
                        
                        // Disconnect the observer once animation is done
                        observer.disconnect();
                    });
                }
            });
        };
        
        // Create the IntersectionObserver
        if ('IntersectionObserver' in window) {
            const skillObserver = new IntersectionObserver(animateSkillBars, {
                root: null,
                rootMargin: '0px',
                threshold: 0.25 // Trigger when 25% of the element is visible
            });
            
            // Start observing the skills section
            skillObserver.observe(skillSection);
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const checkIfInView = () => {
                const sectionTop = skillSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight * 0.75 && !skillSection.dataset.animated) {
                    animateSkillBars([{ isIntersecting: true }], { disconnect: () => {} });
                    window.removeEventListener('scroll', checkIfInView);
                }
            };
            
            window.addEventListener('scroll', throttle(checkIfInView, 100));
            checkIfInView(); // Check on initial load
        }
    }
    
    // Function to manually trigger skill bar animation (for compatibility)
    function animateSkillBars() {
        const skillSection = document.querySelector('.skills');
        if (!skillSection || skillSection.dataset.animated === 'true') return;
        
        const sectionTop = skillSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            // Manually trigger the animation logic
            const skillLevels = document.querySelectorAll('.skill-level');
            
            // Reset all skill levels to 0 width first
            skillLevels.forEach(level => {
                level.style.width = '0%';
            });
            
            // Animate each skill level
            skillLevels.forEach((level, i) => {
                const percentText = level.closest('.skill-item').querySelector('.skill-info p:last-child').textContent;
                const percent = percentText.replace('%', '');
                
                setTimeout(() => {
                    level.style.width = percent + '%';
                }, 50 * i);
            });
            
            // Mark as animated
            skillSection.dataset.animated = 'true';
        }
    }
    
    // Optimize back-to-top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        // Use optimized click handler
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Use smooth scrolling with performance considerations
            if (lowPerformance) {
                // Simple, immediate scroll for low-performance devices
                window.scrollTo(0, 0);
            } else {
                // Smooth scroll for high-performance devices
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Add a class to body based on device performance for CSS optimizations
    document.body.classList.add(lowPerformance ? 'low-performance-device' : 'high-performance-device');
    
    // Initial scroll handler call to set initial states
    handleScroll();
    
    // Initialize the skill bars animation with IntersectionObserver
    setupSkillBarsAnimation();
    
    // Only add fallback listeners if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
        // Throttled function for better performance
        const optimizedSkillAnimation = throttle(function() {
            animateSkillBars();
        }, 100);
        
        window.addEventListener('scroll', optimizedSkillAnimation);
        
        // Add touch event listeners for mobile devices
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            document.addEventListener('touchmove', optimizedSkillAnimation, { passive: true });
        }
        
        // Trigger on initial load in case section is already visible
        animateSkillBars();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    // Email sending functionality
    function sendEmail() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim() || 'Contact from Website';
        const message = document.getElementById('message').value.trim();
    
        // Check if all required fields are filled
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
    
        const encodedName = encodeURIComponent(name);
        const encodedEmail = encodeURIComponent(email);
        const encodedSubject = encodeURIComponent(subject);
        const encodedMessage = encodeURIComponent(message);
    
        const body = `Name: ${encodedName}%0D%0AEmail: ${encodedEmail}%0D%0A%0D%0AMessage: ${encodedMessage}`;
        window.location.href = `mailto:rolanlobo901@gmail.com?subject=${encodedSubject}&body=${body}`;
    }
    
    // Make sure sendEmail is globally accessible
    window.sendEmail = sendEmail;
    
    // Typing effect for hero section
    const typingElement = document.querySelector('.hero-content h2');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});