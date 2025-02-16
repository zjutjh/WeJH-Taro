import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useElectricityQueryOption = defineStore("electricity/query-option", () => {
  const campus = ref("zhpf");

  return {
    campus
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useElectricityQueryOption;
