/* ============================================================
   ABYSS â€” Custom Cursor with Bubble Trail & Magnetic Effect
   ============================================================ */

class AbyssCursor {
  constructor() {
    this.dot = document.getElementById('cursorDot');
    this.ring = document.getElementById('cursorRing');
    this.cursorText = document.getElementById('cursorText');

    if (!this.dot || !this.ring) return;

    // Mouse position
    this.mouse = { x: 0, y: 0 };
    // Smoothed position for ring (lagging behind)
    this.ringPos = { x: 0, y: 0 };
    // Smoothed position for dot
    this.dotPos = { x: 0, y: 0 };

    // State
    this.isHovering = false;
    this.isMagnetic = false;
    this.isClicking = false;
    this.isHidden = false;

    // Bubble trail config
    this.bubbleInterval = null;
    this.lastBubbleTime = 0;
    this.bubbleDelay = 60; // ms between bubbles
    this.maxBubbles = 30;
    this.bubbles = [];

    // Magnetic elements
    this.magneticElements = [];
    this.magneticStrength = 0.35;

    this.init();
  }

  init() {
    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.dot.style.display = 'none';
      this.ring.style.display = 'none';
      return;
    }

    this.bindEvents();
    this.setupMagneticElements();
    this.animate();
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Bubble trail
      this.spawnBubble(e.clientX, e.clientY);
    });

    // Mouse enter/leave window
    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
      this.isHidden = true;
    });

    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
      this.isHidden = false;
    });

    // Click
    document.addEventListener('mousedown', () => {
      this.isClicking = true;
      this.dot.classList.add('clicking');
      this.ring.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      this.isClicking = false;
      this.dot.classList.remove('clicking');
      this.ring.classList.remove('clicking');
    });

    // Hover on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .expedition-card, .species-card, .wonder-card, .fleet-card, .why-card, .gallery-item, .faq-question, input');

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.dot.classList.add('hovering');
        this.ring.classList.add('hovering');
      });

      el.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.dot.classList.remove('hovering');
        this.ring.classList.remove('hovering');
      });
    });
  }

  setupMagneticElements() {
    this.magneticElements = document.querySelectorAll('[data-magnetic]');

    this.magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.isMagnetic = true;
        this.dot.classList.add('magnetic');
        this.ring.classList.add('magnetic');
      });

      el.addEventListener('mouseleave', () => {
        this.isMagnetic = false;
        this.dot.classList.remove('magnetic');
        this.ring.classList.remove('magnetic');
        // Reset element position
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });

      el.addEventListener('mousemove', (e) => {
        if (!this.isMagnetic) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * this.magneticStrength;
        const deltaY = (e.clientY - centerY) * this.magneticStrength;

        gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  spawnBubble(x, y) {
    const now = Date.now();
    if (now - this.lastBubbleTime < this.bubbleDelay) return;
    this.lastBubbleTime = now;

    // Remove oldest bubbles
    while (this.bubbles.length >= this.maxBubbles) {
      const oldest = this.bubbles.shift();
      if (oldest && oldest.parentNode) {
        oldest.parentNode.removeChild(oldest);
      }
    }

    const bubble = document.createElement('div');
    bubble.className = 'cursor-bubble';
    const size = Math.random() * 6 + 3;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = x + (Math.random() * 10 - 5) + 'px';
    bubble.style.top = y + (Math.random() * 10 - 5) + 'px';

    document.body.appendChild(bubble);
    this.bubbles.push(bubble);

    // Remove after animation
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
      const idx = this.bubbles.indexOf(bubble);
      if (idx > -1) this.bubbles.splice(idx, 1);
    }, 1500);
  }

  animate() {
    // Lerp factor â€” how quickly cursor follows
    const dotLerp = 0.2;
    const ringLerp = 0.08;

    // Smooth dot position
    this.dotPos.x += (this.mouse.x - this.dotPos.x) * dotLerp;
    this.dotPos.y += (this.mouse.y - this.dotPos.y) * dotLerp;

    // Smooth ring position (slower / lagging)
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * ringLerp;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * ringLerp;

    // Apply positions
    this.dot.style.left = this.dotPos.x + 'px';
    this.dot.style.top = this.dotPos.y + 'px';

    this.ring.style.left = this.ringPos.x + 'px';
    this.ring.style.top = this.ringPos.y + 'px';

    // Cursor text follows ring
    if (this.cursorText) {
      this.cursorText.style.left = this.ringPos.x + 'px';
      this.cursorText.style.top = (this.ringPos.y + 50) + 'px';
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.abyssCursor = new AbyssCursor();
});
