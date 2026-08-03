export class CampaignProgress {
  static chapters = Object.freeze([
    Object.freeze({ id: 'planetaryAtlas', start: 1, end: 8, labelKey: 'chapterPlanetaryAtlas' }),
    Object.freeze({ id: 'advancedAnalysis', start: 9, end: 11, labelKey: 'chapterAdvancedAnalysis' }),
    Object.freeze({ id: 'jovianWorlds', start: 12, end: 15, labelKey: 'chapterJovianWorlds' }),
    Object.freeze({ id: 'outerFrontiers', start: 16, end: 18, labelKey: 'chapterOuterFrontiers' }),
    Object.freeze({ id: 'bonusArchive', start: 19, end: 21, labelKey: 'chapterBonusArchive' })
  ]);

  static getChapter(order) {
    return this.chapters.find((chapter) => order >= chapter.start && order <= chapter.end) ?? this.chapters.at(-1);
  }

  static isChapterEnd(order) {
    return this.getChapter(order).end === order;
  }
}
