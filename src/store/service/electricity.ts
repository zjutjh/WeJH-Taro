import { defineStore } from "pinia";
import { ref } from "vue";

import { CampusOption } from "@/api/types/yxy";
import { Option } from "@/constants";
import { PINIA_KEY } from "@/constants/pinia-key";
import { persistedStorage } from "@/utils/storage";

export const CAMPUS_OPTION = [
  { label: "朝晖/屏峰", value: "zhpf" },
  { label: "莫干山", value: "mgs" }
] as const satisfies Option<CampusOption>[];

export const useElectricityStore = defineStore(
  PINIA_KEY.ELECTRICITY_GLOBAL,
  () => {
    const campus = ref<CampusOption>("zhpf");
    const selectIndex = ref(0);

    return { campus, selectIndex };
  },
  { persist: { storage: persistedStorage } }
);
