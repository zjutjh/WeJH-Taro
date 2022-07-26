<template>
  <bottom-panel>
    <view
      @tap="nav('home')"
      :class="pageName === 'home' && !showPop ? 'selected' : 'unselected'"
    >
      <view class="iconfont icon-home"></view>
      <view class="description">首页</view>
    </view>
    <view :class="showPop ? 'selected' : 'unselected'">
      <view class="iconfont icon-applist" @tap="plusClick"></view>
      <view class="description">其他</view>
    </view>
    <view
      @tap="nav('my')"
      :class="pageName === 'my' && !showPop ? 'selected' : 'unselected'"
    >
      <view class="iconfont icon-user"></view>
      <view class="description">我的</view>
    </view>
  </bottom-panel>
</template>

<script lang="ts">
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Taro from '@tarojs/taro';
  import { defineComponent, PropType, ref, toRefs } from 'vue';
  export default defineComponent({
    setup(props, { emit }) {
      // comment: 获取当前页面栈
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return {
        nev: (url: string) => {
          if (currentPage.route !== url && !url.includes(currentPage.route))
            Taro.redirectTo({ url: url });
        },
        nav: (val: string) => {
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

<style lang="scss">
  .iconfont {
    font-size: 1.5rem;
  }
  .unselected {
    color: var(--wjh-color-week);
  }
  .selected {
    color: var(--wjh-color-green);
  }
  .description {
    font-size: 0.75rem;
  }
</style>
