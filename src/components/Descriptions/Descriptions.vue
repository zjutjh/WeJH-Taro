<template>
  <view :class="`wjh-descriptions wjh-desriptions-size-${props.size}`">
    <view v-if="props.title" class="wjh-descriptions-header">
      {{ props.title }}
    </view>
    <view class="wjh-descriptions-view">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import "./index.scss";

type PropsType = {
  size?: "small" | "middle";
  title: string
}
const props = withDefaults(defineProps<PropsType>(), {
  size: "middle"
});

</script>
