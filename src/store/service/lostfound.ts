import { defineStore } from "pinia";
import { ref } from "vue";

import { CampusOption, LostOrFoundOption } from "@/api/types/lostfound";
import { persistedStorage } from "@/utils/storage";

export const useLostfoundStore = defineStore(
  "lostfound",
  () => {
    const lastOpenCampus = ref<CampusOption>("屏峰");
    const lastOpenMain = ref<LostOrFoundOption>("");

    return { lastOpenCampus, lastOpenMain };
  },
  { persist: { storage: persistedStorage } }
);
