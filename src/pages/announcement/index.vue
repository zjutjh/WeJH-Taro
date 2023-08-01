<template>
  <view class="background">
    <title-bar title="公告" back-button />
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/announcement.svg"></image>
      </view>
      <view class="tab-bar">
        <text
          class="tab"
          :class="currentTab === 'announcement' ? 'active': undefined"
          @tap="() => handleTabClick('announcement')"
        > 精弘公告
        </text>
        <text
          class="tab"
          :class="currentTab === 'information' ? 'active': undefined"
          @tap="() => handleTabClick('information')"
        > 校园资讯
        </text>
      </view>
      <view class="flex-column">
        <template v-if="currentTab === 'announcement'">
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
                <view>发布于：{{ timeFormat(item.publishTime) }}</view>
              </view>
            </template>
          </card>
        </template>
        <template v-else>
          <card v-if="!informationList.length" style="text-align: center">
            <view>暂无校园资讯</view>
          </card>
          <information-card
            v-for="item in informationList"
           :source="item"
           :key="item.id"
          />
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { Card, TitleBar } from "@/components";
import dayjs from "dayjs";
import { serviceStore } from "@/store";
import InformationCard from "./InformationCard/index.vue";
import "./index.scss";
import { computed, ref } from "vue";
import Taro from "@tarojs/taro";

// 根据路由导航
const instance = Taro.getCurrentInstance();
const currentTab = ref<"announcement" | "information">(
  // @ts-ignore
  instance.router?.params.tab || "announcement"
);

// const informationList = computed(() => {
//   return [...serviceStore.information.informationList].reverse();
// });

const informationList = [
  {
    id: 1,
    title: "关于2023年暑假放假的通知",
    content: "根据学校安排，2023年暑假放假时间为2023年8月1日至2023年8月30日，共30天。请同学们提前做好假期安排，注意安全，注意防疫。\n根据学校安排，2023年暑假放假时间为2023年8月1日至2023年8月30日，共30天。请同学们提前做好假期安排，注意安全，注意防疫。\n",
    publisher: "\"For You\"工程",
    publish_time: "2023-08-01 12:00:00",
    end_time: "2023-08-30 12:00:00",
    link: null,
    image_1: null,//"https://s2.loli.net/2023/07/31/48LEilcZv3GKQuD.jpg"
    image_2: null,
    image_3: null
  },
];

const announcementList = computed(() => {
  return [...serviceStore.announcement.announcements].reverse();
});

const timeFormat= (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};

const handleTabClick = (tab: "announcement" | "information") => {
  currentTab.value = tab;
};

</script>
