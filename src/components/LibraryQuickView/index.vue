<template>
  <quick-view @tap="nav" title="借阅信息" icon-name="library">
    <text class="sub-text"
      >当前借阅({{ dayjs(updateTime.current).fromNow() }})</text
    >
    <view v-if="!current" class="no-data-text">当前无借阅图书</view>
    <view v-for="item in current" :key="item.id">
      <view class="library-book">
        <view> {{ item.name }}</view>
        <view>借阅日期：{{ item.time }}</view>
        <view class="ext" v-if="item.isExtended && item.isExtended < 0"
          >{{ Math.abs(item.isExtended) }}天</view
        >
        <view class="ext red" v-if="item.isExtended && item.isExtended > 0"
          >{{ Math.abs(item.isExtended) }}天</view
        >
      </view>
    </view>
  </quick-view>
</template>
<script lang="ts">
  import QuickView from '../QuickView/index.vue';
  import { LibraryService } from '@/services';
  import Taro from '@tarojs/taro';
  import dayjs from 'dayjs';
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import { throttle } from '@/utils/tools';
  import './index.scss';
  export default defineComponent({
    components: { 'quick-view': QuickView },
    setup() {
      return {
        dayjs
      };
    },
    mounted() {
      this.getLibraryToday();
    },
    computed: {
      current() {
        return serviceStore.library.current;
      },
      updateTime() {
        return serviceStore.library.updateTime;
      },
      currentCount() {
        return this.current ? this.current.length : 0;
      },
      currentExtendedCount() {
        return this.current
          ? this.current.filter((item) => item.IsExtended > 0).length
          : 0;
      }
    },
    methods: {
      getLibraryToday: throttle(LibraryService.getLibraryCurrent),
      nav() {
        Taro.navigateTo({ url: '/pages/library/index' });
      }
    }
  });
</script>
<style>
  .balance {
    font-size: 3rem;
    font-weight: bolder;
    margin: 0.5rem;
  }

  .no-data-text {
    font-size: 1rem;
    padding: 1rem;
    text-align: center;
  }
</style>
