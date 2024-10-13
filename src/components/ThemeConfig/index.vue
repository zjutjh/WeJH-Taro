<template>
  <view
    :class="[themeMode, darkMode]"
    class="background theme"
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

const { mode: darkMode } = useDarkMode();

</script>
