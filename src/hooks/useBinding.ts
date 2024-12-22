import useUser, { BindStateType } from "@/hooks/user/info";
import { computed } from "vue";

export const PermissionAtom: Record<keyof BindStateType, number> = {
  lib: 0b00000001,
  yxy: 0b00000010,
  zf: 0b00000100,
  oauth: 0b00001000
};

/**
 * 二进制的权限组，组内有一个满足了，就视为满足权限
 */
export type PermissionGroup = Array<keyof BindStateType>[];

/*
 * 创建绑定访问权限

 * @param need 对绑定的要求，如 [["zf", "lib"], ["oauth"]] 表示
 * 需要同时绑定 zf 和 lib，或者只绑定了 oauth
 */
function createPermissionGroup(
  require: Array<keyof BindStateType>[]
) {
  return require.map((group) => {
    return group.reduce((prev, curr) => prev | PermissionAtom[curr], 0);
  });
}

export default function useBinding() {
  const { info, fetchUserInfo } = useUser();

  const bindState = computed(() => {
    return info.value?.bind ?? {
      lib: false,
      yxy: false,
      zf: false,
      oauth: false
    };
  });

  const _myPermission = computed(() => {
    let result = 0;
    for (const key in bindState.value) {
      if (bindState.value[key]) {
        result = result | PermissionAtom[key];
      }
    }
    return result;
  });

  function canAccess(require: PermissionGroup) {
    const binaryRequire = createPermissionGroup(require);
    return binaryRequire.some(p => (p & _myPermission.value) === p);
  }

  function updateBindState() {
    fetchUserInfo();
  }

  return {
    bindState,
    updateBindState,
    canAccess
  };
}
