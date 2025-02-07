<template>
  <w-list
    class="dark-mode-toggle"
    style="border-radius: 8px;"
  >
    <w-list-item 
      arrow="right"     
      @tap="handleAdaptToggle">
      <view class="text-wrapper">
        <text> 自动设置 </text>
        <text class="state">
          {{ optionText }}
        </text>
      </view>
    </w-list-item>
    <w-list-item>
      <view class="text-wrapper">
        <text>深色模式</text>
        <WSwtich @tap="handleDarkToogle"/>
      </view>
    </w-list-item>
  </w-list>
</template>

<script setup lang="ts">
import { WList, WListItem } from "@/components";
import { useDarkMode } from "@/hooks";
import { WSwtich } from "@/components";
import Taro from "@tarojs/taro";
import { computed } from "vue";
import store, { serviceStore } from "@/store";
import { Config, defaultConfig } from "@/store/service/theme";
const optionValueMap = {
  "adapted": "跟随微信",
  "noAdapted": "手动设置"
};

const { isAdapted, setIsAdapted, setMode } = useDarkMode();

const optionText = computed(() => {
  if (isAdapted.value) return optionValueMap["adapted"];
  else return optionValueMap["noAdapted"];
});

const handleAdaptToggle = () => {
  Taro.showActionSheet({
    itemList: Object.values(optionValueMap),
    success: (e) => {
      if (e.tapIndex === 0) setIsAdapted(true);
      else {
        setIsAdapted(false);
      }
    }
  });
};

const handleDarkToogle = () => {
  let mode = serviceStore.theme.darkMode.mode;

  const themeStore = serviceStore.theme
      let config : Config | undefined
      if (mode === 'light') {
        setMode('dark')
        config = themeStore.hadTheme.find(theme => theme.name === themeStore.themeMode.dark)?.theme_config;
      } else {
        setMode('light')
        config = themeStore.hadTheme.find(theme => theme.name === themeStore.themeMode.light)?.theme_config;
      }
      if(config === undefined) config = defaultConfig
      store.commit("setConfig",config)
}

</script>

<style lang="scss">
.dark-mode-toggle {

  .text-wrapper {
    display: flex;
    flex: auto;
    justify-content: space-between;
    align-items: center;
  }

  .state {
    color: var(--wjh-color-week);
  }
}
</style>
