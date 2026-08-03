import { safeStorage } from '../persistence/SafeStorage.js';

export class SoundManager extends EventTarget {
  static storageKey = 'projeto-gaia:audio-settings:v1';

  constructor() {
    super();
    const saved = this.load();
    this.muted = saved.muted ?? false;
    this.volume = saved.volume ?? 0.45;
    this.context = null;
    this.master = null;
    this.ambientNodes = null;
    document.addEventListener('pointerdown', () => this.unlock(), { once: true, passive: true });
    document.addEventListener('visibilitychange', () => this.handleVisibility());
    window.addEventListener('pagehide', () => this.suspend());
    window.addEventListener('pageshow', () => {
      if (!this.muted && this.context) this.unlock();
    });
  }

  load() {
    return safeStorage.getJSON(SoundManager.storageKey, {});
  }

  save() {
    return safeStorage.setJSON(SoundManager.storageKey, { muted: this.muted, volume: this.volume });
  }

  async unlock() {
    if (!this.context || this.context.state === 'closed') {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) return false;
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') await this.context.resume();
    if (!this.muted) this.startAmbient();
    return true;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    this.save();
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.context.currentTime, 0.03);
    }
    if (this.muted) this.stopAmbient();
    else this.unlock();
    this.dispatchEvent(new CustomEvent('audio:changed', { detail: this.settings }));
  }

  setVolume(value) {
    this.volume = Math.min(1, Math.max(0, Number(value)));
    this.save();
    if (this.master && this.context && !this.muted) {
      this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.03);
    }
    this.dispatchEvent(new CustomEvent('audio:changed', { detail: this.settings }));
  }

  get settings() {
    return { muted: this.muted, volume: this.volume };
  }

  startAmbient() {
    if (!this.context || !this.master || this.ambientNodes || this.muted) return;
    const ambientGain = this.context.createGain();
    ambientGain.gain.value = 0.018;
    ambientGain.connect(this.master);
    const oscillators = [55, 82.5].map((frequency, index) => {
      const oscillator = this.context.createOscillator();
      oscillator.type = index ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index ? -7 : 0;
      oscillator.connect(ambientGain);
      oscillator.start();
      return oscillator;
    });
    this.ambientNodes = { oscillators, gain: ambientGain };
  }

  stopAmbient() {
    if (!this.ambientNodes) return;
    this.ambientNodes.oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* já finalizado */ }
      oscillator.disconnect();
    });
    this.ambientNodes.gain.disconnect();
    this.ambientNodes = null;
  }

  async suspend() {
    this.stopAmbient();
    if (this.context?.state === 'running') {
      try { await this.context.suspend(); } catch { /* encerramento da página */ }
    }
  }

  handleVisibility() {
    if (document.hidden) this.suspend();
    else if (!this.muted) this.unlock();
  }

  async tone(frequency, duration = 0.12, { type = 'sine', gain = 0.09, delay = 0 } = {}) {
    if (this.muted || !(await this.unlock())) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(this.master);
    oscillator.addEventListener('ended', () => {
      oscillator.disconnect();
      envelope.disconnect();
    }, { once: true });
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  communication() { this.tone(620, .08, { gain: .06 }); this.tone(880, .1, { gain: .05, delay: .1 }); }
  countdown() { this.tone(440, .12, { type: 'square', gain: .045 }); }
  liftoff() { this.tone(110, .7, { type: 'sawtooth', gain: .075 }); this.tone(220, .55, { gain: .05, delay: .12 }); }
  scanner() { [420, 560, 710].forEach((f, i) => this.tone(f, .1, { gain: .04, delay: i * .16 })); }
  success() { [523, 659, 784].forEach((f, i) => this.tone(f, .22, { gain: .055, delay: i * .1 })); }
  error() { this.tone(180, .22, { type: 'square', gain: .04 }); }
  complete() { [392, 523, 659, 784].forEach((f, i) => this.tone(f, .3, { gain: .06, delay: i * .13 })); }
}
