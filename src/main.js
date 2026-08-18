/*

TABLE OF CONTENTS:
1. DOM Content Loaded Event
2. Navigation & Mobile Menu
3. Scroll Effects & Animations
3.5 Projects Sticky Scroller
4. Hero Section Effects
5. Skills Animation
6. Form Handling & Validation
7. Smooth Scrolling
8. Intersection Observer
9. Back to Top Button
10. Utility Functions
==============================================
*/

import { app as firebase, analytics } from './firebase-config.js';
import { logEvent } from 'firebase/analytics';
import { animate, inView, scroll, stagger } from 'motion';




// =========== 1. DOM Content Loaded Event ===========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is ready
    if (window.location.hostname === "aaryan-soni.web.app" || window.location.hostname === "aaryan-soni.firebaseapp.com") {
        window.location.href = "https://aasoni.dev" + window.location.pathname + window.location.search;
    }

    initializeNavigation();
    initializeScrollEffects();
    initializeHeroEffects();
    initializeProjectsScroller();
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
    const navClose = document.getElementById('navClose');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    function closeMenu() {
        if (!hamburger || !navMenu) return;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        if (!hamburger || !navMenu) return;
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
        hamburger.setAttribute('aria-expanded', 'true');
        if (navClose) navClose.focus();
    }

    // Mobile menu toggle functionality
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            if (hamburger.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close mobile menu when clicking any link inside the drawer
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close mobile menu via the drawer's close button
        if (navClose) {
            navClose.addEventListener('click', closeMenu);
        }

        // Close mobile menu when clicking the scrim backdrop
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
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

        // // Add scrolled class to navbar for styling
        // if (scrollTop > 50) {
        //     navbar.classList.add('scrolled');
        // } else {
        //     navbar.classList.remove('scrolled');
        // }

        // Hide/show navbar on scroll (optional enhancement)
        if (scrollTop > lastScrollTop && scrollTop > 250) {
            // Scrolling down
            navbar.style.transform = 'translateY(-200%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

// =========== 3.5 Projects Sticky Scroller ===========
function initializeProjectsScroller() {
    const scroller = document.querySelector('[data-projects-scroller]');
    const sticky = document.querySelector('[data-projects-sticky]');
    const track = document.querySelector('[data-projects-track]');
    const prevBtn = document.querySelector('[data-projects-prev]');
    const nextBtn = document.querySelector('[data-projects-next]');

    if (!scroller || !sticky || !track || !prevBtn || !nextBtn) return;

    // Respect reduced motion: CSS falls back to a wrapping vertical layout
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    // Mobile: CSS stacks the cards vertically, so the scroll-linked
    // horizontal driver (main-thread janky on iOS Safari) is skipped.
    const mobile = window.matchMedia('(max-width: 768px)');
    if (mobile.matches) return;

    const cards = Array.from(track.children);
    const count = cards.length;
    if (count === 0) return;

    let currentIndex = 0;
    let maxTrackX = 0;
    let cardOffsets = [];
    let stickyTop = 0;
    let scrollDistance = 0;
    let trackAnim = null;
    let scrollEndTimer = null;

    function measure() {
        const rail = sticky.querySelector('.projects-scroller');
        const scrollerRect = rail.getBoundingClientRect();
        const stickyRect = sticky.getBoundingClientRect();
        // Visible track window: from the track's start (container edge)
        // to the sticky viewport's right clip edge.
        const windowWidth = stickyRect.right - scrollerRect.left;
        // Center of the viewport relative to the track's start.
        const viewportCenter = (stickyRect.left + stickyRect.right) / 2 - scrollerRect.left;
        // Extra scroll padding so the last card's center can reach the
        // viewport center instead of stopping at the right clip edge.
        const lastCard = cards[count - 1];
        const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
        const centeredMax = Math.max(0, lastCardCenter - viewportCenter);
        maxTrackX = Math.max(track.scrollWidth - windowWidth, centeredMax);
        // Evenly distribute snap positions across the full scroll range so
        // every card is reachable and the last card can be centered.
        cardOffsets = cards.map((_, index) => (
            count > 1 ? (maxTrackX * index) / (count - 1) : 0
        ));
        // Anchor of the sticky's scroll range. Measured from the non-sticky
        // wrapper so it is correct regardless of the current scroll position:
        // sticky.getBoundingClientRect().top clamps to 0 while pinned, which
        // would otherwise corrupt the anchor when re-measured mid-scroll.
        stickyTop = scroller.getBoundingClientRect().top + window.scrollY;
        scrollDistance = Math.max(0, scroller.offsetHeight - window.innerHeight);
    }

    // Read the track's current rendered offset straight from the applied
    // transform, regardless of which animation set it.
    function currentTrackX() {
        const match = track.style.transform.match(/translate(?:3d|X)\(\s*(-?[\d.]+)px/);
        return match ? parseFloat(match[1]) : 0;
    }

    function applyX(x) {
        const clamped = Math.min(0, Math.max(-maxTrackX, x));
        track.style.transform = `translate3d(${clamped}px, 0, 0)`;
    }

    function nearestIndex(x) {
        const abs = Math.abs(x);
        let best = 0;
        let bestDist = Infinity;
        cardOffsets.forEach((offset, index) => {
            const dist = Math.abs(abs - offset);
            if (dist < bestDist) {
                bestDist = dist;
                best = index;
            }
        });
        return best;
    }

    function updateArrows() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === count - 1;
    }

    function updateActive() {
        cards.forEach((card, index) => card.classList.toggle('is-active', index === currentIndex));
    }

    function goToIndex(index, syncScroll = false) {
        index = Math.min(Math.max(0, index), count - 1);
        currentIndex = index;
        updateArrows();
        updateActive();

        const targetX = -cardOffsets[index];

        // Animate the track only: the sticky viewport never scrolls away and
        // the cards slide at a controlled pace.
        if (trackAnim) trackAnim.stop();
        trackAnim = animate(track, { x: targetX }, {
            duration: 0.45,
            ease: 'easeOut',
            onComplete: () => {
                trackAnim = null;
                // For explicit arrow/keyboard navigation, keep the page scroll
                // in sync with the animated card so the wheel position and the
                // track never diverge. While pinned the sticky fills the
                // viewport, so this jump is invisible; it is also clamped to
                // the section's scroll range so it can never overshoot. Use
                // 'instant' — the site's CSS scroll-behavior:smooth would
                // otherwise animate the page.
                if (syncScroll && maxTrackX > 0) {
                    const progress = cardOffsets[index] / maxTrackX;
                    const target = stickyTop + progress * scrollDistance;
                    window.scrollTo({
                        top: Math.min(stickyTop + scrollDistance, Math.max(stickyTop, target)),
                        behavior: 'instant'
                    });
                }
            }
        });
    }

    prevBtn.addEventListener('click', () => goToIndex(currentIndex - 1, true));
    nextBtn.addEventListener('click', () => goToIndex(currentIndex + 1, true));

    // Keyboard navigation while the sticky section is in view
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const rect = sticky.getBoundingClientRect();
        if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
        e.preventDefault();
        goToIndex(currentIndex + (e.key === 'ArrowRight' ? 1 : -1), true);
    });

    measure();

    // Drive the horizontal track from vertical scroll progress
    let lastScrollProgress = null;
    scroll((progress) => {
        // Ignore redundant scroll updates (e.g. trailing events dispatched with
        // no actual movement) that would otherwise fight arrow navigation.
        if (lastScrollProgress !== null && Math.abs(progress - lastScrollProgress) < 0.001) return;
        lastScrollProgress = progress;

        if (trackAnim) trackAnim.stop();
        const scrollX = -progress * maxTrackX;

        // If an arrow animation left the track far from the scroll-driven
        // position, glide it back instead of snapping so wheel scrolling
        // resumes smoothly.
        if (Math.abs(scrollX - currentTrackX()) > 8) {
            trackAnim = animate(track, { x: scrollX }, {
                duration: 0.35,
                ease: 'easeOut',
                onComplete: () => { trackAnim = null; }
            });
        } else {
            applyX(scrollX);
        }

        // Live-highlight whichever card is closest to the snap position
        const nearest = nearestIndex(scrollX);
        if (nearest !== currentIndex) {
            currentIndex = nearest;
            updateArrows();
            updateActive();
        }

        // Snap to the nearest card once scrolling settles
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            const snapTarget = -cardOffsets[nearestIndex(scrollX)];
            // if (Math.abs(scrollX - snapTarget) > 2) goToIndex(nearestIndex(scrollX));
        }, 150);
    }, { target: scroller, offset: ['start start', 'end end'] });

    // Sync to current scroll position on load (e.g. deep links / refresh)
    const loadProgress = scrollDistance > 0
        ? Math.min(1, Math.max(0, (window.scrollY - stickyTop) / scrollDistance))
        : 0;
    currentIndex = nearestIndex(loadProgress * maxTrackX);
    updateArrows();
    updateActive();
    applyX(-loadProgress * maxTrackX);

    // Staggered card entrance when the section scrolls into view
    let entranceDone = false;
    inView(sticky, () => {
        if (entranceDone) return;
        entranceDone = true;
        animate(cards, { opacity: [0, 1], y: [40, 0] }, {
            duration: 0.6,
            ease: 'easeOut',
            delay: stagger(0.08),
            // Clear inline styles so CSS hover/active transforms take over
            onComplete: () => cards.forEach(card => {
                card.style.opacity = '';
                card.style.transform = '';
            })
        });
    }, { amount: 0.3 });

    // Re-measure and re-snap on resize
    window.addEventListener('resize', debounce(() => {
        measure();
        goToIndex(currentIndex);
    }, 150));

    // Layout may shift after fonts/images above the section finish loading;
    // refresh geometry without disturbing the current card or scroll position.
    window.addEventListener('load', () => {
        measure();
        goToIndex(currentIndex);
    }, { once: true });
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

    // Update counters immediately on load (IntersectionObserver-based
    // triggering is unreliable on mobile Safari / Firefox Android)
    animateCounters();

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
        drop.style.color = 'var(--primary-light)';
        drop.style.fontSize = '14px';
        drop.style.fontFamily = 'monospace';
        drop.style.opacity = '0.12';
        drop.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;
        // drop.style.animationDelay = Math.random() * 2 + 's';

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

async function handleFormSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    formData.append("access_key", "b7acc05f-4597-4ad6-8584-b6a40c21b23d");

    const hCaptcha = form.querySelector('textarea[name=h-captcha-response]');

    if (/*!hCaptcha || */(hCaptcha && !hCaptcha.value)) {
        showNotification("Please fill out captcha field before submitting form", "warning");
        return
    }

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

    // //submit form via email temporarily
    // const subject = "New Submission from Portfolio"
    // var fname = document.getElementById('firstName').value,
    //     lname = document.getElementById('lastName').value,
    //     email = document.getElementById('email').value,
    //     inquiryTopic = document.getElementById('subject').value,
    //     message = document.getElementById('message').value;

    let completionMessage = '';
    let completionType = ''

    // const body =
    //     `Hi Aaryan,%0D%0AI am writing to ask you about ${inquiryTopic}.%0D%0AHere's my message:%0D%0A${message}
    //     %0D%0A–${fname} ${lname} [${email}]`
    //
    // location.href = `mailto:aasoni.dev@gmail.com?subject=${subject}&body=${body}`;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            completionMessage = 'Thank you for your message! I\'ll get back to you within 24 hours.';
            completionType = 'success';
        } else {
            completionMessage = ("Error: " + data.message);
            completionType = 'error';
        }

    } catch (error) {
        completionMessage = ("Something went wrong. Please try again. - " + error);
        completionType = 'error';
    }

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success simulation
        showNotification(completionMessage, completionType);
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

    document.querySelectorAll('*[class^=\'delay\'], *[class*=\' delay\']').forEach((element) => {
        var elClassStr = element.classList.toString();
        var delayScalar = parseInt(elClassStr.substring(elClassStr.indexOf("delay") + 6))

        element.style.animationDelay = delayScalar * 0.1 + "s";
    })

    const animateElements = document.querySelectorAll(
        '.section-header, .about-content, .skill-category, ' +
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
                if (entry.target.parentElement.classList.contains('testimonials-grid') ||
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
            
            .notification span, .notification i {
                color: black;
            }
          
            
            .notification-success { border-left-color: #10b981; }
            .notification-error { border-left-color: #ef4444; }
            .notification-info { border-left-color: #3b82f6; }
            .notification-warning { border-left-color: #FE996C; }
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
            const navOverlay = document.getElementById('navOverlay');
            if (hamburger && navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (navOverlay) navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
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
// const debouncedScrollHandler = debounce(function() {
//     // Any expensive scroll operations can go here
// }, 16); // ~60fps

// window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = '/placeholder.svg?height=400&width=600&text=Image+Not+Found';
        e.target.alt = 'Image not available';
    }
}, true);

// Analytics tracking (replace with your analytics code)
function trackEvent(type, action, category, label) {

    // logEvent(type, action, {
    //     event_category: category,
    //     event_label: label
    // });

    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track important user interactions
document.addEventListener('click', function(e) {
    const evType = 'user_interaction'
    const target = e.target.closest('button, a');
    if (target) {
        if (target.classList.contains('cta-btn')) {
            trackEvent(evType, 'click', 'CTA', target.textContent.trim());
        } else if (target.classList.contains('project-link')) {
            trackEvent(evType, 'click', 'Project', target.closest('.project-card').querySelector('h3').textContent);
        } else if (target.href && target.href.startsWith('mailto:')) {
            trackEvent(evType, 'email_click', 'Contact', target.href);
        } else if (target.href && target.href.includes('github.com')) {
            trackEvent(evType, 'github_click', 'Social', target.href);
        }
    }
});

//
// // Performance monitoring
// window.addEventListener('load', function() {
//     // Log performance metrics
//     if (window.performance && window.performance.timing) {
//         const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
//         console.log(`Page load time: ${loadTime}ms`);
//         trackEvent('Performance', 'page_load', loadTime);
//     }
// });

// Error handling
// window.addEventListener('error', function(e) {
//     console.error('JavaScript error:', e.error);
//     showNotification('An unexpected error occurred. Please refresh the page.', 'error');
// });


//services links handling
const serviceLinks = document.querySelectorAll("footer .footer-section.services li a")
const subjDrop = document.getElementById('subject')



serviceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        subjDrop.value = this.getAttribute('data-target');
    })
})






