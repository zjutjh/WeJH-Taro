<template>
  <view class="bottom-panel" :class="{ 'bottom-bar-ios': isNewIPhone() }">
    <slot></slot>
  </view>
</template>
<script lang="ts">
  import { isNewIPhone } from '@/utils/effects';
  import { defineComponent } from 'vue';
  import './style/index.scss';

  export default defineComponent({
    methods: {
      isNewIPhone
    }
  });
</script>
