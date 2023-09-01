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
export const UserServiceStore = {
  state: () => ({
    info: undefined,
    isActive: false,
    isBindZF: false,
    isBindLibrary: false,
    isBindYXY: false,
    isBindOauth: false
  }),
  mutations: {
    setBindZF(state: UserType, value: boolean) {
      state.isBindZF = value;
    },
    setBindLibrary(state: UserType, value: boolean) {
      state.isBindLibrary = value;
    },
    setBindYXY(state: UserType, value: boolean) {
      state.isBindYXY = value;
    },
    setBindOauth(state:UserType, value: boolean) {
      state.isBindOauth = value;
    },
    // comment: 设置用户信息
    setUserInfo(
      state: UserType,
      value: {
        studentID: string;
        bind: { zf: boolean; lib: boolean, yxy: boolean, oauth: boolean };
      }
    ) {
      state.info = { studentID: value.studentID };
      state.isBindZF = value.bind.zf;
      state.isBindLibrary = value.bind.lib;
      state.isBindYXY = value.bind.yxy;
      state.isBindOauth = value.bind.oauth;
      state.isActive = true;
    },
    setUserWXProfile(
      state: UserType,
      value: { avatarUrl: string; nickName: string }
    ) {
      state.wxProfile = value;
    },
    // comment: 删除用户信息
    clearUserInfo(state: UserType) {
      state.info = undefined;
      state.isActive = false;
      state.isBindZF = false;
      state.isBindLibrary = false;
      state.isBindYXY = false;
      state.isBindOauth = false;
    }
  }
};
