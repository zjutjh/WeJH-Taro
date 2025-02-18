<template>
  <view
    :class="darkMode"
    class="background"
    :style="{
      backgroundImage: `url(${backgroundUrl})`,//背景图使用
      backgroundPosition: currentConfig.background_position,
      '--wjh-color-background-page': currentConfig.background_color,
      '--wjh-color-primary-light': currentConfig.base_color.base_500,
      '--wjh-color-primary': currentConfig.base_color.base_600,
      '--wjh-color-primary-dark': currentConfig.base_color.base_700
    }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";
import { serviceStore } from "@/store";
import { useDarkMode } from "@/hooks";
import greenImg from "@/assets/photos/background.svg";

const { mode: darkMode } = useDarkMode();

const currentConfig = computed(() => serviceStore.theme.config);

/** 规范: 开头#表示内置主题 即背景图在前端文件夹里 目前内置主题是浅绿主题
 *  若为纯黑色背景的深色模式 则backgroundUrl使用空字符串 即无背景图 只用backgroundColor渲染
 *  纯黑背景的backgroundPosition也填空字符串
 *  其余正常主题就是直接用url
 * */
const backgroundUrl = computed(() => {
  const img = currentConfig.value?.background_img;
  if (img.startsWith("#")) {
    if (img === "#green") return greenImg;
  }
  return img;
});
</script>
