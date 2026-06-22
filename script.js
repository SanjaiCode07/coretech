/* ========================================
   SRI DURGAI CORE TECH - JAVASCRIPT
   Premium Industrial Manufacturing Website
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => { preloader.classList.add('hidden'); }, 800);
    });
    setTimeout(() => { preloader.classList.add('hidden'); }, 3000);
  }

  // ---- Navigation ----
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Scroll navbar background
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 60);
    }
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ---- Hero Particles ----
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = Math.random() * 4 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = Math.random() * 10 + 10 + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      particlesContainer.appendChild(particle);
      setTimeout(() => { particle.remove(); }, 25000);
    }
    for (let i = 0; i < 20; i++) createParticle();
    setInterval(createParticle, 2000);
  }

  // ---- Counter Animation ----
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let countersStarted = false;
  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const suffix = (target === 14 || target === 20) ? '+' : target === 100 ? '%' : '';
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        counter.textContent = Math.floor(current) + suffix;
      }, 40);
    });
    countersStarted = true;
  }
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) animateCounters();
      });
    }, { threshold: 0.5 });
    counterObserver.observe(heroStats);
  }

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Homepage Gallery Slideshow ----
  const gallerySlideshow = document.getElementById('gallerySlideshow');
  if (gallerySlideshow) {
    const slides = gallerySlideshow.querySelectorAll('.gallery-slide');
    const slidePrev = document.getElementById('slidePrev');
    const slideNext = document.getElementById('slideNext');
    const dotsContainer = document.getElementById('slideDots');
    let currentSlide = 0;
    let slideTimer;

    // Optional: build dots only if dotsContainer exists
    let dots = [];
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slide-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
      dots = dotsContainer.querySelectorAll('.slide-dot');
    }

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots.length > currentSlide) {
        dots[currentSlide].classList.remove('active');
      }
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots.length > currentSlide) {
        dots[currentSlide].classList.add('active');
      }
    }

    function startAutoplay() { slideTimer = setInterval(() => goToSlide(currentSlide + 1), 4500); }
    function stopAutoplay() { clearInterval(slideTimer); }

    startAutoplay();

    if (slidePrev) slidePrev.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide - 1); startAutoplay(); });
    if (slideNext) slideNext.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide + 1); startAutoplay(); });

    // Touch and Mouse Drag-to-Swipe Support
    let dragStartX = 0;
    let isDragging = false;

    function handleDragStart(clientX) {
      dragStartX = clientX;
      isDragging = true;
      stopAutoplay();
    }

    function handleDragEnd(clientX) {
      if (!isDragging) return;
      isDragging = false;
      const diff = dragStartX - clientX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      }
      startAutoplay();
    }

    // Touch listeners
    gallerySlideshow.addEventListener('touchstart', e => {
      handleDragStart(e.changedTouches[0].clientX);
    }, { passive: true });

    gallerySlideshow.addEventListener('touchend', e => {
      handleDragEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    // Mouse drag listeners
    gallerySlideshow.addEventListener('mousedown', e => {
      handleDragStart(e.clientX);
    });

    gallerySlideshow.addEventListener('mouseup', e => {
      handleDragEnd(e.clientX);
    });

    gallerySlideshow.addEventListener('mouseleave', e => {
      if (isDragging) {
        handleDragEnd(e.clientX);
      } else {
        startAutoplay();
      }
    });

    gallerySlideshow.addEventListener('mouseenter', stopAutoplay);
  }

  // ---- Gallery Page: Filtering + Lightbox ----
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (lightbox && galleryItems.length > 0) {
    let currentLightboxIndex = 0;
    let visibleGalleryImages = [];

    function updateVisibleImages() {
      visibleGalleryImages = [];
      galleryItems.forEach(item => {
        if (item.style.display !== 'none') visibleGalleryImages.push(item.querySelector('img').src);
      });
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        updateVisibleImages();
        const imgSrc = item.querySelector('img').src;
        currentLightboxIndex = visibleGalleryImages.indexOf(imgSrc);
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    lightboxPrev.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
      lightboxImg.src = visibleGalleryImages[currentLightboxIndex];
    });
    lightboxNext.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryImages.length;
      lightboxImg.src = visibleGalleryImages[currentLightboxIndex];
    });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
    });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
      else if (e.key === 'ArrowLeft') lightboxPrev.click();
      else if (e.key === 'ArrowRight') lightboxNext.click();
    });
  }

  // ---- Testimonials Slider ----
  const track = document.getElementById('testimonialsTrack');
  const dotsContainerTestimonials = document.getElementById('testimonialsDots');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (track && testimonialCards.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToTestimonialSlide(i));
      dotsContainerTestimonials.appendChild(dot);
    }
    const testimDots = document.querySelectorAll('.testimonial-dot');

    function goToTestimonialSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      testimDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    let slideInterval = setInterval(() => goToTestimonialSlide((currentSlide + 1) % totalSlides), 5000);
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
      slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => goToTestimonialSlide((currentSlide + 1) % totalSlides), 5000);
      });
      let touchStartX = 0;
      slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
      slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          goToTestimonialSlide(diff > 0 ? (currentSlide + 1) % totalSlides : (currentSlide - 1 + totalSlides) % totalSlides);
        }
      }, { passive: true });
    }
  }

  // ---- Quote Form ----
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  if (quoteForm) {
    quoteForm.addEventListener('submit', e => {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        e.preventDefault();
        const required = quoteForm.querySelectorAll('[required]');
        let isValid = true;
        required.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
          }
        });
        if (!isValid) return;
        if (formSuccess) {
          quoteForm.style.display = 'none';
          formSuccess.classList.add('show');
          setTimeout(() => { quoteForm.style.display = ''; formSuccess.classList.remove('show'); quoteForm.reset(); }, 5000);
        }
      }
    });
  }

  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.addEventListener('focus', () => control.parentElement.classList.add('focused'));
    control.addEventListener('blur', () => control.parentElement.classList.remove('focused'));
  });

  // ---- Back to Top & WhatsApp Buttons ----
  const backToTop = document.getElementById('backToTop');
  const whatsappFloat = document.getElementById('whatsappFloat');

  function handleScrollButtons() {
    const scrollY = window.scrollY;
    if (backToTop) {
      backToTop.classList.toggle('show', scrollY > 500);
    }
    if (whatsappFloat) {
      whatsappFloat.classList.toggle('show', scrollY > 150);
    }
  }

  window.addEventListener('scroll', handleScrollButtons, { passive: true });
  handleScrollButtons(); // Initialize on load

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const target = document.querySelector(targetId);
      if (target) {
        const offsetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax hero ----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.2}px)`;
    }, { passive: true });
  }

  // ---- Console branding ----
  console.log(
    '%c Sri Durgai Core Tech %c Premium Industrial Website ',
    'background: #A4C639; color: #1A1A1A; padding: 6px 12px; font-weight: bold; border-radius: 4px 0 0 4px;',
    'background: #1A1A1A; color: #A4C639; padding: 6px 12px; border-radius: 0 4px 4px 0;'
  );

});
