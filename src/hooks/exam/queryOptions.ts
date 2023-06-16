import useGeneralInfo from "@/store/system/generalInfo";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useExamQueryOptionsStore = defineStore("exam/queryOptions", () => {
  const generalInfo = useGeneralInfo();

  const term = ref<"上" | "下" | "短">(generalInfo.value.scoreTerm);
  const year = ref(generalInfo.value.scoreYear);

  function setOption(value: {
    term: "上" | "下" | "短";
    year: string;
  }) {
    term.value = value.term;
    year.value = value.year;
  }

  return {
    term,
    year,
    setOption
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useExamQueryOptionsStore;
