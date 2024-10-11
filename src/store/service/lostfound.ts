export interface LostfoundStoreType {
  lastOpenCampus?: string;
  lastOpenMain?: string;
}

export const LostfoundStore = {
  state: () => ({
    lastOpenCampus: "屏峰",
    lastOpenMain: "全部"
  }),
  mutations: {
    setLastOpenCampus(state: LostfoundStoreType, value: string) {
      state.lastOpenCampus = value;
    },
    setLastOpenMain(state: LostfoundStoreType, value: string) {
      state.lastOpenMain = value;
    }
  }
};
