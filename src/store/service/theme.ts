export interface ThemeStoreType {
  themeMode: string;
}

export const ThemeStore = {
  state: {
    themeMode: "green"
  },
  mutations: {
    setThemeMode(state: ThemeStoreType, value) {
      state.themeMode = value;
    }
  }
};
