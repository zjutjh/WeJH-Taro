<template>
  <view :class="`wjh-card wjh-card-size-${size}`" :style="style">
    <view v-if="title" class="wjh-card-header">
      {{ title }}
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
import { CSSProperties, ref } from "vue";
import "./index.scss";

const props = defineProps<{
  title?: string,
  size?: "small" | "middle",
  style?: CSSProperties,
}>();
const { title, size = ref("middle"), style } = props;

</script>
