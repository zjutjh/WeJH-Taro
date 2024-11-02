<template>
  <view class="applist-item" @tap="appTaped">
    <view class="icon-wrapper" :style="backgroundColor">
      <view :class="['iconfont', iconClass]" />
    </view>
    <text class="label">
      {{ label }}
    </text>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { computed } from "vue";
import "./index.scss";
import useThemeStore from "@/store/service/theme";

const props = defineProps<{
  label: string,
  icon: string,
  bg: string,
  url: string,
  disabled: boolean
}>();

const themeStore = useThemeStore();

// 主题过渡方案
const icon = props.icon;
const iconClass = computed(() => {
  if (themeStore.current?.name === "walk") {
    if (icon !== "lessonstable" && icon !== "exam" && icon !== "score") {
      return "icon-15th-" + icon;
    } else {
      return "icon-" + icon;
    }
  } else {
    return "icon-" + icon;
  }
});

async function appTaped() {
  if (props.disabled) {
    await Taro.navigateTo({ url: "/pages/bind/index" });
    Taro.showToast({
      icon: "none",
      title: "请绑定相关账号"
    });
  } else await Taro.navigateTo({ url: props.url });
}

const backgroundColor = computed(() => {
  if (props.disabled)
    return { "--bg-color": "var(--wjh-color-light)" };
  else return { "--bg-color": `var(--wjh-color-${props.bg}-600)` };
});

</script>
