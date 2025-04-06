<template>
  <view class="quick-view">
    <view class="quick-view-header">
      <view class="quick-view-title">
        <image
          v-if="isShowByUrl"
          :src="getIconUrl(iconName,IconTypeEnum.QuickView)"
        />
        <view
          v-else
          :class="`iconfont icon-${iconName}`"
        />
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
import { toRefs } from "vue";
import "./index.scss";
import { useTheme } from "@/hooks/index";

const { getIconUrl, isShowByUrl, IconTypeEnum } = useTheme();

const props = defineProps<{ title: string; iconName: string; help?: boolean }>();
const { title, iconName, help } = toRefs(props);

const emit = defineEmits(["handleTapHelp"]);

function handleTapHelp() {
  emit("handleTapHelp");
}
</script>
