<template>
  <view class="background">
    <title-bar title="公告"></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/announcement.svg"></image>
      </view>
      <view class="flex-column">
        <card v-if="!announcement" style="text-align: center">
          <view>无通知</view>
        </card>
        <card
          class="announcement-card"
          v-for="(item, index) in announcement.reverse()"
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
  import { computed, defineComponent, ref } from 'vue';
  import { Announcement } from '@/types/Announcement';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { SystemService } from '@/services';
  import dayjs from 'dayjs';
  import { serviceStore } from '@/store';

  import './index.scss';
  export default defineComponent({
    components: { Card, TitleBar },
    setup() {
      function reflesh() {
        SystemService.getAnnouncement();
      }
      const announcement = computed(
        () => serviceStore.announcement.announcements
      );

      return {
        reflesh,
        announcement,
        timeFotmat: (time: string) => {
          return dayjs(time).format('YYYY年MM月DD日');
        }
      };
    },
    mounted() {
      this.reflesh();
    }
  });
</script>
