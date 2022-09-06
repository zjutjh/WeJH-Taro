export interface SystemStoreType {
  loading: boolean;
  generalInfo: {
    is_begin: boolean;
    schoolBusUrl: string;
    term: '上' | '下' | '短';
    termStartDate: string;
    termYear: string;
    time: string;
    week: number;
  };
  runtime: any;
}

export const SystemStore = {
  /*   modules: {
    runtime: RuntimeStore
  }, */
  state: () => ({
    loading: false,
    getSystemInfo: {},
    runtime: {}
  }),
  mutations: {
    startLoading(state: SystemStoreType) {
      state.loading = true;
    },
    stopLoading(state: SystemStoreType) {
      state.loading = false;
    },

    setGeneralInfo(state: SystemStoreType, value) {
      state.generalInfo = value;
    }
  },
  actions: {
    updateGeneralInfo(context) {
      context.commit('setGeneralInfo');
    }
  }
};
