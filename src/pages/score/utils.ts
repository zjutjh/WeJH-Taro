import { FinalTermScore, MidTermScore } from "@/types/Score";

/** 计算出单个成绩的唯一标识符 */
export function composeKey(score: FinalTermScore | MidTermScore) {
  const baseKey = score.lessonID;

  if ("lessonType" in score) {
    return `final/${baseKey}/${score.submitTime}/${score.examType}`;
  }

  return `mid/${baseKey}`;
}
