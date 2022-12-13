<template>
  <bottom-panel>
    <view @tap="nav('home')" :class="pageName === 'home' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper">
      <view class="iconfont icon-home"></view>
      <view class="description">首页</view>
    </view>
    <view :class="showPop ? 'selected' : 'unselected'" class="nav-bar-icon-wrapper" @tap="plusClick">
      <view class="iconfont icon-applist"></view>
      <view class="description">功能</view>
    </view>
    <view @tap="nav('my')" :class="pageName === 'my' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper">
      <view class="iconfont icon-user"></view>
      <view class="description">我的</view>
    </view>
  </bottom-panel>
  <pop-view v-model:show="showPop">
    <app-list v-if="showPop" />
  </pop-view>
</template>

<script setup lang="ts">
import AppList from "@/components/AppList/index.vue";
import PopView from "@/components/PopView/index.vue";
import BottomPanel from "@/components/BottomPanel/index.vue";
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import "./index.scss";
import { ref, toRefs } from "vue";

const emit = defineEmits(["plusClick", "onChange"]);
const showPop = ref(false);

const props = defineProps<{
  pageName: string
}>();
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
