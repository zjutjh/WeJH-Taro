<template>
  <theme-config class="lab-view background">
    <title-bar title="主题" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card class="lab-card">
          <view
            v-if="isEmpty"
            class="empty"
          >
            {{ emptyText }}
          </view>
          <view class="theme-config">
            <view class="theme-config-title">主题色彩</view>
              <view class="tab-bar" >
                <text
                  v-for="item in hadThemeList"
                  class="tab"
                  :class="currentTab === item.name ? 'active' : undefined"
                  @tap="() => handleTabClick(item.name)"
                > {{ nameMap[item.name] }}
                </text>
              </view>
          </view>
          <template #footer>
            <view class="footer-text">
              {{ getCopyRight() }}
            </view>
          </template>
        </card>
        <dark-mode-toggle />
      </view>
    </scroll-view>
    <image
      v-if="isEmpty"
      src="@/assets/photos/lab.svg"
      style="margin: 0 auto"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { Card, TitleBar, ThemeConfig } from "@/components";
import DarkModeToggle from "./features/DarkModeToggle.vue";
import { labText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import {ref, computed, watch, onMounted} from "vue";
import { serviceStore } from "@/store";
import store from "@/store";
import "./index.scss";
import {useRequest} from "@/hooks";
import {UserService} from "@/services";
import Taro from "@tarojs/taro";

let activeTheme = ''
let idMap = {}
let nameMap = {
  green: "绿",
  yellow: "黄",
  blue: "蓝",
  purple: "紫",
  pink: "粉"
}
const isEmpty = ref(false);

const emptyText = computed(() => {
  return labText.empty;
});
const hadThemeList = computed(() => {
  return serviceStore.theme.hadTheme;
});
const themeMode = ref(serviceStore.theme.themeMode);
const currentTab = ref(themeMode);


useRequest(UserService.getUserTheme, {
  manual: false,
  onSuccess: (res) => {
    if(res.data.code === 1 && res.data.msg === "OK") {
      store.commit("setHadTheme", res.data.data.theme_list);
      res.data.data.theme_list.forEach((item:any) => {
        idMap[item.name] = item.id;
      })
    } else {
      Taro.showToast({
        icon: "none",
        title: res.data.msg
      });
    }
  },
  onError: (e:Error) =>{
    return `失败\r\n${e.message || "网络错误"}`;
  }
})

const { run } = useRequest(UserService.setTheme, {
  manual: true,
  onSuccess: (res) => {
    if(res.data.code === 1 && res.data.msg === "OK") {
      store.commit("setThemeMode", currentTab);
      currentTab.value = activeTheme;
      Taro.showToast({ title: "设置成功" });
    } else {
      Taro.showToast({
        icon: "none",
        title: res.data.msg
      });
    }
  },
  onError: (e:Error) =>{
    return `失败\r\n${e.message || "网络错误"}`;
  }
})

watch(() => serviceStore.theme.themeMode, (newValue) => {
  currentTab.value = newValue;
  themeMode.value = newValue;
});

const setThemeMode = (currentTab: string) => {
  run({ id:idMap[currentTab]} )
};

const handleTabClick = (theme: string) => {
  setThemeMode(theme);
  activeTheme = theme;
};
</script>
