export interface WebviewStoreType {
  tempUrl?: string;
  tempTitle?: string;
}

export const WebviewStore = {
  state: () => ({
    tempUrl: undefined,
    tempTitle: undefined
  }),
  mutations: {
    setTempUrl(state: WebviewStoreType, value: {
      url: string;
      title: string;
    }) {
      state.tempUrl = value.url;
      state.tempTitle = value.title;
    },
    clearTemp(state: WebviewStoreType) {
      state.tempUrl = undefined;
      state.tempTitle = undefined;
    }
  }
};
