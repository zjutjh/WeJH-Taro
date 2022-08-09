<template>
  <quick-view @tap="nav" title="借阅信息" icon-name="library">
    <text class="sub-text">
      当前借阅 ({{ dayjs(updateTime.current).fromNow() }})
    </text>
    <view v-if="!current" class="empty">当前无借阅图书</view>
    <card
      v-for="(item, index) in current.slice(0, 3)"
      :key="item.libraryID"
      class="book-card"
      :style="
        index % 2
          ? 'background-color: var(--wjh-color-yellow-light)'
          : 'background-color: var(--wjh-color-orange-light)'
      "
    >
      <view class="book-name"> {{ item.name }}</view>
      <view>借阅日期：{{ item.time }}</view>
    </card>
    <view class="more-detail" v-if="current.length > 3">点击查看更多记录</view>
  </quick-view>
</template>

<script lang="ts">
  import QuickView from '../QuickView/index.vue';
  import { LibraryService } from '@/services';
  import Taro from '@tarojs/taro';
  import dayjs from 'dayjs';
  import Card from '@/components/Card/index.vue';
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import { throttle } from '@/utils/tools';
  import './index.scss';
  export default defineComponent({
    components: { QuickView, Card },
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
