import { useRequestNext } from "@/hooks";
import { UserService } from "@/services";
import { RequestError, persistedStorage } from "@/utils";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
export interface Theme {
  /** 为了避免 id 冲突，内置主题的 id 为 string */
  id: number;
  name: string;
  theme_config: string;
  type: string;
}

const useThemeStore = defineStore("theme", () => {
  const current = ref<Theme>();

  async function setTheme(theme: Theme) {
    try {
      await UserService.setTheme({ id: theme.id });
      current.value = theme;
      Taro.showToast({ title: "设置成功" });
    } catch (e) {
      if (e instanceof RequestError)
        Taro.showToast({ title: `主题设置失败: ${e.message}`, icon: "none" });
    }
  }

  const { data: userThemeData, loading, run: syncThemeList } = useRequestNext(
    UserService.getUserTheme, {
      initialData: {
        current_theme_id: 0,
        theme_list: []
      },
      onSuccess: (res) => {
        const target = themeList.value.find((item) => item.id === res.current_theme_id)!;
        // TODO: 确认后端有没有在限定主题到期后，修改用户的选择项
        if (!target) setTheme(res.theme_list[0]);
        else current.value = target;
      },
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `获取主题数据失败: ${e.message}`, icon: "none" });
        }
      }
    }
  );

  const themeList = computed(() => userThemeData.value.theme_list);

  return {
    userThemeData,
    loading,
    themeList,
    current,
    setTheme,
    syncThemeList
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["current", "userThemeData"]
  }
});

export default useThemeStore;
