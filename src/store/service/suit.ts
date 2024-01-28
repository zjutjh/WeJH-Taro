export interface SuitStoreType {
  lastOpenCampus?: string;
}

export const SuitStore = {
  state: () => ({
    lastOpenCampus: "屏峰",
  }),
  mutations: {
    setLastOpenCampus(state: SuitStoreType, value: string) {
      state.lastOpenCampus = value;
    }
  },
};
