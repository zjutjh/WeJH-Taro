import { first } from "lodash-es";
import { defineStore } from "pinia";
import { ref } from "vue";

import { CampusOption, LostOrFoundOption } from "@/api/types/lostfound";
import { Option } from "@/constants";
import { persistedStorage } from "@/utils/storage";

export const CAMPUS_OPTION_LIST = [
  { label: "屏峰", value: "屏峰" },
  { label: "朝晖", value: "朝晖" },
  { label: "莫干山", value: "莫干山" }
] as const satisfies Option<CampusOption>[];

export const LOST_OR_FOUND_OPTION_LIST = [
  { label: "全部", value: "" },
  { label: "寻物", value: "寻物" },
  { label: "失物", value: "失物" }
] as const satisfies Option<LostOrFoundOption>[];

export const useLostfoundStore = defineStore(
  "lostfound",
  () => {
    const lastOpenCampus = ref<CampusOption>(first(CAMPUS_OPTION_LIST).value);
    const lastOpenMain = ref<LostOrFoundOption>(first(LOST_OR_FOUND_OPTION_LIST).value);

    return { lastOpenCampus, lastOpenMain };
  },
  { persist: { storage: persistedStorage } }
);
