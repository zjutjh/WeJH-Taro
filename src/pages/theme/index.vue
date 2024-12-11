<template>
  <theme-config>
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
          <view class="theme-config" v-if="serviceStore.theme.darkMode.isAdapted === false">
            <view class="theme-config-title">
                主题色彩
            </view>
            <view class="tab-bar">
              <text
                v-for="item in 
                serviceStore.theme.darkMode.mode === 'light' ? hadThemeList_light : hadThemeList_dark"
                :key="item.name"
                class="tab"
                :class="currentTab === item.name ? 'active' : undefined"
                @tap="() => handleTabClick(item.name)"
              >
                {{ nameMap[item.name] }}
              </text>
            </view>
          </view>
          <view class="theme-config" v-if="serviceStore.theme.darkMode.isAdapted === true">
            <view class="theme-config-title">
                浅色主题
            </view>
            <view class="tab-bar">
              <text
                v-for="item in hadThemeList_light"
                :key="item.name"
                class="tab"
                :class="currentTab === item.name ? 'active' : undefined"
                @tap="() => handleTabClick(item.name)"
              >
                {{ nameMap[item.name] }}
              </text>
            </view>
            <view class="theme-config-title">
                深色主题
            </view>
            <view class="tab-bar">
              <text
                v-for="item in hadThemeList_dark"
                :key="item.name"
                class="tab"
                :class="currentTab === item.name ? 'active' : undefined"
                @tap="() => handleTabClick(item.name)"
              >
                {{ nameMap[item.name] }}
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
import { Card, ThemeConfig, TitleBar } from "@/components";
import DarkModeToggle from "./features/DarkModeToggle.vue";
import { labText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import { computed, ref, watch } from "vue";
import store, { serviceStore } from "@/store";
import "./index.scss";
import { useRequest } from "@/hooks";
import { UserService } from "@/services";
import Taro from "@tarojs/taro";

let activeTheme = "";
const idMap = {};
// 主题过渡方案
const nameMap = {
  green: "绿",
  yellow: "黄",
  walk: "毅行",
  blue: "蓝",
  pink: "粉"
};
const configMap = {}
const isEmpty = ref(false);
const emptyText = computed(() => {
  return labText.empty;
});
//主题列表
const hadThemeList_light = computed(() => {
    return serviceStore.theme.hadTheme
});
const hadThemeList_dark = computed(() => {
    return serviceStore.theme.hadTheme.filter((item: any) => item.has_dark_mode)
});

const themeMode = ref(serviceStore.theme.themeMode);
const currentTab = ref(themeMode);
useRequest(UserService.getUserTheme, {
  manual: false,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      console.log(res.data)
      store.commit("setHadTheme", res.data.data.theme_list);
      res.data.data.theme_list.forEach((item: any) => {
        idMap[item.name] = item.theme_id;
        configMap[item.name] = item.theme_config;
      });
      console.log("idMap:",idMap)
    } else {
      Taro.showToast({
        icon: "none",
        title: res.data.msg
      });
    }
  },
  onError: (e: Error) => {
    return `失败\r\n${e.message || "网络错误"}`;
  }
});

const { run } = useRequest(UserService.setTheme, {
  manual: true,
  onSuccess: (res) => {
    console.log(res);
    if (res.data.code === 1 && res.data.msg === "OK") {
      store.commit("setThemeMode", currentTab);
      store.commit("setConfig", configMap[currentTab.value]);//传当前点击的主题对应的config
      currentTab.value = activeTheme;
      Taro.showToast({ title: "设置成功" });
    } else {
      Taro.showToast({
        icon: "none",
        title: res.data.msg
      });
    }
  },
  onError: (e: Error) => {
    return `失败\r\n${e.message || "网络错误"}`;
  }
});

watch(() => serviceStore.theme.themeMode, (newValue) => {
  currentTab.value = newValue;
  themeMode.value = newValue;
});

const setThemeMode = (currentTab: string) => {
  run({ id: idMap[currentTab] });
};

const handleTabClick = (theme: string) => {
  setThemeMode(theme);
  activeTheme = theme;
};
</script>
