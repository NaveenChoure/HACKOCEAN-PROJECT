/* ============================================================
   ABYSS — Soft & Gentle Ambient Music Soundscape Engine
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

      // Soft, gentle, peaceful ambient piano & ocean waves melody (Zero noise, 100% soothing)
      this.bgAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_c0e0b3bf1d.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.45; // Soft, pleasant, comfortable volume
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
      if (textSpan) textSpan.textContent = '🎶 Soft Song On 🔊';
    } else {
      this.toggleBtn.classList.remove('playing');
      if (textSpan) textSpan.textContent = 'Audio Off';
    }
  }
}

// Global Instance
window.abyssAudio = new AbyssAudioEngine();
