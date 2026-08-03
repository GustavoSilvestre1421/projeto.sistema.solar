import { Mission } from './Mission.js';
import { Player } from '../player/Player.js';
import { CampaignProgress } from './CampaignProgress.js';

export class MissionManager extends EventTarget {
  constructor({ missions, savedState, saveManager, bridge }) {
    super();
    this.missions = missions.map((data) => new Mission(data)).sort((a, b) => a.order - b.order);
    this.player = new Player(savedState);
    this.migrateProgression();
    this.saveManager = saveManager;
    this.bridge = bridge;
    this.mode = 'exploration';
    this.awaitingAdvance = false;
    this.currentQuestionIndex = 0;
    this.answerLockedUntil = 0;

    this.bridge.addEventListener('body:selected', (event) => {
      this.handleBodySelected(event.detail);
    });
  }

  get currentMission() {
    return this.missions.find((mission) => !this.player.completedMissionIds.has(mission.id)) ?? null;
  }

  get currentMissionNumber() {
    const mission = this.currentMission;
    return mission ? this.missions.indexOf(mission) + 1 : this.missions.length;
  }

  get currentQuestion() {
    return this.currentMission?.questions[this.currentQuestionIndex] ?? null;
  }

  get currentChapter() {
    return CampaignProgress.getChapter(this.currentMission?.order ?? this.missions.at(-1).order);
  }

  getCurrentQuestionOrder() {
    const mission = this.currentMission;
    const question = this.currentQuestion;
    if (!mission || !question) return [];
    const itemCount = question.type === 'ordering' ? question.items.length : question.alternatives.length;
    const order = this.player.getQuestionOrder(mission.id, this.currentQuestionIndex, itemCount);
    this.persist(false);
    return order;
  }

  setCurrentQuestionOrder(order) {
    const mission = this.currentMission;
    if (!mission || !Array.isArray(order)) return;
    this.player.setQuestionOrder(mission.id, this.currentQuestionIndex, order);
    this.persist(false);
  }

  markQuestionsStarted() {
    const mission = this.currentMission;
    if (!mission) return;
    this.player.questionStartedMissionIds.add(mission.id);
    this.player.setMissionStage(mission.id, 'questions');
    this.player.setQuestionIndex(mission.id, this.currentQuestionIndex);
    this.persist(false);
  }

  startExploration() {
    const mission = this.currentMission;
    if (!mission) return;
    this.player.setMissionStage(mission.id, 'exploring');
    this.persist(false);
  }

  markAnalysisReady() {
    const mission = this.currentMission;
    if (!mission) return;
    this.player.setMissionStage(mission.id, 'analysis-ready');
    this.persist(false);
  }

  setMode(mode) {
    if (!['exploration', 'mission'].includes(mode)) return;
    this.mode = mode;
    this.emit('mode:changed', { mode });
    if (mode === 'mission') this.emitCurrentState();
  }

  handleBodySelected({ bodyName, position }) {
    if (this.mode !== 'mission' || this.awaitingAdvance) return;
    const mission = this.currentMission;
    if (!mission) return;

    if (mission.parentBody && bodyName === mission.parentBody) {
      this.emit('target:host-selected', { mission, bodyName });
      return;
    }

    if (!mission.targetBodies.includes(bodyName)) {
      this.emit('target:incorrect', { bodyName, mission });
      return;
    }

    const alreadyObserved = this.player.getObservedBodies(mission.id).has(bodyName);
    if (alreadyObserved) {
      this.emit('target:duplicate', { mission, bodyName });
      return;
    }
    this.player.observeBody(mission.id, bodyName);
    const observed = this.player.getObservedBodies(mission.id);
    const remainingBodies = mission.targetBodies.filter((target) => !observed.has(target));
    this.persist();
    if (remainingBodies.length > 0) {
      this.emit('target:progress', {
        mission,
        bodyName,
        observed: observed.size,
        total: mission.targetBodies.length,
        remainingBodies
      });
      return;
    }

    const reward = this.player.awardXP(mission.xp.discovery, `discovery:${mission.id}`);
    this.player.discoveredMissionIds.add(mission.id);
    this.player.setMissionStage(mission.id, 'launch-ready');
    this.persist();
    this.emit('target:found', { mission, reward, player: this.player, position });
  }

  answer(response) {
    const mission = this.currentMission;
    const question = this.currentQuestion;
    if (!mission || !this.player.discoveredMissionIds.has(mission.id) || this.awaitingAdvance || Date.now() < this.answerLockedUntil) return;

    const correct = question.type === 'ordering'
      ? Array.isArray(response) && response.length === question.correctOrder.length && response.every((value, index) => value === question.correctOrder[index])
      : response === question.correctAnswer;
    if (!correct) {
      this.player.recordAnswer(false);
      const attemptCount = this.player.recordQuestionAttempt(mission.id, this.currentQuestionIndex);
      this.answerLockedUntil = Date.now() + 900;
      this.persist();
      this.emit('answer:incorrect', { mission, question, alternativeIndex: response, attemptCount, retryDelay: 900 });
      return;
    }

    this.player.recordAnswer(true);
    const attemptCount = this.player.recordQuestionAttempt(mission.id, this.currentQuestionIndex);
    const questionReward = mission.xp.correctAnswer / mission.questions.length;
    const reward = this.player.awardXP(questionReward, `answer:${mission.id}:${this.currentQuestionIndex}`);
    if (this.currentQuestionIndex < mission.questions.length - 1) {
      const answeredQuestion = question;
      this.currentQuestionIndex += 1;
      this.player.setQuestionIndex(mission.id, this.currentQuestionIndex);
      this.persist();
      this.emit('question:correct', {
        mission,
        reward,
        questionIndex: this.currentQuestionIndex,
        question: this.currentQuestion,
        answeredQuestion,
        attemptCount,
        player: this.player
      });
      return;
    }

    this.player.completedMissionIds.add(mission.id);
    this.player.setMissionStage(mission.id, 'completed');
    const stars = this.player.calculateMissionStars(mission);
    this.player.setMissionStars(mission.id, stars);
    this.player.setQuestionIndex(mission.id, mission.questions.length);
    this.player.pendingCompletionMissionId = mission.id;
    this.awaitingAdvance = true;
    this.persist();
    this.emit('answer:correct', {
      mission, question, reward, attemptCount, stars,
      chapterCompleted: CampaignProgress.isChapterEnd(mission.order) ? CampaignProgress.getChapter(mission.order) : null,
      player: this.player
    });
  }

  advance() {
    if (!this.awaitingAdvance) return;
    this.player.pendingCompletionMissionId = '';
    this.awaitingAdvance = false;
    this.persist(false);
    this.emitCurrentState();
  }

  restartCampaign() {
    this.player.resetProgress();
    this.awaitingAdvance = false;
    this.currentQuestionIndex = 0;
    this.persist();
    this.emit('campaign:restarted', { player: this.player });
    this.emitCurrentState();
  }

  emitCurrentState() {
    const pendingMission = this.missions.find((mission) => mission.id === this.player.pendingCompletionMissionId);
    if (pendingMission && this.player.completedMissionIds.has(pendingMission.id)) {
      this.awaitingAdvance = true;
      const question = pendingMission.questions.at(-1);
      this.emit('answer:correct', {
        mission: pendingMission,
        question,
        reward: pendingMission.xp.correctAnswer / pendingMission.questions.length,
        stars: this.player.getMissionStars(pendingMission.id),
        chapterCompleted: CampaignProgress.isChapterEnd(pendingMission.order) ? CampaignProgress.getChapter(pendingMission.order) : null,
        player: this.player,
        resumed: true
      });
      return;
    }
    const mission = this.currentMission;
    if (mission) {
      const rewardedAnswers = mission.questions.filter((_, index) => this.player.rewardTokens.has(`answer:${mission.id}:${index}`)).length;
      const restoredIndex = Math.max(this.player.getQuestionIndex(mission.id), rewardedAnswers);
      this.currentQuestionIndex = Math.min(restoredIndex, mission.questions.length - 1);
      if (restoredIndex !== this.player.getQuestionIndex(mission.id)) this.player.setQuestionIndex(mission.id, restoredIndex);
      const stage = this.player.getMissionStage(mission.id);
      const resumed = Boolean(stage) || this.player.questionStartedMissionIds.has(mission.id) || rewardedAnswers > 0;
      if (resumed) this.player.questionStartedMissionIds.add(mission.id);
      this.persist(false);
      this.emit('mission:changed', { mission, player: this.player, resumed, stage: this.player.getMissionStage(mission.id) });
    } else {
      this.emit('campaign:completed', { player: this.player });
    }
  }

  persist(emitChange = true) {
    this.saveManager.save(this.player);
    if (emitChange) this.emit('progress:changed', { player: this.player });
  }

  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  migrateProgression() {
    if (this.player.rewardTokens.size > 0) {
      this.player.xp = this.missions.reduce((total, mission) => {
        if (this.player.rewardTokens.has(`discovery:${mission.id}`)) total += mission.xp.discovery;
        mission.questions.forEach((_, index) => {
          if (this.player.rewardTokens.has(`answer:${mission.id}:${index}`)) total += mission.xp.correctAnswer / mission.questions.length;
        });
        return total;
      }, 0);
    }
    this.missions.forEach((mission) => {
      if (!this.player.completedMissionIds.has(mission.id) || this.player.getMissionStars(mission.id)) return;
      const hasGranularAttempts = mission.questions.some((_, index) => this.player.getQuestionAttempts(mission.id, index) > 0);
      this.player.setMissionStars(mission.id, hasGranularAttempts ? this.player.calculateMissionStars(mission) : 3);
    });
    this.missions.forEach((mission) => {
      if (this.player.getMissionStage(mission.id)) return;
      if (this.player.completedMissionIds.has(mission.id)) this.player.setMissionStage(mission.id, 'completed');
      else if (this.player.questionStartedMissionIds.has(mission.id)) this.player.setMissionStage(mission.id, 'questions');
      else if (this.player.discoveredMissionIds.has(mission.id)) this.player.setMissionStage(mission.id, 'launch-ready');
      else if (this.player.getObservedBodies(mission.id).size > 0) this.player.setMissionStage(mission.id, 'exploring');
    });
  }
}
