/**
 * ADVANCED ANIMATION CONTROLLER
 * Senior-level animation system with scroll triggers, parallax, and micro-interactions
 */

class AnimationController {
    constructor() {
        this.animations = [];
        this.scrollObserver = null;
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupHoverEffects();
        this.setupMouseTracking();
        this.setupPageLoadAnimations();
        this.setupCounterAnimations();
        this.setupProgressBars();
        this.setupGradientAnimations();
        this.setupStaggeredAnimations();
        this.setupCustomCursor();
        this.setup3DEffects();
    }

    /**
     * Scroll-triggered animations
     */
    setupScrollAnimations() {
        const animateElements = document.querySelectorAll('[data-animate]');
        
        if (!animateElements.length) return;

        this.scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = element.dataset.delay || 0;
                        const animationType = element.dataset.animate || 'fade-up';
                        
                        setTimeout(() => {
                            element.classList.add('animated', animationType);
                            
                            // Add specific animation based on type
                            switch(animationType) {
                                case 'scale':
                                    element.style.transform = 'scale(1)';
                                    break;
                                case 'fade-left':
                                    element.style.transform = 'translateX(0)';
                                    break;
                                case 'fade-right':
                                    element.style.transform = 'translateX(0)';
                                    break;
                            }
                            
                            // Add ripple effect for cards
                            if (element.classList.contains('project-card')) {
                                this.addRippleEffect(element);
                            }
                            
                        }, delay);
                        
                        this.scrollObserver.unobserve(element);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animateElements.forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    /**
     * Parallax effects for background elements
     */
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (!parallaxElements.length) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.5;
                const yPos = -(scrollTop * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }

    /**
     * Advanced hover effects
     */
    setupHoverEffects() {
        // Card tilt effect
        const tiltCards = document.querySelectorAll('[data-tilt]');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(10px)
                `;
                
                // Add glow effect
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, 
                    rgba(139, 92, 246, 0.1), 
                    transparent 70%)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                card.style.background = '';
            });
        });

        // Gradient shift on hover
        const gradientButtons = document.querySelectorAll('.btn-gradient');
        
        gradientButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.animation = 'gradient-shift 2s ease infinite';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.animation = '';
            });
        });
    }

    /**
     * Mouse position tracking for interactive effects
     */
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            // Update custom cursor position
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
            
            // Mouse trail effect
            this.createMouseTrail(e);
        });
    }

    /**
     * Page load animations with sequencing
     */
    setupPageLoadAnimations() {
        // Add loading state
        document.body.classList.add('page-loading');
        
        // Simulate content loading
        setTimeout(() => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
            
            // Animate hero section elements with sequence
            this.animateHeroSequence();
        }, 800);
    }

    animateHeroSequence() {
        const heroElements = document.querySelectorAll('.hero [data-animate-sequence]');
        
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
                
                // Add specific animations based on element type
                if (el.classList.contains('hero-title')) {
                    this.animateTextReveal(el);
                }
                
                if (el.classList.contains('hero-subtitle')) {
                    this.animateTypewriter(el);
                }
                
            }, index * 200);
        });
    }

    /**
     * Counter animations for stats
     */
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target) || 100;
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                            
                            // Add plus sign if needed
                            if (counter.dataset.hasPlus) {
                                counter.textContent += '+';
                            }
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Animated progress bars
     */
    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar[data-width]');
        
        progressBars.forEach(bar => {
            const width = bar.dataset.width;
            bar.style.setProperty('--progress-width', `${width}%`);
            
            // Animate when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.classList.add('progress-fill');
                        observer.unobserve(bar);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }

    /**
     * Gradient animations for backgrounds
     */
    setupGradientAnimations() {
        const gradientElements = document.querySelectorAll('[data-gradient-animate]');
        
        gradientElements.forEach(el => {
            const colors = el.dataset.gradientColors || '#8b5cf6, #3b82f6, #06b6d4';
            const speed = el.dataset.gradientSpeed || '4s';
            
            el.style.background = `linear-gradient(135deg, ${colors})`;
            el.style.backgroundSize = '200% 200%';
            el.style.animation = `gradient-shift ${speed} ease infinite`;
        });
    }

    /**
     * Staggered animations for lists/grids
     */
    setupStaggeredAnimations() {
        const staggeredContainers = document.querySelectorAll('[data-stagger]');
        
        staggeredContainers.forEach(container => {
            const children = container.children;
            const delay = parseInt(container.dataset.staggerDelay) || 100;
            
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * delay}ms`;
                child.classList.add('animate-fade-in');
            });
        });
    }

    /**
     * Custom cursor effects
     */
    setupCustomCursor() {
        if (window.matchMedia('(pointer: fine)').matches) {
            const cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            document.body.appendChild(cursor);
            
            // Cursor interaction states
            document.querySelectorAll('a, button, [data-interactive]').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('cursor-hover');
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('cursor-hover');
                });
            });
        }
    }

    /**
     * 3D transform effects
     */
    setup3DEffects() {
        const cards3D = document.querySelectorAll('[data-3d-effect]');
        
        cards3D.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = (x / rect.width - 0.5) * 2;
                const yPercent = (y / rect.height - 0.5) * 2;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateY(${xPercent * 10}deg)
                    rotateX(${-yPercent * 10}deg)
                    scale3d(1.05, 1.05, 1.05)
                `;
                
                // Adjust shadow based on mouse position
                const shadowX = xPercent * 20;
                const shadowY = yPercent * 20;
                card.style.boxShadow = `
                    ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.3)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            });
        });
    }

    /**
     * Ripple click effect
     */
    addRippleEffect(element) {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    /**
     * Typewriter effect
     */
    animateTypewriter(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.overflow = 'hidden';
        element.style.whiteSpace = 'nowrap';
        element.style.borderRight = '2px solid #8b5cf6';
        
        let i = 0;
        const speed = 50; // typing speed in ms
        
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                element.style.borderRight = 'none';
            }
        };
        
        typeWriter();
    }

    /**
     * Text reveal animation
     */
    animateTextReveal(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.background = 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)';
        element.style.backgroundClip = 'text';
        element.style.webkitBackgroundClip = 'text';
        element.style.webkitTextFillColor = 'transparent';
        element.style.backgroundSize = '200% auto';
        
        let i = 0;
        const revealSpeed = 30;
        
        const revealText = () => {
            if (i <= text.length) {
                element.textContent = text.substring(0, i);
                i++;
                setTimeout(revealText, revealSpeed);
            }
        };
        
        revealText();
        
        // Animate gradient
        let position = 0;
        const animateGradient = () => {
            position = (position + 1) % 200;
            element.style.backgroundPosition = `${position}% 50%`;
            requestAnimationFrame(animateGradient);
        };
        
        setTimeout(() => {
            animateGradient();
        }, text.length * revealSpeed);
    }

    /**
     * Mouse trail effect
     */
    createMouseTrail(e) {
        // Create trail element
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #8b5cf6, #3b82f6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(trail);
        
        // Remove trail after animation
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'translate(-50%, -50%) scale(0)';
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 300);
        }, 100);
    }

    /**
     * Particle system for background
     */
    createParticleSystem() {
        const container = document.querySelector('.particles-container');
        if (!container) return;
        
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, 
                    rgba(139, 92, 246, 0.3), 
                    rgba(59, 130, 246, 0.3));
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                animation: particle-float ${duration}s linear infinite;
                animation-delay: ${delay}s;
                filter: blur(2px);
            `;
            
            container.appendChild(particle);
        }
    }

    /**
     * Initialize animations on DOMContentLoaded
     */
    static init() {
        document.addEventListener('DOMContentLoaded', () => {
            const animationController = new AnimationController();
            
            // Make it globally available for debugging
            window.animations = animationController;
            
            // Create particle system after load
            setTimeout(() => {
                animationController.createParticleSystem();
            }, 1000);
        });
    }
}

// Initialize Animation Controller
AnimationController.init();

/**
 * Additional utility animations
 */

// Debounce function for performance
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

// Throttle function for scroll events
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

// Smooth scroll to element
function smoothScrollTo(target, duration = 1000) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Add CSS for custom cursor
const cursorCSS = `
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #8b5cf6;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, background 0.3s;
        mix-blend-mode: difference;
    }
    
    .cursor-hover {
        width: 40px;
        height: 40px;
        background: rgba(139, 92, 246, 0.3);
        border-width: 1px;
    }
    
    .mouse-trail {
        transition: opacity 0.3s, transform 0.3s;
    }
    
    .page-loading {
        opacity: 0;
    }
    
    .page-loaded {
        opacity: 1;
        transition: opacity 0.8s ease;
    }
`;

// Inject cursor CSS
const style = document.createElement('style');
style.textContent = cursorCSS;
document.head.appendChild(style);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController };
}