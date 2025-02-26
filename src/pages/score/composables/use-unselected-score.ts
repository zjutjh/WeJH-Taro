import { ScoreBase } from "@/types/Score";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

const useUnselectedScore = defineStore("score/calculate", () => {
  const unselectedKeys = ref<ScoreBase["key"][]>([]);

  function selectScore(key: ScoreBase["key"]) {
    const index = unselectedKeys.value.indexOf(key);
    if (index !== -1) {
      unselectedKeys.value.splice(index, 1);
    }
  }

  function clearUnselectedKeys() {
    unselectedKeys.value = [];
  }

  function unselectScore(key: ScoreBase["key"]) {
    // TODO: 优化性能
    if (!unselectedKeys.value.includes(key)) {
      unselectedKeys.value.push(key);
    }
  }

  return {
    unselectedKeys,
    selectScore,
    clearUnselectedKeys,
    unselectScore
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useUnselectedScore;
