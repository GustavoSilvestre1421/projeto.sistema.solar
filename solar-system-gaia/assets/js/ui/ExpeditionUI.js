import { missionLocale } from '../i18n/MissionLocale.js';

const copy = {
  pt: {
    eyebrow: 'Simulação avançada · Academia Gaia', title: 'Expedição Científica', locked: 'Conclua a campanha para desbloquear',
    available: 'Treinamento avançado disponível', resume: 'Expedição em andamento', lockedTitle: 'Expedição bloqueada',
    lockedText: 'Conclua as 21 missões para liberar expedições científicas ilimitadas.', questionsRule: 'questões por expedição',
    energyRule: 'cargas de energia', comboRule: 'bônus por sequência', intro: 'Responda uma única vez a cada questão. Preserve sua energia e encadeie acertos para multiplicar a pontuação.',
    start: 'Iniciar expedição', continue: 'Continuar', result: 'Ver relatório', newRun: 'Nova expedição', menu: 'Voltar ao menu',
    runs: 'Expedições', bestScore: 'Recorde', bestCorrect: 'Mais acertos', bestCombo: 'Melhor combo', question: 'Questão',
    energy: 'Energia', score: 'Pontos', combo: 'Combo', topic: 'Tema', correct: 'Resposta correta', incorrect: 'Energia perdida',
    expected: 'Resposta esperada', fact: 'Registro científico', completeTitle: 'Expedição concluída', interruptedTitle: 'Energia esgotada',
    resultText: (run) => `${run.correct} de ${run.index} respostas corretas · ${run.score} pontos · combo máximo ×${run.maxCombo}.`
  },
  en: {
    eyebrow: 'Advanced simulation · Gaia Academy', title: 'Scientific Expedition', locked: 'Complete the campaign to unlock',
    available: 'Advanced training available', resume: 'Expedition in progress', lockedTitle: 'Expedition locked',
    lockedText: 'Complete all 21 missions to unlock unlimited scientific expeditions.', questionsRule: 'questions per expedition',
    energyRule: 'energy charges', comboRule: 'streak bonus', intro: 'Answer each question only once. Preserve energy and chain correct answers to multiply your score.',
    start: 'Start expedition', continue: 'Continue', result: 'View report', newRun: 'New expedition', menu: 'Back to menu',
    runs: 'Expeditions', bestScore: 'High score', bestCorrect: 'Most correct', bestCombo: 'Best combo', question: 'Question',
    energy: 'Energy', score: 'Score', combo: 'Combo', topic: 'Topic', correct: 'Correct answer', incorrect: 'Energy lost',
    expected: 'Expected answer', fact: 'Science record', completeTitle: 'Expedition complete', interruptedTitle: 'Energy depleted',
    resultText: (run) => `${run.correct} out of ${run.index} correct answers · ${run.score} points · maximum combo ×${run.maxCombo}.`
  },
  es: {
    eyebrow: 'Simulación avanzada · Academia Gaia', title: 'Expedición Científica', locked: 'Completa la campaña para desbloquear',
    available: 'Entrenamiento avanzado disponible', resume: 'Expedición en curso', lockedTitle: 'Expedición bloqueada',
    lockedText: 'Completa las 21 misiones para desbloquear expediciones científicas ilimitadas.', questionsRule: 'preguntas por expedición',
    energyRule: 'cargas de energía', comboRule: 'bonificación por racha', intro: 'Responde una sola vez a cada pregunta. Conserva la energía y encadena aciertos para multiplicar la puntuación.',
    start: 'Iniciar expedición', continue: 'Continuar', result: 'Ver informe', newRun: 'Nueva expedición', menu: 'Volver al menú',
    runs: 'Expediciones', bestScore: 'Récord', bestCorrect: 'Más aciertos', bestCombo: 'Mejor combo', question: 'Pregunta',
    energy: 'Energía', score: 'Puntos', combo: 'Racha', topic: 'Tema', correct: 'Respuesta correcta', incorrect: 'Energía perdida',
    expected: 'Respuesta esperada', fact: 'Registro científico', completeTitle: 'Expedición completada', interruptedTitle: 'Energía agotada',
    resultText: (run) => `${run.correct} de ${run.index} respuestas correctas · ${run.score} puntos · racha máxima ×${run.maxCombo}.`
  }
};

export class ExpeditionUI {
  constructor({ expedition, soundManager = null }) {
    this.expedition = expedition;
    this.sound = soundManager;
    this.returnTo = 'mode';
    this.awaitingNext = false;
    this.currentOrder = [];
    this.elements = {
      modal: document.getElementById('expeditionModal'), modeModal: document.getElementById('modeModal'),
      campaignModal: document.getElementById('campaignCompleteModal'), menuStatus: document.getElementById('expeditionMenuStatus'),
      eyebrow: document.getElementById('expeditionEyebrow'), title: document.getElementById('expeditionTitle'),
      records: document.getElementById('expeditionRecords'), locked: document.getElementById('expeditionLocked'),
      lockedTitle: document.getElementById('expeditionLockedTitle'), lockedText: document.getElementById('expeditionLockedText'),
      intro: document.getElementById('expeditionIntro'), introText: document.getElementById('expeditionIntroText'),
      ruleQuestions: document.getElementById('expeditionRuleQuestions'), ruleEnergy: document.getElementById('expeditionRuleEnergy'),
      ruleCombo: document.getElementById('expeditionRuleCombo'), start: document.getElementById('btnStartExpedition'),
      questionArea: document.getElementById('expeditionQuestionArea'), progress: document.getElementById('expeditionProgress'),
      energy: document.getElementById('expeditionEnergy'), score: document.getElementById('expeditionScore'), combo: document.getElementById('expeditionCombo'),
      mission: document.getElementById('expeditionMission'), question: document.getElementById('expeditionQuestion'),
      alternatives: document.getElementById('expeditionAlternatives'), feedback: document.getElementById('expeditionFeedback'),
      next: document.getElementById('btnExpeditionNext'), result: document.getElementById('expeditionResult'),
      resultEmblem: document.getElementById('expeditionResultEmblem'), resultTitle: document.getElementById('expeditionResultTitle'),
      resultText: document.getElementById('expeditionResultText'), restart: document.getElementById('btnRestartExpedition'),
      finish: document.getElementById('btnFinishExpedition')
    };
    this.bindEvents();
    this.renderMenuStatus();
  }

  get locale() { return copy[missionLocale.language] ?? copy.pt; }

  bindEvents() {
    document.getElementById('btnOpenExpeditionFromMenu').addEventListener('click', () => this.open('mode'));
    document.getElementById('btnCampaignExpedition').addEventListener('click', () => this.open('campaign'));
    document.getElementById('btnCloseExpedition').addEventListener('click', () => this.close());
    this.elements.finish.addEventListener('click', () => this.close());
    this.elements.start.addEventListener('click', () => { this.expedition.start(); this.render(); });
    this.elements.restart.addEventListener('click', () => { this.expedition.start(); this.awaitingNext = false; this.render(); });
    this.elements.next.addEventListener('click', () => { this.awaitingNext = false; this.render(); });
    this.expedition.addEventListener('expedition:answered', () => this.renderMenuStatus());
    missionLocale.addEventListener('locale:changed', () => {
      this.renderMenuStatus();
      if (this.elements.modal.classList.contains('visible')) {
        if (this.expedition.current?.finished) this.awaitingNext = false;
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
    this.elements.menuStatus.textContent = !this.expedition.unlocked ? locale.locked
      : this.expedition.active ? locale.resume : locale.available;
    document.getElementById('btnOpenExpeditionFromMenu').classList.toggle('unlocked', this.expedition.unlocked);
  }

  render() {
    const locale = this.locale;
    this.elements.eyebrow.textContent = locale.eyebrow;
    this.elements.title.textContent = locale.title;
    this.renderRecords();
    this.elements.locked.hidden = this.expedition.unlocked;
    this.elements.intro.hidden = true;
    this.elements.questionArea.hidden = true;
    this.elements.result.hidden = true;
    if (!this.expedition.unlocked) {
      this.elements.lockedTitle.textContent = locale.lockedTitle;
      this.elements.lockedText.textContent = locale.lockedText;
      return;
    }
    if (!this.expedition.current) { this.renderIntro(); return; }
    if (this.expedition.current.finished && !this.awaitingNext) { this.renderResult(); return; }
    this.renderQuestion();
  }

  renderRecords() {
    const locale = this.locale, stats = this.expedition.getStats();
    this.elements.records.replaceChildren();
    [[locale.runs, stats.runs], [locale.bestScore, stats.bestScore], [locale.bestCorrect, `${stats.bestCorrect}/10`], [locale.bestCombo, `×${stats.bestCombo}`]].forEach(([label, value]) => {
      const item = document.createElement('div'), small = document.createElement('span'), strong = document.createElement('strong');
      small.textContent = label; strong.textContent = value; item.append(small, strong); this.elements.records.appendChild(item);
    });
  }

  renderIntro() {
    const locale = this.locale;
    this.elements.intro.hidden = false;
    this.elements.ruleQuestions.textContent = locale.questionsRule;
    this.elements.ruleEnergy.textContent = locale.energyRule;
    this.elements.ruleCombo.textContent = locale.comboRule;
    this.elements.introText.textContent = locale.intro;
    this.elements.start.textContent = locale.start;
  }

  renderQuestion() {
    const locale = this.locale, run = this.expedition.current;
    const entry = run.entries[Math.min(run.index, run.entries.length - 1)];
    const mission = missionLocale.localizeMission(this.expedition.missions[entry.missionIndex]);
    const question = mission.questions[entry.questionIndex];
    this.elements.questionArea.hidden = false;
    this.elements.progress.textContent = `${locale.question} ${Math.min(run.index + 1, 10)}/10`;
    this.elements.energy.textContent = `${locale.energy} ${'⚡'.repeat(Math.max(0, run.energy))}${'·'.repeat(3 - Math.max(0, run.energy))}`;
    this.elements.score.textContent = `${locale.score} ${run.score}`;
    this.elements.combo.textContent = `${locale.combo} ×${run.combo}`;
    this.elements.mission.textContent = `${locale.topic}: ${mission.type === 'mystery' ? mission.destination : mission.displayName}`;
    this.elements.question.textContent = question.question;
    this.elements.feedback.className = 'mission-feedback';
    this.elements.feedback.textContent = locale.intro;
    this.elements.next.hidden = true;
    this.elements.alternatives.replaceChildren();
    this.currentOrder = [...entry.order];
    if (question.type === 'ordering') this.renderOrdering(question);
    else entry.order.forEach((originalIndex) => this.addAlternative(question, originalIndex));
  }

  addAlternative(question, originalIndex) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'mission-alternative'; button.dataset.originalIndex = originalIndex;
    button.textContent = question.alternatives[originalIndex]; button.addEventListener('click', () => this.answer(originalIndex));
    this.elements.alternatives.appendChild(button);
  }

  renderOrdering(question) {
    this.elements.alternatives.replaceChildren();
    this.currentOrder.forEach((originalIndex, position) => {
      const row = document.createElement('div'); row.className = 'ordering-item';
      const number = document.createElement('strong'); number.textContent = position + 1;
      const text = document.createElement('span'); text.textContent = question.items[originalIndex];
      const controls = document.createElement('div'); controls.className = 'ordering-controls';
      const move = (direction) => { const target = position + direction; if (target < 0 || target >= this.currentOrder.length) return;
        [this.currentOrder[position], this.currentOrder[target]] = [this.currentOrder[target], this.currentOrder[position]]; this.renderOrdering(question); };
      const up = document.createElement('button'); up.type = 'button'; up.textContent = '↑'; up.disabled = position === 0;
      up.setAttribute('aria-label', `${missionLocale.t('moveUp')}: ${question.items[originalIndex]}`); up.addEventListener('click', () => move(-1));
      const down = document.createElement('button'); down.type = 'button'; down.textContent = '↓'; down.disabled = position === this.currentOrder.length - 1;
      down.setAttribute('aria-label', `${missionLocale.t('moveDown')}: ${question.items[originalIndex]}`); down.addEventListener('click', () => move(1));
      controls.append(up, down); row.append(number, text, controls); this.elements.alternatives.appendChild(row);
    });
    const submit = document.createElement('button'); submit.type = 'button'; submit.className = 'primary-action ordering-submit';
    submit.textContent = missionLocale.t('checkOrder'); submit.addEventListener('click', () => this.answer([...this.currentOrder])); this.elements.alternatives.appendChild(submit);
  }

  answer(response) {
    const result = this.expedition.answer(response); if (!result) return;
    this.awaitingNext = true;
    this.elements.alternatives.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    const mission = missionLocale.localizeMission(this.expedition.missions[result.entry.missionIndex]);
    const question = mission.questions[result.entry.questionIndex];
    const solution = question.type === 'ordering' ? question.correctOrder.map((index) => question.items[index]).join(' → ') : question.alternatives[question.correctAnswer];
    this.elements.feedback.className = `mission-feedback ${result.correct ? 'correct' : 'incorrect'}`;
    this.elements.feedback.textContent = `${result.correct ? `${this.locale.correct}: +${result.points}` : this.locale.incorrect}. ${this.locale.expected}: ${solution}. ${this.locale.fact}: ${mission.scientificFact}`;
    this.elements.next.hidden = false;
    this.elements.next.textContent = result.finished ? this.locale.result : this.locale.continue;
    result.correct ? this.sound?.success() : this.sound?.error();
    this.renderMenuStatus();
  }

  renderResult() {
    const locale = this.locale, run = this.expedition.current;
    this.elements.result.hidden = false;
    this.elements.resultEmblem.textContent = run.energy > 0 ? '✦' : '◇';
    this.elements.resultTitle.textContent = run.energy > 0 ? locale.completeTitle : locale.interruptedTitle;
    this.elements.resultText.textContent = locale.resultText(run);
    this.elements.restart.textContent = locale.newRun;
    this.elements.finish.textContent = locale.menu;
    this.renderRecords();
  }
}
