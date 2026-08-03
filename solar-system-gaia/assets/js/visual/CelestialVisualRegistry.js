const surfaceImages = new Map();

export function registerCelestialSurface(name, canvas) {
  try {
    surfaceImages.set(name, canvas.toDataURL('image/png'));
  } catch (error) {
    console.warn(`Não foi possível compartilhar a textura de ${name} com a viagem.`, error);
  }
}

export function getCelestialSurface(name) {
  return surfaceImages.get(name) ?? null;
}
