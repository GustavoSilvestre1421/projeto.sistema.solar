export const PROJECT_STORAGE_KEYS = Object.freeze([
  'projeto-gaia:mission-progress:v1',
  'projeto-gaia:commander-profile:v1',
  'projeto-gaia:accessibility:v1',
  'projeto-gaia:audio-settings:v1',
  'projeto-gaia:language:v1',
  'projeto-gaia:tutorial:v1',
  'projeto-gaia:intro-preference:v1',
  'projeto-gaia:daily-challenge:v1',
  'projeto-gaia:scientific-expedition:v1',
  'projeto-gaia:graphics-quality:v1'
]);

export class SafeStorage extends EventTarget {
  constructor(storageProvider = () => globalThis.localStorage) {
    super();
    this.storageProvider = storageProvider;
    this.lastError = null;
  }

  getItem(key, fallback = null) {
    try {
      const value = this.storageProvider().getItem(key);
      return value ?? fallback;
    } catch (error) {
      this.report(error, 'read', key);
      return fallback;
    }
  }

  getJSON(key, fallback = null) {
    const raw = this.getItem(key);
    if (raw === null) return fallback;
    try { return JSON.parse(raw); }
    catch (error) {
      this.report(error, 'parse', key);
      return fallback;
    }
  }

  setItem(key, value) {
    try {
      this.storageProvider().setItem(key, String(value));
      return true;
    } catch (error) {
      this.report(error, 'write', key);
      return false;
    }
  }

  setJSON(key, value) {
    try { return this.setItem(key, JSON.stringify(value)); }
    catch (error) {
      this.report(error, 'serialize', key);
      return false;
    }
  }

  removeItem(key) {
    try {
      this.storageProvider().removeItem(key);
      return true;
    } catch (error) {
      this.report(error, 'remove', key);
      return false;
    }
  }

  removeProjectData() {
    const failed = PROJECT_STORAGE_KEYS.filter((key) => !this.removeItem(key));
    return { success: failed.length === 0, failed };
  }

  report(error, operation, key) {
    this.lastError = error;
    console.warn(`Armazenamento indisponível durante ${operation} em ${key}.`, error);
    this.dispatchEvent(new CustomEvent('storage:error', { detail: { error, operation, key } }));
  }
}

export const safeStorage = new SafeStorage();
