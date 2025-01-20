export interface SystemStoreType {
  loading: boolean;

  generalInfo: {
    is_begin: boolean;
    schoolBusUrl: string;
    term: "上" | "下" | "短";
    termStartDate: string;
    termYear: string;
    time: string;
    week: number;
    scoreTerm: "上" | "下" | "全";
    scoreYear: string;
    score?: "上" | "下" | "短"; // 考虑一些服务与实际学期不同步
  };
  version: string;
  questionnaire: {
    path: string;
    state: "fold" | "close" | "open";
  };
}

export const SystemStore = {
  state: () => ({
    loading: false,
    generalInfo: {},
    version: "",
    questionnaire: {}
  }),
  mutations: {
    startLoading(state: SystemStoreType) {
      state.loading = true;
    },
    stopLoading(state: SystemStoreType) {
      state.loading = false;
    },
    setGeneralInfo(
      state: SystemStoreType,
      value: SystemStoreType["generalInfo"]
    ) {
      state.generalInfo = value;
    },
    setVersion(state: SystemStoreType, value: string) {
      state.version = value;
    },
    setQuestionnaire(
      state: SystemStoreType,
      value: SystemStoreType["questionnaire"]
    ) {
      state.questionnaire = value;
    }
  }
};
