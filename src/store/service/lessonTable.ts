import { persistedStorage, RequestError } from "@/utils";
import { defineStore } from "pinia";
import useGeneralInfo from "../system/generalInfo";
import { ref } from "vue";
import { ZFService } from "@/services";
import { useRequestNext } from "@/hooks";
import { Lesson } from "@/types/Lesson";
import Taro from "@tarojs/taro";

type TermLessonCollection = {
  lessons: Lesson[];
  term: string;
  year: string;
  updateTime: string | undefined;
};

async function termCollectionFetcher(params: { year: string, term: string }) {
  return ZFService
    .getLessonTable(params)
    .then<TermLessonCollection>(_ => {
      return {
        lessons: _.lessonsTable ?? [],
        ...params,
        updateTime: Date().toString()
      };
    });
}

const useLessonTableStore = defineStore("lessonTable", () => {
  const generalInfo = useGeneralInfo();
  const collections = ref<TermLessonCollection[]>([]);

  const { loading, run: fetchLessonTable } = useRequestNext(
    termCollectionFetcher, {
      defaultParams: {
        year: generalInfo.value.termYear,
        term: generalInfo.value.term
      },
      initialData: { lessons: [], term: "", year: "", updateTime: undefined },
      onSuccess: (newCollection) => {
        const { year, term } = newCollection;
        const existedIndex = collections.value.findIndex(_ => _.year === year && _.term === term);
        if (existedIndex !== -1) {
          collections.value[existedIndex] = newCollection;
        } else {
          collections.value.push(newCollection);
        }
      },
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `更新课表失败: ${e.message}`, icon: "none" });
        }
      }
    }
  );

  return {
    collections,
    loading,
    fetchLessonTable
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["collections"]
  }
});

export default useLessonTableStore;
