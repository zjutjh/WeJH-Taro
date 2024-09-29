import { DarkModeTheme, DarkModeOption } from "@/types/DarkMode";
interface ThemeList {
  id?: number;
  name?: string;
  theme_config?: string;
  type: string;
}

export interface ThemeStoreType {
  hadTheme: ThemeList
  themeMode: string;
  darkMode: DarkModeOption
}

export const ThemeStore = {
  state: {
    hadTheme: [],
    themeMode: "green",
    darkMode: {
      mode: "light",
      isAdapted: false
    }
  },
  mutations: {
    setHadTheme(state: ThemeStoreType, value: ThemeList) {
      state.hadTheme = value;
    },
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
