import { questionnaireInfo } from "@/constants/updateInfo";
import { defineStore } from "pinia";
import { persistedStorage } from "@/utils";
import { onMounted, ref } from "vue";

const useQuestionnaireStore = defineStore("questionnaire", () => {
  const path = ref("");
  const status = ref<"fold" | "close" | "open">("close");

  onMounted(() => {
    const newData = questionnaireInfo;
    // 问卷路径有更新，更新状态，并打开问卷入口
    if (newData.path != path.value) {
      path.value = questionnaireInfo.path;
      status.value = "open";
    }
  });

  return {
    path,
    status,
    isAccess: questionnaireInfo.isAccess
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useQuestionnaireStore;
