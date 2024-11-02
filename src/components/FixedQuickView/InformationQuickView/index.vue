<template>
  <view class="information quick-view-container" @tap="handleClick">
    <view class="header">
      <view class="title">
        公告栏
      </view>
    </view>
    <view v-if="latestPost" class="content">
      <text> {{ latestPost.content.slice(0, 60) }}</text>
    </view>
    <view v-else :class="['quick-view-container', 'empty']">
      <text>暂时公告信息</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Taro from "@tarojs/taro";
import { storeToRefs } from "pinia";
import useNotificationStore from "@/store/service/notification";

const { announcement, information } = storeToRefs(useNotificationStore());

const handleClick = () => {
  if (latestPost.value?.type === "announcement") {
    Taro.navigateTo({
      url: "/pages/announcement/index?tab=announcement"
    });
  } else {
    Taro.navigateTo({
      url: "/pages/announcement/index?tab=information"
    });
  }
};

/** 在公告和咨询中取出最新的一条推文 */
const latestPost = computed(() => {
  const latestInformation = information.value[0];
  const latestAnnouncement = announcement.value[announcement.value.length - 1];

  if (!latestInformation || !latestAnnouncement) {
    const content = (latestInformation || latestAnnouncement)?.content?.replace(/\\n/g, "\n");
    if (latestInformation) return { type: "information", content };
    else if (latestAnnouncement) return { type: "announcement", content };
    else return undefined;
  } else {
    if (new Date(latestInformation.publish_time) > new Date(latestAnnouncement.publishTime)) {
      return { type: "information", content: latestInformation.content };
    }
    return { type: "announcement", content: latestAnnouncement.content.replace(/\\n/g, "\n") };
  }
});

</script>
