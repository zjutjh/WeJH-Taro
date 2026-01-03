import { cloneDeep } from "lodash-es";
import { defineStore } from "pinia";
import { ref } from "vue";

import { PINIA_KEY } from "@/constants/pinia-key";
import { persistedStorage } from "@/utils/storage";

import { SCHEDULE_DIRECTION_UNLIMITED_OPTION } from "../_constants";

export const useScheduleFilter = defineStore(
  PINIA_KEY.SCHOOL_BUS_SCHEDULE_FILTER,
  () => {
    const startDirectionOption = ref(cloneDeep(SCHEDULE_DIRECTION_UNLIMITED_OPTION));
    const endDirectionOption = ref(cloneDeep(SCHEDULE_DIRECTION_UNLIMITED_OPTION));

    return {
      startDirectionOption,
      endDirectionOption
    };
  },
  {
    persist: {
      storage: persistedStorage
    }
  }
);
