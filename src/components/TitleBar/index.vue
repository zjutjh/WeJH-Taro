<template>
  <view class="wjh-title-bar" :style="containerStyle">
    <view class="wjh-title-bar-left-container">
      <text
        v-if="backButton"
        class="iconfont wjh-title-bar-back-button icon-arrow-left"
        @tap="handleTapBack"
      />
      <text class="wjh-title-bar-title">
        {{ title }}
      </text>
      <slot />
      <taro-image v-if="systemStore.loading" :src="SvgSpinnerRing" class="wjh-title-bar-spinner" />
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { Image as TaroImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { computed, CSSProperties } from "vue";

import SvgSpinnerRing from "@/assets/spinner-ring.svg";
import { systemStore } from "@/store";

interface TitleBarProps {
  title: string;
  backButton?: boolean;
}

defineProps<TitleBarProps>();

const MENU_BUTTON_RECT = Taro.getMenuButtonBoundingClientRect();

// TODO: 切换到设计稿布局要换算
const containerStyle = computed<CSSProperties>(() => {
  return {
    "--menu-rect-top-offset": `${MENU_BUTTON_RECT.top}px`,
    "--menu-rect-height": `${MENU_BUTTON_RECT.height}px`
  };
});

function handleTapBack() {
  Taro.navigateBack();
}
</script>
