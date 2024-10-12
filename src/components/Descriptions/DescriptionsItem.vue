<template>
  <view class="wjh-descriptions-item">
    <view class="wjh-descriptions-item-container">
      <view
        class="wjh-descriptions-item-label"
        :style="{
          flex: `0 0 calc(100% / 24 * ${props.labelSpan})`,
          maxHeight: `0 0 calc(100% / 24 * ${props.labelSpan})`
        }"
      >
        {{ props.label }}
      </view>
      <view
        :class="`wjh-descriptions-item-content wjh-col-${
          24 - props.labelSpan
        }`"
      >
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import "./index.scss";

type PropsType = {
  label: string,
  labelSpan?: number
};

const props = withDefaults(defineProps<PropsType>(), {
  labelSpan: 6
});

</script>
