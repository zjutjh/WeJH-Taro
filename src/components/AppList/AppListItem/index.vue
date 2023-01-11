<template>
  <view class="applist-item" @tap="appTaped">
    <view class="applist-bg" :style="backgroundColor">
      <image class="applist-item-icon" :src="require('@/assets/icons/applist/' + iconUrl)" />
    </view>
    <text class="label" data-test="label">
      {{ label }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { computed, ref, toRefs } from "vue";
import "./index.scss";

const props = defineProps<{
  label: string,
  iconUrl: string,
  url: string,
  bg: string,
  require: string,
}>();
const { require: requireActive, bg = ref("green"), label, url } = toRefs(props);

let isDisabled = ref(false);
if (requireActive.value === "zf" && !serviceStore.user.isBindZF)
  isDisabled.value = true;
if (requireActive.value === "card" && !serviceStore.user.isBindCard)
  isDisabled.value = true;
if (requireActive.value === "library" && !serviceStore.user.isBindLibrary)
  isDisabled.value = true;

async function appTaped() {
  if (isDisabled.value) {
    await Taro.navigateTo({ url: "/pages/bind/index" });  //保留当前页面，跳转到url界面
    Taro.showToast({  //显示消息提示框
      icon: "none",
      title: "请绑定相关账号"
    });
  } else if (url) await Taro.navigateTo({ url: url.value });
}

const backgroundColor = computed(() => {
  if (isDisabled.value)
    return { backgroundColor: "var(--wjh-color-light)" };
  else return { backgroundColor: `var(--wjh-color-${bg.value})` };
});

</script>
