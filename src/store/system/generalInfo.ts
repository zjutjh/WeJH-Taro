import { useRequestNext } from "@/hooks";
import { SystemService } from "@/services";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";

const useGeneralInfoStore = defineStore("generalInfo", () => {
  const { data } = useRequestNext(
    SystemService.getGeneralInfo, {
      initialData: {
        // @ts-expect-error 代码中未使用
        defaultTheme: undefined,
        fileUrl: "",
        "is_begin": true,
        jpgUrl: "",
        registerTips: "",
        schoolBusUrl: "",
        scoreTerm: "上",
        scoreYear: "2024",
        term: "上",
        termStartDate: "2024-09-15",
        termYear: "2024",
        time: "",
        week: 1
      }
    }
  );

  return {
    info: data
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useGeneralInfoStore;
