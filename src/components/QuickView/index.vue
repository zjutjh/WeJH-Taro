<template>
  <view class="quick-view">
    <view class="quick-view-header">
      <view class="quick-view-title">
        <image v-if="isShowByUrl" :src="iconURL" />
        <view v-else :class="`iconfont icon-${iconName}`" />
        <text>{{ title }}</text>
      </view>
      <view
        v-if="help"
        class="quick-view-help-icon iconfont icon-help"
        @tap.stop="handleTapHelp"
      />
    </view>
    <view class="quick-view-body">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { computed } from "vue";
import { useTheme } from "@/hooks/index";
import { IconTypeEnum } from "@/hooks/useTheme";

const { getIconUrl, isShowByUrl } = useTheme();

interface QuickViewProps {
  title: string;
  iconName: string;
  help?: boolean
}

const props = defineProps<QuickViewProps>();

const iconURL = computed(() => {
  return getIconUrl(props.iconName, IconTypeEnum.QuickView);
});

const emit = defineEmits<{
  handleTapHelp: []
}>();

function handleTapHelp() {
  emit("handleTapHelp");
}
</script>
