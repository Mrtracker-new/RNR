// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const body = document.body;
    
    // Toggle mobile menu
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // Add touch support for testimonial slider
    let touchStartX = 0;
    let touchEndX = 0;
    
    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
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
                stopAutoSlide();
                currentSlide = (currentSlide + 1) % testimonialCards.length;
                showSlide(currentSlide, 'next');
                startAutoSlide();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right - previous slide
                stopAutoSlide();
                currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
                showSlide(currentSlide, 'prev');
                startAutoSlide();
            }
        }
    }
    
    // Throttled version of animateSkillBars
    const throttledAnimateSkillBars = throttle(animateSkillBars, 100);
    
    // Scroll event listener - optimized
    window.addEventListener('scroll', function() {
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
        
        // Animate skill bars when in viewport - using throttled version
        throttledAnimateSkillBars();
    }, { passive: true }); // Add passive flag for better scroll performance
    
    // Enhanced Project filtering with animations
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Add transition class to grid for smoother layout changes
            projectsGrid.classList.add('filtering');
            
            // Stagger the animations for a more dynamic effect
            projectCards.forEach((card, index) => {
                // Set a staggered delay based on card index
                const delay = index * 50;
                
                // Reset any existing animations
                card.style.transition = `all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) ${delay}ms`;
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    // Show matching cards with a staggered entrance
                    setTimeout(() => {
                        card.classList.add('card-visible');
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50 + delay);
                } else {
                    // Hide non-matching cards
                    card.classList.remove('card-visible');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
            
            // Remove the transition class after animations complete
            setTimeout(() => {
                projectsGrid.classList.remove('filtering');
            }, 600);
        });
    });
    
    // Initialize all cards as visible on page load
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('card-visible');
            }, index * 100);
        });
    }, 500);
    
    // Enhanced Testimonial slider
    const testimonialDots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let autoSlideInterval;
    let isAnimating = false;
    
    // Initialize testimonial slider with smooth transitions
    function showSlide(index, direction = null) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Remove active class from all dots
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Activate corresponding dot
        testimonialDots[index].classList.add('active');
        
        // Get current visible slide
        const currentVisibleSlide = document.querySelector('.testimonial-card.active');
        
        // Prepare the new slide
        const newSlide = testimonialCards[index];
        
        // Set initial positions based on direction
        if (currentVisibleSlide) {
            if (direction === 'next' || direction === null) {
                newSlide.style.transform = 'translateX(100%) scale(0.95)';
            } else if (direction === 'prev') {
                newSlide.style.transform = 'translateX(-100%) scale(0.95)';
            }
        }
        
        // Display the new slide
        newSlide.style.display = 'block';
        newSlide.style.opacity = '0';
        
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
    
    // Function to start auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % testimonialCards.length;
            currentSlide = nextIndex;
            showSlide(currentSlide, 'next');
        }, 6000);
    }
    
    // Function to stop auto slide
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Show first slide initially
    if (testimonialCards.length > 0) {
        // Add transition styles to all cards
        testimonialCards.forEach(card => {
            card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        showSlide(currentSlide);
        startAutoSlide();
        
        // Next button click
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            showSlide(currentSlide, 'next');
            startAutoSlide();
        });
        
        // Previous button click
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
            showSlide(currentSlide, 'prev');
            startAutoSlide();
        });
        
        // Dot navigation
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (currentSlide === index) return;
                
                stopAutoSlide();
                const direction = index > currentSlide ? 'next' : 'prev';
                currentSlide = index;
                showSlide(currentSlide, direction);
                startAutoSlide();
            });
        });
        
        // Pause auto slide on hover
        const testimonialContainer = document.querySelector('.testimonial-container');
        testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
        testimonialContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Throttle function to limit how often a function can run
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
    
    // Track if skill bars have been animated
    let skillBarsAnimated = false;
    
    // Animate skill bars when in viewport - optimized version
    function animateSkillBars() {
        if (skillBarsAnimated) return; // Only animate once
        
        const skillSection = document.querySelector('.skills');
        if (!skillSection) return;
        
        const sectionPosition = skillSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            const skillLevels = document.querySelectorAll('.skill-level');
            
            skillLevels.forEach(level => {
                // Get the percentage from the parent element's text
                const percentText = level.closest('.skill-item').querySelector('.skill-info p:last-child').textContent;
                const percent = percentText.replace('%', '');
                
                // Set width with a slight delay for each item to create a staggered effect
                setTimeout(() => {
                    level.style.width = percent + '%';
                }, 100 * Array.from(skillLevels).indexOf(level));
                
                // Add a highlight effect to the percentage indicator
                const percentElement = level.closest('.skill-item').querySelector('.skill-info p:last-child');
                percentElement.classList.add('highlight-percent');
            });
            
            skillBarsAnimated = true; // Mark as animated
        }
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