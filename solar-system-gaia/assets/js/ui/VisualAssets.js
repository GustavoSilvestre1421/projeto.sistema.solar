const palette = {
  astronaut: ['#6ee7ff', '#164b78', 'A'],
  scientist: ['#b995ff', '#4a2875', 'C'],
  engineer: ['#ffbd6e', '#783e20', 'E'],
  commander: ['#7affc5', '#185c4a', 'G']
};

export function crewAvatar(id, title = 'Integrante da tripulação') {
  const [accent, suit, badge] = palette[id] ?? palette.astronaut;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="crew-avatar-svg" viewBox="0 0 96 96" role="img" aria-label="${title}">
    <defs><linearGradient id="visor-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dffbff"/><stop offset=".38" stop-color="#65b9e5"/><stop offset="1" stop-color="#102d52"/></linearGradient></defs>
    <circle cx="48" cy="48" r="45" fill="#07172d" stroke="${accent}" stroke-width="2"/>
    <path d="M22 87c2-20 11-29 26-29s24 9 26 29" fill="${suit}" stroke="${accent}" stroke-width="2"/>
    <rect x="28" y="18" width="40" height="45" rx="19" fill="#dceaf3" stroke="${accent}" stroke-width="2"/>
    <path d="M33 28c5-7 25-9 30 2v17c-8 8-22 9-30 0z" fill="url(#visor-${id})"/>
    <path d="M37 31c5-4 13-5 19-2" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    <circle cx="48" cy="74" r="9" fill="#07172d" stroke="${accent}"/><text x="48" y="78" text-anchor="middle" fill="${accent}" font-size="11" font-family="system-ui" font-weight="900">${badge}</text>
  </svg>`;
}

export function soundIcon(muted) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>${muted ? '<path d="m17 9 4 6m0-6-4 6" stroke="currentColor" stroke-width="2"/>' : '<path d="M16 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'}</svg>`;
}
