import { XPSystem } from './XPSystem.js';

export class Player {
  constructor(savedState = {}) {
    this.xp = Number.isFinite(savedState.xp) ? savedState.xp : 0;
    this.completedMissionIds = new Set(savedState.completedMissionIds ?? []);
    this.discoveredMissionIds = new Set(savedState.discoveredMissionIds ?? []);
    this.rewardTokens = new Set(savedState.rewardTokens ?? []);
    this.totalAttempts = Number.isFinite(savedState.totalAttempts) ? savedState.totalAttempts : 0;
    this.correctAnswers = Number.isFinite(savedState.correctAnswers) ? savedState.correctAnswers : 0;
    this.missionObservations = new Map(
      Object.entries(savedState.missionObservations ?? {}).map(([missionId, bodies]) => [missionId, new Set(bodies)])
    );
    this.missionQuestionIndexes = new Map(
      Object.entries(savedState.missionQuestionIndexes ?? {}).map(([missionId, index]) => [missionId, Number(index) || 0])
    );
    this.questionAttempts = new Map(
      Object.entries(savedState.questionAttempts ?? {}).map(([token, attempts]) => [token, Number(attempts) || 0])
    );
    this.questionOrders = new Map(
      Object.entries(savedState.questionOrders ?? {}).map(([token, order]) => [token, Array.isArray(order) ? [...order] : []])
    );
    this.questionStartedMissionIds = new Set(savedState.questionStartedMissionIds ?? []);
    this.missionStars = new Map(
      Object.entries(savedState.missionStars ?? {}).map(([missionId, stars]) => [missionId, Math.min(3, Math.max(1, Number(stars) || 1))])
    );
    this.missionStages = new Map(
      Object.entries(savedState.missionStages ?? {}).map(([missionId, stage]) => [missionId, String(stage)])
    );
    this.pendingCompletionMissionId = typeof savedState.pendingCompletionMissionId === 'string'
      ? savedState.pendingCompletionMissionId : '';
  }

  get level() {
    return XPSystem.getLevel(this.xp).name;
  }

  awardXP(amount, token) {
    if (this.rewardTokens.has(token)) return 0;
    this.rewardTokens.add(token);
    this.xp += amount;
    return amount;
  }

  resetProgress() {
    this.xp = 0;
    this.completedMissionIds.clear();
    this.discoveredMissionIds.clear();
    this.rewardTokens.clear();
    this.totalAttempts = 0;
    this.correctAnswers = 0;
    this.missionObservations.clear();
    this.missionQuestionIndexes.clear();
    this.questionAttempts.clear();
    this.questionOrders.clear();
    this.questionStartedMissionIds.clear();
    this.missionStars.clear();
    this.missionStages.clear();
    this.pendingCompletionMissionId = '';
  }

  recordAnswer(correct) {
    this.totalAttempts += 1;
    if (correct) this.correctAnswers += 1;
  }

  observeBody(missionId, bodyName) {
    if (!this.missionObservations.has(missionId)) this.missionObservations.set(missionId, new Set());
    this.missionObservations.get(missionId).add(bodyName);
  }

  getObservedBodies(missionId) {
    return this.missionObservations.get(missionId) ?? new Set();
  }

  getQuestionIndex(missionId) {
    return this.missionQuestionIndexes.get(missionId) ?? 0;
  }

  setQuestionIndex(missionId, index) {
    this.missionQuestionIndexes.set(missionId, Math.max(0, Number(index) || 0));
  }

  recordQuestionAttempt(missionId, questionIndex) {
    const token = `${missionId}:${questionIndex}`;
    const attempts = (this.questionAttempts.get(token) ?? 0) + 1;
    this.questionAttempts.set(token, attempts);
    return attempts;
  }

  getQuestionAttempts(missionId, questionIndex) {
    return this.questionAttempts.get(`${missionId}:${questionIndex}`) ?? 0;
  }

  calculateMissionStars(mission) {
    const attempts = mission.questions.reduce((total, _, index) => total + this.getQuestionAttempts(mission.id, index), 0);
    const errors = Math.max(0, attempts - mission.questions.length);
    return errors === 0 ? 3 : errors <= 2 ? 2 : 1;
  }

  setMissionStars(missionId, stars) {
    this.missionStars.set(missionId, Math.min(3, Math.max(1, stars)));
  }

  getMissionStars(missionId) {
    return this.missionStars.get(missionId) ?? 0;
  }

  setMissionStage(missionId, stage) {
    if (stage) this.missionStages.set(missionId, stage);
    else this.missionStages.delete(missionId);
  }

  getMissionStage(missionId) {
    return this.missionStages.get(missionId) ?? '';
  }

  getQuestionOrder(missionId, questionIndex, alternativeCount) {
    const token = `${missionId}:${questionIndex}`;
    const saved = this.questionOrders.get(token);
    const valid = saved?.length === alternativeCount
      && new Set(saved).size === alternativeCount
      && saved.every((index) => Number.isInteger(index) && index >= 0 && index < alternativeCount);
    if (valid) return [...saved];

    const order = Array.from({ length: alternativeCount }, (_, index) => index);
    for (let index = order.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }
    if (alternativeCount > 1 && order.every((value, index) => value === index)) order.push(order.shift());
    this.questionOrders.set(token, order);
    return [...order];
  }

  setQuestionOrder(missionId, questionIndex, order) {
    this.questionOrders.set(`${missionId}:${questionIndex}`, [...order]);
  }

  serialize() {
    return {
      xp: this.xp,
      completedMissionIds: [...this.completedMissionIds],
      discoveredMissionIds: [...this.discoveredMissionIds],
      rewardTokens: [...this.rewardTokens],
      totalAttempts: this.totalAttempts,
      correctAnswers: this.correctAnswers,
      missionObservations: Object.fromEntries(
        [...this.missionObservations].map(([missionId, bodies]) => [missionId, [...bodies]])
      ),
      missionQuestionIndexes: Object.fromEntries(this.missionQuestionIndexes),
      questionAttempts: Object.fromEntries(this.questionAttempts),
      questionOrders: Object.fromEntries(this.questionOrders),
      questionStartedMissionIds: [...this.questionStartedMissionIds],
      missionStars: Object.fromEntries(this.missionStars),
      missionStages: Object.fromEntries(this.missionStages),
      pendingCompletionMissionId: this.pendingCompletionMissionId
    };
  }
}
