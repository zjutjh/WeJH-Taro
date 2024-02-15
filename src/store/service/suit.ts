export interface SuitApplyStoreType {
  lastOpenCampus?: string;
  lastOpenStatus?: string;
}

export const SuitApplyStore = {
  state: () => ({
    lastOpenCampus: "朝晖",
    lastOpenMain: "待处理"
  }),
  mutations: {
    setLastOpenCampus(state: SuitApplyStoreType, value: string) {
      state.lastOpenCampus = value;
    },
    setLastOpenStatus(state:SuitApplyStoreType, value: string) {
      state.lastOpenStatus = value;
    }
  },
};
