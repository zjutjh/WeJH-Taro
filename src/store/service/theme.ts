export interface ThemeStoreType {
  themeMode?: string;
}

export const ThemeStore = {
  state: {
    themeMode: "yellow"
  },
  mutations: {
    setThemeMode(state: ThemeStoreType, value) {
      state.themeMode = value;
    }
  }
};
