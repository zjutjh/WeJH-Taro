<template>
  <view class="information quick-view-container" @tap="handleClickYiXing">
    <view class="header">
      <view class="yixing-title">公告栏</view>
    </view>
    <!-- <view v-if="currentPost" class="content">
      <text> {{ currentPost.content.slice(0, 60) }}</text>
    </view>
    <view v-else :class="['quick-view-container', 'empty']">
      <text> 暂时公告信息 </text>
    </view> -->
    <view class="yixing-content">
      <text style="font-size: large;">精弘毅行火热进行中🔥</text>
      <text>紫色限定主题上线</text>
      <text class="url">点击查看报名详情</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";
import Taro from "@tarojs/taro";
import { serviceStore } from "@/store";
import store from "@/store";
import { SystemService } from "@/services";
import "./index.scss";

// const handleClick = () => {
//   if (currentPost.value.type === "announcement") {
//     Taro.navigateTo({
//       url: "/pages/announcement/index?tab=announcement",
//     });
//   } else {
//     Taro.navigateTo({
//       url: "/pages/announcement/index?tab=information",
//     });
//   }
// };

const handleClickYiXing = () => {
  Taro.navigateTo({
    url: "/pages/yixing/index",
  });
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
  if (information.length === 0) {
    return;
  }
  const infoTime = new Date(information[0].publish_time).getTime();
  const announcementTime = new Date(announcement[announcement.length - 1].publishTime).getTime();
  if (infoTime > announcementTime) {
    currentPost.value = {
      type: "information",
      content: information[0].content.replace(
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
};

onMounted(() => {
  updateCurrentPost();
});

onMounted(async () => {
  try {
    const informationList = (await SystemService.getInformation()).data.data || [];
    store.commit("setInformationList", informationList);
  } catch (e) {
    console.log(e);
  }
});

</script>
