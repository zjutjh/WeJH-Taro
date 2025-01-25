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
import greenImg from '@/assets/photos/background.svg'
import pinkImg from '@/assets/photos/background-pink.svg'
import blueImg from '@/assets/photos/background-blue.svg'
import yellowImg from '@/assets/photos/background-yellow.svg'

const { mode: darkMode } = useDarkMode();//light或者dark

const currentConfig = computed(() => serviceStore.theme.config)

const backgroundUrl = computed(() =>  {
  const img = currentConfig.value.background_img
  if(img.startsWith('#')){
     if(img === '#green') return greenImg
     else if (img === '#pink') return pinkImg
     else if (img === '#blue') return blueImg
     else if (img === '#yellow') return yellowImg
  }
  else return img
});
</script>
