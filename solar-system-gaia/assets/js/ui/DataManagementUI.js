import { safeStorage } from '../persistence/SafeStorage.js';
import { missionLocale } from '../i18n/MissionLocale.js';

export class DataManagementUI {
  constructor() {
    this.elements = {
      mode: document.getElementById('modeModal'),
      modal: document.getElementById('eraseDataModal'),
      open: document.getElementById('btnEraseGaiaData'),
      cancel: document.getElementById('btnCancelEraseData'),
      confirm: document.getElementById('btnConfirmEraseData'),
      error: document.getElementById('eraseDataError')
    };
    this.elements.open.addEventListener('click', () => this.open());
    this.elements.cancel.addEventListener('click', () => this.close());
    this.elements.confirm.addEventListener('click', () => this.erase());
  }

  open() {
    this.elements.error.textContent = '';
    this.elements.mode.classList.remove('visible');
    this.elements.modal.classList.add('visible');
  }

  close() {
    this.elements.modal.classList.remove('visible');
    this.elements.mode.classList.add('visible');
  }

  erase() {
    this.elements.confirm.disabled = true;
    const result = safeStorage.removeProjectData();
    if (result.success) {
      window.location.reload();
      return;
    }
    this.elements.confirm.disabled = false;
    this.elements.error.textContent = missionLocale.t('eraseDataFailure');
  }
}
