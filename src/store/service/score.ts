import { computed, ref, shallowRef, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { persistedStorage, RequestError } from "@/utils";
import { FinalTermScore, MidTermScore } from "@/types/Score";
import { ZFService } from "@/services";
import { omit } from "lodash-es";
import { useRequestNext } from "@/hooks";
import useGeneralInfoStore from "../system/generalInfo";
import Taro from "@tarojs/taro";

type TermScoreCollection = {
  midTerm?: MidTermScore[];
  finalTerm?: FinalTermScore[];
  year: string;
  term: "上" | "下" | "短";
};

function scoreFetcher(params: { year: string, term: "上" | "下" | "短", period: "midTerm" | "finalTerm" }) {
  if (params.period === "midTerm")
    return ZFService.getMidTermScore(omit(params, "period"));
  return ZFService.getFinalTermScore(omit(params, "period"));
}

// TODO: 拆分 quick-view 逻辑
const useScoreStore = defineStore("score", () => {
  const { info: generalInfo } = storeToRefs(useGeneralInfoStore());
  const collections = shallowRef<TermScoreCollection[]>([]);
  const read = ref<Required<TermScoreCollection>>({
    midTerm: [],
    finalTerm: [],
    year: generalInfo.value.scoreYear,
    term: generalInfo.value.scoreTerm
  });
  const unread = ref<Required<TermScoreCollection>>({
    midTerm: [],
    finalTerm: [],
    year: generalInfo.value.scoreYear,
    term: generalInfo.value.scoreTerm
  });
  const lastScoreUpdateTime = ref<string>();

  // TODO: 确认 shallowRef 优化效果
  const current = computed(() => {
    return collections.value.find(
      _ => _.year === generalInfo.value.scoreYear && _.term === generalInfo.value.scoreTerm
    );
  });

  const { loading, run: fetchScore } = useRequestNext(
    scoreFetcher, {
      defaultParams: {
        year: generalInfo.value.scoreYear,
        term: generalInfo.value.scoreTerm,
        period: "finalTerm"
      },
      initialData: [],
      onSuccess: (scores, params) => {
        const { year, term, period } = params!;
        const existedIndex = collections.value.findIndex(_ => _.year === year && _.term === term);
        if (existedIndex !== -1) {
          collections.value[existedIndex] = {
            ...collections.value[existedIndex],
            [period]: scores
          };
        } else {
          collections.value.push({ [period]: scores, year, term });
        }
      },
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `更新成绩失败: ${e.message}`, icon: "none" });
        }
      }
    }
  );

  // 标记一批成绩为已读
  function markBatchRead({ midTerm, finalTerm }: TermScoreCollection) {
    const { scoreTerm, scoreYear } = generalInfo.value;
    // 如果已读的缓存学期不对，就重置缓存
    if (read.value.term !== scoreTerm || read.value.year !== scoreYear)
      read.value = { year: scoreYear, term: scoreTerm, midTerm: [], finalTerm: [] };

    read.value.midTerm?.push(...midTerm!);
    read.value.finalTerm?.push(...finalTerm!);
  }

  // 检查是否有新的成绩产生
  watch(current, (newCollection) => {
    if (!newCollection) return;
    const { scoreTerm, scoreYear } = generalInfo.value;
    const result: Required<TermScoreCollection> = { year: scoreYear, term: scoreTerm, midTerm: [], finalTerm: [] };
    let isFoundNewScore = false;

    const periods = ["midTerm", "finalTerm"] as const;
    periods.map(p => {
      for (const item of (newCollection[p] ?? [])) {
        const { lessonID, score } = item;
        const existed = read.value[p]?.find(
          read => read.lessonID === lessonID && read.score === score
        );
        if (!existed) {
          result[p]?.push(item as any);
          isFoundNewScore = true;
        }
      }
    });
    if (isFoundNewScore) lastScoreUpdateTime.value = Date().toString();
    unread.value = result;
  });

  return {
    loading,
    collections,
    current,
    read,
    unread,
    fetchScore,
    markBatchRead,
    lastScoreUpdateTime
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["collections", "collectionOfRead", "lastScoreUpdateTime"]
  }
});

export default useScoreStore;
