import useMemorizedRequest from "@/hooks/useMemorizedRequest";
import { UserService } from "@/services";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";
import { ref, watch } from "vue";

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

function useUser() {
  const isActive = ref(false);
  const { data: info, refresh: fetchUserInfo } = useMemorizedRequest(
    "user/info",
    () => UserService.getUserInfo().then((res) => res.user),
    {
      initialData: undefined,
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `获取用户信息失败 ${e.message}`, icon: "none" });
        }
      }
    }
  );

  watch(info, (newVal) => {
    if (newVal) isActive.value = true;
  }, { immediate: true });

  function logout() {
    isActive.value = false;
  }

  return {
    info,
    isActive,
    fetchUserInfo,
    logout
  };
};

export default useUser;
