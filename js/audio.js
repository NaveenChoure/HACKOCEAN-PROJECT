/* ============================================================
   ABYSS â€” Web Audio Ambient Soundscape Generator
   Procedural Deep Ocean Hydro-Acoustic Synthesizer
   ============================================================ */

class AbyssAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.pinkNoiseNode = null;
    this.subOsc = null;
    this.bubbleTimer = null;

    this.toggleBtn = document.getElementById('audioToggle');
    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleSound());
    }
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
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

    if (this.toggleBtn) {
      this.toggleBtn.classList.add('playing');
      const textSpan = this.toggleBtn.querySelector('.audio-text');
      if (textSpan) textSpan.textContent = 'Audio On';
    }

    // Fade master gain up
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 2);

    // 1. Deep Sub Bass Drone (Low Ocean Rumble)
    this.subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    // Sub LFO for gentle swell
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.1; // 10s cycle
    lfoGain.gain.value = 8;
    lfo.connect(this.subOsc.frequency);
    lfo.start();

    subFilter.type = 'lowpass';
    subFilter.frequency.value = 120;

    subGain.gain.value = 0.5;

    this.subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.masterGain);
    this.subOsc.start();

    // 2. Ambient Ocean Waves / Hydro Filtered Noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    this.pinkNoiseNode = this.ctx.createBufferSource();
    this.pinkNoiseNode.buffer = noiseBuffer;
    this.pinkNoiseNode.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 350;
    noiseFilter.Q.value = 1.2;

    // Filter modulation for gentle current swell
    const noiseLfo = this.ctx.createOscillator();
    const noiseLfoGain = this.ctx.createGain();
    noiseLfo.frequency.value = 0.15;
    noiseLfoGain.gain.value = 150;
    noiseLfo.connect(noiseFilter.frequency);
    noiseLfo.start();

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.4;

    this.pinkNoiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this.pinkNoiseNode.start();

    // 3. Random Hydroacoustic Bubble Pops
    this.scheduleBubbles();
  }

  triggerBubbleSound() {
    if (!this.isPlaying || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = 300 + Math.random() * 400;
    const endFreq = startFreq + 200 + Math.random() * 300;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  scheduleBubbles() {
    if (!this.isPlaying) return;

    this.triggerBubbleSound();
    const nextInterval = Math.random() * 1500 + 500;
    this.bubbleTimer = setTimeout(() => this.scheduleBubbles(), nextInterval);
  }

  stop() {
    this.isPlaying = false;

    if (this.toggleBtn) {
      this.toggleBtn.classList.remove('playing');
      const textSpan = this.toggleBtn.querySelector('.audio-text');
      if (textSpan) textSpan.textContent = 'Audio Off';
    }

    if (this.bubbleTimer) clearTimeout(this.bubbleTimer);

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.subOsc) {
          try { this.subOsc.stop(); } catch(e){}
        }
        if (this.pinkNoiseNode) {
          try { this.pinkNoiseNode.stop(); } catch(e){}
        }
      }, 1000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.abyssAudio = new AbyssAudioEngine();
});
