<template>
  <view class="applist-item" @tap="appTaped">
    <view class="icon-wrapper" :style="backgroundColor">
      <image 
      :src="getIconUrl(icon,'white')"
      v-if="isShowByUrl"
      />
      <view 
      :class="['iconfont', 'icon-'+icon]"
      v-else
      />
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
import { isShowByUrl,getIconUrl } from "@/hooks/userTheme";

const props = defineProps<{
  label: string,
  icon: string,
  url: string,
  bg: string,
  require: string,
}>();
const { require: requireActive, bg = ref("green"), label, url } = toRefs(props);

const icon = props.icon;

const isDisabled = computed(() => {
  switch (requireActive.value) {
    case "zf":
      return !serviceStore.user.isBindZF && !serviceStore.user.isBindOauth;
    case "library":
      return !serviceStore.user.isBindLibrary;
    case "yxy":
      return !serviceStore.user.isBindYXY;
    default:
      return false;
  }
});

async function appTaped() {
  if (isDisabled.value) {
    await Taro.navigateTo({ url: "/pages/bind/index" });
    Taro.showToast({
      icon: "none",
      title: "请绑定相关账号"
    });
  } else if (url.value) await Taro.navigateTo({ url: url.value });
}

const backgroundColor = computed(() => {
  if (isDisabled.value)
    return { "--bg-color": "var(--wjh-color-light)" };
  else return { "--bg-color": `var(--wjh-color-${bg.value}-600)` };
});

</script>
