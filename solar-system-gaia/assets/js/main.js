import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { simulatorBridge } from './core/SimulatorBridge.js';
import { initializeMissionMode } from './MissionApp.js';
import { BootUI } from './ui/BootUI.js';
import { createSafeCelestialTexture } from './visual/CelestialTextureFactory.js';
import { uiTranslations, nameTranslations } from './i18n/SimulatorTranslations.js';
import { safeStorage } from './persistence/SafeStorage.js';
import { missionLocale } from './i18n/MissionLocale.js';

const GAIA_BUILD = '1.0.2';
const htmlBuild = document.querySelector('meta[name="gaia-build"]')?.content;
const localeBundleIsCurrent = missionLocale.t('modeTitle') !== 'modeTitle'
    && missionLocale.t('analysisEyebrow') !== 'analysisEyebrow'
    && ['pt', 'en', 'es'].every((language) => uiTranslations[language]?.build === GAIA_BUILD)
    && uiTranslations.es?.btnMove === 'Mover'
    && uiTranslations.es?.btnNorthView === 'Vista Norte'
    && uiTranslations.es?.speedLabel === 'Velocidad:';

// Um HTML novo não pode continuar com módulos antigos retidos por um Service Worker anterior.
if (htmlBuild !== GAIA_BUILD || !localeBundleIsCurrent) {
    let recoveryAttempts = 0;
    try { recoveryAttempts = Number(sessionStorage.getItem('projeto-gaia:update-recovery')) || 0; } catch {}
    if (recoveryAttempts < 2) {
        try { sessionStorage.setItem('projeto-gaia:update-recovery', String(recoveryAttempts + 1)); } catch {}
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.filter((key) => key.startsWith('projeto-gaia-')).map((key) => caches.delete(key)));
        }
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration('./');
            if (registration) await registration.unregister();
        }
        location.reload();
        await new Promise(() => {});
    }
} else {
    try { sessionStorage.removeItem('projeto-gaia:update-recovery'); } catch {}
}

const bootUI = new BootUI();

// Capturador de erros amigável para evitar tela preta sem feedback didático
window.addEventListener('error', function(e) {
    console.error(e);
    const errDiv = document.createElement('div');
    errDiv.style.position = 'absolute';
    errDiv.style.top = '20px';
    errDiv.style.left = '50%';
    errDiv.style.transform = 'translateX(-50%)';
    errDiv.style.background = 'rgba(220, 53, 69, 0.9)';
    errDiv.style.color = '#fff';
    errDiv.style.padding = '12px 24px';
    errDiv.style.borderRadius = '8px';
    errDiv.style.zIndex = '99999';
    errDiv.style.fontSize = '0.9em';
    errDiv.style.fontFamily = 'sans-serif';
    errDiv.style.textAlign = 'center';
    errDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
    errDiv.style.border = '1px solid rgba(255,255,255,0.2)';
    const technicalMessage = e?.message ? String(e.message).replace(/[<>]/g, '') : 'Erro desconhecido';
    const warningTitle = document.createElement('strong');
    warningTitle.textContent = missionLocale.t('systemWarning');
    const warningDetail = document.createElement('small');
    warningDetail.style.opacity = '0.8';
    warningDetail.textContent = technicalMessage;
    errDiv.append(warningTitle, ` ${missionLocale.t('renderingInterrupted')}`, document.createElement('br'), warningDetail);
    document.body.appendChild(errDiv);
});

// Declaração explícita de todos os elementos DOM para evitar poluição e falhas globais do JS
const langSelect = document.getElementById('langSelect');
const btnOpenCelestialNavigator = document.getElementById('btnOpenCelestialNavigator');
const celestialNavigatorModal = document.getElementById('celestialNavigatorModal');
const btnCloseCelestialNavigator = document.getElementById('btnCloseCelestialNavigator');
const celestialNavigatorEyebrow = document.getElementById('celestialNavigatorEyebrow');
const celestialNavigatorTitle = document.getElementById('celestialNavigatorTitle');
const celestialNavigatorHelp = document.getElementById('celestialNavigatorHelp');
const celestialBodySelectLabel = document.getElementById('celestialBodySelectLabel');
const celestialBodySelect = document.getElementById('celestialBodySelect');
const btnSelectCelestialBody = document.getElementById('btnSelectCelestialBody');
const infoBox = document.getElementById('infoBox');
const infoBoxClose = document.getElementById('infoBoxClose');
const btnFollowPlanet = document.getElementById('btnFollowPlanet');
const btnCollapseControls = document.getElementById('btnCollapseControls');
const controlsContainer = document.getElementById('controlsContainer');
const btnToggleAnimation = document.getElementById('btnToggleAnimation');
const btnNorthView = document.getElementById('btnNorthView');
const btnAboutProject = document.getElementById('btnAboutProject');
const aboutModal = document.getElementById('aboutModal');
const aboutModalClose = document.getElementById('aboutModalClose');
const aboutModalTitle = document.getElementById('aboutModalTitle');
const aboutModalText = document.getElementById('aboutModalText');
const aboutModalContactLabel = document.getElementById('aboutModalContactLabel');

const showOrbitsCheck = document.getElementById('showOrbitsCheck');
const showLabelsCheck = document.getElementById('showLabelsCheck');
const showAsteroidsCheck = document.getElementById('showAsteroidsCheck');
const showDwarfPlanetsCheck = document.getElementById('showDwarfPlanetsCheck');
const showHalleyCheck = document.getElementById('showHalleyCheck');
const showMajorMoonsCheck = document.getElementById('showMajorMoonsCheck');
const showAxesCheck = document.getElementById('showAxesCheck');
const highlightPlanetsCheck = document.getElementById('highlightPlanetsCheck');
const useProportionalSpeedCheck = document.getElementById('useProportionalSpeedCheck');
const useProportionalDistanceCheck = document.getElementById('useProportionalDistanceCheck');
const useProportionalDiameterCheck = document.getElementById('useProportionalDiameterCheck');
const realSunScaleCheck = document.getElementById('realSunScaleCheck');
const graphicsQualitySelect = document.getElementById('graphicsQualitySelect');
const generalSpeedSlider = document.getElementById('generalSpeedSlider');
const generalSpeedInput = document.getElementById('generalSpeedInput');
const zoomSlider = document.getElementById('zoomSlider');
const zoomInput = document.getElementById('zoomInput');
const tooltip = document.getElementById('tooltip');

let currentLang = 'pt';
let lastStorageWarningAt = 0;
function showInterfaceToast(message, duration = 3800) {
    const toast = document.getElementById('missionToast');
    if (!toast || !message) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toast.interfaceTimer);
    toast.interfaceTimer = setTimeout(() => toast.classList.remove('visible'), duration);
}
safeStorage.addEventListener('storage:error', () => {
    const now = Date.now();
    if (now - lastStorageWarningAt < 3500) return;
    lastStorageWarningAt = now;
    const messages = {
        pt: 'Não foi possível salvar neste navegador. A experiência continua, mas esta alteração pode não permanecer.',
        en: 'This browser could not save your data. You can continue, but this change may not persist.',
        es: 'No se pudo guardar en este navegador. Puedes continuar, pero este cambio puede no conservarse.'
    };
    showInterfaceToast(messages[currentLang] ?? messages.pt, 5200);
});

const container = document.getElementById('canvas-container');
const labelsContainer = document.getElementById('labels-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x01030d);
scene.fog = new THREE.FogExp2(0x01030d, 0.000018);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.005, 50000);
const BASE_CAMERA_DISTANCE = 300;
camera.position.set(0, 150, BASE_CAMERA_DISTANCE); 

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);
bootUI.setProgress(24, missionLocale.t('bootRenderer'));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 15000; 

// Luz Ambiente Estabilizada
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15); 
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 3.5, 0, 0); 
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

let isAnimationRunning = true; 
let showOrbits = true; 
let showLabels = true; 
let showAsteroids = true; 
let showDwarfPlanets = true;
let showHalley = true;
let showMajorMoons = true; 
let showAxes = false;
let highlightPlanets = false; 
let useProportionalSpeed = false; 
let useProportionalDiameter = false; 
let useProportionalDistance = false; 
let useRealSunScale = false;
let speedMultiplier = 1.0; 
let zoomLevel = 1.0;
let isUpdatingFromControls = false; 

let followingBody = null; 
let currentlySelectedBody = null;
let hoveredBody = null; 

let isTransitioningCamera = false;
let targetCameraPos = null;
let targetControlsTarget = null;
let precisionMode = false;
let precisionTargetName = null;
let animationStateBeforePrecision = true;
let panStateBeforePrecision = true;

const SCALE_FACTOR = 150; 
const BASE_EARTH_PROPORTIONAL_SPEED = -0.010;
const EARTH_DIAMETER_KM = 12742; 
const ORBIT_SPACING_MULTIPLIER = 2.5; 
const HIGHLIGHT_FACTOR = 1.35; 

const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

const colorMap = {
    'orange': 0xffa500, 'gray': 0x808080, 'khaki': 0xf0e68c, 'royalblue': 0x4169e1,
    'red': 0xff0000, 'burlywood': 0xdeb887, 'palegoldenrod': 0xeee8aa, 'lightblue': 0xadd8e6,
    'darkblue': 0x00008b, 'lightgrey': 0xd3d3d3, '#fffacd': 0xfffacd, '#f5f5dc': 0xf5f5dc,
    '#d2b48c': 0xd2b48c, '#8b4513': 0x8b4513, '#ffdab9': 0xffdab9
};

const celestialBodiesData = [
     { name: "Sol", type: "star", radiusVisual: 0.06, color: 'orange', angle: 0, speedVisual: 0, speedProportional: 0, orbitRadius: 0, rotationAngle: 0, rotationSpeedVisual: -0.001, e: 0, i: 0, Omega: 0, omega: 0, axialTilt: 7.25 * Math.PI / 180, info: { diameter: 1392700, distance: 0, period: 'N/A', orbitalSpeed: 'N/A', satellites: 'N/A' } },
     { name: "Mercúrio", type: "planet", radiusVisual: 0.008, color: 'gray', angle: Math.random() * 2 * Math.PI, speedVisual: -0.020, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 88), orbitRadius: 0.10, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.02, e: 0.2056, i: 7.00 * Math.PI / 180, Omega: 48.33 * Math.PI / 180, omega: 29.12 * Math.PI / 180, axialTilt: 0.034 * Math.PI / 180, info: { diameter: 4879.4, distance: 57909227, period: 88, orbitalSpeed: 170503, satellites: 0 } },
     { name: "Vênus", type: "planet", radiusVisual: 0.01, color: 'khaki', angle: Math.random() * 2 * Math.PI, speedVisual: -0.012, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 225), orbitRadius: 0.15, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: 0.015, e: 0.0067, i: 3.39 * Math.PI / 180, Omega: 76.68 * Math.PI / 180, omega: 54.88 * Math.PI / 180, axialTilt: 177.3 * Math.PI / 180, info: { diameter: 12103.6, distance: 108209475, period: 225, orbitalSpeed: 126074, satellites: 0 } },
     { name: "Terra", type: "planet", radiusVisual: 0.011, color: 'royalblue', angle: Math.random() * 2 * Math.PI, speedVisual: BASE_EARTH_PROPORTIONAL_SPEED, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 365), orbitRadius: 0.20, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.05, e: 0.0167, i: 0.0 * Math.PI / 180, Omega: -11.26 * Math.PI / 180, omega: 114.20 * Math.PI / 180, axialTilt: 23.44 * Math.PI / 180, info: { diameter: 12742, distance: 149598262, period: 365, orbitalSpeed: 107218, satellites: 1 } },
     { name: "Marte", type: "planet", radiusVisual: 0.007, color: 'red', angle: Math.random() * 2 * Math.PI, speedVisual: -0.008, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 687), orbitRadius: 0.27, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.048, e: 0.0934, i: 1.85 * Math.PI / 180, Omega: 49.57 * Math.PI / 180, omega: 286.50 * Math.PI / 180, axialTilt: 25.19 * Math.PI / 180, info: { diameter: 6779, distance: 227943824, period: 687, orbitalSpeed: 86677, satellites: 2 } },
     { name: "Júpiter", type: "planet", radiusVisual: 0.03, color: 'burlywood', angle: Math.random() * 2 * Math.PI, speedVisual: -0.004, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 4333), orbitRadius: 0.42, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.12, e: 0.0489, i: 1.30 * Math.PI / 180, Omega: 100.55 * Math.PI / 180, omega: 275.06 * Math.PI / 180, axialTilt: 3.13 * Math.PI / 180, info: { diameter: 139822, distance: 778340821, period: 4333, orbitalSpeed: 47002, satellites: 101 } },
     { name: "Saturno", type: "planet", radiusVisual: 0.027, color: 'palegoldenrod', angle: Math.random() * 2 * Math.PI, speedVisual: -0.003, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 10759), orbitRadius: 0.61, hasRing: true, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.11, e: 0.0565, i: 2.49 * Math.PI / 180, Omega: 113.71 * Math.PI / 180, omega: 338.26 * Math.PI / 180, axialTilt: 26.73 * Math.PI / 180, info: { diameter: 116464, distance: 1426666422, period: 10759, orbitalSpeed: 34701, satellites: 274 } },
     { name: "Urano", type: "planet", radiusVisual: 0.02, color: 'lightblue', angle: Math.random() * 2 * Math.PI, speedVisual: -0.002, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 30687), orbitRadius: 0.78, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: 0.07, e: 0.0457, i: 0.77 * Math.PI / 180, Omega: 74.22 * Math.PI / 180, omega: 96.54 * Math.PI / 180, axialTilt: 97.77 * Math.PI / 180, info: { diameter: 50724, distance: 2870658186, period: 30687, orbitalSpeed: 24477, satellites: 28 } },
     { name: "Netuno", type: "planet", radiusVisual: 0.019, color: 'darkblue', angle: Math.random() * 2 * Math.PI, speedVisual: -0.001, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 60190), orbitRadius: 0.93, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.075, e: 0.0113, i: 1.77 * Math.PI / 180, Omega: 131.72 * Math.PI / 180, omega: 273.18 * Math.PI / 180, axialTilt: 28.32 * Math.PI / 180, info: { diameter: 49244, distance: 4498396441, period: 60190, orbitalSpeed: 19566, satellites: 16 } },
     { name: "Ceres", type: "minorBody", radiusVisual: 0.0055, color: 'gray', angle: Math.random() * 2 * Math.PI, speedVisual: -0.006, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 1682), orbitRadius: 0.34, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.035, e: 0.0758, i: 10.59 * Math.PI / 180, Omega: 80.3 * Math.PI / 180, omega: 73.6 * Math.PI / 180, axialTilt: 4 * Math.PI / 180, info: { diameter: 946, distance: 413700000, period: 1682, orbitalSpeed: 64360, satellites: 0 } },
     { name: "Plutão", type: "minorBody", radiusVisual: 0.006, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speedVisual: -0.0007, speedProportional: BASE_EARTH_PROPORTIONAL_SPEED * (365 / 90560), orbitRadius: 1.08, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: 0.012, e: 0.2488, i: 17.16 * Math.PI / 180, Omega: 110.3 * Math.PI / 180, omega: 113.8 * Math.PI / 180, axialTilt: 119.6 * Math.PI / 180, info: { diameter: 2377, distance: 5906380000, period: 90560, orbitalSpeed: 17096, satellites: 5 } },
     { name: "Cometa Halley", type: "minorBody", radiusVisual: 0.0045, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speedVisual: 0.0015, speedProportional: Math.abs(BASE_EARTH_PROPORTIONAL_SPEED * (365 / 27500)), orbitRadius: 0.74, rotationAngle: Math.random() * 2 * Math.PI, rotationSpeedVisual: -0.025, e: 0.78, i: 162.26 * Math.PI / 180, Omega: 58.4 * Math.PI / 180, omega: 111.3 * Math.PI / 180, axialTilt: 0, info: { diameter: 11, distance: 2668000000, period: 27500, orbitalSpeed: 54500, satellites: 0 } }
];

const earthData = celestialBodiesData.find(p => p.name === "Terra");
const earthRealDistance = earthData.info.distance;

celestialBodiesData.forEach(body => {
     if (body.info && body.info.diameter) {
         body.radiusProportional = earthData.radiusVisual * (body.info.diameter / EARTH_DIAMETER_KM);
     } else body.radiusProportional = body.radiusVisual;

     if (body.type === 'planet') {
         body.orbitRadiusProportional = earthData.orbitRadius * (body.info.distance / earthRealDistance);
     } else body.orbitRadiusProportional = body.orbitRadius;
});

const moonsData = [
      { name: "Lua", parent: "Terra", radiusVisual: 0.002, radiusProportional: earthData.radiusVisual * (3475 / EARTH_DIAMETER_KM), orbitGap: 0.015, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.05, e: 0.0549, i: 5.145 * Math.PI / 180, Omega: 125.08 * Math.PI / 180, omega: 318.15 * Math.PI / 180, info: { diameter: 3475, distance: 384400, period: 27.3, orbitalSpeed: 'N/A', satellites: 'N/A' } },
      { name: "Fobos", parent: "Marte", radiusVisual: 0.001, radiusProportional: earthData.radiusVisual * (22.2 / EARTH_DIAMETER_KM), orbitGap: 0.005, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.12, e: 0.0151, i: 1.093 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Deimos", parent: "Marte", radiusVisual: 0.0008, radiusProportional: earthData.radiusVisual * (12.6 / EARTH_DIAMETER_KM), orbitGap: 0.010, color: 'darkgrey', angle: Math.random() * 2 * Math.PI, speed: -0.08, e: 0.0002, i: 0.93 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Io", parent: "Júpiter", radiusVisual: 0.0016, radiusProportional: earthData.radiusVisual * (3643 / EARTH_DIAMETER_KM), orbitGap: 0.009, color: '#fffacd', angle: Math.random() * 2 * Math.PI, speed: -0.20, e: 0.0041, i: 0.05 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Europa", parent: "Júpiter", radiusVisual: 0.0014, radiusProportional: earthData.radiusVisual * (3122 / EARTH_DIAMETER_KM), orbitGap: 0.017, color: '#f5f5dc', angle: Math.random() * 2 * Math.PI, speed: -0.16, e: 0.009, i: 0.47 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Ganimedes", parent: "Júpiter", radiusVisual: 0.002, radiusProportional: earthData.radiusVisual * (5268 / EARTH_DIAMETER_KM), orbitGap: 0.026, color: '#d2b48c', angle: Math.random() * 2 * Math.PI, speed: -0.12, e: 0.0013, i: 0.20 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Calisto", parent: "Júpiter", radiusVisual: 0.0018, radiusProportional: earthData.radiusVisual * (4821 / EARTH_DIAMETER_KM), orbitGap: 0.036, color: '#8b4513', angle: Math.random() * 2 * Math.PI, speed: -0.08, e: 0.0074, i: 0.20 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Encélado", parent: "Saturno", radiusVisual: 0.0012, radiusProportional: earthData.radiusVisual * (504 / EARTH_DIAMETER_KM), orbitGap: 0.050, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.15, e: 0.0047, i: 0.01 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Reia", parent: "Saturno", radiusVisual: 0.0015, radiusProportional: earthData.radiusVisual * (1527 / EARTH_DIAMETER_KM), orbitGap: 0.070, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.11, e: 0.001, i: 0.33 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Titã", parent: "Saturno", radiusVisual: 0.002, radiusProportional: earthData.radiusVisual * (5150 / EARTH_DIAMETER_KM), orbitGap: 0.090, color: '#ffdab9', angle: Math.random() * 2 * Math.PI, speed: -0.10, e: 0.0288, i: 0.348 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Jápeto", parent: "Saturno", radiusVisual: 0.0016, radiusProportional: earthData.radiusVisual * (1469 / EARTH_DIAMETER_KM), orbitGap: 0.110, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.06, e: 0.0286, i: 15.47 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Titânia", parent: "Urano", radiusVisual: 0.0015, radiusProportional: earthData.radiusVisual * (1578 / EARTH_DIAMETER_KM), orbitGap: 0.015, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.09, e: 0.0011, i: 0.34 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Oberon", parent: "Urano", radiusVisual: 0.0014, radiusProportional: earthData.radiusVisual * (1522 / EARTH_DIAMETER_KM), orbitGap: 0.028, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.07, e: 0.0014, i: 0.05 * Math.PI / 180, Omega: 0, omega: 0 },
      { name: "Tritão", parent: "Netuno", radiusVisual: 0.0018, radiusProportional: earthData.radiusVisual * (2706 / EARTH_DIAMETER_KM), orbitGap: 0.020, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: 0.08, e: 0.00001, i: 156.8 * Math.PI / 180, Omega: 0, omega: 0 }, 
      { name: "Nereida", parent: "Netuno", radiusVisual: 0.001, radiusProportional: earthData.radiusVisual * (340 / EARTH_DIAMETER_KM), orbitGap: 0.040, color: 'lightgrey', angle: Math.random() * 2 * Math.PI, speed: -0.04, e: 0.7512, i: 7.23 * Math.PI / 180, Omega: 0, omega: 0 }
];

let celestialObjects = []; 
let moonObjects = [];
let raycastTargets = []; 
const DWARF_PLANET_NAMES = new Set(['Ceres', 'Plutão']);
const isDwarfPlanet = (body) => DWARF_PLANET_NAMES.has(body?.data?.name);
const isHalley = (body) => body?.data?.name === 'Cometa Halley';
const isBodyVisible = (body) => document.body.classList.contains('mission-mode')
    || ((!isDwarfPlanet(body) || showDwarfPlanets) && (!isHalley(body) || showHalley));
const visibleRaycastTargets = () => raycastTargets.filter((target) => {
    const body = [...celestialObjects, ...moonObjects].find((candidate) => candidate.collisionMesh === target);
    return body && isBodyVisible(body) && (!body.parentObj || showMajorMoons);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const collisionGeo = new THREE.SphereGeometry(1, 12, 12);
const collisionMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.0, 
    depthWrite: false
});

// 1. Definição da Geração de Estrelas Tridimensionais
function createRadialTexture(innerColor, outerColor = 'rgba(0,0,0,0)') {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(0.25, innerColor);
    gradient.addColorStop(1, outerColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function createStars() {
    const starsGeo = new THREE.BufferGeometry();
    const starsMat = new THREE.PointsMaterial({ size: 1.15, transparent: true, opacity: 0.88, vertexColors: true, sizeAttenuation: true, depthWrite: false });
    const starsVertices = [];
    const starColors = [];
    const palette = [new THREE.Color(0xffffff), new THREE.Color(0xbdd9ff), new THREE.Color(0xffe2b6)];
    for(let i=0; i<4200; i++) {
        const r = 8000 + Math.random() * 4000; 
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        starsVertices.push(x, y, z);
        const color = palette[Math.floor(Math.random() * palette.length)];
        const intensity = 0.65 + Math.random() * 0.35;
        starColors.push(color.r * intensity, color.g * intensity, color.b * intensity);
    }
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    const starSystem = new THREE.Points(starsGeo, starsMat);
    scene.add(starSystem);

    const nebulaTexture = createRadialTexture('rgba(70,110,210,.32)');
    [[-2600,900,-4200,2600],[3300,-1200,-5200,3000],[-800,-2600,-6200,2400]].forEach(([x,y,z,size], index) => {
        const material = new THREE.SpriteMaterial({ map: nebulaTexture, color: index === 1 ? 0x71579d : 0x456fae, transparent: true, opacity: .11, depthWrite: false, blending: THREE.AdditiveBlending });
        const cloud = new THREE.Sprite(material);
        cloud.position.set(x,y,z);
        cloud.scale.set(size,size,1);
        scene.add(cloud);
    });
}

createStars();
bootUI.setProgress(42, missionLocale.t('bootStars'));

// Cálculo dinâmico unificado do diâmetro dos corpos
function getBodyRadius(bodyData, diameterAdjFactor) {
    let radiusFactor = useProportionalDiameter ? bodyData.radiusProportional : bodyData.radiusVisual;
    let currentRadius = radiusFactor * SCALE_FACTOR;

    if (useProportionalDistance && useProportionalDiameter) {
        currentRadius *= diameterAdjFactor;
    } else if (bodyData.type === 'star' && useProportionalDistance && !useProportionalDiameter) {
        const mercuryData = celestialBodiesData.find(p => p.name === "Mercúrio");
        const mercuryOrbitProportional = mercuryData.orbitRadiusProportional * SCALE_FACTOR;
        const mercuryPerihelion = mercuryOrbitProportional * (1 - mercuryData.e);
        currentRadius = mercuryPerihelion * 0.40;
    }

    return Math.max(0.0001, currentRadius);
}

// Cálculo dinâmico do diâmetro das luas
function getMoonRadius(moonData, parentData, diameterAdjFactor) {
    let moonRadius = (useProportionalDiameter ? moonData.radiusProportional : moonData.radiusVisual) * SCALE_FACTOR;
    if (useProportionalDistance && useProportionalDiameter) {
        moonRadius *= diameterAdjFactor;
    }
    return Math.max(0.05, moonRadius);
}

// Cálculo automático da distância de foco da câmera
function getOptimalCameraDistance(bodyObj) {
    const data = bodyObj.data;
    const diameterAdjFactor = getRadiusParams();
    const currentRadius = getBodyRadius(data, diameterAdjFactor);
    const multiplier = data.hasRing ? 6.5 : 4.0;
    return currentRadius * multiplier;
}

// 2. Criação dos Planetas e Sol
celestialBodiesData.forEach(data => {
    const colorHex = colorMap[data.color] || 0xffffff;
    const surfaceTexture = createSafeCelestialTexture(data.name, colorHex, renderer);
    
    const material = data.type === 'star' ? 
        new THREE.MeshBasicMaterial({ map: surfaceTexture, color: surfaceTexture ? 0xffffff : colorHex }) : 
        new THREE.MeshStandardMaterial({ map: surfaceTexture, color: surfaceTexture ? 0xffffff : colorHex, roughness: data.name === 'Terra' ? .72 : .88, metalness: 0.0 });
        
    const group = new THREE.Group();
    group.rotation.z = data.axialTilt || 0; 
    scene.add(group);

    const mesh = new THREE.Mesh(sphereGeo, material);
    mesh.castShadow = false; 
    mesh.receiveShadow = data.type !== 'star'; 
    group.add(mesh);

    let atmosphereMesh = null;
    let glowSprite = null;
    let cometTail = null;
    if (data.type === 'star') {
        const glowMaterial = new THREE.SpriteMaterial({ map: createRadialTexture('rgba(255,210,92,.95)'), color: 0xffb347, transparent: true, opacity: .82, depthWrite: false, blending: THREE.AdditiveBlending });
        glowSprite = new THREE.Sprite(glowMaterial);
        glowSprite.scale.set(7.5, 7.5, 1);
        group.add(glowSprite);
    } else {
        const atmosphereColors = { 'Vênus': 0xffc66d, 'Terra': 0x5aa9ff, 'Marte': 0xe68562, 'Júpiter': 0xe3b68d, 'Saturno': 0xe8d39b, 'Urano': 0x8ff2f4, 'Netuno': 0x557cff };
        const atmosphereColor = atmosphereColors[data.name];
        if (atmosphereColor) {
            atmosphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: atmosphereColor, transparent: true, opacity: data.name === 'Terra' ? .16 : .09, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }));
            atmosphereMesh.scale.setScalar(1.055);
            group.add(atmosphereMesh);
        }
        if (data.name === 'Cometa Halley') {
            const tailGeometry = new THREE.ConeGeometry(0.75, 5, 18, 1, true);
            const tailMaterial = new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
            cometTail = new THREE.Mesh(tailGeometry, tailMaterial);
            scene.add(cometTail);
        }
    }
    
    const highlightGeo = new THREE.SphereGeometry(1, 16, 16);
    const highlightMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0,
        depthWrite: false
    });
    const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
    group.add(highlightMesh);
    
    const collisionMesh = new THREE.Mesh(collisionGeo, collisionMat);
    scene.add(collisionMesh);
    raycastTargets.push(collisionMesh); 

    let ringMesh = null;
    if (data.hasRing) {
        const ringGeo = new THREE.RingGeometry(1.3, 2.2, 128, 8);
        const positions = ringGeo.attributes.position;
        const ringColors = [];
        const ringPalette = [new THREE.Color(0xd8cba6), new THREE.Color(0x978c72), new THREE.Color(0xeee1b9), new THREE.Color(0x736b5d)];
        for (let index = 0; index < positions.count; index++) {
            const radius = Math.hypot(positions.getX(index), positions.getY(index));
            const normalized = (radius - 1.3) / .9;
            const band = Math.max(0, Math.min(ringPalette.length - 1, Math.floor(normalized * ringPalette.length)));
            const color = ringPalette[band] ?? ringPalette[0];
            ringColors.push(color.r, color.g, color.b);
        }
        ringGeo.setAttribute('color', new THREE.Float32BufferAttribute(ringColors, 3));
        const ringMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.82, roughness: .92, depthWrite: false });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2; 
        ringMesh.castShadow = false; 
        ringMesh.receiveShadow = true; 
        group.add(ringMesh);
    }

    const axisGeo = new THREE.CylinderGeometry(0.015, 0.015, 3.2, 6);
    const axisMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6
    });
    const axisMesh = new THREE.Mesh(axisGeo, axisMat);
    axisMesh.visible = false; 
    group.add(axisMesh);

    const labelDiv = document.createElement('div');
    labelDiv.className = 'planet-label';
    const initialDisplayName = nameTranslations[data.name] ? nameTranslations[data.name][currentLang] : data.name;
    labelDiv.textContent = initialDisplayName;
    labelsContainer.appendChild(labelDiv);

    celestialObjects.push({
        data: data, 
        group: group,
        mesh: mesh, 
        highlightMesh: highlightMesh, 
        collisionMesh: collisionMesh, 
        axisMesh: axisMesh,
        orbitLine: null, 
        ringMesh: ringMesh, 
        atmosphereMesh: atmosphereMesh,
        glowSprite: glowSprite,
        cometTail: cometTail,
        label: labelDiv
    });
});
bootUI.setProgress(64, missionLocale.t('bootPlanets'));

moonsData.forEach(data => {
    const colorHex = colorMap[data.color] || 0xdddddd;
    const surfaceTexture = createSafeCelestialTexture(data.name, colorHex, renderer);
    const material = new THREE.MeshStandardMaterial({ map: surfaceTexture, color: surfaceTexture ? 0xffffff : colorHex, roughness: .94, metalness: 0 });
    const mesh = new THREE.Mesh(sphereGeo, material);
    mesh.castShadow = true; 
    mesh.receiveShadow = false; 
    scene.add(mesh);

    // A malha visual das luas pode ficar minúscula em escalas realistas. Uma
    // esfera invisível e maior oferece um alvo consistente para mouse e toque.
    const collisionMesh = new THREE.Mesh(collisionGeo, collisionMat);
    collisionMesh.userData.bodyName = data.name;
    scene.add(collisionMesh);
    raycastTargets.push(collisionMesh);

    const labelDiv = document.createElement('div');
    labelDiv.className = 'planet-label';
    const initialDisplayName = nameTranslations[data.name] ? nameTranslations[data.name][currentLang] : data.name;
    labelDiv.textContent = initialDisplayName;
    labelDiv.style.fontSize = '9px';
    labelDiv.dataset.bodyName = data.name;
    labelDiv.addEventListener('pointerup', (event) => {
        if (!precisionMode || precisionTargetName !== data.name) return;
        event.preventDefault();
        event.stopPropagation();
        simulatorBridge.notifyBodySelected(data.name, { x: event.clientX, y: event.clientY, source: 'label' });
    });
    labelsContainer.appendChild(labelDiv);

    const parentObj = celestialObjects.find(obj => obj.data.name === data.parent);

    moonObjects.push({
        data: data, 
        group: mesh,
        mesh: mesh, 
        collisionMesh: collisionMesh,
        orbitLine: null, 
        label: labelDiv, 
        parentObj: parentObj
    });
});
bootUI.setProgress(78, missionLocale.t('bootMoons'));

const ASTEROID_COUNT = 1500;
const asteroidGeo = new THREE.DodecahedronGeometry(1, 0); 
const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
const asteroidInstanced = new THREE.InstancedMesh(asteroidGeo, asteroidMat, ASTEROID_COUNT);
asteroidInstanced.castShadow = false; 
asteroidInstanced.receiveShadow = false; 
scene.add(asteroidInstanced);

const asteroidData = [];
const marsRef = celestialBodiesData.find(p => p.name === "Marte");
for (let i = 0; i < ASTEROID_COUNT; i++) {
    asteroidData.push({
        a_rel: Math.random(), 
        e: 0.02 + Math.random() * 0.03, 
        i: marsRef.i + (Math.random() - 0.5) * (0.05 * Math.PI / 180), 
        Omega: marsRef.Omega + (Math.random() - 0.5) * 0.02, 
        omega: marsRef.omega + (Math.random() - 0.5) * 0.02,
        angle: Math.random() * 2 * Math.PI, 
        speed: -0.004 - Math.random() * 0.005,
        size: 0.1 + Math.random() * 0.4,
        rotSpeedX: Math.random() * 0.1,
        rotSpeedY: Math.random() * 0.1,
        rotation: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0)
    });
}

const dummy = new THREE.Object3D(); 

// Equação de órbita baseada no foco elíptico (Sol em 0,0,0) - Primeira Lei de Kepler matematicamente exata
function getOrbitPosition(theta, a, e, i, Omega, omega) {
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
    
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    const y = 0;
    
    const cos_w = Math.cos(omega);
    const sin_w = Math.sin(omega);
    const x1 = x * cos_w - z * sin_w;
    const z1 = x * sin_w + z * cos_w;
    
    const cos_i = Math.cos(i);
    const sin_i = Math.sin(i);
    const x2 = x1;
    const y2 = -z1 * sin_i;
    const z2 = z1 * cos_i;
    
    const cos_O = Math.cos(Omega);
    const sin_O = Math.sin(Omega);
    const x3 = x2 * cos_O - z2 * sin_O;
    const z3 = x2 * sin_O + z2 * cos_O;
    const y3 = y2;
    
    return new THREE.Vector3(x3, y3, z3);
}

function rebuildOrbitLines() {
    const diameterAdjFactor = getRadiusParams();

    celestialObjects.forEach(obj => {
        const data = obj.data;
        if (data.type === 'star') return;

        if (obj.orbitLine) {
            scene.remove(obj.orbitLine);
            obj.orbitLine.geometry.dispose();
            obj.orbitLine.material.dispose();
        }

        let orbitRadiusFactor = useProportionalDistance ? data.orbitRadiusProportional : 
                               (useProportionalDiameter ? data.orbitRadius * ORBIT_SPACING_MULTIPLIER : data.orbitRadius);
        const currentOrbitRadius = orbitRadiusFactor * SCALE_FACTOR;

        const points = [];
        const segments = 512; 
        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * 2 * Math.PI;
            const pos = getOrbitPosition(theta, currentOrbitRadius, data.e, data.i, data.Omega, data.omega);
            points.push(pos);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0xffffff, transparent: true, opacity: 0.3 
        });
        
        obj.orbitLine = new THREE.LineLoop(geometry, material);
        obj.orbitLine.visible = showOrbits && data.type !== 'star' && isBodyVisible(obj);
        scene.add(obj.orbitLine);
    });

    moonObjects.forEach(obj => {
        const data = obj.data;
        const parent = obj.parentObj;

        if (obj.orbitLine) {
            scene.remove(obj.orbitLine);
            obj.orbitLine.geometry.dispose();
            obj.orbitLine.material.dispose();
        }

        const parentRadius = getBodyRadius(parent.data, diameterAdjFactor);

        const visualMoonOrbitScale = useProportionalDistance ? 1.0 : 0.60;
        const gapFactor = useProportionalDiameter ? data.orbitGap * ORBIT_SPACING_MULTIPLIER : data.orbitGap;
        
        const minClearanceFactor = parent.data.hasRing ? 2.4 : 1.15;
        const absoluteMinRadius = parentRadius * minClearanceFactor;

        // SOLUÇÃO REVISADA: Excentricidade efetiva para cálculo consistente do semieixo maior
        const effectiveE = useProportionalDistance ? (data.e || 0) : Math.min(0.2, data.e || 0);
        const minOrbitSemimajor = absoluteMinRadius / (1 - effectiveE);
        const calculatedOrbitRadius = parentRadius + (gapFactor * SCALE_FACTOR * visualMoonOrbitScale);
        const orbitRadius = Math.max(minOrbitSemimajor, calculatedOrbitRadius);

        const points = [];
        const segments = 256; 
        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * 2 * Math.PI;
            // ALTERADO: Usa a excentricidade efetiva também no desenho elíptico da linha
            const pos = getOrbitPosition(theta, orbitRadius, effectiveE, data.i || 0, data.Omega || 0, data.omega || 0);
            points.push(pos);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0xb4b4b4, transparent: true, opacity: 0.2 
        });

        obj.orbitLine = new THREE.LineLoop(geometry, material);
        obj.orbitLine.visible = showOrbits && showMajorMoons;
        scene.add(obj.orbitLine);
    });
}

rebuildOrbitLines();

function setLanguage(lang) {
    currentLang = lang;
    missionLocale.setLanguage(lang);
    safeStorage.setItem('projeto-gaia:language:v1', lang);
    const dict = uiTranslations[lang];
    btnOpenCelestialNavigator.textContent = dict.celestialNavigator;
    celestialNavigatorEyebrow.textContent = dict.navigatorEyebrow;
    celestialNavigatorTitle.textContent = dict.celestialNavigator;
    celestialNavigatorHelp.textContent = dict.navigatorHelp;
    celestialBodySelectLabel.textContent = dict.celestialBody;
    btnSelectCelestialBody.textContent = dict.selectAndApproach;
    btnCloseCelestialNavigator.setAttribute('aria-label', dict.closeNavigator);
    document.getElementById('lblGraphicsQuality').childNodes[0].textContent = dict.graphicsQuality;
    const qualityLabels = [dict.qualityAuto, dict.qualityHigh, dict.qualityMedium, dict.qualityLow];
    [...graphicsQualitySelect.options].forEach((option, index) => { option.textContent = qualityLabels[index]; });
    populateCelestialNavigator(dict);
    
    btnToggleAnimation.textContent = isAnimationRunning ? dict.btnStop : dict.btnMove;
    btnNorthView.textContent = dict.btnNorthView;
    btnNorthView.title = dict.btnNorthViewTitle;
    
    btnAboutProject.textContent = dict.btnAbout;
    btnAboutProject.title = dict.btnAboutTitle;
    aboutModalTitle.textContent = dict.aboutTitle;
    aboutModalText.textContent = dict.aboutText;
    aboutModalContactLabel.textContent = dict.contactLabel;

    btnCollapseControls.title = lang === 'pt' ? "Recolher Painel" : (lang === 'en' ? "Collapse Panel" : "Colapsar Panel");

    document.getElementById('lblShowOrbits').childNodes[1].textContent = dict.showOrbits;
    document.getElementById('lblShowLabels').childNodes[1].textContent = dict.showLabels;
    document.getElementById('lblShowAsteroids').childNodes[1].textContent = dict.showAsteroids;
    document.getElementById('lblShowDwarfPlanets').childNodes[1].textContent = dict.showDwarfPlanets;
    document.getElementById('lblShowHalley').childNodes[1].textContent = dict.showHalley;
    document.getElementById('lblShowMoons').childNodes[1].textContent = dict.showMoons;
    document.getElementById('lblShowAxes').childNodes[1].textContent = dict.showAxes;
    document.getElementById('lblHighlight').childNodes[1].textContent = dict.highlight;
    document.getElementById('lblRealisticSpeed').childNodes[1].textContent = dict.realisticSpeed;
    document.getElementById('lblRealisticDiameter').childNodes[1].textContent = dict.realisticDiameter;
    document.getElementById('lblRealisticDistance').childNodes[1].textContent = dict.realisticDistance;
    document.getElementById('lblRealisticSun').childNodes[1].textContent = dict.realisticSun;

    document.getElementById('lblSpeedLabel').textContent = dict.speedLabel;
    document.getElementById('lblZoomLabel').textContent = dict.zoomLabel;

    document.getElementById('lblEquatorialDiameter').textContent = dict.lblEquatorialDiameter;
    document.getElementById('lblOrbitalPeriod').textContent = dict.lblOrbitalPeriod;
    document.getElementById('lblAvgOrbitalSpeed').textContent = dict.lblAvgOrbitalSpeed;
    document.getElementById('lblNaturalSatellites').textContent = dict.lblNaturalSatellites;

    celestialObjects.forEach(obj => {
        const dName = nameTranslations[obj.data.name] ? nameTranslations[obj.data.name][currentLang] : obj.data.name;
        obj.label.textContent = dName;
    });
    moonObjects.forEach(obj => {
        const dName = nameTranslations[obj.data.name] ? nameTranslations[obj.data.name][currentLang] : obj.data.name;
        obj.label.textContent = dName;
    });

    if (currentlySelectedBody) {
        showInfoBoxData(currentlySelectedBody);
    }
}

langSelect.addEventListener('change', (e) => {
    setLanguage(e.target.value);
});

function getRadiusParams() {
    let diameterAdjFactor = 1.0;
    
    if (useProportionalDistance && useProportionalDiameter) {
        if (!useRealSunScale) {
            const mercury = celestialObjects.find(p => p.data.name === "Mercúrio").data;
            const sol = celestialObjects.find(p => p.data.name === "Sol").data;
            const targetSunRadius = mercury.orbitRadiusProportional * 0.35;
            diameterAdjFactor = targetSunRadius / sol.radiusProportional;
        } else {
            const earthRealRadiusKm = EARTH_DIAMETER_KM / 2;
            const unifiedEarthRadius = (earthRealRadiusKm / earthRealDistance) * (earthData.orbitRadius * SCALE_FACTOR);
            const currentEarthRadius = earthData.radiusProportional * SCALE_FACTOR;
            diameterAdjFactor = unifiedEarthRadius / currentEarthRadius;
        }
    }
    return diameterAdjFactor;
}

function updateScene() {
    const diameterAdjFactor = getRadiusParams();

    celestialObjects.forEach(obj => {
        const data = obj.data;
        const bodyVisible = isBodyVisible(obj);
        
        let orbitRadiusFactor = useProportionalDistance ? data.orbitRadiusProportional : 
                               (useProportionalDiameter ? data.orbitRadius * ORBIT_SPACING_MULTIPLIER : data.orbitRadius);
        
        const currentOrbitRadius = orbitRadiusFactor * SCALE_FACTOR;

        if (isAnimationRunning) {
            const currentSpeed = useProportionalSpeed ? data.speedProportional : data.speedVisual;
            
            const cos_v = Math.cos(data.angle);
            const speedAdjustFactor = Math.pow(1 + data.e * cos_v, 2) / Math.pow(1 - data.e * data.e, 1.5);

            data.angle += currentSpeed * speedMultiplier * 0.1 * speedAdjustFactor;
            data.rotationAngle += data.rotationSpeedVisual * speedMultiplier * 0.1;
        }

        const currentRadius = getBodyRadius(data, diameterAdjFactor);

        const pos = getOrbitPosition(data.angle, currentOrbitRadius, data.e, data.i, data.Omega, data.omega);

        obj.group.position.copy(pos);
        obj.group.visible = bodyVisible;
        obj.group.scale.set(currentRadius, currentRadius, currentRadius);
        if (obj.cometTail) {
            const awayFromSun = new THREE.Vector3().copy(pos).normalize();
            obj.cometTail.position.copy(pos).addScaledVector(awayFromSun, currentRadius * 3.2);
            obj.cometTail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), awayFromSun);
            obj.cometTail.scale.setScalar(Math.max(currentRadius, 0.8));
            obj.cometTail.visible = bodyVisible;
        }
        
        obj.mesh.rotation.y = data.rotationAngle; 
        if (obj.glowSprite) {
            const pulse = document.body.classList.contains('reduce-motion') ? 0 : Math.sin(performance.now() * .0014) * .13;
            obj.glowSprite.scale.set(7.5 + pulse, 7.5 + pulse, 1);
            obj.glowSprite.material.opacity = .78 + pulse * .18;
        }
        
        obj.collisionMesh.position.copy(obj.group.position);
        obj.collisionMesh.visible = bodyVisible;
        
        let hitboxRadius = Math.max(currentRadius, 4.0);
        if (useProportionalDistance && useProportionalDiameter) {
            hitboxRadius = Math.max(currentRadius * 8.0, 0.8);
        } else if (useProportionalDiameter) {
            hitboxRadius = Math.max(currentRadius * 2.5, 2.0);
        }
        obj.collisionMesh.scale.set(hitboxRadius, hitboxRadius, hitboxRadius);

        const isHovered = (hoveredBody === obj);
        const isSelected = (currentlySelectedBody === obj);
        const isFollowing = (followingBody === obj);

        const targetHighlightWorldRadius = currentRadius * HIGHLIGHT_FACTOR;
        const highlightScaleFactor = targetHighlightWorldRadius / currentRadius;
        obj.highlightMesh.scale.set(highlightScaleFactor, highlightScaleFactor, highlightScaleFactor);

        if (isFollowing) {
            obj.highlightMesh.material.opacity = 0;
        } else if (highlightPlanets && data.type !== 'star') {
            obj.highlightMesh.material.opacity = 0.8;
            obj.highlightMesh.material.color.setHex(0x00ffff);
        } else if (isSelected) {
            obj.highlightMesh.material.opacity = 0.8;
            obj.highlightMesh.material.color.setHex(0x00ffaa); 
        } else if (isHovered) {
            obj.highlightMesh.material.opacity = 0.45; 
            obj.highlightMesh.material.color.setHex(0xffffff);
        } else {
            obj.highlightMesh.material.opacity = 0;
        }

        if (obj.orbitLine) {
            obj.orbitLine.visible = showOrbits && data.type !== 'star' && bodyVisible;
        }

        if (showLabels && bodyVisible) {
            const vector = new THREE.Vector3().copy(pos);
            vector.y += currentRadius * 1.5; 
            vector.project(camera);
            
            if (vector.z < 1) {
                const screenX = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const screenY = (vector.y * -0.5 + 0.5) * window.innerHeight;
                obj.label.style.left = `${screenX}px`;
                obj.label.style.top = `${screenY}px`;
                obj.label.style.opacity = '1';
            } else {
                obj.label.style.opacity = '0';
            }
        } else {
            obj.label.style.opacity = '0';
        }
    });

    moonObjects.forEach(obj => {
        const data = obj.data;
        const parent = obj.parentObj;
        
        if (!showMajorMoons) {
            obj.mesh.visible = false;
            obj.collisionMesh.visible = false;
            if (obj.orbitLine) obj.orbitLine.visible = false;
            obj.label.style.opacity = '0';
            return;
        }
        obj.mesh.visible = true;

        // SOLUÇÃO REVISADA: Determina a excentricidade efetiva para os cálculos e frames orbitais da lua
        const effectiveE = useProportionalDistance ? (data.e || 0) : Math.min(0.2, data.e || 0);

        if (isAnimationRunning) {
            const cos_v = Math.cos(data.angle);
            // ALTERADO: Usa a excentricidade efetiva na velocidade angular kepleriana
            const speedAdjustFactor = Math.pow(1 + effectiveE * cos_v, 2) / Math.pow(1 - effectiveE * effectiveE, 1.5);

            data.angle += data.speed * speedMultiplier * 0.1 * speedAdjustFactor;
        }

        const parentRadius = getBodyRadius(parent.data, diameterAdjFactor);

        const visualMoonOrbitScale = useProportionalDistance ? 1.0 : 0.60;
        const gapFactor = useProportionalDiameter ? data.orbitGap * ORBIT_SPACING_MULTIPLIER : data.orbitGap;
        
        const minClearanceFactor = parent.data.hasRing ? 2.4 : 1.15;
        const absoluteMinRadius = parentRadius * minClearanceFactor;

        // ALTERADO: Calcula o semieixo maior usando a excentricidade efetiva
        const minOrbitSemimajor = absoluteMinRadius / (1 - effectiveE);
        const calculatedOrbitRadius = parentRadius + (gapFactor * SCALE_FACTOR * visualMoonOrbitScale);
        const orbitRadius = Math.max(minOrbitSemimajor, calculatedOrbitRadius);
        
        const moonRadius = getMoonRadius(data, parent.data, diameterAdjFactor);

        const px = parent.group.position.x;
        const py = parent.group.position.y;
        const pz = parent.group.position.z;
        
        // ALTERADO: Usa effectiveE na equação de posicionamento kepleriano 3D real
        const relativePos = getOrbitPosition(data.angle, orbitRadius, effectiveE, data.i || 0, data.Omega || 0, data.omega || 0);

        const mx = px + relativePos.x;
        const my = py + relativePos.y;
        const mz = pz + relativePos.z;

        obj.mesh.position.set(mx, my, mz);
        obj.mesh.scale.set(moonRadius, moonRadius, moonRadius);
        obj.collisionMesh.position.set(mx, my, mz);
        // Amplia o alvo sem invadir excessivamente as órbitas das luas vizinhas.
        const touchRadius = Math.max(moonRadius * 3, 0.7);
        obj.collisionMesh.scale.set(touchRadius, touchRadius, touchRadius);
        obj.collisionMesh.visible = showMajorMoons;

        if (obj.orbitLine) {
            obj.orbitLine.position.set(px, py, pz);
            obj.orbitLine.visible = showOrbits && showMajorMoons;
        }

        if (showLabels && showMajorMoons) {
            const vector = new THREE.Vector3(mx, my + moonRadius * 2, mz);
            vector.project(camera);
            if (vector.z < 1) {
                const screenX = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const screenY = (vector.y * -0.5 + 0.5) * window.innerHeight;
                obj.label.style.left = `${screenX}px`;
                obj.label.style.top = `${screenY}px`;
                obj.label.style.opacity = camera.position.distanceTo(obj.mesh.position) < 350 ? '1' : '0';
            } else obj.label.style.opacity = '0';
        } else obj.label.style.opacity = '0';
    });

    if (showAsteroids) {
        asteroidInstanced.visible = true;
        const marsObj = celestialObjects.find(o => o.data.name === "Marte");
        const marsData = marsObj.data;
        
        let mOrbit = useProportionalDistance ? marsData.orbitRadiusProportional : (useProportionalDiameter ? marsData.orbitRadius * ORBIT_SPACING_MULTIPLIER : marsData.orbitRadius);
        
        let innerBound, outerBound;

        if (useProportionalDistance) {
            innerBound = mOrbit * 1.15;
            outerBound = mOrbit * 1.25;
        } else {
            innerBound = mOrbit * 1.15;
            outerBound = mOrbit * 1.20;
        }

        for (let i = 0; i < ASTEROID_COUNT; i++) {
            const ast = asteroidData[i];

            if (isAnimationRunning) {
                const cos_v = Math.cos(ast.angle);
                const speedAdjustFactor = Math.pow(1 + ast.e * cos_v, 2) / Math.pow(1 - ast.e * ast.e, 1.5);

                ast.angle += ast.speed * speedMultiplier * 0.1 * speedAdjustFactor;
                ast.rotation.x += ast.rotSpeedX;
                ast.rotation.y += ast.rotSpeedY;
            }
            
            const a = (innerBound + ast.a_rel * (outerBound - innerBound)) * SCALE_FACTOR;
            const pos = getOrbitPosition(ast.angle, a, ast.e, ast.i, ast.Omega, ast.omega);

            dummy.position.copy(pos);
            
            let scale = ast.size;
            if (useProportionalDiameter) {
                if (useProportionalDistance && useRealSunScale) {
                    scale *= 0.0005; 
                } else {
                    scale *= (diameterAdjFactor * 5);
                }
            }
            dummy.scale.set(scale, scale, scale);
            
            dummy.rotation.copy(ast.rotation);
            dummy.updateMatrix();
            asteroidInstanced.setMatrixAt(i, dummy.matrix);
        }
        asteroidInstanced.instanceMatrix.needsUpdate = true;
    } else {
        asteroidInstanced.visible = false;
    }
}

// Sistema de acompanhamento amortecido e reposicionamento dinâmico de câmera
function handleCameraFollow() {
    if (isTransitioningCamera && targetCameraPos && targetControlsTarget) {
        camera.position.lerp(targetCameraPos, 0.05);
        controls.target.lerp(targetControlsTarget, 0.05);

        if (camera.position.distanceTo(targetCameraPos) < 0.1 && controls.target.distanceTo(targetControlsTarget) < 0.1) {
            camera.position.copy(targetCameraPos);
            controls.target.copy(targetControlsTarget);
            isTransitioningCamera = false;
        }
    } else if (followingBody) {
        const targetPos = followingBody.group.position;
        controls.target.copy(targetPos);

        const optimalDist = getOptimalCameraDistance(followingBody);
        const currentDist = camera.position.distanceTo(targetPos);
        
        if (Math.abs(currentDist - optimalDist) > 0.05) {
            const dir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();
            const targetCamPos = new THREE.Vector3().copy(targetPos).add(dir.multiplyScalar(optimalDist));
            camera.position.lerp(targetCamPos, 0.05);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateScene();
    handleCameraFollow();
    controls.update(); 
    renderer.render(scene, camera);
}

let pointerDownTime = 0;
const pointerDownPos = new THREE.Vector2();
const activeCanvasPointers = new Set();
let canvasGestureHadMultiplePointers = false;

renderer.domElement.addEventListener('pointerdown', (event) => {
    activeCanvasPointers.add(event.pointerId);
    if (activeCanvasPointers.size > 1) canvasGestureHadMultiplePointers = true;
    pointerDownTime = Date.now();
    pointerDownPos.set(event.clientX, event.clientY);
});

renderer.domElement.addEventListener('pointerup', (event) => {
    const wasMultiPointerGesture = canvasGestureHadMultiplePointers;
    activeCanvasPointers.delete(event.pointerId);
    if (activeCanvasPointers.size === 0) canvasGestureHadMultiplePointers = false;
    const duration = Date.now() - pointerDownTime;
    const distance = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
    
    if (!wasMultiPointerGesture && distance < 12 && duration < 500) triggerRaycastClick(event);
});
renderer.domElement.addEventListener('pointercancel', (event) => {
    activeCanvasPointers.delete(event.pointerId);
    if (activeCanvasPointers.size === 0) canvasGestureHadMultiplePointers = false;
});

function triggerRaycastClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(visibleRaycastTargets());

    if (intersects.length > 0) {
        const hitCollisionMesh = intersects[0].object;
        const found = [...celestialObjects, ...moonObjects].find(o => o.collisionMesh === hitCollisionMesh);
                      
            if (found) {
                showInfoBoxData(found);
                simulatorBridge.notifyBodySelected(found.data.name, {
                    x: event.clientX,
                    y: event.clientY
                });
            }
    } else {
        infoBox.style.display = 'none';
        currentlySelectedBody = null;
    }
}

function onPointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(visibleRaycastTargets());
    
    if (intersects.length > 0 && !controls.state) {
        const hitCollisionMesh = intersects[0].object;
        const found = [...celestialObjects, ...moonObjects].find(o => o.collisionMesh === hitCollisionMesh);
        
        if (found) {
            hoveredBody = found;
            
            tooltip.style.left = (event.clientX + 12) + 'px';
            tooltip.style.top = (event.clientY + 12) + 'px';
            const dName = nameTranslations[found.data.name] ? nameTranslations[found.data.name][currentLang] : found.data.name;
            tooltip.textContent = dName;
            tooltip.style.display = 'block';
            renderer.domElement.style.cursor = 'pointer';
        }
    } else {
        hoveredBody = null;
        tooltip.style.display = 'none';
        renderer.domElement.style.cursor = 'default';
    }
}

window.addEventListener('pointermove', onPointerMove);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (graphicsQualitySelect.value === 'auto') applyGraphicsQuality('auto');
});

function showInfoBoxData(obj) {
    const data = obj.data;
    const info = data.info ?? {};
    currentlySelectedBody = obj;
    const dict = uiTranslations[currentLang];
    const numberLocale = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[currentLang] ?? 'pt-BR';
    
    const translatedName = nameTranslations[data.name] ? nameTranslations[data.name][currentLang] : data.name;
    
    document.getElementById('infoBoxTitle').textContent = `${translatedName} ${dict.sourceNasa}`;
    document.getElementById('infoBoxDiameter').textContent = typeof info.diameter === 'number' ? info.diameter.toLocaleString(numberLocale) : (info.diameter ?? dict.notAvailable);
    document.getElementById('infoBoxDistance').textContent = typeof info.distance === 'number' ? info.distance.toLocaleString(numberLocale) : (info.distance ?? dict.notAvailable);
    
    if (typeof info.period === 'number') {
        if (info.period > 365) {
            const yearsVal = (info.period / 365).toFixed(1);
            document.getElementById('infoBoxPeriod').textContent = parseFloat(yearsVal).toLocaleString(numberLocale);
            document.getElementById('lblDays').textContent = dict.years;
        } else {
            document.getElementById('infoBoxPeriod').textContent = info.period.toLocaleString(numberLocale);
            document.getElementById('lblDays').textContent = dict.days;
        }
    } else {
        document.getElementById('infoBoxPeriod').textContent = dict.notAvailable;
        document.getElementById('lblDays').textContent = "";
    }

    if (info.orbitalSpeed !== undefined && info.orbitalSpeed !== 'N/A') {
        document.getElementById('infoBoxSpeed').textContent = info.orbitalSpeed.toLocaleString(numberLocale);
        document.getElementById('infoBoxSpeedP').style.display = 'block';
    } else document.getElementById('infoBoxSpeedP').style.display = 'none';

    if (info.satellites !== undefined && info.satellites !== 'N/A') {
        document.getElementById('infoBoxSatellites').textContent = info.satellites;
        document.getElementById('infoBoxSatellitesP').style.display = 'block';
    } else document.getElementById('infoBoxSatellitesP').style.display = 'none';

    document.getElementById('infoBoxDistanceLabel').textContent = (data.type === 'star') ? dict.distanceCenter : dict.distanceSun;
    
    updateFollowButtonState();
    infoBox.style.display = 'block';
    tooltip.style.display = 'none';
}

// Controle de Exibição do Modal Sobre o Projeto
btnAboutProject.addEventListener('click', () => {
    aboutModal.style.display = 'flex';
});

aboutModalClose.addEventListener('click', () => {
    aboutModal.style.display = 'none';
});

aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
});

infoBoxClose.addEventListener('click', () => {
    infoBox.style.display = 'none';
    currentlySelectedBody = null;
});

btnToggleAnimation.addEventListener('click', () => {
    isAnimationRunning = !isAnimationRunning;
    const dict = uiTranslations[currentLang];
    btnToggleAnimation.textContent = isAnimationRunning ? dict.btnStop : dict.btnMove;
    btnToggleAnimation.classList.toggle('paused');
});

function triggerNorthView() {
    followingBody = null;
    currentlySelectedBody = null;
    infoBox.style.display = 'none';
    updateFollowButtonState();

    targetCameraPos = new THREE.Vector3(0, 450, 0.001);
    targetControlsTarget = new THREE.Vector3(0, 0, 0);
    isTransitioningCamera = true;

    zoomLevel = 1.0; 
    zoomSlider.value = 0.94; 
    zoomInput.value = 0.94;
}

function enterPrecisionMode(targetName) {
    if (!precisionMode) {
        animationStateBeforePrecision = isAnimationRunning;
        panStateBeforePrecision = controls.enablePan;
    }
    precisionMode = true;
    precisionTargetName = targetName;
    isAnimationRunning = false;
    controls.enabled = true;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    btnToggleAnimation.textContent = missionLocale.t('movementFrozen');
    btnToggleAnimation.classList.add('paused');
    document.body.classList.add('precision-mode');
    moonObjects.forEach((moon) => moon.label.classList.toggle('precision-target', moon.data.name === targetName));
}

function exitPrecisionMode() {
    if (!precisionMode) return;
    precisionMode = false;
    precisionTargetName = null;
    isAnimationRunning = animationStateBeforePrecision;
    controls.enabled = true;
    controls.enablePan = panStateBeforePrecision;
    const dict = uiTranslations[currentLang];
    btnToggleAnimation.textContent = isAnimationRunning ? dict.btnStop : dict.btnMove;
    btnToggleAnimation.classList.toggle('paused', !isAnimationRunning);
    document.body.classList.remove('precision-mode');
    moonObjects.forEach((moon) => moon.label.classList.remove('precision-target'));
}

function focusBodyForMission(bodyName, targetName) {
    const body = celestialObjects.find((obj) => obj.data.name === bodyName);
    if (!body) return;
    currentlySelectedBody = body;
    followingBody = body;
    isTransitioningCamera = false;
    const optimalDist = getOptimalCameraDistance(body);
    const direction = new THREE.Vector3().subVectors(camera.position, body.group.position);
    if (direction.lengthSq() < 0.0001) direction.set(0.8, 0.45, 1);
    direction.normalize();
    targetCameraPos = new THREE.Vector3().copy(body.group.position).add(direction.multiplyScalar(optimalDist));
    camera.position.lerp(targetCameraPos, 0.35);
    controls.target.copy(body.group.position);
    showMajorMoons = true;
    showMajorMoonsCheck.checked = true;
    showLabels = true;
    showLabelsCheck.checked = true;
    moonObjects.forEach((moon) => {
        moon.mesh.visible = true;
        moon.collisionMesh.visible = true;
    });
    enterPrecisionMode(targetName);
    updateFollowButtonState();
}

simulatorBridge.addEventListener('camera:focus-requested', (event) => focusBodyForMission(event.detail.bodyName, event.detail.targetName));
simulatorBridge.addEventListener('camera:reset-requested', () => { exitPrecisionMode(); triggerNorthView(); });
simulatorBridge.addEventListener('precision:exit-requested', () => exitPrecisionMode());

btnNorthView.addEventListener('click', triggerNorthView);

showOrbitsCheck.addEventListener('change', e => {
    showOrbits = e.target.checked;
    celestialObjects.forEach(obj => {
        if (obj.orbitLine) obj.orbitLine.visible = showOrbits && obj.data.type !== 'star';
    });
    moonObjects.forEach(obj => {
        if (obj.orbitLine) obj.orbitLine.visible = showOrbits && showMajorMoons;
    });
});
showLabelsCheck.addEventListener('change', e => showLabels = e.target.checked);
showAsteroidsCheck.addEventListener('change', e => showAsteroids = e.target.checked);
function reconcileOptionalBodyVisibility() {
    if (followingBody && !isBodyVisible(followingBody)) triggerNorthView();
    if (currentlySelectedBody && !isBodyVisible(currentlySelectedBody)) {
        currentlySelectedBody = null;
        infoBox.style.display = 'none';
    }
    if (hoveredBody && !isBodyVisible(hoveredBody)) {
        hoveredBody = null;
        tooltip.style.display = 'none';
        renderer.domElement.style.cursor = 'default';
    }
}
showDwarfPlanetsCheck.addEventListener('change', e => {
    showDwarfPlanets = e.target.checked;
    reconcileOptionalBodyVisibility();
});
showHalleyCheck.addEventListener('change', e => {
    showHalley = e.target.checked;
    reconcileOptionalBodyVisibility();
});
showMajorMoonsCheck.addEventListener('change', e => {
    showMajorMoons = e.target.checked;
    moonObjects.forEach(obj => {
        if (obj.orbitLine) obj.orbitLine.visible = showOrbits && showMajorMoons;
    });
});
showAxesCheck.addEventListener('change', e => {
    showAxes = e.target.checked;
    celestialObjects.forEach(obj => {
        if (obj.axisMesh) obj.axisMesh.visible = showAxes;
    });
});
highlightPlanetsCheck.addEventListener('change', e => highlightPlanets = e.target.checked);

function adjustCameraForScaleChange() {
    if (followingBody) {
        const optimalDist = getOptimalCameraDistance(followingBody);
        const targetPos = followingBody.group.position;
        const dir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();
        
        camera.position.copy(targetPos).add(dir.multiplyScalar(optimalDist));
        
        let calculatedZoom = BASE_CAMERA_DISTANCE / optimalDist;
        calculatedZoom = Math.max(0.06, Math.min(200.06, calculatedZoom));
        zoomLevel = calculatedZoom;

        const uiZoom = zoomLevel - 0.06;
        zoomSlider.value = uiZoom;
        zoomInput.value = uiZoom < 10 ? uiZoom.toFixed(2) : uiZoom.toFixed(1);
    }
}

useProportionalSpeedCheck.addEventListener('change', e => {
    useProportionalSpeed = e.target.checked;
    if (useProportionalSpeed) {
        if (!useProportionalDistanceCheck.checked) {
            useProportionalDistanceCheck.checked = true;
            useProportionalDistance = true;
            ambientLight.intensity = 0.45; 
        }
    }
    adjustCameraForScaleChange();
    rebuildOrbitLines(); 
});

useProportionalDistanceCheck.addEventListener('change', e => {
    useProportionalDistance = e.target.checked;
    if (!useProportionalDistance) {
        useProportionalSpeedCheck.checked = false;
        useProportionalSpeed = false;
        ambientLight.intensity = 0.15; 
    } else {
        ambientLight.intensity = 0.45; 
    }
    adjustCameraForScaleChange();
    rebuildOrbitLines(); 
});

function updateSunCheckboxState() {
    realSunScaleCheck.disabled = !useProportionalDiameter;
    if (!useProportionalDiameter) {
        realSunScaleCheck.checked = false;
        useRealSunScale = false;
    }
}

realSunScaleCheck.addEventListener('change', e => {
    useRealSunScale = e.target.checked;
    rebuildOrbitLines(); 
});

useProportionalDiameterCheck.addEventListener('change', e => {
    useProportionalDiameter = e.target.checked;
    updateSunCheckboxState();
    adjustCameraForScaleChange(); 
    rebuildOrbitLines(); 
});

btnCollapseControls.addEventListener('click', () => {
    controlsContainer.classList.toggle('collapsed');
    btnCollapseControls.textContent = controlsContainer.classList.contains('collapsed') ? '▲' : '▼';
});

generalSpeedSlider.addEventListener('input', e => { speedMultiplier = parseFloat(e.target.value); generalSpeedInput.value = speedMultiplier.toFixed(1); });
generalSpeedInput.addEventListener('change', e => { 
    let val = parseFloat(e.target.value);
    val = Math.max(0.1, Math.min(val, 100)); speedMultiplier = val; generalSpeedSlider.value = val; generalSpeedInput.value = val.toFixed(1);
});

function applyZoom(z) {
    isUpdatingFromControls = true; 
    zoomLevel = z; 
    const dist = BASE_CAMERA_DISTANCE / zoomLevel;
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    camera.position.copy(controls.target).add(dir.multiplyScalar(dist));
    requestAnimationFrame(() => {
        isUpdatingFromControls = false;
    });
}

controls.addEventListener('change', () => {
    if (!isUpdatingFromControls && !isTransitioningCamera) {
        const dist = camera.position.distanceTo(controls.target);
        let calculatedZoom = BASE_CAMERA_DISTANCE / dist;
        calculatedZoom = Math.max(0.06, Math.min(200.06, calculatedZoom));
        zoomLevel = calculatedZoom;

        const uiZoom = zoomLevel - 0.06;
        zoomSlider.value = uiZoom;
        zoomInput.value = uiZoom < 10 ? uiZoom.toFixed(2) : uiZoom.toFixed(1);
    }
});

zoomSlider.addEventListener('input', e => { 
    const uiZoom = parseFloat(e.target.value);
    applyZoom(uiZoom + 0.06); 
    zoomInput.value = uiZoom.toFixed(2); 
});
zoomInput.addEventListener('change', e => {
    let uiZoom = parseFloat(e.target.value); 
    uiZoom = Math.max(0, Math.min(uiZoom, 200)); 
    applyZoom(uiZoom + 0.06); 
    zoomSlider.value = uiZoom; 
    zoomInput.value = uiZoom.toFixed(2);
});

controls.addEventListener('start', () => {
    if (followingBody && !precisionMode) {
        followingBody = null;
        updateFollowButtonState();
    }
    isTransitioningCamera = false;
});

function updateFollowButtonState() {
    const dict = uiTranslations[currentLang];
    if (currentlySelectedBody && currentlySelectedBody.data.name === "Sol") {
        btnFollowPlanet.style.display = 'none'; return;
    } else btnFollowPlanet.style.display = 'block';

    if (followingBody === currentlySelectedBody) {
        btnFollowPlanet.textContent = dict.btnUnfollow;
        btnFollowPlanet.style.backgroundColor = "#ff6666"; btnFollowPlanet.style.color = "#fff";
    } else {
        btnFollowPlanet.textContent = dict.btnFollow;
        btnFollowPlanet.style.backgroundColor = "#00ffff"; btnFollowPlanet.style.color = "#000";
    }
}

btnFollowPlanet.addEventListener('click', () => {
    isTransitioningCamera = false;
    if (followingBody === currentlySelectedBody) {
        followingBody = null;
        controls.target.set(0,0,0); 
    } else {
        followingBody = currentlySelectedBody;
        
        const optimalDist = getOptimalCameraDistance(followingBody);
        const calculatedZoom = BASE_CAMERA_DISTANCE / optimalDist;
        zoomLevel = Math.max(0.06, Math.min(200.06, calculatedZoom));

        const uiZoom = zoomLevel - 0.06;
        zoomSlider.value = uiZoom;
        zoomInput.value = uiZoom < 10 ? uiZoom.toFixed(2) : uiZoom.toFixed(1);
    }
    updateFollowButtonState();
});

let celestialNavigatorReturnFocus = null;
function populateCelestialNavigator(dict = uiTranslations[currentLang]) {
    const selectedName = celestialBodySelect.value;
    celestialBodySelect.replaceChildren();
    const groups = [
        [dict.groupStar, celestialObjects.filter((body) => body.data.type === 'star')],
        [dict.groupPlanets, celestialObjects.filter((body) => body.data.type === 'planet')],
        [dict.groupDwarfPlanets, celestialObjects.filter((body) => body.data.type === 'minorBody')],
        [dict.groupMoons, moonObjects]
    ];
    groups.forEach(([label, bodies]) => {
        const group = document.createElement('optgroup');
        group.label = label;
        bodies.forEach((body) => {
            const option = document.createElement('option');
            option.value = body.data.name;
            option.textContent = nameTranslations[body.data.name]?.[currentLang] ?? body.data.name;
            group.appendChild(option);
        });
        celestialBodySelect.appendChild(group);
    });
    if ([...celestialBodySelect.options].some((option) => option.value === selectedName)) celestialBodySelect.value = selectedName;
}

function closeCelestialNavigator() {
    celestialNavigatorModal.classList.remove('visible');
    celestialNavigatorReturnFocus?.focus();
}

btnOpenCelestialNavigator.addEventListener('click', () => {
    celestialNavigatorReturnFocus = document.activeElement;
    populateCelestialNavigator();
    celestialNavigatorModal.classList.add('visible');
    celestialBodySelect.focus();
});
btnCloseCelestialNavigator.addEventListener('click', closeCelestialNavigator);
celestialNavigatorModal.addEventListener('click', (event) => {
    if (event.target === celestialNavigatorModal) closeCelestialNavigator();
});
celestialNavigatorModal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCelestialNavigator();
});
btnSelectCelestialBody.addEventListener('click', () => {
    const found = [...celestialObjects, ...moonObjects].find((body) => body.data.name === celestialBodySelect.value);
    if (!found) return;
    let visibilityNotice = '';
    if (isDwarfPlanet(found) && !showDwarfPlanets) {
        showDwarfPlanets = true;
        showDwarfPlanetsCheck.checked = true;
        visibilityNotice = uiTranslations[currentLang].dwarfLayerEnabled.replace('{body}', nameTranslations[found.data.name]?.[currentLang] ?? found.data.name);
    }
    if (isHalley(found) && !showHalley) {
        showHalley = true;
        showHalleyCheck.checked = true;
        visibilityNotice = uiTranslations[currentLang].halleyLayerEnabled;
    }
    if (found.parentObj && !showMajorMoons) {
        showMajorMoons = true;
        showMajorMoonsCheck.checked = true;
        visibilityNotice = uiTranslations[currentLang].moonsLayerEnabled.replace('{body}', nameTranslations[found.data.name]?.[currentLang] ?? found.data.name);
    }
    showInfoBoxData(found);
    simulatorBridge.notifyBodySelected(found.data.name, { x: window.innerWidth / 2, y: window.innerHeight / 2, accessible: true });
    if (!document.body.classList.contains('mission-mode') && found.data.type !== 'star') btnFollowPlanet.click();
    closeCelestialNavigator();
    showInterfaceToast(visibilityNotice);
});

const QUALITY_STORAGE_KEY = 'projeto-gaia:graphics-quality:v1';
function effectiveGraphicsQuality(preference) {
    if (preference !== 'auto') return preference;
    const constrainedDevice = window.innerWidth <= 600
        || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
        || (navigator.deviceMemory && navigator.deviceMemory <= 4);
    return constrainedDevice ? 'low' : window.devicePixelRatio > 1.5 ? 'medium' : 'high';
}
function applyGraphicsQuality(preference = graphicsQualitySelect.value) {
    const quality = effectiveGraphicsQuality(preference);
    const settings = {
        high: { pixelRatio: 2, asteroids: ASTEROID_COUNT, shadows: true },
        medium: { pixelRatio: 1.35, asteroids: 900, shadows: false },
        low: { pixelRatio: 1, asteroids: 450, shadows: false }
    }[quality];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, settings.pixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.shadowMap.enabled = settings.shadows;
    asteroidInstanced.count = settings.asteroids;
    asteroidInstanced.instanceMatrix.needsUpdate = true;
    document.body.dataset.graphicsQuality = quality;
}
graphicsQualitySelect.addEventListener('change', () => {
    safeStorage.setItem(QUALITY_STORAGE_KEY, graphicsQualitySelect.value);
    applyGraphicsQuality();
});

// Configuração inicial padrão (Português do Brasil)
const savedLanguage = safeStorage.getItem('projeto-gaia:language:v1');
const initialLanguage = ['pt', 'en', 'es'].includes(savedLanguage) ? savedLanguage : 'pt';
langSelect.value = initialLanguage;
setLanguage(initialLanguage);
const savedGraphicsQuality = safeStorage.getItem(QUALITY_STORAGE_KEY);
graphicsQualitySelect.value = ['auto', 'high', 'medium', 'low'].includes(savedGraphicsQuality) ? savedGraphicsQuality : 'auto';
applyGraphicsQuality();
updateSunCheckboxState();
animate();

initializeMissionMode()
    .then(() => {
        bootUI.setProgress(94, missionLocale.t('bootFiles'));
        return bootUI.ready();
    })
    .catch((error) => {
        console.error('Falha ao iniciar o Modo Missão:', error);
        bootUI.setProgress(100, missionLocale.t('bootMissionUnavailable'));
        bootUI.ready();
    });

if ('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
    let reloadingForUpdate = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloadingForUpdate) return;
        reloadingForUpdate = true;
        location.reload();
    });
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
            .then((registration) => registration.update())
            .catch((error) => {
                console.warn('O modo instalável/offline não pôde ser ativado.', error);
            });
    });
}
