(function ($) {
    "use strict";

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });


    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Scroll to Bottom
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-bottom').fadeOut('slow');
        } else {
            $('.scroll-to-bottom').fadeIn('slow');
        }
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1
    });
    

    // Portfolio Slider
    $(".custom-carousel").owlCarousel({
        autoWidth: true,
        loop: true
    });

    $(document).ready(function () {
        $(".custom-carousel .item").click(function () {
            $(".custom-carousel .item").not($(this)).removeClass("active");
            $(this).toggleClass("active");
        });
    });

    // Portfolio carousel
    $('.custom-carousel').owlCarousel({
        loop: false,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        rewind: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        responsive: {
            0: {
              items: 1,
              nav: false,
              loop: false
            },
            576: {
              items: 2,
              nav: false,
              loop: false
            },
            768: {
              items: 3,
              nav: false,
              loop: false
            }
          }
    });

    // Add this new contact form handler
    $(document).ready(function() {
        $('form').on('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = $('#name').val();
            const email = $('#email').val();
            const subject = $('#subject').val();
            const message = $('#message').val();
            
            // Create mailto URL
            const mailtoUrl = `mailto:rolanlobo901@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            )}`;
            
            // Open email client
            window.location.href = mailtoUrl;
            
            // Clear form
            this.reset();
            $('#success').html('<div class="alert alert-success">Message sent successfully!</div>');
        });
    });

    // Animate skill bars when they come into view
    const animateSkills = () => {
        $('.progress-bar').each(function() {
            const bar = $(this);
            const value = bar.attr('aria-valuenow');
            bar.css('width', '0%');
            
            if (isInViewport(this)) {
                bar.animate({
                    width: value + '%'
                }, 1000);
            }
        });
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Trigger animation on scroll
    $(window).scroll(function() {
        animateSkills();
    });

    // Dark mode toggle functionality
    $(document).ready(function() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        console.log('Dark mode script loaded');
        
        if (!darkModeToggle) {
            console.error('Dark mode toggle button not found!');
            return;
        }

        // Check for saved dark mode preference
        const darkMode = localStorage.getItem('darkMode');
        console.log('Saved dark mode preference:', darkMode);
        
        if (darkMode === 'enabled') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', function() {
            console.log('Dark mode toggle clicked');
            body.classList.toggle('dark-mode');
            
            // Update button icon
            if (body.classList.contains('dark-mode')) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkMode', null);
            }
        });
    });

})(jQuery);
