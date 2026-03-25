const PX_PER_MM = 96 / 25.4; // ~3.7795

export function computeScale(widthMm: number, containerWidthPx: number): number {
  const envelopeWidthPx = widthMm * PX_PER_MM;
  const scale = containerWidthPx / envelopeWidthPx;
  return Math.min(scale, 1); // never upscale
}

export function mmToPx(mm: number): number {
  return mm * PX_PER_MM;
}
