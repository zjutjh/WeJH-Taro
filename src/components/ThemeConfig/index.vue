<template>
  <view
    :class="[themeToken, appearanceStore.appearance]"
    class="background theme"
    :style="walkStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";
import useAppearanceStore from "@/store/service/appearance";
import useThemeStore from "@/store/service/theme";

const themeStore = useThemeStore();
const themeToken = computed(() => themeStore.current?.name);
const appearanceStore = useAppearanceStore();

// 主题过渡方案
const walkStyle = computed(() => {
  if (themeToken.value === "walk" && appearanceStore.appearance !== "dark") {
    return "--wjh-color-background-page: #FAE7D4;background-position: bottom 0 right 120%;  background-size: cover;";
  } else if (appearanceStore.appearance === "dark") {
    return "--wjh-color-background-page: #121212";
  } else if (appearanceStore.appearance === "light") {
    return "--wjh-color-background-page: #fefefe; --wjh-color-background-container: #FAFAFAFF";
  } else {
    return "";
  }
});

</script>
