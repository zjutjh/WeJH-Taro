<template>
  <theme-config>
    <title-bar title="主题" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
         <DarkModeToogle/>
         <card class="lab-card">
          <view
            v-if="isEmpty"
            class="empty"
          >
            {{ emptyText }}
          </view>
          <!-- <view class="theme-config" v-if="serviceStore.theme.darkMode.isAdapted === false">
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
          </view> -->
          <view class="theme-config">
            <view class="theme-config-title"  
              v-if="darkIsAdapted||darkMode==='light'">
                浅色主题
            </view>
            <view class="tab-bar"
              v-if="darkIsAdapted||darkMode==='light'">
              <text
                v-for="item in hadThemeList_light"
                :key="item.name"
                class="tab"
                :class="currentTab.light === item.name ? 'active' : undefined"
                @tap="() => handleTabClick(item.name,'light')"
              >
                {{ item.name }}
              </text>
            </view>
            <view class="theme-config-title" 
              v-if="darkIsAdapted||darkMode==='dark'">
                深色主题
            </view>
            <view class="tab-bar"
              v-if="darkIsAdapted||darkMode==='dark'">
              <text
                v-for="item in hadThemeList_dark"
                :key="item.name"
                class="tab"
                :class="currentTab.dark === item.name ? 'active' : undefined"
                @tap="() => handleTabClick(item.name,'dark')"
              >
                {{ item.name }}
              </text>
            </view>
          </view>
          <template #footer>
            <view class="footer-text">
              {{ getCopyRight() }}
            </view>
          </template>
        </card>
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
import DarkModeToogle from "./features/DarkModeToogle.vue";
import { labText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import { computed, ref, watch } from "vue";
import store, { serviceStore } from "@/store";
import "./index.scss";
import { useRequest } from "@/hooks";
import { UserService } from "@/services";
import Taro from "@tarojs/taro";
import { DarkModeTheme } from "@/types/DarkMode";
import { useDarkMode } from "@/hooks";
import { Theme } from "@/store/service/theme";

const idMap = {};
const configMap = {}
const isEmpty = ref(false);
const emptyText = computed(() => {
  return labText.empty;
});
//主题列表
const hadThemeList_light = computed(() => {
    return serviceStore.theme.hadTheme.filter((item:any) => !item.is_dark_mode)
});
const hadThemeList_dark = computed(() => {
    return serviceStore.theme.hadTheme.filter((item: any) => item.is_dark_mode)
});
//当前黑白天模式
const { mode: darkMode, isAdapted: darkIsAdapted  } = useDarkMode();
//受维护的当前主题(包括黑白天)
const currentTab = ref(serviceStore.theme.themeMode);
useRequest(UserService.getUserTheme, {
  manual: false,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      store.commit("setHadTheme", res.data.data.theme_list);
      res.data.data.theme_list.forEach((item: Theme) => {
        idMap[item.name] = item.theme_id;
        configMap[item.name] = item.theme_config;
      });
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
    if (res.data.code === 1 && res.data.msg === "OK") {
      store.commit("setThemeMode", currentTab);
      store.commit("setConfig", 
      darkMode.value==='light'? 
      configMap[currentTab.value.light] : configMap[currentTab.value.dark]);
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

watch(() => serviceStore.theme, (newValue) => {
  currentTab.value = newValue.themeMode;
});


const handleTabClick = (theme: string, darkMode: DarkModeTheme) => {
  if (darkMode === 'dark'){
    run({ id: idMap[theme],dark_id: idMap[currentTab.value.dark]})
  }
  else{
    run({id: idMap[currentTab.value.light],dark_id: idMap[theme]})
  }
};
</script>
