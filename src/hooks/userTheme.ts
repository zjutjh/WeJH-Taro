import { serviceStore } from "@/store"
import { defaultTheme } from "@/store/service/theme";
import { computed } from "vue";

// 映射对象, app功能名字 与 applist_icon 中的键名对应 更新app后需要维护
const iconMap = {
    'lessonstable': 'class_icon',
    'score': 'grade_icon',
    'exam': 'exam_icon',
    'freeroom': 'free_classroom_icon',
    'schoolcard': 'schoolcard_icon',
    'library': 'lend_icon',
    'electricity': 'electricity_icon',
    'schoolbus': 'schoolbus_icon',
    'suit': 'cloth_icon'
};

type iconColor = 'white' | 'black'

export function getIconUrl(icon: string,color : iconColor) {
    const applist_icon = (color === 'black')?
    serviceStore.theme.config.applist_dark_icon : serviceStore.theme.config.applist_icon
    
    if(icon in iconMap){
        const iconStoreName =iconMap[icon]
        return applist_icon[iconStoreName]
    }
    else return ""
}

export const isShowByUrl = computed(() => {
    const themeMode = serviceStore.theme.themeMode
    if (serviceStore.theme.darkMode.mode ==='light') {
      return themeMode.light !== defaultTheme.name
    } else {
      return themeMode.dark !== defaultTheme.name
    }
})