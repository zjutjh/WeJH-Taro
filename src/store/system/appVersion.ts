import { updateInfo } from "@/constants/updateInfo";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useAppVersionStore = defineStore("appVersion", () => {
  const version = ref("");
  const versionInStorage = persistedStorage.getItem("appVersion")?.version;
  const isUpdatedStart = ref(false); // 更新完成后第一次启动

  const newVersion = updateInfo.version;
  if (newVersion && versionInStorage !== newVersion) {
    version.value = newVersion;
    isUpdatedStart.value = true;
  }

  return {
    version,
    isUpdatedStart
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useAppVersionStore;
