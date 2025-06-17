// ============ MODERN ENHANCED JAVASCRIPT ============

// ============ GLOBAL VARIABLES ============
let isMenuOpen = false;
let lastScrollTop = 0;
const body = document.body;
const header = document.getElementById('header');
const loadingScreen = document.getElementById('loadingScreen');

// ============ DOM CONTENT LOADED ============
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ============ WINDOW LOAD EVENT ============
window.addEventListener('load', function() {
    hideLoadingScreen();
    initializeAnimations();
});

// ============ INITIALIZATION FUNCTIONS ============
function initializeApp() {
    setupMenuToggle();
    setupThemeToggle();
    setupSmoothScrolling();
    setupScrollEffects();
    setupModalFunctionality();
    setupBackToTop();
    setupAlbumFilter();
    setupStatsCounter();
    setupAnggotaLinks();
    setupLazyLoading();
    setupKeyboardNavigation();
    setupScrollAnimations();
    setupMouseEffects();
    
    // Initialize theme from localStorage
    initializeTheme();
    
    // Preload critical images
    preloadImages([
        'kls.jpg',
        'mm.jpg',
        'tnh.jpg',
        'omdt.jpg',
        'hornas.jpg',
        'kontes.jpg'
    ]);
}

function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

function initializeAnimations() {
    // Setup intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('photo-card')) {
                    animatePhotoCard(entry.target);
                } else if (entry.target.classList.contains('stat-item')) {
                    animateStatItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.photo-card, .about-card, .stat-item, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// ============ THEME TOGGLE FUNCTIONALITY ============
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme change
        document.documentElement.classList.add('theme-transition');
        
        // Set new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon with animation
        themeIcon.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            themeIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 150);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
        
        // Add theme change effect
        createThemeChangeEffect();
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function createThemeChangeEffect() {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9998;
        animation: themeRipple 0.6s ease-out;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 600);
}

// Add CSS for theme transition
const themeTransitionCSS = `
.theme-transition * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
}

@keyframes themeRipple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes slideInRight {
    0% {
        opacity: 0;
        transform: translateX(30px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scaleIn {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideInLeft {
    0% {
        opacity: 0;
        transform: translateX(-30px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
`;

const style = document.createElement('style');
style.textContent = themeTransitionCSS;
document.head.appendChild(style);

// ============ MENU TOGGLE FUNCTIONALITY ============
function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.classList.toggle('active', isMenuOpen);
    navMenu.classList.toggle('active', isMenuOpen);
    
    // Animate menu items
    if (isMenuOpen) {
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.style.animation = `slideInRight 0.3s ease ${index * 0.1}s both`;
        });
    }
}

function closeMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

// ============ SMOOTH SCROLLING ============
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                closeMenu();
            }
        });
    });
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('tentang');
        });
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ============ SCROLL EFFECTS ============
function setupScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        
        // Header effects
        updateHeaderOnScroll(scrolled);
        
        // Hero parallax effect
        updateHeroParallax(scrolled);
        
        // Back to top button
        updateBackToTop(scrolled);
        
        // Update last scroll position
        lastScrollTop = scrolled;
        ticking = false;
    }
}

function updateHeaderOnScroll(scrolled) {
    const header = document.querySelector('.header');
    
    if (scrolled > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Auto-hide header on scroll down
    if (scrolled > lastScrollTop && scrolled > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
}

function updateHeroParallax(scrolled) {
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        const rate = scrolled * -0.5;
        heroBg.style.transform = `translateY(${rate}px)`;
        
        // Reduce blur as user scrolls
        const maxBlur = 10;
        const minBlur = 0;
        const blurAmount = Math.max(minBlur, maxBlur - (scrolled / 50));
        heroBg.style.filter = `blur(${blurAmount}px)`;
    }
}

function updateBackToTop(scrolled) {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (scrolled > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

// ============ BACK TO TOP FUNCTIONALITY ============
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============ MODAL FUNCTIONALITY ============
function setupModalFunctionality() {
    const modal = document.getElementById('photoModal');
    
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

function openModal(imageSrc, title, description) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    if (!modal || !modalImage || !modalTitle || !modalDescription) return;
    
    // Set modal content
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    // Show modal
    modal.classList.add('active');
    body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    modal.focus();
    
    // Add loading state
    modalImage.style.opacity = '0';
    modalImage.onload = () => {
        modalImage.style.opacity = '1';
        modalImage.style.transition = 'opacity 0.3s ease';
    };
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    body.style.overflow = 'auto';
    
    // Reset image
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.style.opacity = '0';
    }
}

// ============ ALBUM FILTER FUNCTIONALITY ============
function setupAlbumFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const photoCards = document.querySelectorAll('.photo-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter photos with animation
            photoCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
                    card.style.display = 'block';
                } else {
                    card.style.animation = 'none';
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============ STATS COUNTER FUNCTIONALITY ============
function setupStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(element, target) {
    let count = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(count);
    }, 40);
}

// ============ ANGGOTA LINKS FUNCTIONALITY ============
function setupAnggotaLinks() {
    const anggotaLink = document.getElementById('anggotaLink');
    const anggotaBtn = document.getElementById('anggotaBtn');
    
    if (anggotaLink) {
        anggotaLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://anggotakelas.vercel.app/', '_blank');
        });
    }
    
    if (anggotaBtn) {
        anggotaBtn.addEventListener('click', () => {
            window.open('https://anggotakelas.vercel.app/', '_blank');
        });
    }
}

// ============ LAZY LOADING FUNCTIONALITY ============
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============ KEYBOARD NAVIGATION ============
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Navigate with arrow keys when modal is open
        if (document.getElementById('photoModal').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                // Previous image logic
                navigateImage('prev');
            } else if (e.key === 'ArrowRight') {
                // Next image logic
                navigateImage('next');
            }
        }
        
        // Quick navigation with number keys
        if (e.key >= '1' && e.key <= '3') {
            const sections = ['tentang', 'album', 'footer'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                scrollToSection(sections[sectionIndex]);
            }
        }
    });
}

// ============ SCROLL ANIMATIONS ============
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all animatable elements
    document.querySelectorAll('.section-title, .about-card, .photo-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// ============ MOUSE EFFECTS ============
function setupMouseEffects() {
    // Cursor follow effect for buttons
    const buttons = document.querySelectorAll('.btn, .filter-btn, .theme-toggle, .back-to-top');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', createCursorEffect);
        button.addEventListener('mouseleave', removeCursorEffect);
    });
    
    // Parallax mouse effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px)`;
            }
        });
        
        hero.addEventListener('mouseleave', () => {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = 'translate(0, 0)';
            }
        });
    }
}

function createCursorEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    
    button.addEventListener('mousemove', followCursor);
    
    function followCursor(event) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        button.style.setProperty('--mouse-x', x + 'px');
        button.style.setProperty('--mouse-y', y + 'px');
    }
}

function removeCursorEffect(e) {
    const button = e.target;
    button.removeEventListener('mousemove', followCursor);
}

// ============ UTILITY FUNCTIONS ============
function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

function animatePhotoCard(card) {
    card.style.animation = 'fadeInUp 0.6s ease both';
}

function animateStatItem(item) {
    item.style.animation = 'scaleIn 0.5s ease both';
}

function navigateImage(direction) {
    // Get all photo cards
    const photoCards = Array.from(document.querySelectorAll('.photo-card'));
    const currentModal = document.getElementById('photoModal');
    const currentImage = document.getElementById('modalImage').src;
    
    // Find current image index
    let currentIndex = -1;
    photoCards.forEach((card, index) => {
        const img = card.querySelector('img');
        if (img && img.src === currentImage) {
            currentIndex = index;
        }
    });
    
    // Navigate to next/previous image
    if (currentIndex !== -1) {
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % photoCards.length;
        } else {
            newIndex = (currentIndex - 1 + photoCards.length) % photoCards.length;
        }
        
        const newCard = photoCards[newIndex];
        const newImg = newCard.querySelector('img');
        const title = newCard.querySelector('.photo-info h3').textContent;
        const description = newCard.querySelector('.photo-info p').textContent;
        
        openModal(newImg.src, title, description);
    }
}

// ============ ERROR HANDLING ============
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
    // Gracefully handle errors without breaking the user experience
});

// ============ PERFORMANCE OPTIMIZATION ============
// Debounce function for scroll events
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

// Throttle function for resize events
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
    }
}

// Handle window resize
window.addEventListener('resize', throttle(() => {
    // Recalculate any size-dependent elements
    if (isMenuOpen) {
        closeMenu();
    }
}, 250));

// ============ ACCESSIBILITY ENHANCEMENTS ============
function setupAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#tentang';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    // Announce theme changes
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            announcer.textContent = `Switched to ${theme} mode`;
        });
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', setupAccessibility);

// ============ FINAL INITIALIZATION ============
// Ensure all functions are properly initialized
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        // Final setup for any remaining elements
        const allButtons = document.querySelectorAll('button, .btn');
        allButtons.forEach(button => {
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });
    
        
        // Add loading states to images
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                });
            }
        });
    }, 100);
});

console.log('XII TJKT 2 Website JavaScript loaded successfully! 🚀');