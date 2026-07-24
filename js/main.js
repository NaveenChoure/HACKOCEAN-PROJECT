/* ============================================================
   ABYSS â€” Main Application Controller
   ============================================================ */

class AbyssApp {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.scrollProgress = document.getElementById('scrollProgress');
    this.preloader = document.getElementById('preloader');
    this.navToggle = document.getElementById('navToggle');
    this.navLinks = document.getElementById('navLinks');

    this.init();
  }

  init() {
    this.setupPreloader();
    this.setupNavbar();
    this.setupScrollProgress();
    this.setupMobileMenu();
    this.setupBubbleCanvas();
  }

  /* ---------- Preloader ---------- */
  setupPreloader() {
    if (!this.preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.preloader.classList.add('hidden');

        // Remove preloader from DOM after animation
        setTimeout(() => {
          this.preloader.remove();
        }, 800);
      }, 1800);
    });

    // Fallback â€” hide preloader after 4s regardless
    setTimeout(() => {
      if (this.preloader && !this.preloader.classList.contains('hidden')) {
        this.preloader.classList.add('hidden');
        setTimeout(() => {
          if (this.preloader && this.preloader.parentNode) {
            this.preloader.remove();
          }
        }, 800);
      }
    }, 4000);
  }

  /* ---------- Navbar Scroll Behavior ---------- */
  setupNavbar() {
    if (!this.navbar) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;

          // Add scrolled class
          if (scrollY > 80) {
            this.navbar.classList.add('scrolled');
          } else {
            this.navbar.classList.remove('scrolled');
          }

          lastScroll = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ---------- Scroll Progress Bar ---------- */
  setupScrollProgress() {
    if (!this.scrollProgress) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.scrollProgress.style.width = scrollPercent + '%';
      });
    });
  }

  /* ---------- Mobile Menu ---------- */
  setupMobileMenu() {
    if (!this.navToggle || !this.navLinks) return;

    this.navToggle.addEventListener('click', () => {
      this.navToggle.classList.toggle('active');
      this.navLinks.classList.toggle('active');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.navToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
        this.navToggle.classList.remove('active');
        this.navLinks.classList.remove('active');
      }
    });
  }

  /* ---------- Ambient Bubble Canvas ---------- */
  setupBubbleCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bubbleCanvas';
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
      opacity: 0.4;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let bubbles = [];
    const maxBubbles = 25;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Bubble {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5 + this.speedX;

        if (this.y < -20) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 212, ${this.opacity})`;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    // Init bubbles
    for (let i = 0; i < maxBubbles; i++) {
      const b = new Bubble();
      b.y = Math.random() * canvas.height; // Spread initially
      bubbles.push(b);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(b => {
        b.update();
        b.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.abyssApp = new AbyssApp();
});
