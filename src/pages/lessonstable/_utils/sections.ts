export function isSectionsOverlap(sectionsA: string, sectionsB: string): boolean {
  const [startA, endA] = sectionsA.split("-").map(Number);
  const [startB, endB] = sectionsB.split("-").map(Number);
  return !(endA < startB || endB < startA);
}
