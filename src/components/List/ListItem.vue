<template>
  <view class="wjh-list-item">
    <view class="wjh-list-item-content">
      <view class="wjh-list-item-content-main">
        <slot></slot>
      </view>
      <template v-if="props.clickable">
        <view class="wjh-list-item-content-arrow iconfont icon-arrow-right"></view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import "./index.scss";

type PropsType = {
  clickable?: boolean;
}
const props = withDefaults(defineProps<PropsType>(), {
  clickable: false
});

</script>
