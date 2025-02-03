import { DarkModeOption, DarkModeTheme } from "@/types/DarkMode";

type applistIcon = {
  class_icon: string;
  grade_icon: string;
  exam_icon: string;
  free_classroom_icon: string;
  schoolcard_icon: string;
  lend_icon: string;
  electricity_icon: string;
  schoolbus_icon: string;
  cloth_icon: string;
}

export interface Config {
  bar_icon: {
    home_icon: string;
    function_icon: string;
    my_icon: string;
    selected_home_icon: string;
    selected_function_icon: string;
    selected_my_icon: string;
  },
  applist_icon: applistIcon
  applist_dark_icon: applistIcon
  background_img: string;
  background_color: string;
  background_position: string;
  selection_img: string;
  base_color: {
    base_500: string;
    base_600: string;
    base_700: string;
  },
}

export interface Theme {
  name: string;
  theme_config: Config,
  is_dark_mode: boolean;
  theme_id: number;
}

export type ThemeList = Theme[]

type ThemeMode = {light: string; dark: string}

export interface ThemeStoreType {
  hadTheme: ThemeList;
  themeMode: ThemeMode
  config: Config
  darkMode: DarkModeOption
}

export const defaultConfig = {
  bar_icon: {
    home_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_light.png",
    function_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_light.png",
    my_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_light.png",
    selected_home_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_light_green.png",
    selected_function_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_light_green.png",
    selected_my_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_light_green.png"
  },
  applist_icon: {
      class_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf_table_white.png",
      grade_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/grade_white.png",
      exam_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam_white.png",
      free_classroom_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-white.png",
      schoolcard_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-white.png",
      lend_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book-white.png",
      electricity_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-white.png",
      schoolbus_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-white.png",
      cloth_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-white.png"
  },
  applist_dark_icon: {
      class_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf-table-black(unused).png",
      grade_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/score-black(unused).png",
      exam_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam-black(unused).png",
      free_classroom_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-black(unused).png",
      schoolcard_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-black(unused).png",
      lend_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book(unused).png",
      electricity_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-black(unused).png",
      schoolbus_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-black(unused).png",
      cloth_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-black(unused).png"
  },
  selection_img: '',
  background_img: '#green',
  background_color: "#f5f5f5",
  background_position: "bottom 0 right 50%",
  base_color:{
      base_500: "#d3f5ed",
      base_600: "#53d1b6",
      base_700: "#51bbbb"
  }
}
export const defaultTheme = { 
  name: "绿",
  is_dark_mode: false,
  theme_id: 1,
  theme_config: defaultConfig
}


export const ThemeStore = {
  state: {
    hadTheme: [defaultTheme],
    themeMode: {
      light: "毅行",
      dark: "深绿"
    },
    config: defaultConfig,//正在使用的主题的config
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
    setConfig(state: ThemeStoreType, value: Config) {
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
