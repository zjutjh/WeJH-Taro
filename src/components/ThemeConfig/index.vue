<template>
  <view
    :class="darkMode"
    class="background"
    :style="computedStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed, onMounted, watch } from "vue";
import store, { serviceStore } from "@/store";
import { useDarkMode, useRequest } from "@/hooks";
import greenImg from "@/assets/photos/background.svg";
import { UserService } from "@/services";
import { toCamelCase } from "@/utils/camelize";
import Taro from "@tarojs/taro";

const { mode: darkMode, setMode } = useDarkMode();

const currentConfig = computed(() => serviceStore.theme.config);

/** 规范: 开头#表示内置主题 即背景图在前端文件夹里 目前内置主题是浅绿主题
 *  若为纯黑色背景的深色模式 则backgroundUrl使用空字符串 即无背景图 只用backgroundColor渲染
 *  纯黑背景的backgroundPosition也填空字符串
 *  其余正常主题就是直接用url
 * */
const backgroundUrl = computed(() => {
  const img = currentConfig.value?.backgroundImg;
  if (img.startsWith("#")) {
    if (img === "#green") return greenImg;
  }
  return img;
});

const computedStyle = computed(() => ({
  backgroundImage: `url(${backgroundUrl.value})`,
  backgroundPosition: currentConfig.value.backgroundPosition,
  "--wjh-color-background-page": currentConfig.value.backgroundColor,
  "--wjh-color-primary-light": currentConfig.value.baseColor.base500,
  "--wjh-color-primary": currentConfig.value.baseColor.base600,
  "--wjh-color-primary-dark": currentConfig.value.baseColor.base700
}));
const { run } = useRequest(UserService.getUserTheme, {
  manual: true,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      const camelizedData = toCamelCase(res.data.data);
      store.commit("setHadTheme", camelizedData.themeList);
      store.commit("setThemeMode", {
        light: camelizedData.currentThemeId, dark: camelizedData.currentThemeDarkId
      });
      setMode(darkMode.value);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.data.msg
      });
    }
  },
  onError: (e: Error) => {
    return `失败\r\n${e.message || "网络错误"}`;
  }
});
onMounted(() => {
  if (serviceStore.user.isActive) {
    run();
  }
});
watch(() => serviceStore.user.isActive, () => {
  if (serviceStore.user.isActive) {
    run();
  }
});
</script>
