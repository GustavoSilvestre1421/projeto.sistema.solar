import { safeStorage } from '../persistence/SafeStorage.js';

export class ExpeditionManager extends EventTarget {
  static storageKey = 'projeto-gaia:scientific-expedition:v1';
  static questionLimit = 10;
  static startingEnergy = 3;

  constructor({ missions, player, storage = safeStorage, random = Math.random }) {
    super();
    this.missions = missions;
    this.player = player;
    this.storage = storage;
    this.random = random;
    this.state = this.load();
  }

  get unlocked() { return this.player.completedMissionIds.size === this.missions.length; }
  get current() { return this.state.current; }
  get active() { return Boolean(this.current && !this.current.finished); }

  start() {
    if (!this.unlocked) return null;
    const pool = [];
    this.missions.forEach((mission, missionIndex) => mission.questions.forEach((question, questionIndex) => {
      pool.push({ missionIndex, questionIndex, size: (question.type === 'ordering' ? question.items : question.alternatives).length });
    }));
    this.shuffle(pool);
    const entries = pool.slice(0, ExpeditionManager.questionLimit).map(({ missionIndex, questionIndex, size }) => {
      const order = Array.from({ length: size }, (_, index) => index);
      this.shuffle(order);
      if (order.length > 1 && order.every((value, index) => value === index)) order.push(order.shift());
      return { missionIndex, questionIndex, order };
    });
    this.state.current = {
      entries, index: 0, energy: ExpeditionManager.startingEnergy,
      score: 0, correct: 0, combo: 0, maxCombo: 0, finished: false
    };
    this.persist();
    this.emit('expedition:started', { expedition: this.current });
    return this.current;
  }

  answer(response) {
    if (!this.unlocked || !this.active) return null;
    const expedition = this.current;
    const entry = expedition.entries[expedition.index];
    const question = this.missions[entry.missionIndex].questions[entry.questionIndex];
    const correct = question.type === 'ordering'
      ? Array.isArray(response) && response.length === question.correctOrder.length
        && response.every((value, index) => value === question.correctOrder[index])
      : response === question.correctAnswer;
    let points = 0;
    if (correct) {
      expedition.combo += 1;
      expedition.maxCombo = Math.max(expedition.maxCombo, expedition.combo);
      expedition.correct += 1;
      points = 100 + (expedition.combo - 1) * 25;
      expedition.score += points;
    } else {
      expedition.energy -= 1;
      expedition.combo = 0;
    }
    expedition.index += 1;
    const finished = expedition.energy <= 0 || expedition.index >= expedition.entries.length;
    if (finished) this.finish();
    else this.persist();
    const detail = { correct, points, finished, question, entry, expedition };
    this.emit('expedition:answered', detail);
    return detail;
  }

  finish() {
    const expedition = this.current;
    if (!expedition || expedition.finished) return;
    expedition.finished = true;
    this.state.runs += 1;
    this.state.bestScore = Math.max(this.state.bestScore, expedition.score);
    this.state.bestCorrect = Math.max(this.state.bestCorrect, expedition.correct);
    this.state.bestCombo = Math.max(this.state.bestCombo, expedition.maxCombo);
    this.persist();
  }

  getStats() {
    return {
      runs: this.state.runs,
      bestScore: this.state.bestScore,
      bestCorrect: this.state.bestCorrect,
      bestCombo: this.state.bestCombo
    };
  }

  load() {
    try {
      const value = JSON.parse(this.storage.getItem(ExpeditionManager.storageKey));
      if (value?.version !== 1) throw new Error('versão incompatível');
      return {
        version: 1,
        runs: Number(value.runs) || 0,
        bestScore: Number(value.bestScore) || 0,
        bestCorrect: Number(value.bestCorrect) || 0,
        bestCombo: Number(value.bestCombo) || 0,
        current: this.validCurrent(value.current) ? value.current : null
      };
    } catch {
      return { version: 1, runs: 0, bestScore: 0, bestCorrect: 0, bestCombo: 0, current: null };
    }
  }

  validCurrent(current) {
    return current && Array.isArray(current.entries) && current.entries.length === ExpeditionManager.questionLimit
      && Number.isInteger(current.index) && current.index >= 0 && current.index <= current.entries.length
      && Number.isFinite(current.energy) && Number.isFinite(current.score);
  }

  persist() {
    try { this.storage.setItem(ExpeditionManager.storageKey, JSON.stringify(this.state)); }
    catch { /* armazenamento indisponível */ }
  }

  shuffle(values) {
    for (let index = values.length - 1; index > 0; index -= 1) {
      const target = Math.floor(this.random() * (index + 1));
      [values[index], values[target]] = [values[target], values[index]];
    }
    return values;
  }

  emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }
}
