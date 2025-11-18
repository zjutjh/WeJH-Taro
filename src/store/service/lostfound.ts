import { defineStore } from "pinia";
import { ref } from "vue";

import { Campus, Main } from "@/api/types/lostfound";
import { persistedStorage } from "@/utils/storage";

export const useLostfoundStore = defineStore(
  "lostfound",
  () => {
    const lastOpenCampus = ref<Campus>("屏峰");
    const lastOpenMain = ref<Main>("");

    return { lastOpenCampus, lastOpenMain };
  },
  { persist: { storage: persistedStorage } }
);
