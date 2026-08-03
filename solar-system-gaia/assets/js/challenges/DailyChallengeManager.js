import { safeStorage } from '../persistence/SafeStorage.js';

export class DailyChallengeManager extends EventTarget {
  static storageKey = 'projeto-gaia:daily-challenge:v1';

  constructor({ missions, player, storage = safeStorage, now = () => new Date() }) {
    super();
    this.missions = missions;
    this.player = player;
    this.storage = storage;
    this.now = now;
    this.state = this.load();
  }

  get unlocked() { return this.player.completedMissionIds.size === this.missions.length; }
  get todayKey() { return DailyChallengeManager.dateKey(this.now()); }

  getToday() {
    const key = this.todayKey;
    const entries = this.createEntries(key);
    const stored = this.state.history[key] ?? {};
    const answers = Array.isArray(stored.answers) ? stored.answers.slice(0, entries.length) : [];
    const completed = answers.length === entries.length && Boolean(stored.completed);
    return { key, entries, ...stored, answers, completed, currentIndex: answers.length };
  }

  answer(response) {
    if (!this.unlocked) return null;
    const today = this.getToday();
    if (today.completed || today.currentIndex >= today.entries.length) return null;
    const entry = today.entries[today.currentIndex];
    const question = this.missions[entry.missionIndex].questions[entry.questionIndex];
    const correct = question.type === 'ordering'
      ? Array.isArray(response) && response.length === question.correctOrder.length
        && response.every((value, index) => value === question.correctOrder[index])
      : response === question.correctAnswer;
    const record = this.state.history[today.key] ?? { answers: [], completed: false };
    record.answers.push({ correct, response });
    if (record.answers.length === today.entries.length) {
      record.completed = true;
      record.score = record.answers.filter((answer) => answer.correct).length;
    }
    this.state.history[today.key] = record;
    this.persist();
    this.dispatchEvent(new CustomEvent('challenge:answered', { detail: { correct, question, entry, record } }));
    return { correct, question, entry, completed: record.completed, score: record.score ?? null };
  }

  getStats() {
    const completed = Object.entries(this.state.history)
      .filter(([, value]) => value.completed)
      .sort(([a], [b]) => a.localeCompare(b));
    const completedKeys = new Set(completed.map(([key]) => key));
    let streak = 0;
    let cursor = new Date(`${this.todayKey}T12:00:00`);
    if (!completedKeys.has(this.todayKey)) cursor.setDate(cursor.getDate() - 1);
    while (completedKeys.has(DailyChallengeManager.dateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    let bestStreak = 0;
    let run = 0;
    let previous = null;
    completed.forEach(([key]) => {
      const current = new Date(`${key}T12:00:00`);
      run = previous && Math.round((current - previous) / 86400000) === 1 ? run + 1 : 1;
      bestStreak = Math.max(bestStreak, run);
      previous = current;
    });
    return {
      days: completed.length,
      perfectDays: completed.filter(([, value]) => value.score === 3).length,
      streak,
      bestStreak
    };
  }

  createEntries(key) {
    const pool = [];
    this.missions.forEach((mission, missionIndex) => mission.questions.forEach((_, questionIndex) => {
      pool.push({ missionIndex, questionIndex });
    }));
    const random = DailyChallengeManager.random(DailyChallengeManager.hash(key));
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [pool[index], pool[target]] = [pool[target], pool[index]];
    }
    return pool.slice(0, 3).map((entry, entryIndex) => {
      const question = this.missions[entry.missionIndex].questions[entry.questionIndex];
      const values = question.type === 'ordering' ? question.items : question.alternatives;
      const order = values.map((_, index) => index);
      for (let index = order.length - 1; index > 0; index -= 1) {
        const target = Math.floor(random() * (index + 1));
        [order[index], order[target]] = [order[target], order[index]];
      }
      if (order.length > 1 && order.every((value, index) => value === index)) order.push(order.shift());
      return { ...entry, entryIndex, order };
    });
  }

  load() {
    try {
      const parsed = JSON.parse(this.storage.getItem(DailyChallengeManager.storageKey));
      return parsed?.version === 1 && parsed.history ? parsed : { version: 1, history: {} };
    } catch { return { version: 1, history: {} }; }
  }

  persist() {
    try { this.storage.setItem(DailyChallengeManager.storageKey, JSON.stringify(this.state)); }
    catch { /* armazenamento privado ou indisponível */ }
  }

  static dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static hash(text) {
    let value = 2166136261;
    for (const character of text) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
    return value >>> 0;
  }

  static random(seed) {
    return () => {
      seed = Math.imul(1664525, seed) + 1013904223 >>> 0;
      return seed / 4294967296;
    };
  }
}
