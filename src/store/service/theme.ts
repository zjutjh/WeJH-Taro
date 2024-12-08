import { DarkModeOption, DarkModeTheme } from "@/types/DarkMode";
interface ThemeList {
  name: string;
  theme_config: {
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
    dark_base_color: {
      dark_base_500: string;
      dark_base_600: string;
      dark_base_700: string;
    }
  },
  has_dark_mode: boolean;
  theme_id: number;
}[]

export interface ThemeStoreType {
  hadTheme: ThemeList
  themeMode: string;
  darkMode: DarkModeOption
}

export const ThemeStore = {
  state: {//在缓存区 小程序一打开立刻使用的主题配置
    hadTheme: [],//已有主题列表
    themeMode: "green",//选的是哪一个主题
    darkMode: {
      mode: "light",
      isAdapted: false
    }
  },
  mutations: {//初步启动小程序后从后端获得的配置 并且会对原本初步生成的配置(state)进行更新
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
