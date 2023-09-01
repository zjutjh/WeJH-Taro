import { computed, onMounted, onUnmounted } from "vue";
import { DarkModeTheme } from "@/types/DarkMode";
import store from "@/store";
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";

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
