<template>
  <theme-config class="lab-view background">
    <title-bar title="实验室" back-button />
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
              <view class="tab-bar">
                <text
                  class="tab"
                  :class="currentTab === 'green' ? 'active' : undefined"
                  @tap="() => handleTabClick('green')"
                > 绿
                </text>
                <text
                  class="tab"
                  :class="currentTab === 'yellow' ? 'active' : undefined"
                  @tap="() => handleTabClick('yellow')"
                > 黄
                </text>
                <text
                  class="tab"
                  :class="currentTab === 'blue' ? 'active' : undefined"
                  @tap="() => handleTabClick('blue')"
                > 蓝
                </text>
                <text
                  class="tab"
                  :class="currentTab === 'dark' ? 'active' : undefined"
                  @tap="() => handleTabClick('dark')"
                > 暗
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
import { Card, TitleBar, ThemeConfig } from "@/components";
import { labText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import { ref, computed,watch  } from "vue";
import { serviceStore } from "@/store";
import store from "@/store";
import "./index.scss";

const isEmpty = ref(false);

const emptyText = computed(() => {
  return labText.empty;
});

const themeMode = ref(serviceStore.theme.themeMode);
const currentTab = ref(themeMode);

watch(() => serviceStore.theme.themeMode, (newValue) => {
  currentTab.value = newValue;
  themeMode.value = newValue;
});

const setThemeMode = (currentTab: string) => {
  store.commit("setThemeMode", currentTab);
};

const handleTabClick = (theme: string) => {
  currentTab.value = theme;
  setThemeMode(theme);
};
</script>
