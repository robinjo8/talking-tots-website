
// --- Existing TomiTalk curve (steep, fast) ---
export function getTomiTalkCurve(progress: number, width: number, height: number) {
  const startX = 80;
  const endX = width - 80;
  const startY = height - 60;
  const endY = 80;
  const steps = Math.floor(120 + progress * 100);
  let d = `M${startX} ${startY}`;
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * progress;
    const eased = 1 - Math.exp(-3.3 * t); // rapid rise
    const x = startX + (endX - startX) * t;
    const y = startY - (startY - endY) * eased;
    d += ` L${x} ${y}`;
  }
  return d;
}

// --- New: Public System curve (orange-to-red, concave up, smooth/continuous from start to end) ---
export function getPublicCurve(progress: number, width: number, height: number) {
  const startX = 80;
  const endX = width - 80;
  const startY = height - 60;
  const endY = 100;
  const steps = Math.floor(120 + progress * 100);
  let d = `M${startX} ${startY}`;
  for (let i = 1; i <= steps; i++) {
    // Smooth concave-up progression, strictly increasing and continuously differentiable across [0,1]
    // Exponent between 2 and 3, visually matches "slow then faster" upward
    const t = (i / steps) * progress;
    // Remove curvatureKick for full smoothness
    const eased = 0.6 * Math.pow(t, 2.35);
    const yEased = Math.min(eased, 1);
    const x = startX + (endX - startX) * t;
    const y = startY - (startY - endY) * yEased;
    d += ` L${x} ${y}`;
  }
  return d;
}
