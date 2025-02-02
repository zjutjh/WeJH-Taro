import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useLostFoundQueryOption = defineStore("lostfound/select", () => {
  const campus = ref<"全部" | "朝晖" | "屏峰" | "莫干山">("屏峰");
  const lostOrFound = ref<"全部" | "失物" | "寻物">("全部");
  const kind = ref("全部");

  return {
    campus,
    lostOrFound,
    kind
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useLostFoundQueryOption;
