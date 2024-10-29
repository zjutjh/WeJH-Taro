import { defineStore } from "pinia";
import { ref } from "vue";
import { persistedStorage } from "@/utils";

export interface SystemStoreType {
  loading: boolean;
}

// TODO: extract global loading
export const useSystemStore = defineStore("system", () => {
  const loading = ref(false);

  const startLoading = () => {
    loading.value = true;
  };
  const stopLoading = () => {
    loading.value = false;
  };

  return {
    loading,
    startLoading,
    stopLoading
  };
}, {
  persist: {
    storage: persistedStorage
  }
});
