const CACHE_NAME = 'projeto-gaia-v1.0.2';
const CORE_ASSETS = [
  './', './index.html', './manifest.webmanifest', './assets/css/styles.css',
  './assets/data/missions.json', './assets/data/missions.en.json', './assets/data/missions.es.json', './assets/data/question-formats.json', './assets/data/scientific-sources.json',
  './assets/icons/gaia-icon-192.png', './assets/icons/gaia-icon-512.png', './assets/images/gaia-share.jpg',
  './assets/js/main.js?v=1.0.2', './assets/js/MissionApp.js',
  './assets/js/accessibility/AccessibilityManager.js', './assets/js/audio/SoundManager.js',
  './assets/js/challenges/DailyChallengeManager.js', './assets/js/challenges/ExpeditionManager.js',
  './assets/js/core/SimulatorBridge.js', './assets/js/effects/RocketAnimation.js',
  './assets/js/i18n/MissionLocale.js', './assets/js/i18n/SimulatorTranslations.js',
  './assets/js/missions/CampaignProgress.js', './assets/js/missions/Mission.js', './assets/js/missions/MissionManager.js',
  './assets/js/persistence/SafeStorage.js', './assets/js/persistence/SaveManager.js',
  './assets/js/player/Player.js', './assets/js/player/XPSystem.js', './assets/js/profile/ProfileManager.js',
  './assets/js/ui/BootUI.js', './assets/js/ui/DailyChallengeUI.js', './assets/js/ui/DataManagementUI.js',
  './assets/js/ui/ExpeditionUI.js', './assets/js/ui/JournalUI.js', './assets/js/ui/MissionUI.js',
  './assets/js/ui/ProfileUI.js', './assets/js/ui/TutorialUI.js', './assets/js/ui/VisualAssets.js',
  './assets/js/visual/CelestialTextureFactory.js', './assets/js/visual/CelestialVisualRegistry.js',
  './assets/vendor/three/three.module.js', './assets/vendor/three/addons/controls/OrbitControls.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key.startsWith('projeto-gaia-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

async function fetchAndCache(request, cacheKey = request) {
  const response = await fetch(request);
  if (!response.ok) return response;
  const copy = response.clone();
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(cacheKey, copy);
  } catch (error) {
    console.warn('O recurso foi carregado, mas não pôde ser atualizado no cache.', error);
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const fallbackKey = request.mode === 'navigate' ? './index.html' : request;
  event.respondWith(fetchAndCache(request, fallbackKey).catch(() => caches.match(fallbackKey)));
});
