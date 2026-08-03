import { missionLocale } from '../i18n/MissionLocale.js';

const copy = {
  pt: {
    eyebrow: 'Transmissão diária · Academia Gaia', title: 'Desafio do Dia', unlocked: 'Três questões disponíveis hoje',
    lockedStatus: 'Conclua a campanha para desbloquear', doneStatus: 'Desafio concluído hoje', lockedTitle: 'Arquivo bloqueado',
    lockedText: 'Conclua as 21 missões da campanha para liberar transmissões científicas diárias.', question: 'Questão',
    noRewards: 'Uma tentativa por questão · Sem alteração no XP oficial', correct: 'Resposta correta.', incorrect: 'Resposta incorreta.',
    next: 'Próxima questão', result: 'Ver resultado', finish: 'Concluir transmissão', days: 'Dias', streak: 'Sequência',
    best: 'Melhor', perfect: 'Perfeitos', resultTitles: ['Revisão recomendada', 'Bom começo', 'Ótimo desempenho', 'Transmissão perfeita'],
    resultText: (score) => `Você acertou ${score} de 3 questões. Um novo desafio será gerado amanhã.`,
    source: 'Tema', fact: 'Registro científico', solution: 'Resposta esperada'
  },
  en: {
    eyebrow: 'Daily transmission · Gaia Academy', title: 'Daily Challenge', unlocked: 'Three questions available today',
    lockedStatus: 'Complete the campaign to unlock', doneStatus: 'Challenge completed today', lockedTitle: 'Archive locked',
    lockedText: 'Complete all 21 campaign missions to unlock daily science transmissions.', question: 'Question',
    noRewards: 'One attempt per question · Official XP is unchanged', correct: 'Correct answer.', incorrect: 'Incorrect answer.',
    next: 'Next question', result: 'View result', finish: 'Finish transmission', days: 'Days', streak: 'Streak',
    best: 'Best', perfect: 'Perfect', resultTitles: ['Review recommended', 'Good start', 'Great performance', 'Perfect transmission'],
    resultText: (score) => `You answered ${score} out of 3 questions correctly. A new challenge will be generated tomorrow.`,
    source: 'Topic', fact: 'Science record', solution: 'Expected answer'
  },
  es: {
    eyebrow: 'Transmisión diaria · Academia Gaia', title: 'Desafío del Día', unlocked: 'Tres preguntas disponibles hoy',
    lockedStatus: 'Completa la campaña para desbloquear', doneStatus: 'Desafío completado hoy', lockedTitle: 'Archivo bloqueado',
    lockedText: 'Completa las 21 misiones de la campaña para desbloquear transmisiones científicas diarias.', question: 'Pregunta',
    noRewards: 'Un intento por pregunta · El XP oficial no cambia', correct: 'Respuesta correcta.', incorrect: 'Respuesta incorrecta.',
    next: 'Siguiente pregunta', result: 'Ver resultado', finish: 'Finalizar transmisión', days: 'Días', streak: 'Racha',
    best: 'Mejor', perfect: 'Perfectos', resultTitles: ['Revisión recomendada', 'Buen comienzo', 'Gran desempeño', 'Transmisión perfecta'],
    resultText: (score) => `Acertaste ${score} de 3 preguntas. Mañana se generará un nuevo desafío.`,
    source: 'Tema', fact: 'Registro científico', solution: 'Respuesta esperada'
  }
};

export class DailyChallengeUI {
  constructor({ challenge, soundManager = null }) {
    this.challenge = challenge;
    this.sound = soundManager;
    this.returnTo = 'mode';
    this.awaitingNext = false;
    this.currentOrder = [];
    this.elements = {
      modal: document.getElementById('dailyChallengeModal'), modeModal: document.getElementById('modeModal'),
      campaignModal: document.getElementById('campaignCompleteModal'), menuStatus: document.getElementById('dailyChallengeMenuStatus'),
      eyebrow: document.getElementById('dailyChallengeEyebrow'), title: document.getElementById('dailyChallengeTitle'),
      stats: document.getElementById('dailyChallengeStats'), locked: document.getElementById('dailyChallengeLocked'),
      lockedTitle: document.getElementById('dailyChallengeLockedTitle'), lockedText: document.getElementById('dailyChallengeLockedText'),
      questionArea: document.getElementById('dailyChallengeQuestionArea'), progress: document.getElementById('dailyChallengeProgress'),
      mission: document.getElementById('dailyChallengeMission'), question: document.getElementById('dailyChallengeQuestion'),
      alternatives: document.getElementById('dailyChallengeAlternatives'), feedback: document.getElementById('dailyChallengeFeedback'),
      next: document.getElementById('btnDailyChallengeNext'), result: document.getElementById('dailyChallengeResult'),
      resultMedal: document.getElementById('dailyChallengeResultMedal'), resultTitle: document.getElementById('dailyChallengeResultTitle'),
      resultText: document.getElementById('dailyChallengeResultText'), finish: document.getElementById('btnFinishDailyChallenge')
    };
    this.bindEvents();
    this.renderMenuStatus();
  }

  get locale() { return copy[missionLocale.language] ?? copy.pt; }

  bindEvents() {
    document.getElementById('btnOpenDailyChallengeFromMenu').addEventListener('click', () => this.open('mode'));
    document.getElementById('btnCampaignDailyChallenge').addEventListener('click', () => this.open('campaign'));
    document.getElementById('btnCloseDailyChallenge').addEventListener('click', () => this.close());
    this.elements.finish.addEventListener('click', () => this.close());
    this.elements.next.addEventListener('click', () => { this.awaitingNext = false; this.render(); });
    this.challenge.addEventListener('challenge:answered', () => this.renderMenuStatus());
    missionLocale.addEventListener('locale:changed', () => {
      this.renderMenuStatus();
      if (this.elements.modal.classList.contains('visible')) {
        if (this.challenge.getToday().completed) this.awaitingNext = false;
        this.render();
      }
    });
    document.addEventListener('challenge:availability-changed', () => this.renderMenuStatus());
  }

  open(source = 'mode') {
    this.returnTo = source;
    this.awaitingNext = false;
    this.elements.modeModal.classList.remove('visible');
    this.elements.campaignModal.classList.remove('visible');
    this.render();
    this.elements.modal.classList.add('visible');
  }

  close() {
    this.elements.modal.classList.remove('visible');
    (this.returnTo === 'campaign' ? this.elements.campaignModal : this.elements.modeModal).classList.add('visible');
  }

  renderMenuStatus() {
    const locale = this.locale;
    const today = this.challenge.getToday();
    this.elements.menuStatus.textContent = !this.challenge.unlocked
      ? locale.lockedStatus : today.completed ? locale.doneStatus : locale.unlocked;
    document.getElementById('btnOpenDailyChallengeFromMenu').classList.toggle('unlocked', this.challenge.unlocked);
  }

  render() {
    const locale = this.locale;
    const today = this.challenge.getToday();
    this.elements.eyebrow.textContent = locale.eyebrow;
    this.elements.title.textContent = locale.title;
    this.renderStats();
    this.elements.locked.hidden = this.challenge.unlocked;
    this.elements.questionArea.hidden = true;
    this.elements.result.hidden = true;
    if (!this.challenge.unlocked) {
      this.elements.lockedTitle.textContent = locale.lockedTitle;
      this.elements.lockedText.textContent = locale.lockedText;
      return;
    }
    if (today.completed && !this.awaitingNext) { this.renderResult(today); return; }
    this.renderQuestion(today);
  }

  renderStats() {
    const locale = this.locale;
    const stats = this.challenge.getStats();
    this.elements.stats.replaceChildren();
    [[locale.days, stats.days], [locale.streak, stats.streak], [locale.best, stats.bestStreak], [locale.perfect, stats.perfectDays]].forEach(([label, value]) => {
      const item = document.createElement('div');
      const small = document.createElement('span'); small.textContent = label;
      const strong = document.createElement('strong'); strong.textContent = value;
      item.append(small, strong); this.elements.stats.appendChild(item);
    });
  }

  renderQuestion(today) {
    const locale = this.locale;
    const index = Math.min(today.currentIndex, today.entries.length - 1);
    const entry = today.entries[index];
    const mission = missionLocale.localizeMission(this.challenge.missions[entry.missionIndex]);
    const question = mission.questions[entry.questionIndex];
    this.elements.questionArea.hidden = false;
    this.elements.progress.textContent = `${locale.question} ${index + 1}/3`;
    this.elements.mission.textContent = `${locale.source}: ${mission.type === 'mystery' ? mission.destination : mission.displayName}`;
    this.elements.question.textContent = question.question;
    this.elements.feedback.className = 'mission-feedback';
    this.elements.feedback.textContent = locale.noRewards;
    this.elements.next.hidden = true;
    this.elements.alternatives.replaceChildren();
    this.currentOrder = [...entry.order];
    if (question.type === 'ordering') this.renderOrdering(question);
    else entry.order.forEach((originalIndex) => this.addAlternative(question, originalIndex));
  }

  addAlternative(question, originalIndex) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'mission-alternative';
    button.textContent = question.alternatives[originalIndex]; button.dataset.originalIndex = String(originalIndex);
    button.addEventListener('click', () => this.answer(originalIndex));
    this.elements.alternatives.appendChild(button);
  }

  renderOrdering(question) {
    this.elements.alternatives.replaceChildren();
    this.currentOrder.forEach((originalIndex, position) => {
      const row = document.createElement('div'); row.className = 'ordering-item';
      const number = document.createElement('strong'); number.textContent = position + 1;
      const text = document.createElement('span'); text.textContent = question.items[originalIndex];
      const controls = document.createElement('div'); controls.className = 'ordering-controls';
      const move = (direction) => {
        const target = position + direction; if (target < 0 || target >= this.currentOrder.length) return;
        [this.currentOrder[position], this.currentOrder[target]] = [this.currentOrder[target], this.currentOrder[position]];
        this.renderOrdering(question);
      };
      const up = document.createElement('button'); up.type = 'button'; up.textContent = '↑'; up.disabled = position === 0;
      up.setAttribute('aria-label', `${missionLocale.t('moveUp')}: ${question.items[originalIndex]}`); up.addEventListener('click', () => move(-1));
      const down = document.createElement('button'); down.type = 'button'; down.textContent = '↓'; down.disabled = position === this.currentOrder.length - 1;
      down.setAttribute('aria-label', `${missionLocale.t('moveDown')}: ${question.items[originalIndex]}`); down.addEventListener('click', () => move(1));
      controls.append(up, down); row.append(number, text, controls); this.elements.alternatives.appendChild(row);
    });
    const submit = document.createElement('button'); submit.type = 'button'; submit.className = 'primary-action ordering-submit';
    submit.textContent = missionLocale.t('checkOrder'); submit.addEventListener('click', () => this.answer([...this.currentOrder]));
    this.elements.alternatives.appendChild(submit);
  }

  answer(response) {
    const result = this.challenge.answer(response);
    if (!result) return;
    this.awaitingNext = true;
    this.elements.alternatives.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    this.elements.feedback.className = `mission-feedback ${result.correct ? 'correct' : 'incorrect'}`;
    const mission = missionLocale.localizeMission(this.challenge.missions[result.entry.missionIndex]);
    const localizedQuestion = mission.questions[result.entry.questionIndex];
    const solution = localizedQuestion.type === 'ordering'
      ? localizedQuestion.correctOrder.map((index) => localizedQuestion.items[index]).join(' → ')
      : localizedQuestion.alternatives[localizedQuestion.correctAnswer];
    this.elements.feedback.textContent = `${result.correct ? this.locale.correct : this.locale.incorrect} ${this.locale.solution}: ${solution}. ${this.locale.fact}: ${mission.scientificFact}`;
    this.elements.next.hidden = false;
    this.elements.next.textContent = result.completed ? this.locale.result : this.locale.next;
    result.correct ? this.sound?.success() : this.sound?.error();
  }

  renderResult(today) {
    const score = today.score ?? today.answers.filter((answer) => answer.correct).length;
    this.elements.result.hidden = false;
    this.elements.resultMedal.textContent = score === 3 ? '✦' : score === 2 ? '◆' : score === 1 ? '◇' : '○';
    this.elements.resultTitle.textContent = this.locale.resultTitles[score];
    this.elements.resultText.textContent = this.locale.resultText(score);
    this.elements.finish.textContent = this.locale.finish;
    this.renderStats();
  }
}
