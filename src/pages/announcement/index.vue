<template>
  <view class="background">
    <title-bar title="公告" back-button />
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

<script setup lang="ts">
import Card from "@/components/Card/index.vue";
import TitleBar from "@/components/TitleBar/index.vue";
import dayjs from "dayjs";
import { serviceStore } from "@/store";
import "./index.scss";
import { computed } from "vue";

const announcementList = computed(() => {
  return [...serviceStore.announcement.announcements].reverse();
});

const timeFotmat = (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};

</script>
