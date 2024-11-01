import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface LostfoundStoreType {
  lastOpenCampus?: string;
  lastOpenMain?: string;
}

const useLostFoundStore = defineStore("lostfound", () => {
  const lastOpenCampus = ref("屏峰");
  const lastOpenMain = ref("全部");

  function setLastOpenCampus(value: string) {
    lastOpenCampus.value = value;
  }

  function setLastOpenMain(value: string) {
    lastOpenMain.value = value;
  }

  return {
    lastOpenCampus,
    lastOpenMain,
    setLastOpenCampus,
    setLastOpenMain
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useLostFoundStore;
