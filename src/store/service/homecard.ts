import { HomeCardName, homeCardNameMap } from "@/constants/homeCards";
import useBinding from "@/hooks/useBinding";
import { persistedStorage } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

/** 默认启用两张卡片 */
const defaultHomeCard: HomeCardName[] = ["lessons-table-quick-view", "score-quick-view"];

const useHomeCardStore = defineStore("homeCard", () => {
  const selectedKeys = ref(defaultHomeCard);
  const { canAccess } = useBinding();

  /** 根据绑定态，用户能访问的所有卡片 */
  const allCards = computed(() => {
    return Object.values(homeCardNameMap)
      .filter(item => canAccess(item.require));
  });

  /** 选中的所有卡片，根据用户的绑定态做筛选 */
  const filteredSelectedCards = computed(() => {
    const uniqueNames = Array.from(new Set(selectedKeys.value));
    const selected = uniqueNames.filter(name => homeCardNameMap[name]).map(name => homeCardNameMap[name]);

    return selected.filter(card => allCards.value.includes(card));
  });

  function add(value: HomeCardName) {
    if (!selectedKeys.value.includes(value))
      selectedKeys.value.push(value);
  }

  function remove(value: HomeCardName) {
    const toDelete = selectedKeys.value.findIndex(item => item === value);
    if (toDelete !== -1) selectedKeys.value.splice(toDelete, 1);
  }

  return {
    selectedKeys,
    selectedCards: filteredSelectedCards,
    allCards,
    add,
    remove
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useHomeCardStore;
