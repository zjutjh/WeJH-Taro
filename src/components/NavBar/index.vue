<template>
  <bottom-panel>
    <view @tap="nev('/pages/index/index')">
      <view class="iconfont icon-home"></view>
      <view class="description">首页</view>
    </view>
    <view>
      <view class="iconfont icon-applist" @tap="plusClick"></view>
      <view class="description">其他</view>
    </view>
    <view @tap="nev('/pages/my/index')">
      <view class="iconfont icon-user"></view>
      <view class="description">我的</view>
    </view>
  </bottom-panel>
</template>

<script lang="ts">
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Taro from '@tarojs/taro';
  import { defineComponent } from 'vue';
  export default defineComponent({
    setup(props, { emit }) {
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return {
        nev: (url: string) => {
          if (currentPage.route !== url && !url.includes(currentPage.route))
            Taro.redirectTo({ url: url });
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
      }
    }
  });
</script>

<style lang="scss">
  .iconfont {
    color: #888888;
    font-size: 1.5rem;
  }
  .description {
    font-size: 0.75rem;
  }
</style>
