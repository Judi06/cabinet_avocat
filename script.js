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
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Contact form toggle
    const showFormBtn = document.getElementById('show-form-btn');
    const contactForm = document.getElementById('contact-form');
    
    showFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactForm.classList.toggle('active');
        showFormBtn.textContent = contactForm.classList.contains('active') ? 'Fermer le Formulaire' : 'Envoyez un Message';
        
        if (contactForm.classList.contains('active')) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
    
    // Form submission
    const form = document.getElementById('contact-form');
    const notification = document.getElementById('notification');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
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
                    contactForm.classList.remove('active');
                    showFormBtn.textContent = 'Envoyez un Message';
                }, 2000);
            } else {
                throw new Error('Erreur lors de l\'envoi du formulaire');
            }
        } catch (error) {
            showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
            console.error(error);
        }
    });
    
    // Pause animations on hover for carousels
    const carousels = [
        document.querySelector('.expertises-track'),
        document.querySelector('.avocats-track'),
        document.querySelector('.avis-track')
    ];
    
    carousels.forEach(track => {
        if (track) {
            track.parentElement.addEventListener('mouseenter', () => {
                track.style.animationPlayState = 'paused';
            });
            
            track.parentElement.addEventListener('mouseleave', () => {
                track.style.animationPlayState = 'running';
            });
        }
    });

    // Slider for cabinet section
    const sliderImages = document.querySelectorAll('.slider-container img');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentIndex = 0;

    function showSlide(index) {
        sliderImages.forEach(img => img.classList.remove('active'));
        sliderImages[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % sliderImages.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
        showSlide(currentIndex);
    }

    // Initialize slider
    showSlide(currentIndex);

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const sliderContainer = document.querySelector('.about-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Navigation buttons
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

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
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
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
    notification.textContent = message;
    notification.className = `notification ${type} active`;
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 5000);
}