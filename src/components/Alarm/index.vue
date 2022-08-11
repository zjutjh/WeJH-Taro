<template>
  <view class="wjh-alarm" @tap="resetCounter">
    <view class="iconfont icon-alarm wjh-alarm-icon"></view>
    <view v-if="counter || 0 > 0" class="wjh-alarm-counter-background">{{
      counter
    }}</view>
  </view>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import './index.scss';

  export default defineComponent({
    props: {
      counter: Number
    },
    methods: {
      resetCounter() {
        // this.counter = 0;
      }
    }
  });
</script>
