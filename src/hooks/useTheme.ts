import { serviceStore } from "@/store";
import { defaultTheme } from "@/store/service/theme";
import { computed } from "vue";

enum IconTypeEnum {
  /** Applist中使用的icon */
  AppList = "applist",
  /** QuickViewCard中使用的icon */
  QuickView = "quickview"
}

const useTheme = () => {

  /**  映射对象, app功能名字 与 applistIcon 中的键名对应 更新app后需要维护 */
  const iconMap = {
    "lessonstable": "classIcon",
    "score": "gradeIcon",
    "exam": "examIcon",
    "freeroom": "freeClassroomIcon",
    "schoolcard": "schoolcardIcon",
    "library": "lendIcon",
    "electricity": "electricityIcon",
    "schoolbus": "schoolbusIcon",
    "suit": "clothIcon"
  };

  function getIconUrl(icon: string, type: IconTypeEnum) {
    const appListIcon = (type === IconTypeEnum.QuickView) ?
      serviceStore.theme.config.quickviewIcon : serviceStore.theme.config.applistIcon;

    if (icon in iconMap) {
      const iconStoreName = iconMap[icon];
      return appListIcon[iconStoreName];
    } else return "";
  }

  const isShowByUrl = computed(() => {
    const themeMode = serviceStore.theme.themeMode;
    if (serviceStore.theme.darkMode.mode === "light") {
      return themeMode.light !== defaultTheme.light.themeId;
    } else {
      return themeMode.dark !== defaultTheme.dark.themeId;
    }
  });

  return {
    iconMap,
    IconTypeEnum,
    getIconUrl,
    isShowByUrl
  };
};

export default useTheme;
