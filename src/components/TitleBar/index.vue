<template>
  <view class="wjh-title-bar" :style="titleStyle">
    <view v-if="loading" class="bg-default" />
    <view :style="justTitleStyle">
      <text
        v-if="backButton"
        class="iconfont wjh-title-bar-back-button icon-arrow-left"
        @tap="goBack"
      />
      <text class="wjh-title-bar-title">
        {{ title }}
      </text>
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { computed, toRefs } from "vue";
import { systemStore } from "@/store";
import "./index.scss";

const props = defineProps<{
  title: string;
  backButton?: boolean;
}>();

const { title, backButton } = toRefs(props);

const loading = computed(() => {
  return systemStore.loading;
});

const titleStyle = computed(() => {
  const MenuRect = Taro.getMenuButtonBoundingClientRect();
  const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight || 0;
  return {
    height: MenuRect.top + MenuRect.height +
      MenuRect.top - statusBarHeight + "px"
  };
});

const justTitleStyle = computed(() => {
  const MenuRect = Taro.getMenuButtonBoundingClientRect();
  return {
    height: MenuRect.height + "px",
    marginTop: MenuRect.top + "px",
    marginLeft: "1rem",
    display: "flex",
    fontSize: "1.5rem",
    lineHeight: MenuRect.height + "px"
  };
});

function goBack() {
  Taro.navigateBack();
}

</script>
