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
  /** 规范: 开头#表示内置主题 即背景图在前端文件夹里 目前内置主题是浅绿主题
   *  若为纯黑色背景的深色模式 则backgroundUrl使用空字符串 即无背景图 只用backgroundColor渲染
   * 纯黑背景的backgroundPosition也填空字符串*/
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

type ThemeMode = {light: number; dark: number}

export interface ThemeStoreType {
  hadTheme: ThemeList;
  themeMode: ThemeMode
  config: Config
  darkMode: DarkModeOption
}

export const defaultConfig_light = {
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
export const defaultConfig_dark = {
  bar_icon: {
    home_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_dark.png",
    function_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_dark.png",
     my_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_dark.png",
    selected_home_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_dark_green.png",
    selected_function_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_dark_green.png",
    selected_my_icon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_dark_green.png"
  },
  applist_icon: {
    class_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf_table_black.png",
    grade_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/grade_black.png",
    exam_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam_black.png",
    free_classroom_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-black.png",
    schoolcard_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-black.png",
    lend_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book-black.png",
    electricity_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-black.png",
    schoolbus_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-black.png",
    cloth_icon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-black.png"
  },
  applist_dark_icon: {
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
  selection_img: "",
  background_img: "",
  background_color: "#121212",
  background_position: "bottom 0 right 50%",
  base_color: {
    base_500: "#334843",
    base_600: "#4ab59e",
    base_700: "#48a2a2"
  },
}

export const defaultTheme = {
  light: {
    name: "绿",
    is_dark_mode: false,
    theme_id: 18,
    theme_config: defaultConfig_light
  },
  dark: {
    name: "绿",
    is_dark_mode: true,
    theme_id: 23,
    theme_config: defaultConfig_dark
  }
}



export const ThemeStore = {
  state: {
    hadTheme: [defaultTheme.light, defaultTheme.dark],
    /**themeMode默认值需要根据实际环境来维护*/
    themeMode: {
      light: 18,
      dark: 23
    },
    /** 正在使用的主题的config*/
    config: defaultConfig_light,
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
