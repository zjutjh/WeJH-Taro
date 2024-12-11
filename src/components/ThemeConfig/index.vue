<template>
  <view
    :class="[themeMode, darkMode]"
    class="background theme"
    :style="Style"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";
import { serviceStore } from "@/store";
import { useDarkMode } from "@/hooks";
import { ThemeStore } from "@/store/service/theme";

const themeMode = computed(() => serviceStore.theme.themeMode);
console.log("themeMode:", themeMode.value);
// 主题过渡方案 sb特判 马上给你改了
const Style = computed(() => {
  //等后端改好就全改了
  // if(themeMode.value !== "green" || "yellow" || "blue" || "pink"){
  //   return ThemeStore.state.config
  // }
  if (themeMode.value === "walk" && darkMode.value !== "dark") {
    return "--wjh-color-background-page: #FAE7D4;background-position: bottom 0 right 120%;  background-size: cover;";
  } else if (darkMode.value === "dark") {
    return "--wjh-color-background-page: #121212";
  } else if (darkMode.value === "light") {
    return "--wjh-color-background-page: #fefefe; --wjh-color-background-container: #FAFAFAFF";
  } else {
    return "";
  }
});

const { mode: darkMode } = useDarkMode();//light或者dark

</script>
