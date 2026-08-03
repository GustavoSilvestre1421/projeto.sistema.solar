export class Mission {
  static progressionXP = Object.freeze({
    basic: Object.freeze({ discovery: 20, correctAnswer: 80 }),
    advanced: Object.freeze({ discovery: 30, correctAnswer: 110 }),
    moon: Object.freeze({ discovery: 20, correctAnswer: 100 }),
    bonus: Object.freeze({ discovery: 30, correctAnswer: 120 })
  });

  constructor(data) {
    const required = [
      'id', 'title', 'description', 'planet', 'objective', 'question',
      'alternatives', 'correctAnswer', 'scientificFact', 'scanData', 'dossier', 'sources', 'scientificReviewDate'
    ];

    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`Missão inválida: campo "${field}" ausente.`);
      }
    }

    if (!Array.isArray(data.alternatives) || data.alternatives.length < 2) {
      throw new Error(`Missão ${data.id}: são necessárias ao menos duas alternativas.`);
    }

    if (!Number.isInteger(data.correctAnswer) || !data.alternatives[data.correctAnswer]) {
      throw new Error(`Missão ${data.id}: resposta correta inválida.`);
    }

    if (!Array.isArray(data.sources) || data.sources.length === 0 || data.sources.some((source) =>
      !source.organization || !source.title || !/^https:\/\/.+/.test(source.url))) {
      throw new Error(`Missão ${data.id}: fontes científicas inválidas ou ausentes.`);
    }

    Object.assign(this, data);
    this.type = data.type ?? 'locate';
    this.difficulty = ['moon', 'bonus'].includes(this.type)
      ? this.type
      : ['comparison', 'multiTarget', 'mystery'].includes(this.type) ? 'advanced' : 'basic';
    this.xp = Mission.progressionXP[this.difficulty];
    this.targetBodies = Object.freeze([...(data.targetBodies ?? [data.planet])]);
    this.destination = data.destination ?? data.planet;
    this.displayName = data.displayName ?? data.planet;
    this.questions = [
      { question: data.question, alternatives: data.alternatives, correctAnswer: data.correctAnswer },
      ...(data.additionalQuestions ?? [])
    ].map((question, index) => {
      const formatted = { type: 'multipleChoice', ...question, ...(data.questionFormats?.[index] ?? {}) };
      return Object.freeze({
        ...formatted,
        alternatives: formatted.alternatives ? Object.freeze([...formatted.alternatives]) : undefined,
        items: formatted.items ? Object.freeze([...formatted.items]) : undefined,
        correctOrder: formatted.correctOrder ? Object.freeze([...formatted.correctOrder]) : undefined
      });
    });
    if (this.questions.some((question) => !question.question
      || (question.type === 'ordering'
        ? !question.items?.length || question.correctOrder?.length !== question.items.length
        : !question.alternatives?.[question.correctAnswer]))) {
      throw new Error(`Missão ${data.id}: banco de perguntas inválido.`);
    }
    this.dossier = Object.freeze({
      ...data.dossier,
      sections: Object.freeze(data.dossier.sections.map((section) => Object.freeze([...section])))
    });
    this.sources = Object.freeze(data.sources.map((source) => Object.freeze({ ...source })));
    Object.freeze(this.alternatives);
    Object.freeze(this.scanData);
    Object.freeze(this.questions);
    Object.freeze(this);
  }
}
