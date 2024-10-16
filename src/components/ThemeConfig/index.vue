<template>
  <view
    :class="[themeMode, darkMode]"
    class="background theme"
    :style="walkStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";
import { serviceStore } from "@/store";
import { useDarkMode } from "@/hooks";

const themeMode = computed(() => serviceStore.theme.themeMode);
// 主题过渡方案
const walkStyle = computed(() => {
  if (themeMode.value === "walk" && darkMode.value !== "dark") {
    return "--wjh-color-background-page: #FAE7D4;background-position: bottom 0 right 120%;  background-size: cover;";
  } else if (darkMode.value === "dark") {
    return "--wjh-color-background-page: #121212";
  } else {
    return "";
  }
});

const { mode: darkMode } = useDarkMode();

</script>
