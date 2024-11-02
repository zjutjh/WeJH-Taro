import { useRequestNext } from "@/hooks";
import useBinding, { PermissionGroup } from "@/hooks/useBinding";
import { SystemService } from "@/services";
import { persistedStorage } from "@/utils";
import { omit } from "lodash-es";
import { defineStore } from "pinia";
import { computed } from "vue";

const useAppListStore = defineStore("appList", () => {
  const { canAccess } = useBinding();

  const { data: rawList } = useRequestNext(
    SystemService.getAppList, {
      initialData: []
    }
  );

  const list = computed(() => rawList.value.map(item => {
    const permissionMap: Record<string, PermissionGroup> = {
      "zf": [["zf"], ["oauth"]],
      "yxy": [["yxy"]],
      /**
       * TODO: 用户信息接口响应中 lib 属性表示图书馆绑定，而查询应用列
       * 表中，用 library 表示需要图书馆权限，等后端统一后给该特判取消
       */
      "library": [["lib"]],
      "oauth": [["oauth"]]
    };
    const require = permissionMap[item.require];

    return {
      ...omit(item, "require"),
      disabled: require ? !canAccess(require) : false
    };
  }));

  return {
    list,
    rawList
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["rawList"]
  }
});

export default useAppListStore;
