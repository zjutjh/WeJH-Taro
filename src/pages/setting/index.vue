<template>
  <theme-config>
    <title-bar title="设置" back-button />
    <scroll-view
      :scroll-y="true"
      style="flex: 1"
    >
      <view
        class="flex-column"
        :style="isEmpty ? 'justify-content: space-between' : undefined"
      >
        <card class="setting-card">
          <view
            v-if="isEmpty"
            class="empty"
          >
            {{ emptyText }}
          </view>
          <template #footer>
            <view class="footer-text">
              {{ copyright }}
            </view>
          </template>
        </card>
      </view>
    </scroll-view>
    <image
      v-if="isEmpty"
      src="@/assets/photos/setting.svg"
      style="margin: 0 auto"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { Card, TitleBar, ThemeConfig } from "@/components";
import { settingText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import { ref, watch } from "vue";
import { serviceStore } from "@/store";
import store from "@/store";
import "./index.scss";

const isEmpty = ref(true);
const emptyText = settingText.empty;
const copyright = getCopyRight();
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
