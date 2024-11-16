import { useRequestNext } from "@/hooks";
import { ZFService } from "@/services";
import useGeneralInfo from "@/store/system/generalInfo";
import { Exam } from "@/types/Exam";
import { persistedStorage, RequestError } from "@/utils";
import { withRespDataNeverNull } from "@/utils/promise";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import { ref } from "vue";

type TermExamCollection = {
  exams: Exam[],
  year: string;
  term: "上" | "下" | "短";
  updateTime: string;
};

const useExamStore = defineStore("exam/collections", () => {
  const generalInfo = useGeneralInfo();
  const collections = ref<TermExamCollection[]>([]);

  const { error, loading, run: fetchExam } = useRequestNext(
    withRespDataNeverNull(ZFService.getExamInfo), {
      defaultParams: {
        year: generalInfo.value.termYear,
        term: generalInfo.value.term
      },
      initialData: [],
      onSuccess: (exams, params) => {
        const { year, term } = params!;
        const existedIndex = collections.value.findIndex(_ => _.year === year && _.term === term);

        if (existedIndex !== -1) {
          collections.value[existedIndex] = {
            ...collections.value[existedIndex],
            exams,
            updateTime: Date().toString()
          };
        } else {
          collections.value.push({ exams, year, term, updateTime: Date().toString() });
        }
      },
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `更新成绩失败: ${e.message}`, icon: "none" });
        }
      }
    }
  );

  function queryByTermSync(options?: { year: string, term: "上" | "下" | "短" }) {
    const { year, term } = options ?? { term: generalInfo.value.term, year: generalInfo.value.termYear };
    const existed = collections.value.find(_ => _.year === year && _.term === term);

    return existed;
  }

  return {
    loading,
    collections,
    fetchExam,
    error,
    queryByTermSync
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["collections"]
  }
});

export default useExamStore;
