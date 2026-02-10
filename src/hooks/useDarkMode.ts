import Taro from "@tarojs/taro";
import { computed, onMounted, onUnmounted } from "vue";

import store, { serviceStore } from "@/store";
import { Config, defaultConfigDark, defaultConfigLight } from "@/store/service/theme";
import { DarkModeTheme } from "@/types/DarkMode";

const useDarkMode = () => {
  const mode = computed(() => serviceStore.theme.darkMode.mode);
  const isAdapted = computed(() => serviceStore.theme.darkMode.isAdapted);

  const handleModeChange = (e) => {
    if (isAdapted.value === true) {
      setMode(e.theme as DarkModeTheme);
    }
  };

  const setIsAdapted = (value: boolean) => {
    store.commit("setDarkModeAdapted", value);
    if (value === true) {
      const { theme } = Taro.getAppBaseInfo();
      setMode(theme as DarkModeTheme);
    }
  };

  const setMode = (value: DarkModeTheme) => {
    store.commit("setDarkMode", value);
    let config: Config | undefined;
    const themeStore = serviceStore.theme;
    if (value === "dark") {
      config = themeStore.hadTheme.find(
        (theme) => theme.themeId === themeStore.themeMode.dark
      )?.themeConfig;
    } else {
      config = themeStore.hadTheme.find(
        (theme) => theme.themeId === themeStore.themeMode.light
      )?.themeConfig;
    }
    if (config === undefined) config = value === "light" ? defaultConfigLight : defaultConfigDark;
    store.commit("setConfig", config);
  };

  onMounted(() => {
    if (isAdapted.value) {
      const { theme } = Taro.getAppBaseInfo();
      setMode(theme as DarkModeTheme);
    }

    Taro.onThemeChange(handleModeChange);
  });

  onUnmounted(() => {
    Taro.offThemeChange(handleModeChange);
  });

  return {
    mode,
    isAdapted,
    setMode,
    setIsAdapted
  };
};

export default useDarkMode;
