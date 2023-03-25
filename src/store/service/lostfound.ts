export interface LostfoundStoreType {
  lastOpenCampus?: string;
}

export const LostfoundStore = {
  state: () => ({
    lastOpenCampus: "屏峰",
  }),
  mutations: {
    setLastOpenCampus(state: LostfoundStoreType, value: string) {
      state.lastOpenCampus = value;
    },
  },
};
