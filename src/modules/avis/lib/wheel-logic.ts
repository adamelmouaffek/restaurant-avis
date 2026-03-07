import type { Prize } from "@/shared/types";

export function selectPrize(prizes: Prize[]): { prize: Prize; segmentIndex: number } {
  const activePrizes = prizes.filter((p) => p.is_active);

  if (activePrizes.length === 0) {
    throw new Error("Aucun cadeau actif configure");
  }

  const totalWeight = activePrizes.reduce((sum, p) => sum + p.probability, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (let i = 0; i < activePrizes.length; i++) {
    cumulative += activePrizes[i].probability;
    if (random < cumulative) {
      return { prize: activePrizes[i], segmentIndex: i };
    }
  }

  // Fallback (ne devrait jamais arriver)
  return { prize: activePrizes[activePrizes.length - 1], segmentIndex: activePrizes.length - 1 };
}

export function calculateWheelAngle(segmentIndex: number, totalSegments: number): number {
  const segmentAngle = 360 / totalSegments;
  const segmentCenter = segmentAngle * segmentIndex + segmentAngle / 2;

  // 5 rotations completes + arret sur le segment gagnant
  // On soustrait car la roue tourne dans le sens horaire
  // et la fleche est en haut (0 degres)
  const targetAngle = 360 * 5 + (360 - segmentCenter);

  return targetAngle;
}
