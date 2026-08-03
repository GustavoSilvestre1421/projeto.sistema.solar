import { missionLocale } from '../i18n/MissionLocale.js';
import { safeStorage } from '../persistence/SafeStorage.js';

const content = {
  pt: {
    eyebrow: 'Academia Gaia · Orientação', step: 'Etapa', skip: 'Pular tutorial', back: 'Voltar', next: 'Próximo', finish: 'Começar jornada',
    steps: [
      ['🪐', 'Dois modos de exploração', 'Use o Modo Exploração para navegar livremente. No Modo Missão, você investiga alvos, coleta evidências e avança pela campanha científica.'],
      ['🖱️', 'Controle a câmera', 'No computador, arraste para girar e use a roda para aproximar. No celular, arraste com um dedo e faça o gesto de pinça com dois dedos para controlar o zoom.'],
      ['🎯', 'Selecione corpos celestes', 'Clique ou toque em um planeta, lua ou corpo bônus. Em missões de luas, use Aproximar para acompanhar o planeta hospedeiro e facilitar a seleção.'],
      ['🚀', 'Complete uma investigação', 'Leia o briefing, encontre o alvo, autorize o lançamento e estude as evidências no Centro de Análise antes de responder às perguntas.'],
      ['📓', 'Acompanhe seu progresso', 'Abra o Diário de Bordo para rever dossiês, viagens, estrelas e capítulos. Depois da campanha, o Desafio do Dia e a Expedição Científica serão liberados.']
    ]
  },
  en: {
    eyebrow: 'Gaia Academy · Orientation', step: 'Step', skip: 'Skip tutorial', back: 'Back', next: 'Next', finish: 'Start journey',
    steps: [
      ['🪐', 'Two exploration modes', 'Use Exploration Mode to navigate freely. In Mission Mode, you investigate targets, collect evidence and advance through the science campaign.'],
      ['🖱️', 'Control the camera', 'On a computer, drag to rotate and use the wheel to zoom. On mobile, drag with one finger and pinch with two fingers to control zoom.'],
      ['🎯', 'Select celestial bodies', 'Click or tap a planet, moon or bonus body. During moon missions, use Approach to follow the host planet and make selection easier.'],
      ['🚀', 'Complete an investigation', 'Read the briefing, find the target, authorize launch and study the evidence in the Analysis Center before answering.'],
      ['📓', 'Track your progress', 'Open the Mission Journal to review dossiers, journeys, stars and chapters. After the campaign, the Daily Challenge and Scientific Expedition will unlock.']
    ]
  },
  es: {
    eyebrow: 'Academia Gaia · Orientación', step: 'Etapa', skip: 'Omitir tutorial', back: 'Volver', next: 'Siguiente', finish: 'Comenzar viaje',
    steps: [
      ['🪐', 'Dos modos de exploración', 'Usa el Modo Exploración para navegar libremente. En el Modo Misión, investigas objetivos, recopilas evidencias y avanzas por la campaña científica.'],
      ['🖱️', 'Controla la cámara', 'En la computadora, arrastra para girar y usa la rueda para acercarte. En el móvil, arrastra con un dedo y pellizca con dos dedos para controlar el zoom.'],
      ['🎯', 'Selecciona cuerpos celestes', 'Haz clic o toca un planeta, luna o cuerpo adicional. En misiones lunares, usa Acercar para seguir al planeta anfitrión y facilitar la selección.'],
      ['🚀', 'Completa una investigación', 'Lee el informe, encuentra el objetivo, autoriza el lanzamiento y estudia las evidencias en el Centro de Análisis antes de responder.'],
      ['📓', 'Sigue tu progreso', 'Abre el Diario de misión para revisar informes, viajes, estrellas y capítulos. Después de la campaña se desbloquean el Desafío del Día y la Expedición Científica.']
    ]
  }
};

export class TutorialUI {
  static storageKey = 'projeto-gaia:tutorial:v1';

  constructor(profileManager) {
    this.profileManager = profileManager;
    this.index = 0;
    this.elements = {
      modal: document.getElementById('tutorialModal'),
      modeModal: document.getElementById('modeModal'),
      step: document.getElementById('tutorialStep'),
      eyebrow: document.getElementById('tutorialEyebrow'),
      icon: document.getElementById('tutorialIcon'),
      title: document.getElementById('tutorialTitle'),
      text: document.getElementById('tutorialText'),
      progress: document.getElementById('tutorialProgress'),
      skip: document.getElementById('btnSkipTutorial'),
      back: document.getElementById('btnTutorialBack'),
      next: document.getElementById('btnTutorialNext')
    };
    this.bindEvents();
    if (profileManager.profile && !this.isComplete()) setTimeout(() => this.open(), 0);
  }

  bindEvents() {
    document.getElementById('btnOpenTutorialFromMenu').addEventListener('click', () => this.open(true));
    this.elements.skip.addEventListener('click', () => this.close());
    this.elements.back.addEventListener('click', () => this.go(-1));
    this.elements.next.addEventListener('click', () => this.index === this.current.steps.length - 1 ? this.close() : this.go(1));
    this.profileManager.addEventListener('profile:changed', () => {
      if (!this.isComplete()) setTimeout(() => this.open(), 0);
    });
    missionLocale.addEventListener('locale:changed', () => {
      if (this.elements.modal.classList.contains('visible')) this.render();
    });
    document.addEventListener('keydown', (event) => {
      if (!this.elements.modal.classList.contains('visible')) return;
      if (event.key === 'ArrowRight') this.elements.next.click();
      if (event.key === 'ArrowLeft' && this.index > 0) this.go(-1);
      if (event.key === 'Escape') this.close();
    });
  }

  get current() { return content[missionLocale.language] ?? content.pt; }

  isComplete() {
    return safeStorage.getItem(TutorialUI.storageKey) === 'complete';
  }

  open(force = false) {
    if (!force && this.isComplete()) return;
    this.index = 0;
    this.elements.modeModal.classList.remove('visible');
    this.elements.modal.classList.add('visible');
    this.render();
  }

  close() {
    safeStorage.setItem(TutorialUI.storageKey, 'complete');
    this.elements.modal.classList.remove('visible');
    this.elements.modeModal.classList.add('visible');
  }

  go(offset) {
    this.index = Math.max(0, Math.min(this.current.steps.length - 1, this.index + offset));
    this.render();
  }

  render() {
    const locale = this.current;
    const [icon, title, text] = locale.steps[this.index];
    this.elements.eyebrow.textContent = locale.eyebrow;
    this.elements.step.textContent = `${locale.step} ${this.index + 1}/${locale.steps.length}`;
    this.elements.icon.textContent = icon;
    this.elements.title.textContent = title;
    this.elements.text.textContent = text;
    this.elements.skip.textContent = locale.skip;
    this.elements.back.textContent = locale.back;
    this.elements.back.disabled = this.index === 0;
    this.elements.next.textContent = this.index === locale.steps.length - 1 ? locale.finish : locale.next;
    this.elements.progress.replaceChildren(...locale.steps.map((_, index) => {
      const marker = document.createElement('span');
      marker.classList.toggle('active', index <= this.index);
      return marker;
    }));
    this.elements.progress.setAttribute('aria-valuenow', String(this.index + 1));
    requestAnimationFrame(() => this.elements.next.focus());
  }
}
