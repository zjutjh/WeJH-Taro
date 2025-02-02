<template>
  <w-list
    class="dark-mode-toggle"
    style="border-radius: 8Px;"
    @tap="handleToggle"
  >
    <w-list-item arrow="right">
      <view class="text-wrapper">
        <text> 深色模式 </text>
        <text class="state">
          {{ optionText }}
        </text>
      </view>
    </w-list-item>
  </w-list>
</template>

<script setup lang="ts">
import { WList, WListItem } from "@/components";
import { useDarkMode } from "@/hooks";
import { DarkModeTheme } from "@/types/DarkMode";
import Taro from "@tarojs/taro";
import { computed } from "vue";
import store, { serviceStore } from "@/store";
import { Config } from "@tarojs/taro/types/compile";
import { defaultConfig } from "@/store/service/theme";
const optionValueMap = {
  "adapted": "跟随微信",
  "dark": "深色",
  "light": "浅色"
};

const { mode, isAdapted, setMode, setIsAdapted } = useDarkMode();

const optionText = computed(() => {
  if (isAdapted.value) return optionValueMap["adapted"];
  else return optionValueMap[mode.value];
});

const handleToggle = () => {
  Taro.showActionSheet({
    itemList: Object.values(optionValueMap),
    success: (e) => {
      let newMode = Object.keys(optionValueMap)[e.tapIndex]
      if (e.tapIndex === 0) setIsAdapted(true);
      else {
        setIsAdapted(false);
        setMode(newMode as DarkModeTheme);
      }
      const themeStore = serviceStore.theme
      let config : Config | undefined
      if (newMode === 'dark') {
        config = themeStore.hadTheme.find(theme => theme.name === themeStore.themeMode.dark)?.theme_config;
      } else {
        config = themeStore.hadTheme.find(theme => theme.name === themeStore.themeMode.light)?.theme_config;
      }
      if(config === undefined) config = defaultConfig
      store.commit("setConfig",config)
    }
  });
};

</script>

<style lang="scss">
.dark-mode-toggle {

  .text-wrapper {
    display: flex;
    flex: auto;
    justify-content: space-between;
  }

  .state {
    color: var(--wjh-color-week);
  }
}
</style>
