import { computed } from "vue";

import { serviceStore } from "@/store";
import { defaultTheme } from "@/store/service/theme";

export enum IconTypeEnum {
  /** Applist中使用的icon */
  AppList = "applist",
  /** QuickViewCard中使用的icon */
  QuickView = "quickview"
}

/**  映射对象, app功能名字 与 applistIcon 中的键名对应 更新app后需要维护 */
const ICON_NAME_MAP = {
  lessonstable: "classIcon",
  score: "gradeIcon",
  exam: "examIcon",
  freeroom: "freeClassroomIcon",
  schoolcard: "schoolcardIcon",
  library: "lendIcon",
  electricity: "electricityIcon",
  "school-bus": "schoolbusIcon",
  suit: "clothIcon"
} as const;

const useTheme = () => {
  function getIconUrl(icon: string, type: IconTypeEnum) {
    const appListIcon =
      type === IconTypeEnum.QuickView
        ? serviceStore.theme.config.quickviewIcon
        : serviceStore.theme.config.applistIcon;

    if (icon in ICON_NAME_MAP) {
      const iconStoreName = ICON_NAME_MAP[icon];
      return appListIcon[iconStoreName];
    }
    return "";
  }

  const isShowByUrl = computed(() => {
    const themeMode = serviceStore.theme.themeMode;
    if (serviceStore.theme.darkMode.mode === "light") {
      return themeMode.light !== defaultTheme.light.themeId;
    }
    return themeMode.dark !== defaultTheme.dark.themeId;
  });

  return {
    getIconUrl,
    isShowByUrl
  };
};

export default useTheme;
