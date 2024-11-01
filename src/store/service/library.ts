import { useRequestNext } from "@/hooks";
import { LibraryService } from "@/services";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export const LibraryServiceStore = {
  state: () => ({
    history: [],
    current: [],
    updateTime: {
      history: undefined,
      current: undefined
    }
  }),
  mutations: {
    setLibraryHistory(state: any, value: Array<object>) {
      state.history = value;
      state.updateTime.history = new Date();
    },
    setLibraryCurrent(state: any, value: Array<object>) {
      state.current = value;
      state.updateTime.current = new Date();
    }
  }
};

const useLibraryStore = defineStore("library", () => {
  const updateTime = ref<string>();

  // 当前正在借阅
  const { data: borrowing, error } = useRequestNext(
    LibraryService.getLibraryCurrent, {
      initialData: [],
      onSuccess: () => {
        updateTime.value = Date().toString();
      }
    }
  );

  return {
    borrowing,
    updateTime,
    error
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["borrowing", "updateTime"]
  }
});

export default useLibraryStore;
