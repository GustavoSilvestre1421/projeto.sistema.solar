import { safeStorage } from '../persistence/SafeStorage.js';

export class ProfileManager extends EventTarget {
  static storageKey = 'projeto-gaia:commander-profile:v1';

  static avatars = Object.freeze([
    { id: 'astronaut', symbol: '🧑‍🚀', label: 'Astronauta' },
    { id: 'scientist', symbol: '👩‍🔬', label: 'Pesquisadora' },
    { id: 'engineer', symbol: '🧑‍🔧', label: 'Engenheiro' },
    { id: 'commander', symbol: '👩‍🚀', label: 'Comandante' }
  ]);

  constructor() {
    super();
    this.profile = this.load();
  }

  load() {
    const profile = safeStorage.getJSON(ProfileManager.storageKey);
    return this.isValid(profile) ? profile : null;
  }

  save({ name, avatarId }) {
    const profile = { name: name.trim(), avatarId };
    if (!this.isValid(profile)) throw new Error('profileValidation');
    if (!safeStorage.setJSON(ProfileManager.storageKey, profile)) {
      throw new Error('profileSaveFailure');
    }
    this.profile = profile;
    this.dispatchEvent(new CustomEvent('profile:changed', { detail: { profile } }));
    return profile;
  }

  getAvatar(avatarId = this.profile?.avatarId) {
    return ProfileManager.avatars.find((avatar) => avatar.id === avatarId) ?? ProfileManager.avatars[0];
  }

  isValid(profile) {
    const validName = typeof profile?.name === 'string'
      && profile.name.trim().length >= 2
      && profile.name.trim().length <= 20;
    const validAvatar = ProfileManager.avatars.some((avatar) => avatar.id === profile?.avatarId);
    return validName && validAvatar;
  }
}
