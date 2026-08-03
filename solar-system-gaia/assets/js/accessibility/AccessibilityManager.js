import { safeStorage } from '../persistence/SafeStorage.js';

export class AccessibilityManager {
  static storageKey = 'projeto-gaia:accessibility:v1';

  constructor() {
    this.settings = this.load();
    this.reduceMotion = document.getElementById('accessReduceMotion');
    this.highContrast = document.getElementById('accessHighContrast');
    this.reduceMotion.checked = this.settings.reduceMotion;
    this.highContrast.checked = this.settings.highContrast;
    this.apply();
    this.reduceMotion.addEventListener('change', () => this.update());
    this.highContrast.addEventListener('change', () => this.update());
    this.installModalFocusManagement();
  }

  load() {
    return { reduceMotion: false, highContrast: false, ...safeStorage.getJSON(AccessibilityManager.storageKey, {}) };
  }

  update() {
    this.settings = { reduceMotion: this.reduceMotion.checked, highContrast: this.highContrast.checked };
    safeStorage.setJSON(AccessibilityManager.storageKey, this.settings);
    this.apply();
  }

  apply() {
    document.body.classList.toggle('reduce-motion', this.settings.reduceMotion);
    document.body.classList.toggle('high-contrast', this.settings.highContrast);
  }

  installModalFocusManagement() {
    const modals = [...document.querySelectorAll('.game-modal')];
    const focusableSelector = 'button:not([disabled]):not([hidden]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    modals.forEach((modal) => {
      let previousFocus = null;
      new MutationObserver(() => {
        const opened = modal.classList.contains('visible');
        if (opened) {
          previousFocus = document.activeElement;
          requestAnimationFrame(() => modal.querySelector(focusableSelector)?.focus());
        } else if (previousFocus instanceof HTMLElement) {
          previousFocus.focus({ preventScroll: true });
        }
      }).observe(modal, { attributes: true, attributeFilter: ['class'] });

      modal.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const focusable = [...modal.querySelectorAll(focusableSelector)].filter((item) => item.getClientRects().length);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
    });
  }
}
