<template>
  <view class="applist-item" @tap="appTaped">
    <view class="icon-wrapper" :style="backgroundColor">
      <view :class="['iconfont', `icon-${icon}`]"> </view>
    </view>
    <text class="label"> {{ label }} </text>
  </view>
</template>

<script setup lang="ts">
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { computed, ref, toRefs } from "vue";
import "./index.scss";

const props = defineProps<{
  label: string,
  icon: string,
  url: string,
  bg: string,
  require: string,
}>();
const { require: requireActive, bg = ref("green"), label, url } = toRefs(props);

const isDisabled = ref(false);
if (requireActive.value === "zf" && !serviceStore.user.isBindZF)
  isDisabled.value = true;
if (requireActive.value === "library" && !serviceStore.user.isBindLibrary)
  isDisabled.value = true;
if (requireActive.value === "yxy" && !serviceStore.user.isBindYXY)
  isDisabled.value = true;

async function appTaped() {
  if (isDisabled.value) {
    await Taro.navigateTo({ url: "/pages/bind/index" });
    Taro.showToast({
      icon: "none",
      title: "请绑定相关账号"
    });
  } else if (url) await Taro.navigateTo({ url: url.value });
}

const backgroundColor = computed(() => {
  if (isDisabled.value)
    return { backgroundColor: "var(--wjh-color-light)" };
  else return { backgroundColor: `var(--wjh-color-${bg.value}-600)` };
});

</script>
