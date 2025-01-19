import { Score } from "@/types/Score";
import { ServiceStoreType } from ".";

type ScoreServiceStoreType = ServiceStoreType["score"];

export const ScoreServiceStore = {
  state: {
    readScoreMarks: [], // 所有已读成绩的标记
    findNewScoresTime: undefined,
    scorePeriod: "期末", // 记录当前成绩页面选中的期中/期末
    unCalScore: []
  },

  mutations: {

    /**
     * 拆入已读成绩
     * 提取成标记存入数组
     * @param state
     * @param value 成绩
     */
    insertReadScore(
      state: ScoreServiceStoreType,
      value: Score
    ) {
      state.readScoreMarks.push({
        name: value.lessonID,
        scorePoint: value.scorePoint,
        val: true
      });
    },

    /**
     * 发现新出成绩之后的操作
     * - 标记时间
     * @param state
     */

    setUnCalc(
      state: ScoreServiceStoreType,
      value: Score
    ) {
      if (!Array.isArray(state.unCalScore)) {
        state.unCalScore = []; // 如果不是数组，初始化为空数组
      }
      state.unCalScore.push({
        name: value.className,
        scorePoint: value.scorePoint
      });
    },

    /**
     * 取消选中成绩
     * @param state
     * @param value 成绩
     */
    delUnCalc(
      state: ScoreServiceStoreType,
      value: Score
    ) {
      if (!Array.isArray(state.unCalScore)) {
        state.unCalScore = []; // 如果不是数组，初始化为空数组
      }
      const toDelete = state.unCalScore.findIndex(
        item => item.name === value.className
      );
      if (toDelete !== -1) {
        state.unCalScore.splice(toDelete, 1);
      }
    },

    findNewScore(state: ScoreServiceStoreType) {
      state.findNewScoresTime = new Date();
    },

    /**
     * 更新当前选中的成绩时期（期中/期末）
     * @param state
     * @param value 更新的period
     */
    changeScorePeriod(
      state: ScoreServiceStoreType,
      value: "期中" | "期末"
    ) {
      state.scorePeriod = value;
    }

  }
};
