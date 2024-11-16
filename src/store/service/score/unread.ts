import useGeneralInfo from "@/store/system/generalInfo";
import { FinalTermScore, MidTermScore, ScoreBase } from "@/types/Score";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import useScoreQuery from "./query";

const useUnreadScore = defineStore("score/unread", () => {
  const generalInfo = useGeneralInfo();
  const lastScoreUpdateTime = ref<string>();
  const readMidTermScores = ref<MidTermScore[]>([]);
  const readFinalTermScores = ref<FinalTermScore[]>([]);

  const termOfScore = ref({
    year: generalInfo.value.scoreYear,
    term: generalInfo.value.scoreTerm
  });
  const { list: midTermScores } = useScoreQuery({
    defaultQueryParams: {
      year: generalInfo.value.scoreYear,
      term: generalInfo.value.scoreTerm,
      period: "期中"
    }
  });
  const { list: finalTermScores } = useScoreQuery({
    defaultQueryParams: {
      year: generalInfo.value.scoreYear,
      term: generalInfo.value.scoreTerm,
      period: "期末"
    }
  });

  // 标记所有成绩为已读
  function readAll() {
    const { scoreTerm, scoreYear } = generalInfo.value;
    // 如果已读的缓存学期不对，就重置缓存
    if (termOfScore.value.term !== scoreTerm || termOfScore.value.year !== scoreYear) {
      readFinalTermScores.value = [];
      readMidTermScores.value = [];
    }

    readFinalTermScores.value = finalTermScores.value as FinalTermScore[];
    readMidTermScores.value = midTermScores.value;
  }

  const unreadScores = computed(() => {
    if (!midTermScores || !finalTermScores) return [];
    const result: (ScoreBase & { period: "期中" | "期末" })[] = [];
    let isFoundNewScore = false;

    for (const item of midTermScores.value) {
      const { lessonID, score } = item;
      const existed = readMidTermScores.value.find(
        read => read.lessonID === lessonID && read.score === score
      );
      if (!existed) {
        result.push({ ...item, period: "期中" });
        isFoundNewScore = true;
      }
    }

    for (const item of finalTermScores.value) {
      const { lessonID, score } = item;
      // 相同课程，如果 score 不同，也视作新成绩
      const existed = readFinalTermScores.value.find(
        read => read.lessonID === lessonID && read.score === score
      );
      if (!existed) {
        result.push({ ...item, period: "期末" });
        isFoundNewScore = true;
      }
    }

    if (isFoundNewScore) lastScoreUpdateTime.value = Date().toString();
    return result;
  });

  return {
    readAll,
    list: unreadScores,
    readMidTermScores,
    readFinalTermScores,
    lastScoreUpdateTime
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useUnreadScore;
