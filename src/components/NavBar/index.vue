<template>
  <bottom-panel>
    <view
      @tap="nav('home')"
      :class="pageName === 'home' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
    >
      <view class="iconfont icon-home"></view>
      <view class="description">首页</view>
    </view>
    <view
      :class="showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="plusClick"
    >
      <view class="iconfont icon-applist"></view>
      <view class="description">其他</view>
    </view>
    <view
      @tap="nav('my')"
      :class="pageName === 'my' && !showPop ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
    >
      <view class="iconfont icon-user"></view>
      <view class="description">我的</view>
    </view>
  </bottom-panel>
</template>

<script lang="ts">
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Taro from '@tarojs/taro';
  import { defineComponent } from 'vue';
  import './index.scss';

  export default defineComponent({
    setup(props, { emit }) {
      return {
        nav: (val: string) => {
          emit('update:showPop', false);
          emit('update:pageName', val);
        },
        plusClick: () => {
          emit('plusClick');
        }
      };
    },
    components: { BottomPanel },
    props: {
      showPlus: {
        default: true,
        type: Boolean
      },
      pageName: {
        type: String,
        default: 'home'
      },
      showPop: Boolean
    }
  });
</script>
