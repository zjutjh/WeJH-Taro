<template>
  <view
    :class="[darkMode]"
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

const backgroundUrl = computed(() => {
  // 此处判定是根据background_img ↓ 的规范来的 具体可看其注释
  const img = currentConfig.value?.background_img;
  if (img.startsWith("#")) {
    if (img === "#green") return greenImg;
  }
  return img;
});
</script>
