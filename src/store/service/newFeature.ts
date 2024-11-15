import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type FeatureNode = {
  [key: string]: string | null | FeatureNode;
};

/**
  * 递归查找子项是否有通知
  */
const childrenHasUnreadItem = (node: FeatureNode | string | null): boolean => {
  if (typeof node === "string") return true;
  else if (node === null) return false;

  return Object
    .keys(node)
    .some(key => childrenHasUnreadItem(node[key]));
};

const useNewFeatureStore = defineStore("newFeature", () => {
  const tree = ref<FeatureNode>({
    home: null,
    appList: null,
    my: {
      bind: "新"
    }
  });

  const newFeatureInTab = computed(() => ({
    home: childrenHasUnreadItem(tree.value.home),
    appList: childrenHasUnreadItem(tree.value.appList),
    my: childrenHasUnreadItem(tree.value.my)
  }));

  return {
    tree,
    newFeatureInTab
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useNewFeatureStore;
