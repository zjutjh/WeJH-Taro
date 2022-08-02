<template>
  <view class="background">
    <title-bar title="公告"></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/announcement.svg"></image>
      </view>
      <view class="flex-column">
        <card v-if="!announcementList" style="text-align: center">
          <view>无通知</view>
        </card>
        <card
          class="announcement-card"
          v-for="(item, index) in announcementList"
          :key="index"
          :title="item.title"
        >
          <view> {{ item.content.replace(/\\n/g, '\n') }}</view>
          <template #footer>
            <view class="time-wrapper">
              <view>发布于：{{ timeFotmat(item.publishTime) }}</view>
            </view>
          </template>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import dayjs from 'dayjs';
  import { serviceStore } from '@/store';
  import './index.scss';

  export default defineComponent({
    components: { Card, TitleBar },
    data() {
      return {};
    },
    computed: {
      announcementList() {
        return serviceStore.announcement.announcements.reverse();
      }
    },
    methods: {
      timeFotmat: (time: string) => {
        return dayjs(time).format('YYYY年MM月DD日');
      }
    }
  });
</script>
