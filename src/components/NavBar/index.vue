<template>
  <bottom-panel>
    <view
      :class="pageName === 'home' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="nav('home')"
    >
      <image
        :src="pageName === 'home' && !showPop ?
        barIcons.selected_home_icon : barIcons.home_icon"
        v-if="isShowByUrl"/>
      <view class="iconfont icon-home" v-else/>
      <view class="description">
        首页
      </view>
      <view v-if="notificationActive.home" class="badge-wrapper">
        <w-badge size="small" />
      </view>
    </view>
    <view
      :class="showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="plusClick"
    >
      <image
        :src="showPop ? barIcons.selected_function_icon : barIcons.function_icon"
        v-if="isShowByUrl"/>
      <view class="iconfont icon-applist" v-else/>
      <view class="description">
        功能
      </view>
      <view v-if="notificationActive.applist" class="badge-wrapper">
        <w-badge size="small" />
      </view>
    </view>
    <view
      :class="pageName === 'my' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="nav('my')"
    >
      <image
        :src="pageName === 'my' && !showPop ? barIcons.selected_my_icon : barIcons.my_icon"
        v-if="isShowByUrl"/>
      <view class="iconfont icon-user" v-else/>
      <view class="description">
        我的
      </view>
      <view v-if="notificationActive.my" class="badge-wrapper">
        <w-badge size="small" />
      </view>
    </view>
  </bottom-panel>
  <pop-view v-model:show="showPop">
    <view class="sub-text-container">
      <text class="sub-text">
        部分功能卡片可通过点击首页下方的加号添加
      </text>
    </view>
    <app-list v-if="showPop" />
  </pop-view>
</template>

<script setup lang="ts">
import AppList from "../AppList/index.vue";
import PopView from "../PopView/index.vue";
import BottomPanel from "../BottomPanel/index.vue";
import { WBadge } from "..";
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import "./index.scss";
import { computed, ref, toRefs } from "vue";
import { checkNotification } from "@/utils";
import { defaultTheme } from "@/store/service/theme";
import { defaultTheme } from "@/store/service/theme";

const emit = defineEmits(["plusClick", "onChange"]);
const showPop = ref(false);

const props = defineProps<{
  pageName: string
}>();

const notificationActive = computed(() => {
  const store = serviceStore.notification.state;
  return {
    home: checkNotification("home", store),
    applist: checkNotification("applist", store),
    my: checkNotification("my", store)
  };
});
const barIcons = computed(() => serviceStore.theme.config.bar_icon);
const isShowByUrl = computed(() => {
  let themeMode = serviceStore.theme.themeMode
  if (serviceStore.theme.darkMode.mode ==='light') {
    return themeMode.light !== defaultTheme.name
  } else {
    return themeMode.dark !== defaultTheme.name
  }
})

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
