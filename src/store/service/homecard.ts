import { HomeCardName, homeCards } from "@/constants/homeCards";
import { persistedStorage } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

/** 默认启用两张卡片 */
const defaultHomeCard: HomeCardName[] = ["lessons-table-quick-view", "score-quick-view"];

const useHomeCardStore = defineStore("homeCard", () => {
  // TODO: 没有赋值上去
  const namesOfSelected = ref(defaultHomeCard);
  const initialization = ref(true);

  function add(value: HomeCardName) {
    namesOfSelected.value.push(value);
  }

  function remove(value: HomeCardName) {
    const toDelete = namesOfSelected.value.findIndex(item => item === value);
    if (toDelete !== -1) namesOfSelected.value.splice(toDelete, 1);
  }

  const selected = computed(() => {
    const uniqueNames = Array.from(new Set(namesOfSelected.value));
    return uniqueNames.filter(name => homeCards[name]).map(name => homeCards[name]);
  });

  return {
    selected,
    namesOfSelected,
    // FIXME: 这个有用？
    initialization,
    add,
    remove
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useHomeCardStore;
