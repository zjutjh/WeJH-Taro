import { DarkModeTheme, DarkModeOption } from "@/types/DarkMode";

export interface ThemeStoreType {
  themeMode: string;
  darkMode: DarkModeOption
}

export const ThemeStore = {
  state: {
    themeMode: "green",
    darkMode: {
      mode: "light",
      isAdapted: false
    }
  },
  mutations: {
    setThemeMode(state: ThemeStoreType, value: string) {
      state.themeMode = value;
    },
    setDarkMode(state: ThemeStoreType, value: DarkModeTheme) {
      state.darkMode.mode = value;
    },
    setDarkModeAdapted(state: ThemeStoreType, value: boolean) {
      state.darkMode.isAdapted = value;
    }
  }
};
