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
import useAppearanceStore from "@/store/service/appearance";
import Taro from "@tarojs/taro";
import { computed } from "vue";

const optionValueMap = {
  "adapted": "跟随微信",
  "dark": "深色",
  "light": "浅色"
};

const appearanceStore = useAppearanceStore();

const optionText = computed(() => {
  if (appearanceStore.isAdapted) return optionValueMap["adapted"];
  else return optionValueMap[appearanceStore.appearance];
});

const handleToggle = () => {
  Taro.showActionSheet({
    itemList: Object.values(optionValueMap),
    success: (e) => {
      appearanceStore.setAppearance(
        Object.keys(optionValueMap)[e.tapIndex] as any
      );
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
