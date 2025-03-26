import { DarkModeOption, DarkModeTheme } from "@/types/DarkMode";

type ApplistIcon = {
  classIcon: string;
  gradeIcon: string;
  examIcon: string;
  freeClassroomIcon: string;
  schoolcardIcon: string;
  lendIcon: string;
  electricityIcon: string;
  schoolbusIcon: string;
  clothIcon: string;
};

export interface Config {
  barIcon: {
    homeIcon: string;
    functionIcon: string;
    myIcon: string;
    selectedHomeIcon: string;
    selectedFunctionIcon: string;
    selectedMyIcon: string;
  },
  applistIcon: ApplistIcon
  quickviewIcon: ApplistIcon
  backgroundImg: string;
  backgroundColor: string;
  backgroundPosition: string;
  selectionImg: string;
  baseColor: {
    base500: string;
    base600: string;
    base700: string;
  },
}

export interface Theme {
  name: string;
  themeConfig: Config,
  isDarkMode: boolean;
  themeId: number;
}

export type ThemeList = Theme[];

type ThemeMode = {
  light: number; dark: number
};

export interface ThemeStoreType {
  hadTheme: ThemeList;
  themeMode: ThemeMode
  config: Config
  darkMode: DarkModeOption
}

export const defaultConfigLight: Config = {
  barIcon: {
    homeIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_light.png",
    functionIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_light.png",
    myIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_light.png",
    selectedHomeIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_light_green.png",
    selectedFunctionIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_light_green.png",
    selectedMyIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_light_green.png"
  },
  applistIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf_table_white.png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/grade_white.png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam_white.png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-white.png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-white.png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book-white.png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-white.png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-white.png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-white.png"
  },
  quickviewIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf-table-black(unused).png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/score-black(unused).png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam-black(unused).png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-black(unused).png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-black(unused).png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book(unused).png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-black(unused).png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-black(unused).png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-black(unused).png"
  },
  selectionImg: "",
  backgroundImg: "#green",
  backgroundColor: "#f5f5f5",
  backgroundPosition: "bottom 0 right 50%",
  baseColor: {
    base500: "#d3f5ed",
    base600: "#53d1b6",
    base700: "#51bbbb"
  }
};
export const defaultConfigDark: Config = {
  barIcon: {
    homeIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_dark.png",
    functionIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_dark.png",
    myIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_dark.png",
    selectedHomeIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/home_fill_dark_green.png",
    selectedFunctionIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/appstore_fill_dark_green.png",
    selectedMyIcon: "https://api.cnpatrickstar.com/img/icons/bottom_icon/user_dark_green.png"
  },
  applistIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf_table_black.png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/grade_black.png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam_black.png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-black.png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-black.png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book-black.png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-black.png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-black.png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-black.png"
  },
  quickviewIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/24gf_table_white.png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/grade_white.png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/exam_white.png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/emptyclass-white.png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/card-b-white.png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/book-white.png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/electricity-white.png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/bus-white.png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/apply_icon/suitapply-white.png"
  },
  selectionImg: "",
  backgroundImg: "",
  backgroundColor: "#121212",
  backgroundPosition: "bottom 0 right 50%",
  baseColor: {
    base500: "#334843",
    base600: "#4ab59e",
    base700: "#48a2a2"
  }
};

export const defaultTheme = {
  light: {
    name: "绿",
    isDarkMode: false,
    /** 此处themeId无特殊意义 */
    themeId: 1,
    themeConfig: defaultConfigLight
  },
  dark: {
    name: "绿",
    isDarkMode: true,
    /** 此处themeId无特殊意义 */
    themeId: 2,
    themeConfig: defaultConfigDark
  }
};

export const ThemeStore = {
  state: {
    hadTheme: [defaultTheme.light, defaultTheme.dark],
    themeMode: {
      light: defaultTheme.light.themeId,
      dark: defaultTheme.dark.themeId
    },
    /** 正在使用的主题的config*/
    config: defaultConfigLight,
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
