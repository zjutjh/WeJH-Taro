import { Lesson } from "@/types/lesson";

/**
 * 检查两个课程是否存在重叠部分
 */
export function isSectionsOverlap(sectionsA: Lesson["sections"], sectionsB: Lesson["sections"]) {
  const [startA, endA] = sectionsA.split("-").map(Number);
  const [startB, endB] = sectionsB.split("-").map(Number);
  return endA >= startB && endB >= startA;
}
