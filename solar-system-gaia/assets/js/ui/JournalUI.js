import { crewAvatar } from './VisualAssets.js';
import { missionLocale } from '../i18n/MissionLocale.js';

export class JournalUI {
  constructor({ manager, profileManager, rocketAnimation, soundManager = null, openDossier }) {
    this.manager = manager;
    this.profileManager = profileManager;
    this.rocketAnimation = rocketAnimation;
    this.sound = soundManager;
    this.openDossier = openDossier;
    this.trainingMission = null;
    this.trainingIndex = 0;
    this.trainingOrders = [];
    this.elements = {
      modal: document.getElementById('journalModal'),
      missions: document.getElementById('journalMissions'),
      avatar: document.getElementById('journalAvatar'),
      name: document.getElementById('journalName'),
      level: document.getElementById('journalLevel'),
      xp: document.getElementById('journalXP'),
      completed: document.getElementById('journalCompleted'),
      attempts: document.getElementById('journalAttempts'),
      accuracy: document.getElementById('journalAccuracy'),
      stars: document.getElementById('journalStars'),
      progressBar: document.getElementById('journalProgressBar'),
      chapterSummary: document.getElementById('journalChapterSummary'),
      trainingModal: document.getElementById('trainingModal'),
      trainingTitle: document.getElementById('trainingTitle'),
      trainingProgress: document.getElementById('trainingProgress'),
      trainingQuestion: document.getElementById('trainingQuestion'),
      trainingAlternatives: document.getElementById('trainingAlternatives'),
      trainingFeedback: document.getElementById('trainingFeedback'),
      trainingNext: document.getElementById('btnTrainingNext')
    };
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('btnOpenJournal').addEventListener('click', () => this.open());
    document.getElementById('btnOpenJournalFromMenu').addEventListener('click', () => {
      document.getElementById('modeModal').classList.remove('visible');
      this.open();
    });
    document.getElementById('btnCloseJournal').addEventListener('click', () => this.close());
    document.getElementById('btnCloseTraining').addEventListener('click', () => this.closeTraining());
    this.elements.trainingNext.addEventListener('click', () => this.nextTrainingQuestion());
    document.addEventListener('journal:open', () => this.open());
    this.manager.addEventListener('progress:changed', () => {
      if (this.elements.modal.classList.contains('visible')) this.render();
    });
    this.profileManager.addEventListener('profile:changed', () => {
      if (this.elements.modal.classList.contains('visible')) this.render();
    });
    missionLocale.addEventListener('locale:changed', () => {
      if (this.elements.modal.classList.contains('visible')) this.render();
      if (this.elements.trainingModal.classList.contains('visible')) this.renderTrainingQuestion();
    });
  }

  open() {
    this.render();
    this.elements.modal.classList.add('visible');
  }

  close() {
    this.elements.modal.classList.remove('visible');
  }

  render() {
    const { player, missions } = this.manager;
    const profile = this.profileManager.profile;
    const avatar = this.profileManager.getAvatar();
    const completed = player.completedMissionIds.size;
    const accuracy = player.totalAttempts > 0 ? Math.round(player.correctAnswers / player.totalAttempts * 100) : null;
    this.elements.avatar.innerHTML = crewAvatar(avatar.id, missionLocale.t({ astronaut: 'avatarAstronaut', scientist: 'avatarScientist', engineer: 'avatarEngineer', commander: 'avatarCommander' }[avatar.id]));
    this.elements.name.textContent = profile?.name ?? missionLocale.t('commander');
    this.elements.level.textContent = missionLocale.levelName(player.level);
    this.elements.xp.textContent = player.xp;
    this.elements.completed.textContent = `${completed}/${missions.length}`;
    this.elements.attempts.textContent = player.totalAttempts;
    this.elements.accuracy.textContent = accuracy === null ? '—' : `${accuracy}%`;
    const earnedStars = [...player.missionStars.values()].reduce((total, stars) => total + stars, 0);
    this.elements.stars.textContent = `${earnedStars}/${missions.length * 3}`;
    this.elements.progressBar.style.width = `${completed / missions.length * 100}%`;
    const chapter = this.manager.currentChapter;
    const chapterCompleted = missions.filter((mission) => mission.order >= chapter.start && mission.order <= chapter.end && player.completedMissionIds.has(mission.id)).length;
    this.elements.chapterSummary.textContent = `${missionLocale.t('chapter')}: ${missionLocale.t(chapter.labelKey)} · ${chapterCompleted}/${chapter.end - chapter.start + 1}`;
    this.renderMissionCards();
  }

  renderMissionCards() {
    const { player, missions, currentMission } = this.manager;
    this.elements.missions.replaceChildren();
    missions.forEach((mission, missionIndex) => {
      const localizedMission = missionLocale.localizeMission(mission);
      const completed = player.completedMissionIds.has(mission.id);
      const current = currentMission?.id === mission.id;
      const card = document.createElement('article');
      card.className = `journal-mission ${completed ? 'completed' : current ? 'current' : 'locked'}`;
      card.style.setProperty('--card-index', missionIndex);
      const status = missionLocale.t(completed ? 'investigationComplete' : current ? 'currentMissionStatus' : 'locked');
      const missionLabel = mission.type === 'mystery' && completed ? localizedMission.destination : localizedMission.displayName;
      const number = document.createElement('span'); number.className = 'journal-mission-number'; number.textContent = String(mission.order).padStart(2, '0');
      const title = document.createElement('h4'); title.textContent = missionLabel;
      const statusLabel = document.createElement('small'); statusLabel.textContent = status;
      card.append(number, title, statusLabel);
      if (completed) {
        const stars = document.createElement('span');
        stars.className = 'mission-stars';
        const rating = player.getMissionStars(mission.id);
        stars.textContent = `${'★'.repeat(rating)}${'☆'.repeat(3 - rating)}`;
        const fact = document.createElement('p');
        fact.textContent = localizedMission.scientificFact;
        const actions = document.createElement('div');
        actions.className = 'journal-card-actions';
        actions.append(
          this.makeButton(missionLocale.t('dossier'), () => { this.close(); this.openDossier(mission); }),
          this.makeButton(missionLocale.t('train'), () => this.startTraining(mission)),
          this.makeButton(missionLocale.t('replayJourney'), () => this.replayFlight(mission))
        );
        card.append(stars, fact, actions);
      }
      this.elements.missions.appendChild(card);
    });
  }

  makeButton(label, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  async replayFlight(mission) {
    this.close();
    await this.rocketAnimation.launchTo(mission.destination);
    this.open();
  }

  startTraining(mission) {
    this.trainingMission = mission;
    this.trainingIndex = 0;
    this.trainingOrders = mission.questions.map((question) => {
      const entries = question.type === 'ordering' ? question.items : question.alternatives;
      const order = entries.map((_, index) => index);
      for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
      }
      if (order.length > 1 && order.every((value, index) => value === index)) order.push(order.shift());
      return order;
    });
    this.close();
    this.renderTrainingQuestion();
    this.elements.trainingModal.classList.add('visible');
  }

  renderTrainingQuestion() {
    const localizedMission = missionLocale.localizeMission(this.trainingMission);
    const question = localizedMission.questions[this.trainingIndex];
    const label = localizedMission.type === 'mystery' ? localizedMission.destination : localizedMission.displayName;
    this.elements.trainingTitle.textContent = missionLocale.t('trainingTitle', { target: label });
    this.elements.trainingProgress.textContent = `${missionLocale.t('question')} ${this.trainingIndex + 1}/${this.trainingMission.questions.length}`;
    this.elements.trainingQuestion.textContent = question.question;
    this.elements.trainingFeedback.className = 'mission-feedback';
    this.elements.trainingFeedback.textContent = missionLocale.t('freeTraining');
    this.elements.trainingNext.hidden = true;
    this.elements.trainingAlternatives.replaceChildren();
    if (question.type === 'ordering') {
      this.renderTrainingOrder(question, this.trainingOrders[this.trainingIndex]);
      return;
    }
    this.trainingOrders[this.trainingIndex].forEach((originalIndex) => {
      const alternative = question.alternatives[originalIndex];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mission-alternative';
      button.textContent = alternative;
      button.dataset.originalIndex = String(originalIndex);
      button.addEventListener('click', () => this.answerTraining(originalIndex));
      this.elements.trainingAlternatives.appendChild(button);
    });
  }

  renderTrainingOrder(question, order) {
    order.forEach((originalIndex, position) => {
      const row = document.createElement('div');
      row.className = 'ordering-item';
      const number = document.createElement('strong'); number.textContent = `${position + 1}`;
      const text = document.createElement('span'); text.textContent = question.items[originalIndex];
      const controls = document.createElement('div'); controls.className = 'ordering-controls';
      const move = (direction) => {
        const target = position + direction;
        if (target < 0 || target >= order.length) return;
        const next = [...order]; [next[position], next[target]] = [next[target], next[position]];
        this.trainingOrders[this.trainingIndex] = next;
        this.elements.trainingAlternatives.replaceChildren();
        this.renderTrainingOrder(question, next);
      };
      const up = document.createElement('button'); up.type = 'button'; up.textContent = '↑'; up.disabled = position === 0;
      up.setAttribute('aria-label', `${missionLocale.t('moveUp')}: ${question.items[originalIndex]}`); up.addEventListener('click', () => move(-1));
      const down = document.createElement('button'); down.type = 'button'; down.textContent = '↓'; down.disabled = position === order.length - 1;
      down.setAttribute('aria-label', `${missionLocale.t('moveDown')}: ${question.items[originalIndex]}`); down.addEventListener('click', () => move(1));
      controls.append(up, down); row.append(number, text, controls); this.elements.trainingAlternatives.appendChild(row);
    });
    const submit = document.createElement('button'); submit.type = 'button'; submit.className = 'primary-action ordering-submit';
    submit.textContent = missionLocale.t('checkOrder'); submit.addEventListener('click', () => this.answerTraining(order));
    this.elements.trainingAlternatives.appendChild(submit);
  }

  answerTraining(response) {
    const question = this.trainingMission.questions[this.trainingIndex];
    const correct = question.type === 'ordering'
      ? Array.isArray(response) && response.every((value, index) => value === question.correctOrder[index])
      : response === question.correctAnswer;
    if (!correct) {
      this.sound?.error();
      this.elements.trainingFeedback.className = 'mission-feedback incorrect';
      this.elements.trainingFeedback.textContent = missionLocale.t('trainingIncorrect');
      return;
    }
    this.elements.trainingAlternatives.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.originalIndex) === question.correctAnswer) button.classList.add('correct');
    });
    if (question.type === 'ordering') this.elements.trainingAlternatives.querySelectorAll('.ordering-item').forEach((item) => item.classList.add('correct'));
    this.sound?.success();
    this.elements.trainingFeedback.className = 'mission-feedback correct';
    this.elements.trainingFeedback.textContent = missionLocale.t('trainingCorrect');
    this.elements.trainingNext.hidden = false;
    this.elements.trainingNext.textContent = missionLocale.t(this.trainingIndex === this.trainingMission.questions.length - 1 ? 'finishTraining' : 'nextQuestion');
  }

  nextTrainingQuestion() {
    if (this.trainingIndex < this.trainingMission.questions.length - 1) {
      this.trainingIndex += 1;
      this.renderTrainingQuestion();
    } else {
      this.closeTraining();
    }
  }

  closeTraining() {
    this.elements.trainingModal.classList.remove('visible');
    this.open();
  }
}
