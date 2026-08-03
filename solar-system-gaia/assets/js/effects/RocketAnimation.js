import { getCelestialSurface } from '../visual/CelestialVisualRegistry.js';
import { missionLocale } from '../i18n/MissionLocale.js';

export class RocketAnimation {
  constructor(element, soundManager = null) {
    this.element = element;
    this.rocket = element.querySelector('.cutscene-rocket');
    this.planet = element.querySelector('.cutscene-planet');
    this.status = element.querySelector('.launch-status');
    this.countdown = element.querySelector('.launch-countdown');
    this.sound = soundManager;
  }

  async launchTo(planetName) {
    const colors = {
      'Mercúrio': '#8d8d8d', 'Vênus': '#d9a85b', 'Terra': '#2b7bdc', 'Marte': '#b54c32',
      'Júpiter': '#c89b72', 'Saturno': '#d9c486', 'Urano': '#83d9df', 'Netuno': '#315bc6'
    };
    this.element.hidden = false;
    this.element.classList.add('visible');
    this.planet.style.setProperty('--planet-color', colors[planetName] ?? '#6ba8ff');
    const surface = getCelestialSurface(planetName);
    this.planet.style.backgroundImage = surface ? `url("${surface}")` : '';
    this.planet.classList.toggle('has-surface', Boolean(surface));
    this.planet.classList.toggle('is-saturn', planetName === 'Saturno');
    const localizedName = missionLocale.bodyName(planetName);
    this.planet.dataset.name = localizedName;
    this.status.textContent = missionLocale.t('routeConfirmed', { target: localizedName });

    for (const number of [3, 2, 1]) {
      this.countdown.textContent = number;
      this.countdown.classList.remove('pulse');
      void this.countdown.offsetWidth;
      this.countdown.classList.add('pulse');
      this.sound?.countdown();
      await new Promise((resolve) => setTimeout(resolve, 650));
    }
    this.countdown.textContent = missionLocale.t('launchWord');
    this.sound?.liftoff();
    await new Promise((resolve) => setTimeout(resolve, 350));
    this.countdown.textContent = '';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('reduce-motion')) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.finish();
      return;
    }

    const flight = this.rocket.animate([
      { transform: 'translate(-50%, 35vh) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, 25vh) scale(1.04)', opacity: 1, offset: 0.18 },
      { transform: 'translate(-50%, -18vh) scale(0.72)', opacity: 1, offset: 0.72 },
      { transform: 'translate(-50%, -37vh) scale(0.18)', opacity: 0 }
    ], { duration: 3200, easing: 'cubic-bezier(0.38, 0.05, 0.18, 1)', fill: 'forwards' });

    await flight.finished.catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 350));
    this.finish();
  }

  finish() {
    this.countdown.textContent = '';
    this.element.classList.remove('visible');
    this.element.hidden = true;
  }
}
