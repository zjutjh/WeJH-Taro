<template>
  <view class="wjh-title-bar" :style="titleStyle">
    <view class="bg-default" v-if="loading"></view>
    <view :style="justTitleStyle">
      <text
        v-if="backButton"
        class="iconfont wjh-title-bar-back-button icon-arrow-left"
        @tap="goBack"
      ></text>
      <text class="wjh-title-bar-title">{{ title }}</text>
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
  import Taro from '@tarojs/taro';
  import { defineComponent } from 'vue';
  import { systemStore } from '@/store';
  import './index.scss';
  export default defineComponent({
    props: {
      title: String,
      backButton: {
        default: true,
        type: Boolean
      }
    },
    computed: {
      loading() {
        return systemStore.loading;
      },
      titleStyle() {
        let MenuRect = Taro.getMenuButtonBoundingClientRect();
        let statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
        return {
          height:
            MenuRect.top +
            MenuRect.height +
            MenuRect.top -
            statusBarHeight +
            'px'
        };
      },
      justTitleStyle() {
        let MenuRect = Taro.getMenuButtonBoundingClientRect();
        return {
          height: MenuRect.height + 'px',
          marginTop: MenuRect.top + 'px',
          marginLeft: '1rem',
          display: 'flex',
          fontSize: '1.5rem',
          lineHeight: MenuRect.height + 'px'
        };
      }
    },
    methods: {
      goBack() {
        Taro.navigateBack();
      }
    }
  });
</script>
