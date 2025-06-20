// import { app as firebase } from "./firebase-config.js";

/*
==============================================
TABLE OF CONTENTS
==============================================
1. Preloader
2. Smooth Scrolling
3. Cursor Animation
4. Navbar Scroll Effect
5. Mobile Menu Toggle
6. Skills Animation
7. Project Filtering
8. Testimonial Slider
9. Back to Top Button
10. Form Submission
11. Scroll Reveal Animations
==============================================
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // =========== 1. Preloader ===========
    // Simulate loading time
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);

    // =========== 2. Smooth Scrolling ===========
    // Select all links with hashes
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is within the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Close mobile menu if open
                    if (document.querySelector('.nav-links').classList.contains('active')) {
                        toggleMobileMenu();
                    }

                    // Scroll to the target element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    // Update active link
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });

    // =========== 3. Cursor Animation ===========
    const cursor = document.querySelector('.cursor');

    // Show custom cursor on desktop only
    if (window.innerWidth > 768) {
        cursor.style.display = 'grid';
        cursor.animate({opacity:1}, {
            duration: 200, fill: "auto"
        })

        window.addEventListener('mousemove', (e) => {
            const i = {
                transform: `translate(${e.clientX - cursor.offsetWidth / 2}px, ${e.clientY - cursor.offsetHeight / 2}px)`,
            }

            cursor.animate(i, {
                duration: 800, fill: "forwards"
            })
        });

        // Cursor effects on hover
        const links = document.querySelectorAll('a, button, .filter-btn, .project-card');

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.opacity = '1';

                //switch cases for hovered element
                //cursor.children[0].src = "switch cases"
            });

            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '0.8';
            });
        });
    } else {
        cursor.style.display = "none";
    }

    // =========== 4. Navbar Scroll Effect ===========
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Add background to navbar on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Show/hide back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // =========== 5. Mobile Menu Toggle ===========
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // =========== 6. Skills Animation ===========
    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-per');

    function animateSkills() {
        skillBars.forEach(skill => {
            const percentage = skill.getAttribute('per');
            skill.style.width = percentage + '%';
        });
    }

    // Use Intersection Observer to trigger animation when skills section is in view
    const skillsSection = document.querySelector('.skills');

    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
    }

    // =========== 7. Project Filtering ===========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Show all projects if filter is 'all', otherwise filter by category
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // =========== 8. Testimonial Slider ===========
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    // Function to update the active testimonial
    function updateTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Event listeners for navigation buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
            updateTestimonial(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
            updateTestimonial(currentIndex);
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateTestimonial(index);
        });
    });

    // Auto-rotate testimonials
    let testimonialInterval = setInterval(() => {
        currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
        updateTestimonial(currentIndex);
    }, 5000);

    // Pause auto-rotation on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');

    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });

        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
                updateTestimonial(currentIndex);
            }, 5000);
        });
    }

    // =========== 9. Back to Top Button ===========
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========== 10. Form Submission ===========
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Simulate form submission (replace with actual form submission)
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Simulate API call with timeout
            setTimeout(() => {
                // Show success message (in a real application, you would handle success/error responses)
                alert('Thank you for your message! I will get back to you soon.');

                // Reset form
                contactForm.reset();

                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);

            /*
            // Example of actual form submission using fetch API
            fetch('your-form-handler-url', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Handle success
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            })
            .catch(error => {
                // Handle error
                alert('There was an error sending your message. Please try again.');
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
            */
        });
    }

    // =========== 11. Scroll Reveal Animations ===========
    // Simple scroll reveal effect for elements
    const revealElements = document.querySelectorAll('.section-header, .about-content, .service-card, .project-card, .testimonial-slider, .contact-content');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});

// Window load event for additional initializations
window.addEventListener('load', function() {
    // Initialize any components that need the full page to be loaded

    // Preload images for smoother transitions
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const newImg = new Image();
            newImg.src = src;
        }
    });
});