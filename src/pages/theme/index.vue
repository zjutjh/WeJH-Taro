<template>
  <theme-config>
    <title-bar title="主题" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <dark-mode-toogle />
        <card
          v-for="mode in modes"
          :key="mode.name"
          class="theme-card"
        >
          <view class="theme-config">
            <view class="theme-config-title" :style="{ color: `var(${titleColor})` }">
              色彩配置({{ modeNameMap[mode.name] }})
            </view>
            <view class="tab-bar noActivity">
              <view v-for="item in mode.list.noActivity" :key="item.themeId" class="tab-noActivity">
                <view
                  class="tab-noActivity-block"
                  :style="{
                    border: handleActiveBorder(item),
                    backgroundColor: item.themeConfig.baseColor.base600
                  }"
                  @tap="handleTabClick(item.themeId, mode.name)"
                />
                <view class="tab-name">
                  {{ item.name }}
                </view>
              </view>
            </view>
            <view
              v-if="mode.list.activity.length"
              class="tab-bar activity"
              style="border-top: 1Px solid var(--wjh-color-border);"
            >
              <view
                v-for="item in mode.list.activity"
                :key="item.themeId"
                class="tab-activity"
                @tap="handleTabClick(item.themeId, mode.name)"
              >
                <view>
                  <image
                    class="tab-activity-block"
                    :style="{ border: handleActiveBorder(item) }"
                    :src="item.themeConfig.selectionImg"
                  />
                </view>
                <view class="tab-name">
                  {{ item.name }}
                </view>
              </view>
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
  </theme-config>
</template>

<script setup lang="ts">
import { Card, ThemeConfig, TitleBar } from "@/components";
import DarkModeToogle from "./features/DarkModeToogle.vue";
import { getCopyRight } from "@/utils";
import { computed } from "vue";
import store, { serviceStore } from "@/store";
import "./index.scss";
import { useRequest, useDarkMode } from "@/hooks";
import { UserService } from "@/services";
import Taro from "@tarojs/taro";
import { Theme } from "@/store/service/theme";

const { mode: darkMode } = useDarkMode();
const configMap = {};
const titleColor = computed(() => {
  return darkMode.value === "light" ? "--wjh-color-primary" : undefined;
});

const hadThemeListLight = computed(() => {
  const list = serviceStore.theme.hadTheme.filter((item: Theme) => !item.isDarkMode);
  return {
    "noActivity": list.filter((item: Theme) => item.themeConfig?.selectionImg === ""),
    "activity": list.filter((item: Theme) => item.themeConfig?.selectionImg.startsWith("https://api.cnpatrickstar.com/img/icons"))
  };
});
const hadThemeListDark = computed(() => {
  const list = serviceStore.theme.hadTheme.filter((item: Theme) => item.isDarkMode);
  return {
    "noActivity": list.filter((item: Theme) => item.themeConfig?.selectionImg === ""),
    "activity": list.filter((item: Theme) => item.themeConfig?.selectionImg.startsWith("https://api.cnpatrickstar.com/img/icons"))
  };
});

/** 用来实现——浅色模式时浅色卡片在上 深色时同理, 的工具变量 */
const modes = computed(() => {
  const modeSettingList = [{ name: "light", list: hadThemeListLight.value }, { name: "dark", list: hadThemeListDark.value }];
  if (darkMode.value === "light") return modeSettingList;
  else return modeSettingList.reverse();
});
const modeNameMap = { "light": "浅色", "dark": "深色" };

/** 受维护的当前主题(包括黑白天) */
const currentThemeMode = computed(() => {
  return serviceStore.theme.themeMode;
});
const newThemeMode = currentThemeMode.value;

useRequest(UserService.getUserTheme, {
  manual: false,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      store.commit("setHadTheme", res.data.data.theme_list);
      res.data.data.theme_list.forEach((item: Theme) => {
        configMap[item.themeId] = item.themeConfig;
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
      store.commit("setThemeMode", newThemeMode);
      store.commit("setConfig",
        darkMode.value === "light" ?
          configMap[newThemeMode.light] : configMap[newThemeMode.dark]);
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

const handleTabClick = (themeId: number, darkMode: string) => {
  if (darkMode === "light") {
    newThemeMode.light = themeId;
    run({ id: themeId, darkId: currentThemeMode.value.dark });
  } else {
    newThemeMode.dark = themeId;
    run({ id: currentThemeMode.value.light, darkId: themeId });
  }
};

const handleActiveBorder = (item: Theme) => {
  let borderColor: string | undefined = undefined;
  const borderColorLight = item.themeConfig.baseColor.base700;
  const borderColorDark = "#E5E5E5";

  borderColor = darkMode.value === "light" ? borderColorLight : borderColorDark;

  if (currentThemeMode.value.light === item.themeId || currentThemeMode.value.dark === item.themeId) {
    return "5rpx solid " + borderColor;
  } else return "";
};
</script>
