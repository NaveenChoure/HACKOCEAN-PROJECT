/* ============================================================
   ABYSS â€” GSAP ScrollTrigger Animations
   ============================================================ */

class AbyssAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Failsafe: IntersectionObserver + fallback timeout to ensure no content stays hidden
    this.setupFailsafeReveals();

    // Register ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Global GSAP defaults
      gsap.defaults({
        ease: 'power3.out',
        duration: 1
      });

      this.setupRevealAnimations();
      this.setupHeroAnimations();
      this.setupDiveExperience();
      this.setupParallax();
      this.setupCardAnimations();
      this.setupStatsSection();
      this.setupJourneyTimeline();
      this.setupSectionTransitions();
    }
  }

  setupFailsafeReveals() {
    const hiddenElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    
    // IntersectionObserver reveal
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'is-visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }
        });
      }, { threshold: 0.1 });

      hiddenElements.forEach(el => observer.observe(el));
    }

    // Ultimate fallback after 2.5s
    setTimeout(() => {
      hiddenElements.forEach(el => {
        el.classList.add('visible', 'is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 2500);
  }

  /* ---------- Generic Reveal on Scroll ---------- */
  setupRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 60%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Reveal left
    document.querySelectorAll('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Reveal right
    document.querySelectorAll('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Reveal with rotation
    document.querySelectorAll('.reveal-rotate').forEach(el => {
      gsap.fromTo(el,
        { rotateY: 15, x: 50, opacity: 0 },
        {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered children
    document.querySelectorAll('.stagger-children').forEach(container => {
      const children = container.querySelectorAll('.reveal');
      gsap.fromTo(children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ---------- Hero Section ---------- */
  setupHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Hero content entrance
    const tl = gsap.timeline({ delay: 1.5 });

    tl.fromTo('.hero-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.hero-title .word',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.15, ease: 'expo.out' },
      '-=0.4'
    )
    .fromTo('.hero-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-buttons',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.scroll-indicator',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.2'
    );

    // Hero parallax on scroll
    gsap.to('.hero-bg img', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Fade hero content on scroll
    gsap.to('.hero-content', {
      y: -80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: '30% top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  /* ---------- Dive Experience Depth Timeline ---------- */
  setupDiveExperience() {
    const depthStops = document.querySelectorAll('.depth-stop');
    if (!depthStops.length) return;

    depthStops.forEach((stop, i) => {
      const marker = stop.querySelector('.depth-marker');
      const content = stop.querySelector('.depth-content');
      const visual = stop.querySelector('.depth-visual');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stop,
          start: 'top 80%',
          end: 'top 40%',
          toggleActions: 'play none none none'
        }
      });

      // Marker scales in
      if (marker) {
        tl.fromTo(marker,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }
        );
      }

      // Content slides in
      if (content) {
        const direction = i % 2 === 0 ? -60 : 60;
        tl.fromTo(content,
          { x: direction, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.3'
        );
      }

      // Visual floats in
      if (visual) {
        const direction = i % 2 === 0 ? 60 : -60;
        tl.fromTo(visual,
          { x: direction, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        );
      }
    });

    // Animate the vertical line drawing
    const timeline = document.querySelector('.depth-timeline');
    if (timeline) {
      gsap.fromTo(timeline,
        { '--line-height': '0%' },
        {
          '--line-height': '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          }
        }
      );
    }
  }

  /* ---------- Parallax Effects ---------- */
  setupParallax() {
    // About section image
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
      gsap.to(aboutImage, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // Float stats on about image
    document.querySelectorAll('.about-float-stat').forEach((stat, i) => {
      gsap.to(stat, {
        y: i % 2 === 0 ? -20 : 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    });

    // CTA background animation
    const ctaGlow = document.querySelector('.cta-glow');
    if (ctaGlow) {
      gsap.to(ctaGlow, {
        scale: 1.3,
        opacity: 0.8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    }
  }

  /* ---------- Card Hover Animations ---------- */
  setupCardAnimations() {
    // Tilt effect for expedition cards
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  /* ---------- Statistics Counter ---------- */
  setupStatsSection() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
          this.animateCounter(counter, target);
        },
        once: true
      });
    });
  }

  animateCounter(element, target) {
    const duration = 2;
    const start = 0;
    const increment = target / (duration * 60); // 60fps
    let current = start;

    const update = () => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        return;
      }
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(update);
    };

    update();
  }

  /* ---------- Journey Timeline Horizontal Scroll ---------- */
  setupJourneyTimeline() {
    const wrapper = document.querySelector('.journey-timeline-wrapper');
    const timeline = document.querySelector('.journey-timeline');
    if (!wrapper || !timeline) return;

    // Animate steps on scroll into view
    const steps = timeline.querySelectorAll('.journey-step');
    steps.forEach((step, i) => {
      gsap.fromTo(step,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animate arrows
    const arrows = timeline.querySelectorAll('.journey-arrow');
    arrows.forEach((arrow, i) => {
      gsap.fromTo(arrow,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: i * 0.1 + 0.2,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ---------- Section Background Transitions ---------- */
  setupSectionTransitions() {
    // Subtle section entrance animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      gsap.fromTo(section,
        { opacity: 0.7 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure GSAP is loaded
  setTimeout(() => {
    window.abyssAnimations = new AbyssAnimations();
  }, 100);
});
