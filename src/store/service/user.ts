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
  isBindCard: boolean;
  isBindLibrary: boolean;
  isBindYXY: boolean;
}
export const UserServiceStore = {
  state: () => ({
    info: undefined,
    isActive: false,
    isBindZF: false,
    isBindCard: false,
    isBindLibrary: false,
    isBindYXY: false
  }),
  mutations: {
    setBindZF(state: UserType, value: boolean) {
      state.isBindZF = value;
    },
    setBindSchoolCard(state: UserType, value: boolean) {
      state.isBindCard = value;
    },
    setBindLibrary(state: UserType, value: boolean) {
      state.isBindLibrary = value;
    },
    setBindYXY(state: UserType, value: boolean) {
      state.isBindYXY = value;
    },
    // comment: 设置用户信息
    setUserInfo(
      state: UserType,
      value: {
        studentID: string;
        bind: { zf: boolean; card: boolean; lib: boolean, yxy: boolean };
      }
    ) {
      state.info = { studentID: value.studentID };
      state.isBindZF = value.bind.zf;
      state.isBindCard = value.bind.card;
      state.isBindLibrary = value.bind.lib;
      state.isBindYXY = value.bind.yxy;
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
      state.isBindCard = false;
      state.isBindLibrary = false;
      state.isBindYXY = false;
    }
  }
};
