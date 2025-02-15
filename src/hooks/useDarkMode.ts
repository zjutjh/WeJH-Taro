import { computed, onMounted, onUnmounted } from "vue";
import { DarkModeTheme } from "@/types/DarkMode";
import store, { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { Config, defaultConfigDark, defaultConfigLight } from "@/store/service/theme";

const useDarkMode = () => {
  const mode = computed(() => serviceStore.theme.darkMode.mode);
  const isAdapted = computed(() => serviceStore.theme.darkMode.isAdapted);

  const handleModeChange = (e) => {
    if (isAdapted.value === true) {
      setMode(e.theme as DarkModeTheme);
    }
  };

  const setIsAdapted = async (value: boolean) => {
    store.commit("setDarkModeAdapted", value);
    if (value === true) {
      const sysInfo = await Taro.getSystemInfo();
      setMode(sysInfo.theme as DarkModeTheme);
    }
  };

  const setMode = async (value: DarkModeTheme) => {
    store.commit("setDarkMode", value);
    let config: Config | undefined;
    const themeStore = serviceStore.theme;
    if (value === "dark") {
      config = themeStore.hadTheme.find(theme => theme.theme_id === themeStore.themeMode.dark)?.theme_config;
    } else {
      config = themeStore.hadTheme.find(theme => theme.theme_id === themeStore.themeMode.light)?.theme_config;
    }
    if (config === undefined) config = value === "light" ? defaultConfigLight : defaultConfigDark;
    store.commit("setConfig", config);
  };

  onMounted(async () => {
    if (isAdapted.value) {
      const sysInfo = await Taro.getSystemInfo();
      setMode(sysInfo.theme as DarkModeTheme);
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
