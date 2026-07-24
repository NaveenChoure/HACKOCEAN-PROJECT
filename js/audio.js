/* ============================================================
   ABYSS — Web Audio & Ambient Hydro-Acoustic Engine
   ============================================================ */

class AbyssAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.subOsc = null;
    this.pinkNoiseNode = null;
    this.bubbleTimer = null;
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

      // Pre-create ambient audio element fallback
      this.bgAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.5;

      // Unlock AudioContext on first user interaction anywhere
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
      };
      document.addEventListener('click', unlockAudio);
      document.addEventListener('keydown', unlockAudio);
    });
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  toggleSound() {
    this.initAudioContext();

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.updateUI(true);

    // 1. Play Ambient Hydrophone Background Track
    if (this.bgAudio) {
      this.bgAudio.play().catch(err => console.log('HTML5 Audio fallback:', err));
    }

    // 2. Synthesize Deep Ocean Sub-Bass Rumble
    if (this.ctx) {
      try {
        this.subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        const subFilter = this.ctx.createBiquadFilter();

        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(60, this.ctx.currentTime);

        subFilter.type = 'lowpass';
        subFilter.frequency.value = 150;
        subGain.gain.value = 0.4;

        this.subOsc.connect(subFilter);
        subFilter.connect(subGain);
        subGain.connect(this.masterGain);
        this.subOsc.start();
      } catch(e) {}
    }

    // 3. Play Sonar Ping & Bubble Pops
    this.playSonarPing();
    this.scheduleBubbles();
  }

  stop() {
    this.isPlaying = false;
    this.updateUI(false);

    if (this.bgAudio) {
      this.bgAudio.pause();
    }

    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
    }

    if (this.subOsc) {
      try {
        this.subOsc.stop();
        this.subOsc.disconnect();
      } catch(e) {}
      this.subOsc = null;
    }
  }

  updateUI(playing) {
    this.toggleBtn = document.getElementById('audioToggle');
    if (!this.toggleBtn) return;

    const textSpan = this.toggleBtn.querySelector('.audio-text');
    if (playing) {
      this.toggleBtn.classList.add('playing');
      if (textSpan) textSpan.textContent = 'Audio On 🔊';
    } else {
      this.toggleBtn.classList.remove('playing');
      if (textSpan) textSpan.textContent = 'Audio Off';
    }
  }

  playSonarPing() {
    if (!this.ctx) this.initAudioContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      const pingFilter = this.ctx.createBiquadFilter();

      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      pingOsc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.6);

      pingFilter.type = 'bandpass';
      pingFilter.frequency.value = 1000;
      pingFilter.Q.value = 5;

      pingGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      pingGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      pingOsc.connect(pingFilter);
      pingFilter.connect(pingGain);
      pingGain.connect(this.masterGain || this.ctx.destination);

      pingOsc.start();
      pingOsc.stop(this.ctx.currentTime + 0.85);
    } catch(e) {}
  }

  scheduleBubbles() {
    if (!this.isPlaying) return;

    this.triggerBubbleSound();
    const nextInterval = Math.random() * 2000 + 800;
    this.bubbleTimer = setTimeout(() => this.scheduleBubbles(), nextInterval);
  }

  triggerBubbleSound() {
    if (!this.isPlaying || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startFreq = 400 + Math.random() * 300;
      const endFreq = startFreq + 250;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.11);
    } catch(e) {}
  }
}

// Global Audio Engine Instance
window.abyssAudio = new AbyssAudioEngine();

// Play Sonar Ping on interactive clicks
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn, .nav-links a, .explore-btn, [data-magnetic]')) {
    if (window.abyssAudio) {
      window.abyssAudio.playSonarPing();
    }
  }
});
