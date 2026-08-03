import { safeStorage } from './SafeStorage.js';

export class SaveManager extends EventTarget {
  static storageKey = 'projeto-gaia:mission-progress:v1';

  load() {
    const saved = safeStorage.getJSON(SaveManager.storageKey, {});
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    const arrays = ['completedMissionIds', 'discoveredMissionIds', 'rewardTokens', 'questionStartedMissionIds'];
    const records = ['missionObservations', 'missionQuestionIndexes', 'questionAttempts', 'questionOrders', 'missionStars', 'missionStages'];
    const sanitized = { ...saved };
    arrays.forEach((field) => { if (!Array.isArray(sanitized[field])) sanitized[field] = []; });
    records.forEach((field) => {
      if (!sanitized[field] || typeof sanitized[field] !== 'object' || Array.isArray(sanitized[field])) sanitized[field] = {};
    });
    for (const [missionId, bodies] of Object.entries(sanitized.missionObservations)) {
      if (!Array.isArray(bodies)) delete sanitized.missionObservations[missionId];
    }
    for (const [token, order] of Object.entries(sanitized.questionOrders)) {
      if (!Array.isArray(order)) delete sanitized.questionOrders[token];
    }
    if (typeof sanitized.pendingCompletionMissionId !== 'string') sanitized.pendingCompletionMissionId = '';
    return sanitized;
  }

  save(player) {
    try {
      const saved = safeStorage.setJSON(SaveManager.storageKey, { version: 5, ...player.serialize() });
      if (!saved) throw safeStorage.lastError ?? new Error('Armazenamento indisponível');
      this.lastError = null;
      return true;
    } catch (error) {
      this.lastError = error;
      console.error('O progresso atual não pôde ser salvo.', error);
      this.dispatchEvent(new CustomEvent('save:error', { detail: { error } }));
      return false;
    }
  }
}
