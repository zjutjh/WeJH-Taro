import { Score } from "@/types/Score";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useScoreServiceStore = defineStore("score", () => {
  const readScoreMarks = ref();
  const findNewScoresTime = ref();
  const scorePeriod = ref("期末");

  /**
   * 拆入已读成绩
   * 提取成标记存入数组
   * @param state
   * @param value 成绩
   */
  const insertReadScore = (value: Score) => {
    readScoreMarks.value.push({
      name: value.lessonID,
      scorePoint: value.scorePoint,
      val: true
    });
  };
  /**
   * 发现新出成绩之后的操作
   * - 标记时间
   * @param state
   */
  const findNewScore = () => {
    findNewScoresTime.value = new Date();
  };

  /**
   * 更新当前选中的成绩时期（期中/期末）
   * @param state
   * @param value 更新的period
   */
  const changeScorePeriod = (value: "期中" | "期末") => {
    scorePeriod.value = value;
  };
  return {
    readScoreMarks,
    findNewScoresTime,
    scorePeriod,
    insertReadScore,
    findNewScore,
    changeScorePeriod
  };
});
