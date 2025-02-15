import useGeneralInfo from "@/store/system/generalInfo";
import { ExamTermOption } from "@/types/Exam";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useExamQueryOptionsStore = defineStore("exam/queryOptions", () => {
  const generalInfo = useGeneralInfo();

  const term = ref<ExamTermOption["term"]>(generalInfo.value.scoreTerm);
  const year = ref(generalInfo.value.scoreYear);

  function setOption(value: ExamTermOption) {
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
