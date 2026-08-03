import { safeStorage } from '../persistence/SafeStorage.js';
import { missionLocale } from '../i18n/MissionLocale.js';

export class BootUI {
  static storageKey = 'projeto-gaia:intro-preference:v1';

  constructor() {
    this.startedAt = performance.now();
    this.skipPreference = safeStorage.getItem(BootUI.storageKey) === 'skip';
    this.elements = {
      overlay: document.getElementById('bootScreen'),
      bar: document.getElementById('bootProgressBar'),
      percent: document.getElementById('bootPercent'),
      status: document.getElementById('bootStatus'),
      enter: document.getElementById('btnEnterGaia'),
      skip: document.getElementById('skipIntroPreference')
    };
    this.elements.skip.checked = this.skipPreference;
    this.elements.enter.addEventListener('click', () => this.dismiss());
    this.elements.skip.addEventListener('change', () => {
      if (this.elements.skip.checked) safeStorage.setItem(BootUI.storageKey, 'skip');
      else safeStorage.removeItem(BootUI.storageKey);
    });
    this.setProgress(8, missionLocale.t('bootCore'));
  }

  setProgress(percent, status) {
    const value = Math.max(0, Math.min(100, percent));
    this.elements.bar.style.width = `${value}%`;
    this.elements.percent.textContent = `${Math.round(value)}%`;
    if (status) this.elements.status.textContent = status;
  }

  async ready() {
    this.setProgress(100, missionLocale.t('bootReady'));
    const reducedMotion = document.body.classList.contains('reduce-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimum = this.skipPreference || reducedMotion ? 180 : 1300;
    const remaining = Math.max(0, minimum - (performance.now() - this.startedAt));
    await new Promise((resolve) => setTimeout(resolve, remaining));
    if (this.skipPreference) this.dismiss();
    else {
      this.elements.enter.hidden = false;
      this.elements.enter.focus();
      this.elements.overlay.classList.add('ready');
    }
  }

  dismiss() {
    if (this.elements.overlay.hidden) return;
    this.elements.overlay.classList.add('leaving');
    const delay = document.body.classList.contains('reduce-motion') ? 0 : 520;
    setTimeout(() => { this.elements.overlay.hidden = true; }, delay);
  }
}
