/* ============================================================
   ABYSS â€” Section-Specific Interactions
   ============================================================ */

class AbyssSections {
  constructor() {
    this.init();
  }

  init() {
    this.setupFAQ();
    this.setupTestimonialsSwiper();
    this.setupGalleryHover();
    this.setupSpeciesHover();
    this.setupSmoothScroll();
  }

  /* ---------- FAQ Accordion ---------- */
  setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(other => {
          other.classList.remove('active');
          const answer = other.querySelector('.faq-answer');
          if (answer) answer.style.maxHeight = '0px';
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          const answer = item.querySelector('.faq-answer');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        }
      });
    });
  }

  /* ---------- Testimonials Swiper ---------- */
  setupTestimonialsSwiper() {
    const swiperEl = document.querySelector('.testimonials-swiper');
    if (!swiperEl) return;

    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      },
      effect: 'slide',
      speed: 600,
    });

    // Style the pagination bullets via CSS injection
    const style = document.createElement('style');
    style.textContent = `
      .swiper-pagination {
        margin-top: 40px !important;
        position: relative !important;
      }
      .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        background: rgba(255,255,255,0.2);
        opacity: 1;
        margin: 0 6px !important;
        transition: all 0.3s ease;
        border-radius: 5px;
      }
      .swiper-pagination-bullet-active {
        background: #00f5d4;
        width: 30px;
        box-shadow: 0 0 15px rgba(0,245,212,0.4);
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------- Gallery Hover Effects ---------- */
  setupGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // Dim other items
        galleryItems.forEach(other => {
          if (other !== item) {
            other.style.opacity = '0.5';
            other.style.filter = 'brightness(0.6)';
          }
        });
      });

      item.addEventListener('mouseleave', () => {
        // Restore all
        galleryItems.forEach(other => {
          other.style.opacity = '1';
          other.style.filter = 'none';
        });
      });
    });
  }

  /* ---------- Species Card Hover ---------- */
  setupSpeciesHover() {
    const speciesCards = document.querySelectorAll('.species-card');

    speciesCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Scale up the emoji
        const bg = card.querySelector('.species-card-bg');
        if (bg) {
          bg.style.transform = 'scale(1.15)';
          bg.style.filter = 'brightness(1.2)';
        }
      });

      card.addEventListener('mouseleave', () => {
        const bg = card.querySelector('.species-card-bg');
        if (bg) {
          bg.style.transform = 'scale(1)';
          bg.style.filter = 'none';
        }
      });
    });
  }

  /* ---------- Smooth Scroll for Nav Links ---------- */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Close mobile menu
        const navLinks = document.getElementById('navLinks');
        const navToggle = document.getElementById('navToggle');
        if (navLinks) navLinks.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');

        // Smooth scroll
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.abyssSections = new AbyssSections();
});
