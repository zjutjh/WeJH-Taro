<template>
  <theme-config>
    <title-bar title="主题" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <dark-mode-toggle />
        <card
          v-for="mode in modes"
          :key="mode.name"
          class="theme-card"
        >
          <view class="theme-config">
            <view class="theme-config-title" :style="{ color: `var(${titleColor})` }">
              {{ handleShowedTitle(mode.name) }}配置({{ modeNameMap[mode.name] }})
            </view>
            <view class="tab-bar noActivity">
              <view v-for="item in mode.list.noActivity" :key="item.themeId" class="tab-noActivity">
                <view
                  class="tab-noActivity-block-outer"
                  :style="{
                    border: activeBorder(item),
                  }"
                  @tap="handleTabClick(item.themeId, mode.name)"
                >
                  <view
                    class="tab-noActivity-block-inner"
                    :style="{
                      backgroundColor: item.themeConfig.baseColor.base600
                    }"
                  />
                </view>
                <view class="tab-name">
                  {{ item.name }}
                </view>
              </view>
            </view>
            <view
              v-if="mode.list.activity.length"
              class="tab-bar activity"
            >
              <view
                v-for="item in mode.list.activity"
                :key="item.themeId"
                class="tab-activity"
                @tap="handleTabClick(item.themeId, mode.name)"
              >
                <view
                  class="tab-activity-block-outer"
                  :style="{ border: activeBorder(item) }"
                >
                  <image
                    class="tab-activity-block-inner"
                    :src="item.themeConfig.selectionImg"
                  />
                </view>
                <view class="tab-name">
                  {{ item.name }}
                </view>
              </view>
            </view>
          </view>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { Card, ThemeConfig, TitleBar } from "@/components";
import DarkModeToggle from "./components/DarkModeToggle.vue";
import { computed } from "vue";
import store, { serviceStore } from "@/store";
import "./index.scss";
import { useRequest, useDarkMode } from "@/hooks";
import { UserService } from "@/services";
import Taro from "@tarojs/taro";
import { Theme } from "@/store/service/theme";
import { toCamelCase } from "@/utils/camelize";

const { mode: darkMode, setMode, isAdapted } = useDarkMode();
const configMap = {};
const titleColor = computed(() => {
  return darkMode.value === "light" ? "--wjh-color-primary" : undefined;
});

const hadThemeListLight = computed(() => {
  const list = serviceStore.theme.hadTheme.filter((item: Theme) => !item.isDarkMode);
  return {
    "noActivity": list.filter((item: Theme) => item.themeConfig?.selectionImg === ""),
    "activity": list.filter((item: Theme) =>
      item.themeConfig?.selectionImg.startsWith("http")
    )
  };
});
const hadThemeListDark = computed(() => {
  const list = serviceStore.theme.hadTheme.filter((item: Theme) => item.isDarkMode);
  return {
    "noActivity": list.filter((item: Theme) => item.themeConfig?.selectionImg === ""),
    "activity": list.filter((item: Theme) =>
      item.themeConfig?.selectionImg.startsWith("http")
    )
  };
});

/** 用来实现——浅色模式时浅色卡片在上 深色时同理, 的工具变量 */
const modes = computed(() => {
  const modeSettingList = [
    { name: "light", list: hadThemeListLight.value }, { name: "dark", list: hadThemeListDark.value }
  ];
  if (isAdapted.value) {
    if (darkMode.value === "light") return modeSettingList;
    else return modeSettingList.reverse();
  } else {
    return modeSettingList.filter((item) => item.name === darkMode.value);
  }
});
const modeNameMap = { "light": "浅色", "dark": "深色" };
const handleShowedTitle = (mode) => {
  if (mode === modes.value[0].name) return "色彩";
  else return "预设";
};
/** 受维护的当前主题(包括黑白天) */
const currentThemeMode = computed(() => {
  return serviceStore.theme.themeMode;
});
const newThemeMode = currentThemeMode.value;

useRequest(UserService.getUserTheme, {
  manual: false,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      const camelizedData = toCamelCase(res.data.data);
      store.commit("setHadTheme", camelizedData.themeList);
      store.commit("setThemeMode", {
        light: camelizedData.currentThemeId, dark: camelizedData.currentThemeDarkId
      });
      newThemeMode.light = camelizedData.currentThemeId;
      newThemeMode.dark = camelizedData.currentThemeDarkId;
      setMode(darkMode.value);
      camelizedData.themeList.forEach((item: Theme) => {
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
          configMap[newThemeMode.light] : configMap[newThemeMode.dark]
      );
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
    run({ id: themeId, dark_id: currentThemeMode.value.dark });
  } else {
    newThemeMode.dark = themeId;
    run({ id: currentThemeMode.value.light, dark_id: themeId });
  }
};

const activeBorder = (item: Theme) => {
  const borderColor: string | undefined = item.themeConfig.baseColor.base700;

  if (currentThemeMode.value.light === item.themeId || currentThemeMode.value.dark === item.themeId) {
    return "6rpx solid " + borderColor;
  } else return "";
};
</script>
