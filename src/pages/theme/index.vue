<template>
  <theme-config>
    <title-bar title="主题" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card class="lab-card">
          <view class="theme-config">
            <view class="theme-config-title">
              主题色彩
            </view>
            <view class="tab-bar">
              <text
                v-for="item in themeStore.themeList"
                :key="item.name"
                class="tab"
                :class="themeStore.current?.name === item.name ? 'active' : undefined"
                @tap="() => handleSelect(item)"
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
        <dark-mode-toggle />
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { Card, ThemeConfig, TitleBar } from "@/components";
import DarkModeToggle from "./features/DarkModeToggle.vue";
import { getCopyRight } from "@/utils";
import "./index.scss";
import useThemeStore, { Theme } from "@/store/service/theme";

// TODO: 主题过渡方案
const themeStore = useThemeStore();

const handleSelect = (theme: Theme) => {
  themeStore.setTheme(theme);
};
</script>
