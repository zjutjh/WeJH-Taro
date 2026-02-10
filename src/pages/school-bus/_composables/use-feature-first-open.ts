import { defineStore } from "pinia";
import { ref } from "vue";

import { PINIA_KEY } from "@/constants/pinia-key";
import { persistedStorage } from "@/utils/storage";

/**
 * 是否第一次打开校车页
 */
export const useSchoolBusFeatureFirstOpen = defineStore(
  PINIA_KEY.SCHOOL_BUS_FEATURE_FIRST_OPEN,
  () => {
    const isFirstOpen = ref(true);
    return {
      isFirstOpen
    };
  },
  {
    persist: {
      storage: persistedStorage
    }
  }
);
