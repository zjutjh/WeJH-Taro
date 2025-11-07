<template>
  <bottom-panel class="nav-bar">
    <view
      :class="pageName === 'home' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="nav('home')"
    >
      <taro-image
        v-if="isShowByUrl"
        :src="pageName === 'home' && !showPop ? barIcons.selectedHomeIcon : barIcons.homeIcon"
        mode="aspectFit"
      />
      <view v-else class="iconfont icon-home" />
      <view class="description"> 首页 </view>
      <view v-if="notificationActive.home" class="badge-wrapper">
        <w-badge size="small" />
      </view>
    </view>
    <view
      :class="showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="plusClick"
    >
      <taro-image
        v-if="isShowByUrl"
        :src="showPop ? barIcons.selectedFunctionIcon : barIcons.functionIcon"
        mode="aspectFit"
      />
      <view v-else class="iconfont icon-applist" />
      <view class="description"> 功能 </view>
      <view v-if="notificationActive.applist" class="badge-wrapper">
        <w-badge size="small" />
      </view>
    </view>
    <view
      :class="pageName === 'my' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="nav('my')"
    >
      <taro-image
        v-if="isShowByUrl"
        :src="pageName === 'my' && !showPop ? barIcons.selectedMyIcon : barIcons.myIcon"
        mode="aspectFit"
      />
      <view v-else class="iconfont icon-user" />
      <view class="description"> 我的 </view>
      <view v-if="notificationActive.my" class="badge-wrapper">
        <w-badge size="small" />
      </view>
    </view>
  </bottom-panel>
  <pop-view v-model:show="showPop" class="nav-bar-pop-view">
    <view class="sub-text-container">
      <text class="sub-text"> 部分功能卡片可通过点击首页下方的加号添加 </text>
    </view>
    <app-list v-if="showPop" />
  </pop-view>
</template>

<script setup lang="ts">
import "./index.scss";

import { Image as TaroImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { computed, ref, toRefs } from "vue";

import { BottomPanel, PopView, WBadge } from "@/components";
import { useTheme } from "@/hooks";
import { serviceStore } from "@/store";
import { checkNotification } from "@/utils";

import AppList from "./components/app-list/index.vue";

const { isShowByUrl } = useTheme();

const emit = defineEmits(["plusClick", "onChange"]);
const showPop = ref(false);

const props = defineProps<{
  pageName: string;
}>();

const notificationActive = computed(() => {
  const store = serviceStore.notification.state;
  return {
    home: checkNotification("home", store),
    applist: checkNotification("applist", store),
    my: checkNotification("my", store)
  };
});
const barIcons = computed(() => serviceStore.theme.config.barIcon);

const { pageName } = toRefs(props);

/**
 * 导航至 Home / My
 * Applist 不是页面
 * @param 页面名
 */
const nav = (val: string) => {
  emit("onChange", val);
  showPop.value = false;
};

const plusClick = () => {
  if (!serviceStore.user.isActive) {
    Taro.showToast({
      icon: "none",
      title: "激活账号以使用功能"
    });
    return;
  }
  showPop.value = !showPop.value;
  emit("plusClick");
};
</script>
