<template>
  <view
    :class="`wjh-card wjh-card-size-${props.size}`"
    :style="props.style"
  >
    <view v-if="props.title" class="wjh-card-header">
      {{ props.title }}
    </view>
    <view v-if="$slots.header" class="wjh-card-header">
      <slot name="header"></slot>
    </view>
    <view class="wjh-card-body">
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="wjh-card-footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { CSSProperties } from "vue";
import "./index.scss";

const props = withDefaults(defineProps<{
  title?: string,
  size?: "small" | "middle",
  style?: CSSProperties,
}>(), {
  size: "middle"
});

</script>
