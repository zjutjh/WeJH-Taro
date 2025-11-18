<template>
  <view class="applist-item" @tap="handleTap">
    <view class="icon-wrapper" :style="iconWrapperStyle">
      <taro-image v-if="isShowByUrl" mode="aspectFit" :src="iconURL" :style="iconStyle" />
      <view v-else :class="['iconfont', 'icon-' + icon]" />
    </view>
    <text class="label">
      {{ label }}
    </text>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { Image as TaroImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { computed, ref, StyleValue, toRefs } from "vue";

import { useDarkMode, useTheme } from "@/hooks";
import { IconTypeEnum } from "@/hooks/useTheme";
import { serviceStore } from "@/store";

import { BIND_CODE_NAME_RECORD } from "../utils";

const props = defineProps<{
  label: string;
  icon: string;
  url: string;
  bg: string;
  require: string;
}>();

const { require: requireActive, bg = ref("green"), label, url } = toRefs(props);

const { mode: darkMode } = useDarkMode();
const { isShowByUrl, getIconUrl } = useTheme();

const isDisabled = computed(() => {
  switch (requireActive.value) {
    case "oauth":
      return !serviceStore.user.isBindOauth;
    case "zf":
      return !serviceStore.user.isBindZF && !serviceStore.user.isBindOauth;
    case "yxy":
      return !serviceStore.user.isBindYXY;
    case "null":
      return false;
    default:
      return false;
  }
});

const iconURL = computed(() => {
  return getIconUrl(props.icon, IconTypeEnum.AppList);
});

const iconStyle = computed<StyleValue>(() => {
  if (darkMode.value === "dark" && isDisabled.value) {
    return {
      opacity: 0.1,
      filter: "contrast(0) brightness(2) invert(0)"
    };
  }
  return undefined;
});

const iconWrapperStyle = computed<StyleValue>(() => {
  if (isDisabled.value) {
    return { "--bg-color": "var(--wjh-color-light)" };
  }
  return { "--bg-color": `var(--wjh-color-${bg.value}-600)` };
});

async function handleTap() {
  if (isDisabled.value) {
    const { confirm: isConfirm } = await Taro.showModal({
      title: "提示",
      content: `前往绑定 ${BIND_CODE_NAME_RECORD[requireActive.value] ?? ""} 账号`
    });
    if (isConfirm) {
      Taro.navigateTo({ url: `/pages/bind/index?bind=${requireActive.value}` });
    }
  } else if (url.value) {
    Taro.navigateTo({ url: url.value });
  }
}
</script>
