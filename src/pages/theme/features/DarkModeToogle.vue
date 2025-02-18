<template>
  <w-list class="dark-mode-toggle" style="border-radius: 8px;">
    <w-list-item arrow="right" @tap="handleAdaptToggle">
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
        <w-swtich
          :active="isActive"
          @tap="handleDarkToogle"
        />
      </view>
    </w-list-item>
  </w-list>
</template>

<script setup lang="ts">
import { WList, WListItem, WSwtich } from "@/components";
import { useDarkMode } from "@/hooks";
import Taro from "@tarojs/taro";
import { computed } from "vue";
const optionValueMap = {
  "adapted": "跟随微信",
  "noAdapted": "手动设置"
};

const { isAdapted, setIsAdapted, setMode, mode } = useDarkMode();

const isActive = computed(() => {
  return mode.value === "light";
});

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
  setMode(mode.value === "light" ? "dark" : "light");
  setIsAdapted(false);
};
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
