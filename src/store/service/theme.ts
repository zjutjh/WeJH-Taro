import { DarkModeOption, DarkModeTheme } from "@/types/DarkMode";

type applistIcon = {
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
  applistIcon: applistIcon
  applistDarkIcon: applistIcon
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
    homeIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/homeFill_light.png",
    functionIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/appstoreFill_light.png",
    myIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/user_light.png",
    selectedHomeIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/homeFill_light_green.png",
    selectedFunctionIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/appstoreFill_light_green.png",
    selectedMyIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/user_light_green.png"
  },
  applistIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/24gf_table_white.png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/grade_white.png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/exam_white.png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/emptyclass-white.png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/card-b-white.png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/book-white.png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/electricity-white.png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/bus-white.png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/suitapply-white.png"
  },
  applistDarkIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/24gf-table-black(unused).png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/score-black(unused).png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/exam-black(unused).png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/emptyclass-black(unused).png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/card-b-black(unused).png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/book(unused).png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/electricity-black(unused).png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/bus-black(unused).png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/suitapply-black(unused).png"
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
    homeIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/homeFillDark.png",
    functionIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/appstoreFillDark.png",
    myIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/userDark.png",
    selectedHomeIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/homeFillDark_green.png",
    selectedFunctionIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/appstoreFillDark_green.png",
    selectedMyIcon: "https://api.cnpatrickstar.com/img/icons/bottomIcon/userDark_green.png"
  },
  applistIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/24gf_table_black.png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/grade_black.png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/exam_black.png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/emptyclass-black.png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/card-b-black.png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/book-black.png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/electricity-black.png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/bus-black.png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/suitapply-black.png"
  },
  applistDarkIcon: {
    classIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/24gf_table_white.png",
    gradeIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/grade_white.png",
    examIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/exam_white.png",
    freeClassroomIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/emptyclass-white.png",
    schoolcardIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/card-b-white.png",
    lendIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/book-white.png",
    electricityIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/electricity-white.png",
    schoolbusIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/bus-white.png",
    clothIcon: "https://api.cnpatrickstar.com/img/icons/applyIcon/suitapply-white.png"
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
    themeId: 18,
    themeConfig: defaultConfigLight
  },
  dark: {
    name: "绿",
    isDarkMode: true,
    themeId: 23,
    themeConfig: defaultConfigDark
  }
};

export const ThemeStore = {
  state: {
    hadTheme: [defaultTheme.light, defaultTheme.dark],
    /** themeMode.light是白天绿色主题的themeId
     *  themeMode.dark 是黑夜绿色主题的themeId
     * 需要根据实际环境来维护*/
    themeMode: {
      light: 18,
      dark: 23
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
