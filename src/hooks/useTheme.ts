import { serviceStore } from "@/store";
import { defaultTheme } from "@/store/service/theme";
import { computed } from "vue";

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

  /** main是功能里展示的 other是QuickView等里展示的
   * 对于浅色主题 main是白的 other的黑的
   * 对于深色主题 main是黑的 other是白的
   */
  type IconType = "main" | "other";

  function getIconUrl(icon: string, type: IconType) {
    const applistIcon = (type === "other") ?
      serviceStore.theme.config.applistDarkIcon : serviceStore.theme.config.applistIcon;

    if (icon in iconMap) {
      const iconStoreName = iconMap[icon];
      return applistIcon[iconStoreName];
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
    getIconUrl,
    isShowByUrl
  };
};

export default useTheme;
