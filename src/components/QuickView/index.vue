<template>
  <view class="quick-view">
    <view class="quick-view-header">
      <view class="quick-view-title">
        <view :class="`quick-view-name-icon wjh-icon-${iconName}-fill`"></view>
        <view class="title-split"></view>
        <text>{{ title }}</text>
      </view>
      <view
        v-if="help"
        class="quick-view-help-icon iconfont icon-help"
        @tap.stop="handleTapHelp"
      ></view>
    </view>
    <slot></slot>
  </view>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import './style/index.scss';
  export default defineComponent({
    data() {
      return {
        isShowHelp: false
      };
    },
    components: {},
    props: {
      title: String,
      iconName: String,
      help: Boolean,
      helpContent: String
    },
    methods: {
      handleTapHelp() {
        this.$emit('handleTapHelp');
      }
    }
  });
</script>
