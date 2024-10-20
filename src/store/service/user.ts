import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserType {
  info?: {
    studentID: string;
  };
  wxProfile: {
    avatarUrl: string;
    nickName: string;
  };
  isActive: boolean;
  isBindZF: boolean;
  isBindLibrary: boolean;
  isBindYXY: boolean;
  isBindOauth: boolean;
}

export const useUserStore = defineStore("user", () => {
  const info = ref<UserType["info"]>(undefined);
  const isActive = ref(false);
  const isBindZF = ref(false);
  const isBindLibrary = ref(false);
  const isBindYXY = ref(false);
  const isBindOauth = ref(false);
  const wxProfile = ref<UserType["wxProfile"]>();

  const setBindZF = (value: boolean) => {
    isBindZF.value = value;
  };

  const setBindLibrary = (value: boolean) => {
    isBindLibrary.value = value;
  };
  const setBindYXY = (value: boolean) => {
    isBindYXY.value = value;
  };
  const setBindOauth = (value: boolean) => {
    isBindOauth.value = value;
  };
  const setUserInfo = (value: {
    studentID: string;
    bind: { zf: boolean; lib: boolean, yxy: boolean, oauth: boolean };
  }) => {
    info.value = { studentID: value.studentID };
    isBindZF.value = value.bind.zf;
    isBindLibrary.value = value.bind.lib;
    isBindYXY.value = value.bind.yxy;
    isBindOauth.value = value.bind.oauth;
    isActive.value = true;
  };

  const setUserWXProfile = (value: { avatarUrl: string; nickName: string }) => {
    wxProfile.value = value;
  };
  const clearUserInfo = () => {
    info.value = undefined;
    isActive.value = false;
    setBindZF(false);
    setBindLibrary(false);
    setBindYXY(false);
    setBindOauth(false);
  };

  return {
    info,
    isActive,
    isBindZF,
    isBindLibrary,
    isBindYXY,
    isBindOauth,
    wxProfile,
    setUserInfo,
    setUserWXProfile,
    clearUserInfo,
    setBindZF,
    setBindLibrary,
    setBindYXY,
    setBindOauth
  };
});
