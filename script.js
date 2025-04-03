document.addEventListener('DOMContentLoaded', function() {
    // Header animation
    setTimeout(() => {
        document.querySelector('header h1').style.opacity = '1';
        document.querySelector('header h1').style.transform = 'translateY(0)';
        document.querySelector('header p').style.opacity = '1';
        document.querySelector('header p').style.transform = 'translateY(0)';
        document.querySelector('header .btn').style.opacity = '1';
        document.querySelector('header .btn').style.transform = 'translateY(0)';
    }, 500);
    
    // Scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.hamburger').classList.remove('active');
                document.querySelector('.nav-links').classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Handle external links
            if (targetId.startsWith('http') || targetId.endsWith('.html')) {
                window.location.href = targetId;
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle - Enhanced version
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent page scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Contact form toggle
    const showFormBtn = document.getElementById('show-form-btn');
    const contactForm = document.getElementById('contact-form');
    
    if (showFormBtn && contactForm) {
        showFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactForm.classList.toggle('active');
            showFormBtn.textContent = contactForm.classList.contains('active') 
                ? 'Fermer le Formulaire' 
                : 'Envoyez un Message';
            
            if (contactForm.classList.contains('active')) {
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    // Form submission
    const form = document.getElementById('contact-form');
    const notification = document.getElementById('notification');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('Votre message a été envoyé avec succès !', 'success');
                    form.reset();
                    setTimeout(() => {
                        if (contactForm) {
                            contactForm.classList.remove('active');
                            showFormBtn.textContent = 'Envoyez un Message';
                        }
                    }, 2000);
                } else {
                    throw new Error('Erreur lors de l\'envoi du formulaire');
                }
            } catch (error) {
                showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
                console.error(error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // Carousel Avocats
    const avocatTrack = document.querySelector('.avocats-track');
    const avocatCards = document.querySelectorAll('.avocat-card');
    const avocatPrev = document.querySelector('.avocat-prev');
    const avocatNext = document.querySelector('.avocat-next');
    
    if (avocatTrack && avocatCards.length > 0) {
        let currentAvocatIndex = 0;
        const cardWidth = avocatCards[0].offsetWidth + 32; // width + gap

        function updateAvocatCarousel() {
            avocatTrack.style.transform = `translateX(-${currentAvocatIndex * cardWidth}px)`;
        }

        if (avocatNext) {
            avocatNext.addEventListener('click', () => {
                currentAvocatIndex = (currentAvocatIndex + 1) % avocatCards.length;
                updateAvocatCarousel();
            });
        }

        if (avocatPrev) {
            avocatPrev.addEventListener('click', () => {
                currentAvocatIndex = (currentAvocatIndex - 1 + avocatCards.length) % avocatCards.length;
                updateAvocatCarousel();
            });
        }

        // Pause on hover
        avocatTrack.addEventListener('mouseenter', () => {
            avocatTrack.style.animationPlayState = 'paused';
        });

        avocatTrack.addEventListener('mouseleave', () => {
            avocatTrack.style.animationPlayState = 'running';
        });

        // Initialisation
        updateAvocatCarousel();
    }

    // Carousel Avis
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

    // Slider for cabinet section
    const sliderImages = document.querySelectorAll('.slider-container img');
    if (sliderImages.length > 0) {
        let currentIndex = 0;

        function showSlide(index) {
            sliderImages.forEach(img => img.classList.remove('active'));
            sliderImages[index].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % sliderImages.length;
            showSlide(currentIndex);
        }

        // Initialize slider
        showSlide(currentIndex);

        // Auto-advance slides every 5 seconds
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        const sliderContainer = document.querySelector('.about-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }

    // Gestion des modals
    function initModals() {
        const modal = document.getElementById('avis-modal');
        if (!modal) return;
        
        const openModalBtns = document.querySelectorAll('#open-avis-modal');
        const closeModal = document.querySelector('.close-modal');
        
        // Ouverture du modal
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Fermeture du modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Fermeture en cliquant à l'extérieur
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Gestion du formulaire d'avis
        const avisForm = document.getElementById('avis-form');
        if (avisForm) {
            avisForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Récupération des données du formulaire
                const formData = new FormData(this);
                const nom = formData.get('name');
                const note = formData.get('note');
                const commentaire = formData.get('comment');
                
                // Validation des données
                if (!nom || !note || !commentaire) {
                    showNotification("Veuillez remplir tous les champs du formulaire.", 'error');
                    return;
                }
                
                // Simulation d'envoi
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                
                // Simulation de délai pour l'envoi
                setTimeout(() => {
                    showNotification("Merci pour votre avis ! Il sera publié après modération.", 'success');
                    this.reset();
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1500);
            });
        }
    }
    
    // Initialisation des modals
    initModals();
});

// Fonction de notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} active`;
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 5000);
}