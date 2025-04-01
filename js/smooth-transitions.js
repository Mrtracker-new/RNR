// Smooth Section Transitions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth section transitions
    const initSmoothTransitions = () => {
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Create intersection observer for sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add special animation when section enters viewport
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    
                    // Add staggered animations to children elements
                    const animElements = entry.target.querySelectorAll('.stagger-animation');
                    animElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('element-visible');
                        }, 100 * index);
                    });
                }
            });
        }, {
            threshold: 0.15, // Trigger when 15% of the section is visible
            rootMargin: '-50px 0px'
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
        
        // Add parallax effect to hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                if (scrollPosition < window.innerHeight) {
                    const heroImage = heroSection.querySelector('.hero-image');
                    const heroContent = heroSection.querySelector('.hero-content');
                    
                    if (heroImage) {
                        heroImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
                    }
                    
                    if (heroContent) {
                        heroContent.style.transform = `translateY(${scrollPosition * 0.1}px)`;
                    }
                }
            });
        }
        
        // Add scroll-triggered animations to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Add hover effects to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.classList.add('btn-hover');
            });
            
            btn.addEventListener('mouseleave', function() {
                this.classList.remove('btn-hover');
            });
        });
        
        // Add magnetic effect to social icons
        const socialIcons = document.querySelectorAll('.social-icons a');
        socialIcons.forEach(icon => {
            icon.addEventListener('mousemove', function(e) {
                const position = this.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;
                
                this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0)';
            });
        });
    };
    
    // Initialize smooth transitions
    initSmoothTransitions();
});