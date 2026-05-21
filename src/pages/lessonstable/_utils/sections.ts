/**
 * 检查两个课程是否存在重叠部分
 * @param sectionsA - 格式为 d-d，d 为 1-12 的数字
 * @param sectionsB - 同 sectionA
 */
export function isSectionsOverlap(sectionsA: string, sectionsB: string): boolean {
  const [startA, endA] = sectionsA.split("-").map(Number);
  const [startB, endB] = sectionsB.split("-").map(Number);
  return !(endA < startB || endB < startA);
}
