import useGeneralInfo from "@/store/system/generalInfo";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useScoreQueryOptionStore = defineStore("score/queryOptions", () => {
  const generalInfo = useGeneralInfo();

  const term = ref<"上" | "下" | "短">(generalInfo.value.scoreTerm);
  const year = ref(generalInfo.value.scoreYear);
  const period = ref<"期中" | "期末">("期末");

  function setOption(value: {
    term: "上" | "下" | "短";
    year: string;
    period: "期中" | "期末";
  }) {
    term.value = value.term;
    year.value = value.year;
    period.value = value.period;
  }

  return {
    term,
    year,
    period,
    setOption
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useScoreQueryOptionStore;
