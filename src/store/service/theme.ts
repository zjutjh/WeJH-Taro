import { DarkModeOption, DarkModeTheme } from "@/types/DarkMode";
interface ThemeConfig {
  bar_icon: {
    home_icon: string;
    function_icon: string;
    my_icon: string;
    selected_home_icon: string;
    selected_function_icon: string;
    selected_my_icon: string;
  },
  applist_icon: {
    class_icon: string;
    grade_icon: string;
    exam_icon: string;
    free_classroom_icon: string;
    schoolcard_icon: string;
    lend_icon: string;
    electricity_icon: string;
    schoolbus_icon: string;
    cloth_icon: string;
  },
  background_img: string;
  background_color: string;
  background_position: string;
  base_color: {
    base_500: string;
    base_600: string;
    base_700: string;
  },
}
export interface Theme {
  name: string;
  theme_config: ThemeConfig,
  is_dark_mode: boolean;
  theme_id: number;
}

export type ThemeList = Theme[]

type ThemeMode = {light: string; dark: string}

export interface ThemeStoreType {
  hadTheme: ThemeList;
  themeMode: ThemeMode
  config: ThemeConfig
  darkMode: DarkModeOption
}

export const ThemeStore = {
  state: {
    hadTheme: [],
    themeMode: {
      light: "green",
      dark: "green"
    },
    config: [],
    darkMode: {
      mode: "light",
      isAdapted: false
    }
  },
  mutations: {
    setHadTheme(state: ThemeStoreType, value: ThemeList) {
      state.hadTheme = value;
    },
    setThemeMode(state: ThemeStoreType, value: ThemeMode) {
      state.themeMode = value;
    },
    setConfig(state: ThemeStoreType, value: ThemeConfig) {
      state.config = value;
    },
    setDarkMode(state: ThemeStoreType, value: DarkModeTheme) {
      state.darkMode.mode = value;
    },
    setDarkModeAdapted(state: ThemeStoreType, value: boolean) {
      state.darkMode.isAdapted = value;
    }
  }
};
