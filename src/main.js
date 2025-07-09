/*

TABLE OF CONTENTS:
1. DOM Content Loaded Event
2. Navigation & Mobile Menu
3. Scroll Effects & Animations
4. Hero Section Effects
5. Skills Animation
6. Form Handling & Validation
7. Smooth Scrolling
8. Intersection Observer
9. Back to Top Button
10. Utility Functions
==============================================
*/

//TODO: email form

// =========== 1. DOM Content Loaded Event ===========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is ready
    initializeNavigation();
    initializeScrollEffects();
    initializeHeroEffects();
    initializeSkillsAnimation();
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeAccessibility();
});

// =========== 2. Navigation & Mobile Menu ===========
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle functionality
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');

            // Update ARIA attributes for accessibility
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// =========== 3. Scroll Effects & Animations ===========
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class to navbar for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional enhancement)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

// =========== 4. Hero Section Effects ===========
function initializeHeroEffects() {
    // Typing animation for hero subtitle
    const typingElement = document.getElementById('typingText');
    const phrases = [
        'Full-Stack Developer',
        'Cybersecurity Enthusiast',
        'System Administrator',
        'Problem Solver',
        'Content Creator',
        'Gamer',
        'Fast Learner',
        'Tech Lover',
        'Programmer',
        'Game Designer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    if (typingElement) {
        typeText();
    }

    // Animated counter for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Trigger counter animation when hero section is visible
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroSection);
    }

    // Code rain effect
    createCodeRain();
}

function createCodeRain() {
    const codeRain = document.getElementById('codeRain');
    if (!codeRain) return;

    const characters = '01';
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.left = i * 20 + 'px';
        drop.style.color = '#002c55';
        drop.style.fontSize = '14px';
        drop.style.fontFamily = 'monospace';
        drop.style.opacity = '0.1';
        drop.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;
        drop.style.animationDelay = Math.random() * 2 + 's';

        // Create falling text
        let text = '';
        for (let j = 0; j < 20; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        drop.innerHTML = text;

        codeRain.appendChild(drop);
    }

    // Add CSS animation for falling effect
    if (!document.querySelector('#code-rain-styles')) {
        const style = document.createElement('style');
        style.id = 'code-rain-styles';
        style.textContent = `
            @keyframes fall {
                0% { transform: translateY(-100vh); }
                100% { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
    }
}

// =========== 5. Skills Animation ===========
function initializeSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    };

    // Trigger animation when skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateSkillBars, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(skillsSection);
    }
}

// =========== 6. Form Handling & Validation ===========
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Update field styling and error message
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    field.classList.toggle('error', !isValid);
    field.setAttribute('aria-invalid', !isValid);

    return isValid;
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
}

function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message'
    };
    return labels[fieldName] || fieldName;
}

function handleFormSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('Please correct the errors in the form.', 'error');
        return;
    }

    // Show loading state
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    //TODO: use firebase storage here??

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success simulation
        showNotification('Thank you for your message! I\'ll get back to you within 24 hours.', 'success');
        form.reset();

        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;

        // Focus management for accessibility
        submitButton.focus();

    }, 2000);

}

// =========== 7. Smooth Scrolling ===========
function initializeSmoothScrolling() {
    // Smooth scrolling for all anchor links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (target) {
            e.preventDefault();
            const targetId = target.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// =========== 8. Intersection Observer for Animations ===========
function initializeScrollAnimations() {
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(
        '.section-header, .about-content, .skill-category, .project-card, ' +
        '.testimonial-card, .contact-content, .capability-list li'
    );

    // Intersection Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Create observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate', 'in-view');

                // Add staggered animation for grid items
                if (entry.target.parentElement.classList.contains('projects-grid') ||
                    entry.target.parentElement.classList.contains('testimonials-grid') ||
                    entry.target.parentElement.classList.contains('skills-grid')) {

                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements
    animateElements.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// =========== 9. Back to Top Button ===========
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =========== 10. Utility Functions ===========
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}" aria-hidden="true"></i>
            <span>${escapeHtml(message)}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease-out;
                border-left: 4px solid #10b981;
            }
            .notification-success { border-left-color: #10b981; }
            .notification-error { border-left-color: #ef4444; }
            .notification-info { border-left-color: #3b82f6; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: auto;
                color: #9ca3af;
                padding: 4px;
                border-radius: 4px;
                transition: color 0.15s ease;
            }
            .notification-close:hover {
                color: #4b5563;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Announce to screen readers
    announceToScreenReader(message);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        if (announcement.parentElement) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

function initializeAccessibility() {
    // Add skip links functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
        // Enter key activates buttons and links
        if (e.key === 'Enter') {
            const target = e.target;
            if (target.classList.contains('project-card') ||
                target.classList.contains('cta-btn')) {
                target.click();
            }
        }

        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any expensive scroll operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = '/placeholder.svg?height=400&width=600&text=Image+Not+Found';
        e.target.alt = 'Image not available';
    }
}, true);

// Analytics tracking (replace with your analytics code)
function trackEvent(category, action, label) {
    // Google Analytics 4 example:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });

    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track important user interactions
document.addEventListener('click', function(e) {
    const target = e.target.closest('button, a');
    if (target) {
        if (target.classList.contains('cta-btn')) {
            trackEvent('CTA', 'click', target.textContent.trim());
        } else if (target.classList.contains('project-link')) {
            trackEvent('Project', 'view', target.closest('.project-card').querySelector('h3').textContent);
        } else if (target.href && target.href.startsWith('mailto:')) {
            trackEvent('Contact', 'email_click', target.href);
        } else if (target.href && target.href.includes('github.com')) {
            trackEvent('Social', 'github_click', target.href);
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if available
    }

    // Ctrl/Cmd + / to show keyboard shortcuts (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        // Show keyboard shortcuts modal
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        trackEvent('Performance', 'page_load', loadTime);
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

console.log('Alex Chen Portfolio website loaded successfully');