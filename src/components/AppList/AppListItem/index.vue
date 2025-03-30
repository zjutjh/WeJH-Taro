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
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { computed, ref, toRefs } from "vue";
import "./index.scss";
import { BIND_CODE_NAME_RECORD } from "../utils";

const props = defineProps<{
  label: string,
  icon: string,
  url: string,
  bg: string,
  require: string,
}>();
const { require: requireActive, bg = ref("green"), label, url } = toRefs(props);
// 主题过渡方案
const icon = props.icon;
const themeMode = computed(() => serviceStore.theme.themeMode);
const iconClass = computed(() => {
  if (themeMode.value === "walk") {
    if (icon !== "lessonstable" && icon !== "exam" && icon !== "score") {
      return "icon-15th-" + icon;
    } else {
      return "icon-" + icon;
    }
  } else {
    return "icon-" + icon;
  }
});

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
      return true;
  }
});

async function appTaped() {
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

const backgroundColor = computed(() => {
  if (isDisabled.value)
    return { "--bg-color": "var(--wjh-color-light)" };
  else return { "--bg-color": `var(--wjh-color-${bg.value}-600)` };
});

</script>
