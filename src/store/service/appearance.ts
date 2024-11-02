import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import { persistedStorage } from "@/utils";

export type Appearance = "light" | "dark";

const useAppearanceStore = defineStore("appearance", () => {
  const appearance = ref<Appearance>("light");
  const isAdapted = ref(false);

  const onSystemAppearanceChange = (e) => {
    if (isAdapted.value === true) {
      appearance.value = e.theme;
    }
  };

  onMounted(async () => {
    if (isAdapted.value) {
      const sysInfo = await Taro.getSystemInfo();
      appearance.value = sysInfo.theme!;
    }

    Taro.onThemeChange(onSystemAppearanceChange);
  });

  onUnmounted(() => {
    Taro.offThemeChange(onSystemAppearanceChange);
  });

  watchEffect(async () => {
    if (isAdapted.value) {
      const sysInfo = await Taro.getSystemInfo();
      appearance.value = sysInfo.theme!;
    }
  });

  function setAppearance(option: Appearance | "adapted") {
    if (option === "adapted") {
      isAdapted.value = true;
    } else {
      isAdapted.value = false;
      appearance.value = option;
    }
  }

  return {
    appearance,
    isAdapted,
    setAppearance
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useAppearanceStore;
