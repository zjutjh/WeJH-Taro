import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";
import { RentStatusEnum, CampusCodeEnum } from "../types";

const useSuitQueryOptions = defineStore("suit/queryOptions", () => {
  const campus = ref<CampusCodeEnum>(CampusCodeEnum.ZH);
  const applyStatus = ref<RentStatusEnum>(RentStatusEnum.PENDING);

  function setOptions(partial: {
    campus?: CampusCodeEnum;
    applyStatus?: RentStatusEnum;
  }) {
    campus.value = partial.campus ?? campus.value;
    applyStatus.value = partial.applyStatus ?? applyStatus.value;
  }

  return {
    campus,
    applyStatus,
    setOptions
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useSuitQueryOptions;
