import { ProfileManager } from '../profile/ProfileManager.js';
import { crewAvatar } from './VisualAssets.js';
import { missionLocale } from '../i18n/MissionLocale.js';

export class ProfileUI {
  constructor(profileManager) {
    this.profileManager = profileManager;
    this.selectedAvatarId = profileManager.profile?.avatarId ?? ProfileManager.avatars[0].id;
    this.elements = {
      modal: document.getElementById('profileModal'),
      modeModal: document.getElementById('modeModal'),
      form: document.getElementById('profileForm'),
      nameInput: document.getElementById('commanderNameInput'),
      avatars: document.getElementById('avatarOptions'),
      error: document.getElementById('profileError'),
      title: document.getElementById('profileModalTitle'),
      subtitle: document.getElementById('profileModalSubtitle'),
      hudName: document.getElementById('commanderHudName'),
      hudAvatar: document.getElementById('commanderHudAvatar'),
      modeProfile: document.getElementById('modeProfileSummary')
    };

    this.renderAvatarOptions();
    this.bindEvents();
    missionLocale.addEventListener('locale:changed', () => this.refreshLocale());
    this.start();
  }

  start() {
    if (this.profileManager.profile) {
      this.applyProfile(this.profileManager.profile);
      this.elements.modeModal.classList.add('visible');
    } else {
      this.open(false);
    }
  }

  bindEvents() {
    this.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        const profile = this.profileManager.save({
          name: this.elements.nameInput.value,
          avatarId: this.selectedAvatarId
        });
        this.applyProfile(profile);
        this.elements.error.textContent = '';
        this.elements.modal.classList.remove('visible');
        this.elements.modeModal.classList.add('visible');
      } catch (error) {
        this.elements.error.textContent = missionLocale.t(error.message);
      }
    });

    document.getElementById('btnEditProfile').addEventListener('click', () => this.open(true));
    document.getElementById('btnEditProfileFromMenu').addEventListener('click', () => {
      this.elements.modeModal.classList.remove('visible');
      this.open(true);
    });
  }

  renderAvatarOptions() {
    this.elements.avatars.replaceChildren();
    ProfileManager.avatars.forEach((avatar) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'avatar-option';
      button.dataset.avatarId = avatar.id;
      const portrait = document.createElement('span');
      portrait.appendChild(this.createAvatarNode(avatar));
      const label = document.createElement('strong');
      label.textContent = this.avatarLabel(avatar.id);
      button.append(portrait, label);
      button.addEventListener('click', () => this.selectAvatar(avatar.id));
      this.elements.avatars.appendChild(button);
    });
    this.selectAvatar(this.selectedAvatarId);
  }

  selectAvatar(avatarId) {
    this.selectedAvatarId = avatarId;
    this.elements.avatars.querySelectorAll('.avatar-option').forEach((button) => {
      const selected = button.dataset.avatarId === avatarId;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  open(editing) {
    this.editing = editing;
    const profile = this.profileManager.profile;
    this.elements.title.textContent = missionLocale.t(editing ? 'editProfileTitle' : 'profileTitle');
    this.elements.subtitle.textContent = missionLocale.t(editing ? 'editProfileSubtitle' : 'profileSubtitle');
    this.elements.nameInput.value = profile?.name ?? '';
    this.selectAvatar(profile?.avatarId ?? ProfileManager.avatars[0].id);
    this.elements.error.textContent = '';
    this.elements.modal.classList.add('visible');
    requestAnimationFrame(() => this.elements.nameInput.focus());
  }

  applyProfile(profile) {
    const avatar = this.profileManager.getAvatar(profile.avatarId);
    this.elements.hudName.textContent = profile.name;
    this.elements.hudAvatar.replaceChildren(this.createAvatarNode(avatar));
    const commanderName = document.createElement('span');
    commanderName.textContent = `${missionLocale.t('commander')} ${profile.name}`;
    this.elements.modeProfile.replaceChildren(this.createAvatarNode(avatar), commanderName);
  }

  createAvatarNode(avatar) {
    const label = this.avatarLabel(avatar.id);
    const parsed = new DOMParser().parseFromString(crewAvatar(avatar.id, label), 'image/svg+xml');
    if (parsed.documentElement.nodeName === 'parsererror') {
      const fallback = document.createElement('span');
      fallback.textContent = avatar.symbol;
      fallback.setAttribute('aria-label', label);
      return fallback;
    }
    return document.importNode(parsed.documentElement, true);
  }

  avatarLabel(id) {
    return missionLocale.t({ astronaut: 'avatarAstronaut', scientist: 'avatarScientist', engineer: 'avatarEngineer', commander: 'avatarCommander' }[id]);
  }

  refreshLocale() {
    const selected = this.selectedAvatarId;
    this.renderAvatarOptions();
    this.selectAvatar(selected);
    if (this.elements.modal.classList.contains('visible')) this.open(Boolean(this.editing));
    if (this.profileManager.profile) this.applyProfile(this.profileManager.profile);
  }
}
