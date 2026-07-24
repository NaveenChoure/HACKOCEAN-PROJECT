/* ============================================================
   ABYSS — Continuous Melodic Ocean Soundscape Engine
   ============================================================ */

class AbyssAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.bgAudio = null;
    this.toggleBtn = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.toggleBtn = document.getElementById('audioToggle');
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleSound();
        });
      }

      // Continuous, smooth, unbroken melodic deep sea music stream (No water droplets!)
      this.bgAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = 1.0; // FULL HIGH VOLUME
    });
  }

  toggleSound() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;

    if (this.bgAudio) {
      this.bgAudio.play()
        .then(() => {
          this.isPlaying = true;
          this.updateUI(true);
        })
        .catch(err => {
          console.log('Audio playback error:', err);
          // Retry playback on user interaction
          const retry = () => {
            this.bgAudio.play().then(() => {
              this.isPlaying = true;
              this.updateUI(true);
            });
            document.removeEventListener('click', retry);
          };
          document.addEventListener('click', retry);
        });
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.updateUI(false);
  }

  updateUI(playing) {
    this.toggleBtn = document.getElementById('audioToggle');
    if (!this.toggleBtn) return;

    const textSpan = this.toggleBtn.querySelector('.audio-text');
    if (playing) {
      this.toggleBtn.classList.add('playing');
      if (textSpan) textSpan.textContent = '🎶 Playing Song 🔊';
    } else {
      this.toggleBtn.classList.remove('playing');
      if (textSpan) textSpan.textContent = 'Audio Off';
    }
  }
}

// Global Instance
window.abyssAudio = new AbyssAudioEngine();
