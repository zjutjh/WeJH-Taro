import { useRequestNext } from "@/hooks";
import { LibraryService } from "@/services";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

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
