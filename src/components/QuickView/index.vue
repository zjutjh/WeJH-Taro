<template>
  <view class="quick-view">
    <view class="title">
      <view :class="`icon wjh-icon-${iconName}-fill`"></view>
      <view class="title-split"></view>
      <text>{{ title }}</text>
    </view>
    <view class="div-line"></view>
    <slot></slot>
  </view>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import './style/index.scss';
  export default defineComponent({
    props: {
      title: String,
      iconName: String
    }
  });
</script>
