import { defineStore } from "pinia";
import { ref } from "vue";

const useElectricityQueryOption = defineStore("electricity/query-option", () => {
  const campus = ref("zhpf");

  return {
    campus
  };
});

export default useElectricityQueryOption;
