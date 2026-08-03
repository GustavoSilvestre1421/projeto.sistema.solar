import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Mission } from '../assets/js/missions/Mission.js';
import { MissionManager } from '../assets/js/missions/MissionManager.js';
import { SaveManager } from '../assets/js/persistence/SaveManager.js';

if (!globalThis.CustomEvent) globalThis.CustomEvent = class CustomEvent extends Event {
  constructor(type, options = {}) { super(type); this.detail = options.detail; }
};

const readJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const missions = readJSON('../assets/data/missions.json');
const sources = readJSON('../assets/data/scientific-sources.json');
const formats = readJSON('../assets/data/question-formats.json');

for (const mission of missions) {
  assert.equal('xp' in mission, false, `${mission.id} não deve duplicar a fonte de XP do domínio`);
  mission.sources = sources.missions[mission.id];
  mission.scientificReviewDate = sources.reviewedAt;
  mission.questionFormats = formats.pt?.[mission.id] ?? {};
  const validated = new Mission(mission);
  assert.equal(validated.questions.length, 2, `${mission.id} deve possuir duas perguntas`);
  assert.ok(validated.sources.length > 0, `${mission.id} deve possuir fontes`);
}

const xpByType = Object.fromEntries(new MissionManager({
  missions,
  savedState: {},
  saveManager: { save() { return true; } },
  bridge: new EventTarget()
}).missions.map((mission) => [mission.type, mission.xp]));
assert.deepEqual(xpByType.locate, { discovery: 20, correctAnswer: 80 });
assert.deepEqual(xpByType.comparison, { discovery: 30, correctAnswer: 110 });
assert.deepEqual(xpByType.moon, { discovery: 20, correctAnswer: 100 });
assert.deepEqual(xpByType.bonus, { discovery: 30, correctAnswer: 120 });

let lastSave = {};
const manager = new MissionManager({
  missions,
  savedState: {},
  saveManager: { save(player) { lastSave = player.serialize(); return true; } },
  bridge: new EventTarget()
});
manager.setMode('mission');
while (manager.currentMission) {
  const mission = manager.currentMission;
  mission.targetBodies.forEach((bodyName) => manager.handleBodySelected({ bodyName, position: {} }));
  while (!manager.awaitingAdvance) {
    const question = manager.currentQuestion;
    manager.answer(question.type === 'ordering' ? [...question.correctOrder] : question.correctAnswer);
  }
  manager.advance();
}
assert.equal(manager.player.xp, 2510);
assert.equal(manager.player.completedMissionIds.size, 21);
assert.equal([...manager.player.missionStars.values()].reduce((sum, value) => sum + value, 0), 63);

let finalSave = {};
const firstRun = new MissionManager({
  missions,
  savedState: {},
  saveManager: { save(player) { finalSave = player.serialize(); return true; } },
  bridge: new EventTarget()
});
firstRun.setMode('mission');
const firstMission = firstRun.currentMission;
firstMission.targetBodies.forEach((bodyName) => firstRun.handleBodySelected({ bodyName, position: {} }));
while (!firstRun.awaitingAdvance) {
  const question = firstRun.currentQuestion;
  firstRun.answer(question.type === 'ordering' ? [...question.correctOrder] : question.correctAnswer);
}
assert.equal(finalSave.pendingCompletionMissionId, firstMission.id);
const restored = new MissionManager({ missions, savedState: finalSave, saveManager: { save() { return true; } }, bridge: new EventTarget() });
let resumedSuccess = false;
restored.addEventListener('answer:correct', ({ detail }) => { resumedSuccess = detail.resumed === true && detail.mission.id === firstMission.id; });
restored.setMode('mission');
assert.equal(resumedSuccess, true, 'A tela final da missão deve ser retomada após recarregar');

globalThis.localStorage = {
  getItem: () => JSON.stringify({ completedMissionIds: {}, missionObservations: [], questionOrders: 'inválido' }),
  setItem() {}, removeItem() {}
};
const sanitized = new SaveManager().load();
assert.deepEqual(sanitized.completedMissionIds, []);
assert.deepEqual(sanitized.missionObservations, {});
assert.deepEqual(sanitized.questionOrders, {});
new MissionManager({ missions, savedState: sanitized, saveManager: { save() { return true; } }, bridge: new EventTarget() });

console.log('✓ 21 missões, 42 perguntas, 2.510 XP e 63 estrelas');
console.log('✓ recompensas derivadas de uma única fonte de XP');
console.log('✓ retomada da tela de sucesso preservada');
console.log('✓ save estruturalmente corrompido recuperado');
