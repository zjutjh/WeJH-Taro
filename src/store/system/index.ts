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
