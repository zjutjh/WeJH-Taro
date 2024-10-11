<template>
  <view :class="['wjh-list', `wjh-list-size-${props.size}`, inner && 'wjh-list-inner'] ">
    <slot name="header" />
    <template v-if="slots.header">
      <view class="wjh-list-header">
        <slot name="header" />
      </view>
    </template>
    <slot />
    <template v-if="slots.footer">
      <view class="wjh-list-footer">
        <slot name="footer" />
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { useSlots, withDefaults } from "vue";
import "./index.scss";

type PropsType = {
  size?: "small" | "middle",
  inner?: boolean
};

const props = withDefaults(defineProps<PropsType>(), {
  size: "middle",
  inner: false
});

const slots = useSlots();

</script>
