document.addEventListener('DOMContentLoaded', function() {
    initNewTestimonials();
});

function initNewTestimonials() {
    const testimonialsContainer = document.querySelector('.new-testimonials-container');
    if (!testimonialsContainer) return;
    
    // Testimonial data
    const testimonials = [
        {
            name: 'Emily Johnson',
            position: 'CEO, Digital Solutions',
            image: 'img/testimonial-1.jpg',
            rating: 5,
            text: 'Absolutely fantastic service! The team delivered beyond our expectations and provided excellent support throughout the project duration.',
            project: 'Website redesign and performance optimization',
            stats: [
                { value: '45%', label: 'Conversion Increase' },
                { value: '3x', label: 'Performance Boost' }
            ]
        },
        {
            name: 'Michael Chen',
            position: 'CTO, Tech Innovators',
            image: 'img/testimonial-2.jpg',
            rating: 4.5,
            text: 'Their attention to detail and creative approach helped us achieve remarkable results. Highly recommended for anyone looking for professional service.',
            project: 'Custom web application development',
            stats: [
                { value: '60%', label: 'Time Saved' },
                { value: '25%', label: 'Cost Reduction' }
            ]
        },
        {
            name: 'Sarah Williams',
            position: 'Marketing Director',
            image: 'img/testimonial-3.jpg',
            rating: 5,
            text: 'Outstanding work ethic and technical expertise. The project was completed ahead of schedule with perfect execution.',
            project: 'E-commerce platform with integrated marketing tools',
            stats: [
                { value: '85%', label: 'Sales Increase' },
                { value: '12k+', label: 'New Customers' }
            ]
        }
    ];
    
    // Create testimonial slider
    createTestimonialSlider(testimonialsContainer, testimonials);
}

function createTestimonialSlider(container, testimonials) {
    // Create wrapper elements
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'testimonial-slider-wrapper';
    
    const slider = document.createElement('div');
    slider.className = 'testimonial-slider';
    
    // Create testimonial cards
    testimonials.forEach((testimonial, index) => {
        const card = createTestimonialCard(testimonial, index);
        slider.appendChild(card);
    });
    
    // Create navigation
    const navigation = document.createElement('div');
    navigation.className = 'testimonial-navigation';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'testimonial-nav-btn prev';
    prevBtn.setAttribute('aria-label', 'Previous testimonial');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'testimonial-nav-btn next';
    nextBtn.setAttribute('aria-label', 'Next testimonial');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Pagination
    const pagination = document.createElement('div');
    pagination.className = 'testimonial-pagination';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `pagination-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('data-index', index);
        pagination.appendChild(dot);
    });
    
    // Assemble navigation
    navigation.appendChild(prevBtn);
    navigation.appendChild(pagination);
    navigation.appendChild(nextBtn);
    
    // Assemble slider
    sliderWrapper.appendChild(slider);
    container.appendChild(sliderWrapper);
    container.appendChild(navigation);
    
    // Initialize slider functionality
    initSliderFunctionality(slider, pagination, prevBtn, nextBtn);
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = `testimonial-card${index === 0 ? ' active' : ''}`;
    card.setAttribute('data-index', index);
    
    // Create front of card
    const cardInner = document.createElement('div');
    cardInner.className = 'testimonial-card-inner';
    
    // Create header with image and author info
    const header = document.createElement('div');
    header.className = 'testimonial-header';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'testimonial-image';
    
    const image = document.createElement('img');
    image.src = testimonial.image;
    image.alt = testimonial.name;
    image.loading = 'lazy';
    
    imageContainer.appendChild(image);
    
    const authorInfo = document.createElement('div');
    authorInfo.className = 'testimonial-author';
    
    const name = document.createElement('h4');
    name.textContent = testimonial.name;
    
    const position = document.createElement('p');
    position.textContent = testimonial.position;
    
    authorInfo.appendChild(name);
    authorInfo.appendChild(position);
    
    header.appendChild(imageContainer);
    header.appendChild(authorInfo);
    
    // Create rating
    const rating = document.createElement('div');
    rating.className = 'testimonial-rating';
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    // Create full and half stars based on rating
    const fullStars = Math.floor(testimonial.rating);
    const hasHalfStar = testimonial.rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        if (i < fullStars) {
            star.className = 'fas fa-star';
        } else if (i === fullStars && hasHalfStar) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
        starsContainer.appendChild(star);
    }
    
    rating.appendChild(starsContainer);
    
    // Create testimonial content
    const content = document.createElement('div');
    content.className = 'testimonial-content';
    
    const quoteLeft = document.createElement('i');
    quoteLeft.className = 'fas fa-quote-left';
    
    const quote = document.createElement('p');
    quote.textContent = testimonial.text;
    
    const quoteRight = document.createElement('i');
    quoteRight.className = 'fas fa-quote-right';
    
    content.appendChild(quoteLeft);
    content.appendChild(quote);
    content.appendChild(quoteRight);
    
    // Project details section removed as requested
    
    // Assemble card
    cardInner.appendChild(header);
    cardInner.appendChild(rating);
    cardInner.appendChild(content);
    
    card.appendChild(cardInner);
    
    return card;
}

function initSliderFunctionality(slider, pagination, prevBtn, nextBtn) {
    const cards = slider.querySelectorAll('.testimonial-card');
    const dots = pagination.querySelectorAll('.pagination-dot');
    let currentIndex = 0;
    let autoplayInterval;
    
    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Update current index
        currentIndex = index;
        
        // Update cards
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
            
            // Apply different transform based on position relative to current
            if (i < currentIndex) {
                card.style.transform = 'translateX(-100%) scale(0.8)';
                card.style.opacity = '0';
            } else if (i > currentIndex) {
                card.style.transform = 'translateX(100%) scale(0.8)';
                card.style.opacity = '0';
            } else {
                card.style.transform = 'translateX(0) scale(1)';
                card.style.opacity = '1';
            }
        });
        
        // Update pagination dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Initialize first testimonial
    showTestimonial(0);
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + cards.length) % cards.length;
        showTestimonial(newIndex);
        resetAutoplay();
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % cards.length;
        showTestimonial(newIndex);
        resetAutoplay();
    });
    
    // Pagination dot click
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showTestimonial(index);
            resetAutoplay();
        });
    });
    
    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (diff > swipeThreshold) {
            // Swipe right - show previous
            const newIndex = (currentIndex - 1 + cards.length) % cards.length;
            showTestimonial(newIndex);
        } else if (diff < -swipeThreshold) {
            // Swipe left - show next
            const newIndex = (currentIndex + 1) % cards.length;
            showTestimonial(newIndex);
        }
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const newIndex = (currentIndex + 1) % cards.length;
            showTestimonial(newIndex);
        }, 5000);
    }
    
    function pauseAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        pauseAutoplay();
        startAutoplay();
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    slider.addEventListener('mouseenter', pauseAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
}