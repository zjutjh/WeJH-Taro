import useBinding, { PermissionGroup } from "@/hooks/useBinding";
import { SystemService } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { omit } from "lodash-es";
import { computed } from "vue";

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

function useAppList() {
  const { canAccess } = useBinding();

  const { data: rawList } = useQuery({
    queryKey: ["appList"],
    queryFn: SystemService.getAppList
  });

  const list = computed(() => {
    if (!rawList.value) return [];

    return rawList.value?.map(item => {
      const require = permissionMap[item.require];

      return {
        ...omit(item, "require"),
        disabled: require ? !canAccess(require) : false
      };
    });
  });

  return {
    list
  };
};

export default useAppList;
