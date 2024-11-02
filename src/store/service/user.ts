import { useRequestNext } from "@/hooks";
import { UserService } from "@/services";
import { RequestError, persistedStorage } from "@/utils";
import Taro from "@tarojs/taro";
import { omit } from "lodash-es";
import { defineStore } from "pinia";
import { ref } from "vue";

export type WXProfileType = {
  avatarUrl: string;
  nickName: string;
};

export type UserInfoType = {
  createTime: string;
  id: number;
  phoneNum: string;
  studentID: string;
  username: string;
  userType: number;
};

export type BindStateType = {
  lib: boolean;
  yxy: boolean;
  zf: boolean;
  oauth: boolean;
};

const useUserStore = defineStore("user", () => {
  const info = ref<UserInfoType>();
  const bindState = ref<BindStateType>({
    zf: false,
    lib: false,
    yxy: false,
    oauth: false
  });
  const wxProfile = ref<WXProfileType>();
  const isActive = ref(false);

  const { loading, run: getUserData } = useRequestNext(
    UserService.getUserInfo, {
      initialData: undefined,
      onSuccess: (res) => {
        info.value = omit(res!.user, "bind");
        bindState.value = res!.user.bind;
        isActive.value = true;
      },
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `获取用户信息失败 ${e.message}`, icon: "none" });
        }
      }
    }
  );

  async function getWXProfile() {
    const { userInfo } = await Taro.getUserProfile({
      desc: "用于获取头像和昵称"
    });
    wxProfile.value = userInfo;
  }

  function updateBindState(payload: keyof BindStateType, value: boolean) {
    bindState.value[payload] = value;
  }

  const clearUserData = () => {
    info.value = undefined;
    isActive.value = false;
    bindState.value = {
      zf: false,
      lib: false,
      yxy: false,
      oauth: false
    };
  };

  return {
    info,
    isActive,
    wxProfile,
    bindState,
    loading,
    getUserData,
    getWXProfile,
    updateBindState,
    clearUserData
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["info", "isActive", "wxProfile", "bindState"]
  }
});

export default useUserStore;
