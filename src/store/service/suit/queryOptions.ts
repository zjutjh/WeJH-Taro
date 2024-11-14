import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useSuitQueryOptions = defineStore("suit/queryOptions", () => {
  const campus = ref<"屏峰" | "朝晖" | "莫干山">("朝晖");
  const applyStatus = ref<"待处理" | "借用中" | "已完成">("待处理");

  function setOptions(partial: {
    campus?: "屏峰" | "朝晖" | "莫干山";
    applyStatus?: "待处理" | "借用中" | "已完成";
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
