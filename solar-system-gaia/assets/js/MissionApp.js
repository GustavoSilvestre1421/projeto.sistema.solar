import { simulatorBridge } from './core/SimulatorBridge.js';
import { MissionManager } from './missions/MissionManager.js';
import { SaveManager } from './persistence/SaveManager.js';
import { MissionUI } from './ui/MissionUI.js';
import { ProfileManager } from './profile/ProfileManager.js';
import { ProfileUI } from './ui/ProfileUI.js';
import { TutorialUI } from './ui/TutorialUI.js';
import { RocketAnimation } from './effects/RocketAnimation.js';
import { JournalUI } from './ui/JournalUI.js';
import { SoundManager } from './audio/SoundManager.js';
import { AccessibilityManager } from './accessibility/AccessibilityManager.js';
import { missionLocale } from './i18n/MissionLocale.js';
import { DailyChallengeManager } from './challenges/DailyChallengeManager.js';
import { DailyChallengeUI } from './ui/DailyChallengeUI.js';
import { ExpeditionManager } from './challenges/ExpeditionManager.js';
import { ExpeditionUI } from './ui/ExpeditionUI.js';
import { DataManagementUI } from './ui/DataManagementUI.js';

export async function initializeMissionMode() {
  missionLocale.setLanguage(document.getElementById('langSelect').value);
  new AccessibilityManager();
  new DataManagementUI();
  const loadJSON = async (path, fallback = null) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      if (fallback !== null) { console.warn(`Pacote opcional indisponível: ${path}`, error); return fallback; }
      throw error;
    }
  };
  const [missions, englishPack, spanishPack, questionFormats, scientificSources] = await Promise.all([
    loadJSON('assets/data/missions.json'), loadJSON('assets/data/missions.en.json', {}), loadJSON('assets/data/missions.es.json', {}),
    loadJSON('assets/data/question-formats.json', { pt: {}, en: {}, es: {} }),
    loadJSON('assets/data/scientific-sources.json')
  ]);
  const localizeFormats = (translation, formats = {}) => translation ? {
    ...translation,
    questions: translation.questions?.map((question, index) => ({ ...question, ...(formats[index] ?? {}) }))
  } : translation;
  missions.forEach((mission) => {
    mission.sources = scientificSources.missions?.[mission.id] ?? [];
    mission.scientificReviewDate = scientificSources.reviewedAt;
    mission.questionFormats = questionFormats.pt?.[mission.id] ?? {};
    mission.translations = {
      en: localizeFormats(englishPack[mission.id], questionFormats.en?.[mission.id]),
      es: localizeFormats(spanishPack[mission.id], questionFormats.es?.[mission.id])
    };
  });
  const saveManager = new SaveManager();
  const soundManager = new SoundManager();
  const rocketAnimation = new RocketAnimation(document.getElementById('rocketFlight'), soundManager);
  const manager = new MissionManager({
    missions,
    savedState: saveManager.load(),
    saveManager,
    bridge: simulatorBridge
  });

  const missionUI = new MissionUI(manager, rocketAnimation, soundManager);
  saveManager.addEventListener('save:error', () => missionUI.showToast(missionLocale.t('saveError')));
  const profileManager = new ProfileManager();
  new ProfileUI(profileManager);
  new TutorialUI(profileManager);
  new JournalUI({
    manager,
    profileManager,
    rocketAnimation,
    soundManager,
    openDossier: (mission) => missionUI.openDossier(mission, 'journal')
  });
  const dailyChallenge = new DailyChallengeManager({ missions: manager.missions, player: manager.player });
  new DailyChallengeUI({ challenge: dailyChallenge, soundManager });
  const expedition = new ExpeditionManager({ missions: manager.missions, player: manager.player });
  new ExpeditionUI({ expedition, soundManager });
  manager.addEventListener('progress:changed', () => document.dispatchEvent(new CustomEvent('challenge:availability-changed')));
  return manager;
}
