import { soundIcon } from './VisualAssets.js';
import { missionLocale } from '../i18n/MissionLocale.js';

export class MissionUI {
  constructor(manager, rocketAnimation, soundManager = null) {
    this.manager = manager;
    this.rocketAnimation = rocketAnimation;
    this.sound = soundManager;
    this.pendingMission = null;
    this.discoveryReward = 0;
    this.travelInProgress = false;
    this.analysisComplete = true;
    this.analysisToken = 0;
    this.dossierContext = 'beforeQuestions';
    this.elements = {
      modeModal: document.getElementById('modeModal'),
      missionHud: document.getElementById('missionHud'),
      hudTitle: document.getElementById('missionHudTitle'),
      hudObjective: document.getElementById('missionHudObjective'),
      chapterLabel: document.getElementById('missionChapterLabel'),
      hudXP: document.getElementById('missionHudXP'),
      hudLevel: document.getElementById('missionHudLevel'),
      hudProgress: document.getElementById('missionHudProgress'),
      campaignProgressBar: document.getElementById('missionCampaignProgressBar'),
      xpGainEffect: document.getElementById('xpGainEffect'),
      focusButton: document.getElementById('btnMissionFocus'),
      soundButton: document.getElementById('btnToggleSound'),
      soundVolume: document.getElementById('soundVolume'),
      briefingModal: document.getElementById('missionBriefingModal'),
      briefingTitle: document.getElementById('briefingTitle'),
      briefingText: document.getElementById('briefingText'),
      briefingObjective: document.getElementById('briefingObjective'),
      launchModal: document.getElementById('launchConfirmModal'),
      launchText: document.getElementById('launchConfirmText'),
      dossierModal: document.getElementById('dossierModal'),
      dossierTitle: document.getElementById('dossierTitle'),
      analysisScanner: document.getElementById('analysisScanner'),
      analysisScannerTitle: document.getElementById('analysisScannerTitle'),
      analysisScannerData: document.getElementById('analysisScannerData'),
      analysisScannerStatus: document.getElementById('analysisScannerStatus'),
      dossierOverview: document.getElementById('dossierOverview'),
      dossierSections: document.getElementById('dossierSections'),
      dossierLearnMore: document.getElementById('dossierLearnMore'),
      dossierLearnMoreText: document.getElementById('dossierLearnMoreText'),
      dossierSources: document.getElementById('dossierSources'),
      dossierReviewDate: document.getElementById('dossierReviewDate'),
      dossierSourcesList: document.getElementById('dossierSourcesList'),
      dossierAction: document.getElementById('btnDossierAction'),
      questionModal: document.getElementById('missionQuestionModal'),
      questionTitle: document.getElementById('missionQuestionTitle'),
      questionProgress: document.getElementById('missionQuestionProgress'),
      questionText: document.getElementById('missionQuestionText'),
      alternatives: document.getElementById('missionAlternatives'),
      feedback: document.getElementById('missionFeedback'),
      chapterBadge: document.getElementById('missionChapterBadge'),
      continueButton: document.getElementById('btnContinueMission'),
      reviewDossierButton: document.getElementById('btnReviewDossier'),
      toast: document.getElementById('missionToast'),
      campaignModal: document.getElementById('campaignCompleteModal'),
      campaignText: document.getElementById('campaignCompleteText')
    };
    this.bindControls();
    this.bindManagerEvents();
    this.bindSoundControls();
  }

  bindControls() {
    document.getElementById('btnChooseExploration').addEventListener('click', () => {
      this.manager.setMode('exploration');
      this.elements.modeModal.classList.remove('visible');
    });
    document.getElementById('btnChooseMission').addEventListener('click', () => {
      this.manager.setMode('mission');
      this.elements.modeModal.classList.remove('visible');
    });
    document.getElementById('btnOpenModeMenu').addEventListener('click', () => this.elements.modeModal.classList.add('visible'));
    this.elements.focusButton.addEventListener('click', () => this.toggleMissionFocus());
    document.getElementById('btnStartExploration').addEventListener('click', () => {
      this.manager.startExploration();
      this.elements.briefingModal.classList.remove('visible');
    });
    document.getElementById('btnLaunchRocket').addEventListener('click', () => this.startLaunch());
    this.elements.dossierAction.addEventListener('click', () => {
      this.elements.dossierModal.classList.remove('visible');
      if (this.dossierContext === 'journal') {
        document.dispatchEvent(new CustomEvent('journal:open'));
        return;
      }
      this.openQuestion(this.pendingMission, this.dossierContext === 'question' ? 0 : this.discoveryReward);
    });
    document.getElementById('btnReviewDossier').addEventListener('click', () => {
      this.elements.questionModal.classList.remove('visible');
      this.openDossier(this.pendingMission, 'question');
    });
    this.elements.continueButton.addEventListener('click', () => {
      this.elements.questionModal.classList.remove('visible');
      this.manager.advance();
    });
    document.getElementById('btnCampaignExploration').addEventListener('click', () => {
      this.elements.campaignModal.classList.remove('visible');
      this.manager.setMode('exploration');
    });
    document.getElementById('btnRestartCampaign').addEventListener('click', () => {
      const confirmed = window.confirm(missionLocale.t('restartConfirm'));
      if (!confirmed) return;
      this.elements.campaignModal.classList.remove('visible');
      this.manager.restartCampaign();
      this.showToast(missionLocale.t('restartSuccess'));
    });
  }

  bindSoundControls() {
    if (!this.sound) return;
    const render = () => {
      const { muted, volume } = this.sound.settings;
      this.elements.soundButton.innerHTML = `${soundIcon(muted)}<span>${missionLocale.t(muted ? 'soundOff' : 'soundOn')}</span>`;
      this.elements.soundButton.setAttribute('aria-pressed', String(!muted));
      this.elements.soundVolume.value = String(volume);
    };
    this.elements.soundButton.addEventListener('click', () => this.sound.setMuted(!this.sound.muted));
    this.elements.soundVolume.addEventListener('input', (event) => this.sound.setVolume(event.target.value));
    this.sound.addEventListener('audio:changed', render);
    missionLocale.addEventListener('locale:changed', render);
    render();
  }

  bindManagerEvents() {
    missionLocale.addEventListener('locale:changed', () => this.refreshLocalizedView());
    this.manager.addEventListener('mode:changed', ({ detail }) => {
      if (detail.mode !== 'mission') this.manager.bridge.exitPrecisionMode();
      document.body.classList.toggle('mission-mode', detail.mode === 'mission');
      this.elements.missionHud.hidden = detail.mode !== 'mission';
      document.getElementById('btnOpenModeMenu').textContent = missionLocale.t(detail.mode === 'mission' ? 'missionMode' : 'explorationMode');
    });
    this.manager.addEventListener('mission:changed', ({ detail }) => {
      this.sound?.communication();
      this.renderMission(detail.mission);
      this.elements.briefingModal.classList.remove('visible');
      this.travelInProgress = false;
      if (detail.stage === 'questions') this.openQuestion(detail.mission, 0, missionLocale.t('resumedQuestion'));
      else if (detail.stage === 'analysis-ready') this.openDossier(detail.mission, 'beforeQuestions');
      else if (detail.stage === 'launch-ready') this.prepareLaunch({ mission: detail.mission, reward: 0 });
      else if (detail.stage !== 'exploring') this.openBriefing(detail.mission);
    });
    this.manager.addEventListener('progress:changed', () => this.renderProgress());
    this.manager.addEventListener('target:incorrect', ({ detail }) => this.showToast(missionLocale.t('incorrectTarget', { body: missionLocale.bodyName(detail.bodyName) })));
    this.manager.addEventListener('target:duplicate', ({ detail }) => this.showToast(missionLocale.t('duplicateEvidence', { body: missionLocale.bodyName(detail.bodyName) })));
    this.manager.addEventListener('target:host-selected', ({ detail }) => {
      this.focusedOnHost = true;
      this.manager.bridge.focusBody(detail.bodyName, detail.mission.displayName);
      this.elements.focusButton.textContent = missionLocale.t('backOverview');
      this.showToast(missionLocale.t('hostFollowing', { body: missionLocale.bodyName(detail.bodyName), target: missionLocale.localizeMission(detail.mission).displayName }));
    });
    this.manager.addEventListener('target:progress', ({ detail }) => {
      const remaining = detail.remainingBodies.map((body) => missionLocale.bodyName(body)).join(', ');
      this.showToast(missionLocale.t('evidenceRecorded', { body: missionLocale.bodyName(detail.bodyName), observed: detail.observed, total: detail.total, remaining }));
    });
    this.manager.addEventListener('target:found', ({ detail }) => {
      this.manager.bridge.exitPrecisionMode();
      this.animateXP(detail.reward);
      this.prepareLaunch(detail);
    });
    this.manager.addEventListener('answer:incorrect', ({ detail }) => {
      this.sound?.error();
      const selected = this.elements.alternatives.querySelector(`[data-original-index="${detail.alternativeIndex}"]`);
      if (selected) {
        selected.classList.remove('incorrect-choice');
        void selected.offsetWidth;
        selected.classList.add('incorrect-choice');
      }
      const buttons = [...this.elements.alternatives.querySelectorAll('button')];
      const disabledStates = buttons.map((button) => button.disabled);
      buttons.forEach((button) => { button.disabled = true; });
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => buttons.forEach((button, index) => { button.disabled = disabledStates[index]; }), detail.retryDelay);
      this.elements.feedback.className = 'mission-feedback incorrect';
      this.elements.feedback.textContent = this.getProgressiveFeedback(detail);
    });
    this.manager.addEventListener('question:correct', ({ detail }) => {
      this.sound?.success();
      this.animateXP(detail.reward);
      this.renderProgress();
      this.openQuestion(detail.mission, detail.reward, missionLocale.t('answerCorrectNext', { xp: detail.reward }));
    });
    this.manager.addEventListener('answer:correct', ({ detail }) => {
      if (!detail.resumed) { this.sound?.success(); this.animateXP(detail.reward); }
      this.showSuccess(detail);
    });
    this.manager.addEventListener('campaign:completed', () => {
      this.sound?.complete();
      this.renderProgress();
      const { missions, player } = this.manager;
      this.elements.campaignText.textContent = missionLocale.t('campaignSummary', { missions: missions.length, xp: player.xp, level: missionLocale.levelName(player.level) });
      this.elements.campaignModal.classList.add('visible');
    });
  }

  openBriefing(mission) {
    mission = missionLocale.localizeMission(mission);
    const commander = document.getElementById('commanderHudName').textContent || missionLocale.t('commander');
    this.elements.briefingTitle.textContent = mission.title;
    this.elements.briefingText.textContent = `${commander}, ${mission.description.charAt(0).toLowerCase()}${mission.description.slice(1)}`;
    this.elements.briefingObjective.textContent = missionLocale.t('objectivePrefix', { objective: mission.objective });
    this.elements.briefingModal.classList.add('visible');
  }

  prepareLaunch({ mission, reward }) {
    if (this.travelInProgress) return;
    this.travelInProgress = true;
    this.pendingMission = mission;
    this.discoveryReward = reward;
    const localizedMission = missionLocale.localizeMission(mission);
    this.elements.launchText.textContent = missionLocale.t('launchConfirmation', { target: this.getMissionLabel(localizedMission) });
    this.elements.launchModal.classList.add('visible');
  }

  async startLaunch() {
    this.elements.launchModal.classList.remove('visible');
    await this.rocketAnimation.launchTo(this.pendingMission.destination);
    this.manager.markAnalysisReady();
    this.openAnalysis(this.pendingMission);
  }

  openAnalysis(mission) {
    this.sound?.scanner();
    this.travelInProgress = false;
    this.analysisComplete = false;
    const token = ++this.analysisToken;
    this.openDossier(mission, 'beforeQuestions', true);
    clearTimeout(this.scanTimer);
    this.scanTimer = setTimeout(() => {
      if (token !== this.analysisToken) return;
      this.analysisComplete = true;
      this.elements.analysisScanner.classList.remove('scanning');
      this.elements.analysisScannerStatus.textContent = missionLocale.t('analysisReady');
      this.elements.dossierAction.disabled = false;
      this.elements.dossierAction.textContent = missionLocale.t('questions');
    }, 1650);
  }

  renderMission(mission) {
    this.pendingMission = mission;
    this.dossierContext = 'beforeQuestions';
    const localizedMission = missionLocale.localizeMission(mission);
    const notice = document.getElementById('missionLanguageNotice');
    const translated = missionLocale.hasMissionTranslation(mission);
    notice.textContent = translated ? '' : missionLocale.t('contentNotice');
    notice.hidden = translated;
    this.elements.hudTitle.textContent = localizedMission.title;
    this.elements.hudObjective.textContent = localizedMission.objective;
    const chapter = this.manager.currentChapter;
    const completedInChapter = this.manager.missions.filter((item) => item.order >= chapter.start && item.order <= chapter.end && this.manager.player.completedMissionIds.has(item.id)).length;
    this.elements.chapterLabel.textContent = `${missionLocale.t('chapter')}: ${missionLocale.t(chapter.labelKey)} · ${completedInChapter}/${chapter.end - chapter.start + 1}`;
    this.focusedOnHost = false;
    this.elements.focusButton.hidden = !mission.parentBody;
    if (mission.parentBody) this.elements.focusButton.textContent = missionLocale.t('focusBody', { body: missionLocale.bodyName(mission.parentBody) });
    this.renderProgress();
  }

  toggleMissionFocus() {
    const mission = this.manager.currentMission;
    if (!mission?.parentBody) return;
    this.focusedOnHost = !this.focusedOnHost;
    if (this.focusedOnHost) {
      this.manager.bridge.focusBody(mission.parentBody, mission.displayName);
      this.elements.focusButton.textContent = missionLocale.t('backOverview');
      this.showToast(missionLocale.t('cameraFollowing', { body: missionLocale.bodyName(mission.parentBody), target: missionLocale.localizeMission(mission).displayName }));
    } else {
      this.manager.bridge.resetCamera();
      this.elements.focusButton.textContent = missionLocale.t('focusBody', { body: missionLocale.bodyName(mission.parentBody) });
    }
  }

  renderProgress() {
    const { player, currentMissionNumber, missions } = this.manager;
    this.elements.hudXP.textContent = player.xp;
    this.elements.hudLevel.textContent = missionLocale.levelName(player.level);
    this.elements.hudProgress.textContent = `${currentMissionNumber}/${missions.length}`;
    const progress = player.completedMissionIds.size / missions.length * 100;
    this.elements.campaignProgressBar.style.width = `${progress}%`;
    this.elements.campaignProgressBar.parentElement?.setAttribute('aria-valuenow', String(Math.round(progress)));
  }

  animateXP(amount) {
    if (!amount) return;
    const effect = this.elements.xpGainEffect;
    effect.textContent = `+${amount} XP`;
    effect.classList.remove('visible');
    void effect.offsetWidth;
    effect.classList.add('visible');
    clearTimeout(this.xpEffectTimer);
    this.xpEffectTimer = setTimeout(() => effect.classList.remove('visible'), 1250);
  }

  refreshLocalizedView() {
    const mission = this.manager.currentMission;
    if (!mission) return;
    const dossierContext = this.dossierContext;
    this.renderMission(mission);
    if (this.elements.briefingModal.classList.contains('visible')) this.openBriefing(mission);
    if (this.elements.dossierModal.classList.contains('visible')) {
      this.openDossier(mission, dossierContext, !this.analysisComplete && dossierContext === 'beforeQuestions');
    }
    if (this.elements.questionModal.classList.contains('visible')) this.openQuestion(mission);
  }

  openQuestion(mission, reward = 0, message = '') {
    this.manager.markQuestionsStarted();
    this.elements.questionModal.classList.remove('mission-success-pulse');
    this.elements.chapterBadge.hidden = true;
    const localizedMission = missionLocale.localizeMission(mission);
    const index = this.manager.currentQuestionIndex;
    const question = localizedMission.questions[index];
    this.elements.questionTitle.textContent = localizedMission.title;
    this.elements.questionProgress.textContent = `${missionLocale.t('question')} ${index + 1}/${localizedMission.questions.length}`;
    this.elements.questionText.textContent = question.question;
    this.elements.feedback.className = 'mission-feedback';
    this.elements.feedback.textContent = message || (reward > 0 ? missionLocale.t('destinationReached', { xp: reward }) : missionLocale.t('useScannerData'));
    this.elements.continueButton.hidden = true;
    this.elements.reviewDossierButton.hidden = false;
    this.elements.alternatives.replaceChildren();
    const order = this.manager.getCurrentQuestionOrder();
    if (question.type === 'ordering') {
      this.renderOrderingQuestion(question, order);
      this.elements.questionModal.classList.add('visible');
      return;
    }
    order.forEach((originalIndex) => {
      const alternative = question.alternatives[originalIndex];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mission-alternative';
      button.textContent = alternative;
      button.dataset.originalIndex = String(originalIndex);
      button.addEventListener('click', () => this.manager.answer(originalIndex));
      this.elements.alternatives.appendChild(button);
    });
    this.elements.questionModal.classList.add('visible');
  }

  renderOrderingQuestion(question, order) {
    order.forEach((originalIndex, position) => {
      const row = document.createElement('div');
      row.className = 'ordering-item';
      row.dataset.originalIndex = String(originalIndex);
      const positionLabel = document.createElement('strong');
      positionLabel.textContent = `${position + 1}`;
      const text = document.createElement('span');
      text.textContent = question.items[originalIndex];
      const controls = document.createElement('div');
      controls.className = 'ordering-controls';
      const move = (direction) => {
        const target = position + direction;
        if (target < 0 || target >= order.length) return;
        const nextOrder = [...order];
        [nextOrder[position], nextOrder[target]] = [nextOrder[target], nextOrder[position]];
        this.manager.setCurrentQuestionOrder(nextOrder);
        this.elements.alternatives.replaceChildren();
        this.renderOrderingQuestion(question, nextOrder);
      };
      const up = document.createElement('button');
      up.type = 'button'; up.textContent = '↑'; up.disabled = position === 0;
      up.setAttribute('aria-label', `${missionLocale.t('moveUp')}: ${question.items[originalIndex]}`);
      up.addEventListener('click', () => move(-1));
      const down = document.createElement('button');
      down.type = 'button'; down.textContent = '↓'; down.disabled = position === order.length - 1;
      down.setAttribute('aria-label', `${missionLocale.t('moveDown')}: ${question.items[originalIndex]}`);
      down.addEventListener('click', () => move(1));
      controls.append(up, down); row.append(positionLabel, text, controls);
      this.elements.alternatives.appendChild(row);
    });
    const submit = document.createElement('button');
    submit.type = 'button'; submit.className = 'primary-action ordering-submit';
    submit.textContent = missionLocale.t('checkOrder');
    submit.addEventListener('click', () => this.manager.answer(order));
    this.elements.alternatives.appendChild(submit);
  }

  openDossier(mission, context = 'beforeQuestions', scanning = false) {
    this.pendingMission = mission;
    mission = missionLocale.localizeMission(mission);
    this.dossierContext = context;
    if (!scanning) this.analysisComplete = true;
    this.elements.dossierTitle.textContent = `${missionLocale.t('analysisCenter')}: ${this.getMissionLabel(mission)}`;
    this.elements.analysisScannerTitle.textContent = scanning
      ? missionLocale.t('scanningEvidence')
      : missionLocale.t('collectedEvidence');
    this.elements.analysisScannerData.replaceChildren();
    mission.scanData.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'scanner-data-item';
      if (scanning) item.style.animationDelay = `${index * 420}ms`;
      else item.classList.add('revealed');
      item.textContent = data;
      this.elements.analysisScannerData.appendChild(item);
    });
    this.elements.analysisScanner.classList.toggle('scanning', scanning);
    this.elements.analysisScannerStatus.textContent = scanning
      ? missionLocale.t('processing')
      : missionLocale.t('analysisReady');
    this.elements.dossierOverview.textContent = mission.dossier.overview;
    this.elements.dossierSections.replaceChildren();
    mission.dossier.sections.forEach(([title, text]) => {
      const section = document.createElement('article');
      section.className = 'dossier-section';
      const heading = document.createElement('h3');
      heading.textContent = title;
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      section.append(heading, paragraph);
      this.elements.dossierSections.appendChild(section);
    });
    this.elements.dossierLearnMore.open = false;
    this.elements.dossierLearnMoreText.textContent = mission.dossier.learnMore;
    this.elements.dossierSources.open = false;
    this.elements.dossierReviewDate.textContent = missionLocale.t('sourcesReviewed', {
      date: new Intl.DateTimeFormat(missionLocale.language === 'pt' ? 'pt-BR' : missionLocale.language, { dateStyle: 'long' })
        .format(new Date(`${mission.scientificReviewDate}T12:00:00Z`))
    });
    this.elements.dossierSourcesList.replaceChildren();
    mission.sources.forEach((source) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `${source.organization} — ${source.title}`;
      item.appendChild(link);
      this.elements.dossierSourcesList.appendChild(item);
    });
    this.elements.dossierAction.textContent = context === 'journal'
      ? missionLocale.t('journal')
      : context === 'question' ? missionLocale.t('returnToQuestion') : missionLocale.t('questions');
    this.elements.dossierAction.disabled = scanning;
    if (scanning) this.elements.dossierAction.textContent = missionLocale.t('processing');
    this.elements.dossierModal.classList.add('visible');
  }

  showSuccess({ mission, question, reward, stars, chapterCompleted }) {
    this.elements.questionModal.classList.add('mission-success-pulse');
    this.elements.alternatives.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.originalIndex) === question.correctAnswer) button.classList.add('correct');
    });
    if (question.type === 'ordering') this.elements.alternatives.querySelectorAll('.ordering-item').forEach((item) => item.classList.add('correct'));
    this.elements.feedback.className = 'mission-feedback correct';
    const localizedMission = missionLocale.localizeMission(mission);
    const summary = document.createElement('strong');
    summary.textContent = missionLocale.t('missionCompletedReward', { xp: reward, stars: `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}` });
    this.elements.feedback.replaceChildren(summary, document.createElement('br'), document.createTextNode(localizedMission.scientificFact));
    if (chapterCompleted) {
      this.elements.chapterBadge.textContent = `${missionLocale.t('chapterComplete')}: ${missionLocale.t(chapterCompleted.labelKey)} ✦`;
      this.elements.chapterBadge.hidden = false;
    }
    this.elements.reviewDossierButton.hidden = true;
    this.elements.continueButton.hidden = false;
    this.renderProgress();
  }

  showToast(message) {
    this.elements.toast.textContent = message;
    this.elements.toast.classList.add('visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.elements.toast.classList.remove('visible'), 2800);
  }

  getProgressiveFeedback({ mission, alternativeIndex, attemptCount }) {
    const localizedMission = missionLocale.localizeMission(mission);
    const question = localizedMission.questions[this.manager.currentQuestionIndex];
    const selected = question.type === 'ordering' ? null : question.alternatives[alternativeIndex];
    const opening = question.type === 'ordering' ? missionLocale.t('orderingMismatch') : missionLocale.t('selectedMismatch', { selected });

    if (attemptCount === 1) {
      const clue = localizedMission.scanData[this.manager.currentQuestionIndex % localizedMission.scanData.length];
      return `${opening} ${missionLocale.t('evidenceHint')}: ${clue}. ${missionLocale.t('retrySoon')}`;
    }
    if (attemptCount === 2) {
      const section = localizedMission.dossier.sections[this.manager.currentQuestionIndex % localizedMission.dossier.sections.length];
      return `${opening} ${missionLocale.t('analysisHint')}: ${section[1]}`;
    }
    return `${opening} ${missionLocale.t('reviewHint')}: ${missionLocale.t('reviewRecommendation')}`;
  }

  getMissionLabel(mission) {
    const revealed = this.manager.player.discoveredMissionIds.has(mission.id);
    return mission.type === 'mystery' && revealed ? mission.destination : mission.displayName;
  }
}
