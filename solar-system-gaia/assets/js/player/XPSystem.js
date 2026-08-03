export class XPSystem {
  static levels = Object.freeze([
    { name: 'Cadete', minimumXP: 0 },
    { name: 'Explorador', minimumXP: 200 },
    { name: 'Pesquisador', minimumXP: 500 },
    { name: 'Comandante', minimumXP: 900 },
    { name: 'Especialista Planetário', minimumXP: 1400 },
    { name: 'Explorador do Sistema Solar', minimumXP: 2000 },
    { name: 'Pioneiro das Fronteiras', minimumXP: 2450 }
  ]);

  static getLevel(xp) {
    return [...this.levels]
      .reverse()
      .find((level) => xp >= level.minimumXP) ?? this.levels[0];
  }
}
