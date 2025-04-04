document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Header Animation
    // =============================================
    setTimeout(() => {
        const headerTitle = document.querySelector('header h1');
        const headerText = document.querySelector('header p');
        const headerBtn = document.querySelector('header .btn');
        
        if (headerTitle) {
            headerTitle.style.opacity = '1';
            headerTitle.style.transform = 'translateY(0)';
        }
        
        if (headerText) {
            headerText.style.opacity = '1';
            headerText.style.transform = 'translateY(0)';
        }
        
        if (headerBtn) {
            headerBtn.style.opacity = '1';
            headerBtn.style.transform = 'translateY(0)';
        }
    }, 500);

    // =============================================
    // Scroll Animations
    // =============================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => {
        if (el) observer.observe(el);
    });

    // =============================================
    // Mobile Menu Functionality
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close for external links
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('http') || targetId.endsWith('.html')) {
                    return;
                }
                
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // =============================================
    // Smooth Scrolling for Navigation
    // =============================================
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip for external links
            if (targetId.startsWith('http') || targetId.endsWith('.html')) {
                return;
            }
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (window.innerWidth <= 768 && hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // Contact Form Toggle
    // =============================================
    const showFormBtn = document.getElementById('show-form-btn');
    const contactForm = document.getElementById('contact-form');
    
    if (showFormBtn && contactForm) {
        showFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactForm.classList.toggle('active');
            
            if (contactForm.classList.contains('active')) {
                this.textContent = 'Fermer le Formulaire';
                contactForm.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest'
                });
            } else {
                this.textContent = 'Envoyez un Message';
            }
        });
    }

    // =============================================
    // Form Submission Handling
    // =============================================
    const forms = [
        { id: 'contact-form', action: 'https://formspree.io/f/xgvanppz' },
        { id: 'avis-form', action: '' }
    ];
    
    forms.forEach(formConfig => {
        const form = document.getElementById(formConfig.id);
        if (!form) return;
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            try {
                // For demo purposes - in production, use formConfig.action
                let response;
                if (formConfig.id === 'contact-form') {
                    response = await fetch(formConfig.action, {
                        method: 'POST',
                        body: new FormData(this),
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                } else {
                    // Simulate success for avis form
                    response = { ok: true };
                }
                
                if (response.ok) {
                    showNotification(
                        formConfig.id === 'contact-form' 
                            ? 'Votre message a été envoyé avec succès !' 
                            : 'Merci pour votre avis ! Il sera publié après modération.',
                        'success'
                    );
                    
                    this.reset();
                    
                    // Close modal if avis form
                    if (formConfig.id === 'avis-form') {
                        const avisModal = document.getElementById('avis-modal');
                        if (avisModal) avisModal.style.display = 'none';
                        body.style.overflow = '';
                    }
                    
                    // Close contact form if open
                    if (formConfig.id === 'contact-form' && contactForm) {
                        contactForm.classList.remove('active');
                        if (showFormBtn) showFormBtn.textContent = 'Envoyez un Message';
                    }
                } else {
                    throw new Error('Erreur lors de l\'envoi du formulaire');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(
                    'Une erreur est survenue. Veuillez réessayer.',
                    'error'
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    });

    // =============================================
    // Avocats Carousel
    // =============================================
    const avocatTrack = document.querySelector('.avocats-track');
    const avocatCards = document.querySelectorAll('.avocat-card');
    const avocatPrev = document.querySelector('.avocat-prev');
    const avocatNext = document.querySelector('.avocat-next');
    
    if (avocatTrack && avocatCards.length > 0) {
        let currentAvocatIndex = 0;
        const cardWidth = avocatCards[0].offsetWidth + 32; // width + gap
        const maxIndex = avocatCards.length - 1;

        function updateAvocatCarousel() {
            avocatTrack.style.transform = `translateX(-${currentAvocatIndex * cardWidth}px)`;
            
            // Update button states
            if (avocatPrev) {
                avocatPrev.disabled = currentAvocatIndex === 0;
            }
            if (avocatNext) {
                avocatNext.disabled = currentAvocatIndex === maxIndex;
            }
        }

        // Navigation handlers
        if (avocatNext) {
            avocatNext.addEventListener('click', () => {
                if (currentAvocatIndex < maxIndex) {
                    currentAvocatIndex++;
                    updateAvocatCarousel();
                }
            });
        }

        if (avocatPrev) {
            avocatPrev.addEventListener('click', () => {
                if (currentAvocatIndex > 0) {
                    currentAvocatIndex--;
                    updateAvocatCarousel();
                }
            });
        }

        // Pause on hover
        avocatTrack.addEventListener('mouseenter', () => {
            avocatTrack.style.animationPlayState = 'paused';
        });

        avocatTrack.addEventListener('mouseleave', () => {
            avocatTrack.style.animationPlayState = 'running';
        });

        // Initialize
        updateAvocatCarousel();
    }

    // =============================================
    // Avis Carousel Auto-Scroll
    // =============================================
    const avisTrack = document.querySelector('.avis-track');
    if (avisTrack) {
        avisTrack.style.animationDuration = '90s';
        
        avisTrack.parentElement.addEventListener('mouseenter', () => {
            avisTrack.style.animationPlayState = 'paused';
        });
        
        avisTrack.parentElement.addEventListener('mouseleave', () => {
            avisTrack.style.animationPlayState = 'running';
        });
    }

    // =============================================
    // Cabinet Slider
    // =============================================
    const sliderImages = document.querySelectorAll('.slider-container img');
    if (sliderImages.length > 0) {
        let currentIndex = 0;
        let slideInterval;

        function showSlide(index) {
            sliderImages.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % sliderImages.length;
            showSlide(currentIndex);
        }

        function startSlider() {
            showSlide(currentIndex);
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Pause on hover
        const sliderContainer = document.querySelector('.about-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            sliderContainer.addEventListener('mouseleave', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        }

        startSlider();
    }

    // =============================================
    // Modal Handling
    // =============================================
    const avisModal = document.getElementById('avis-modal');
    const openAvisModalBtns = document.querySelectorAll('#open-avis-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Open modal
    if (openAvisModalBtns.length > 0 && avisModal) {
        openAvisModalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                avisModal.style.display = 'block';
                body.style.overflow = 'hidden';
            });
        });
    }
    
    // Close modal
    if (closeModalButtons.length > 0) {
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    body.style.overflow = '';
                }
            });
        });
    }
    
    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            body.style.overflow = '';
        }
    });

    // =============================================
    // Notification System
    // =============================================
    window.showNotification = function(message, type) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type} active`;
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    };
});

// Initialize any necessary polyfills
(function() {
    // IntersectionObserver polyfill if needed
    if (!('IntersectionObserver' in window) ||
        !('IntersectionObserverEntry' in window) ||
        !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.0/intersection-observer.min.js';
        document.head.appendChild(script);
    }
})();
