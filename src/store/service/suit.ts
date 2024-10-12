type suitItem = {
  name: string;
  img: string;
  specs: {
    id: number;
    spec: string;
    stock: number;
  }[];
}[];

export interface SuitStoreType {
  lastOpenCampus?: string;
  campusSuitInfo?: suitItem;
  lastOpenStatus?: string;
}

export const SuitStore = {
  state: () => ({
    lastOpenCampus: "屏峰",
    campusSuitInfo: [],
    lastOpenMain: "待处理"
  }),
  mutations: {
    setLastOpenCampus(state: SuitStoreType, value: string) {
      state.lastOpenCampus = value;
    },
    setCampusSuitInfo(state: SuitStoreType, value: suitItem) {
      state.campusSuitInfo = value;
    },
    setLastOpenStatus(state: SuitStoreType, value: string) {
      state.lastOpenStatus = value;
    }
  }
};
