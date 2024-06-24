import useGeneralInfoStore from "@/store/system/generalInfo";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";

const useExamQueryOptionsStore = defineStore("exam/queryOptions", () => {
  const { info: generalInfo } = storeToRefs(useGeneralInfoStore());

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
});

export default useExamQueryOptionsStore;
