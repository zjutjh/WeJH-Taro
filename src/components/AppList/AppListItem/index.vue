<template>
  <view class="applist-item" @tap="appTaped">
    <view class="icon-wrapper" :style="backgroundColor">
      <image 
      :src="iconUrl"
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
import { defaultTheme } from "@/store/service/theme";

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
const currentConfig = computed(() => serviceStore.theme.config)

const iconUrl =computed(() => {
  const applist_icon = currentConfig.value.applist_icon
  if (icon === 'lessonstable') return applist_icon.class_icon
  if (icon === 'score') return applist_icon.grade_icon
  if (icon === 'exam') return applist_icon.exam_icon
  if (icon === 'freeroom') return applist_icon.free_classroom_icon
  if (icon === 'schoolcard') return applist_icon.schoolcard_icon
  if (icon === 'library') return applist_icon.lend_icon
  if (icon === 'electricity') return applist_icon.electricity_icon
  if (icon === 'schoolbus') return applist_icon.schoolbus_icon
  if (icon === 'suit') return applist_icon.cloth_icon
})

const isShowByUrl = computed(() => {
  if (serviceStore.theme.darkMode.mode ==='light') {
    return themeMode.value.light !== defaultTheme.name
  } else {
    return themeMode.value.dark !== defaultTheme.name
  }
}) 
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
