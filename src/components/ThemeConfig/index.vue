<template>
  <view
    :class="[darkMode]"
    class="background"
    :style="{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: backgroundPosition,
      '--wjh-color-background-page': backgroundColor,
      '--wjh-color-primary-light': base_color.base_500,
      '--wjh-color-primary': base_color.base_600,
      '--wjh-color-primary-dark': base_color.base_700
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

const { mode: darkMode } = useDarkMode();//light或者dark

const currentConfig = computed(() => serviceStore.theme.config)

const backgroundPosition = computed(() => currentConfig.value.background_position);

const backgroundImage = computed(() => currentConfig.value.background_img)

const backgroundColor = computed(() => currentConfig.value.background_color)

const base_color = computed(()=> currentConfig.value.base_color)
</script>
