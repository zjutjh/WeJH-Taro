<template>
  <view class="information quick-view-container" @tap="handleClick">
    <view class="header">
      <view class="title">公告栏</view>
    </view>
    <view v-if="currentPost" class="content">
      <text> {{ currentPost.content.slice(0, 60) }}</text>
    </view>
    <view v-else :class="['quick-view-container', 'empty']">
      <text> 暂时公告信息 </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Taro from "@tarojs/taro";
import { serviceStore } from "@/store";

const handleClick = () => {
  if (currentPost.value.type === "announcement") {
    Taro.navigateTo({
      url: "/pages/announcement/index?tab=announcement",
    });
  } else {
    Taro.navigateTo({
      url: "/pages/announcement/index?tab=information",
    });
  }
};

const currentPost = ref<{ type: string; content: string }>({
  type: "announcement",
  content: serviceStore.announcement.announcements[
    serviceStore.announcement.announcements.length - 1 || 0
  ].content.replace(/\\n/g, "\n"),
});

const updateCurrentPost = () => {
  const information = serviceStore.information.informationList;
  const announcement = serviceStore.announcement.announcements;
  const info_time = new Date(information[information.length - 1].publish_time).getTime();
  const announcement_time = new Date(announcement[announcement.length - 1].publishTime).getTime();

  if (information.length !== 0) {
    if (info_time > announcement_time) {
      currentPost.value = {
        type: "information",
        content: information[information.length - 1].content.replace(
          /\\n/g,
          "\n"
        ),
      };
    } else {
      currentPost.value = {
        type: "announcement",
        content: announcement[announcement.length - 1].content.replace(
          /\\n/g,
          "\n"
        ),
      };
    }
  }
};

updateCurrentPost();

</script>
