<template>
  <theme-config>
    <title-bar title="公告" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <image src="@/assets/photos/announcement.svg" />
      </view>
      <view class="tab-bar">
        <text
          class="tab"
          :class="currentTab === 'announcement' ? 'active' : undefined"
          @tap="() => handleTabClick('announcement')"
        >
          精弘公告
        </text>
        <text
          class="tab"
          :class="currentTab === 'information' ? 'active' : undefined"
          @tap="() => handleTabClick('information')"
        >
          校园资讯
        </text>
      </view>
      <view class="flex-column">
        <template v-if="currentTab === 'announcement'">
          <card v-if="!announcementList" style="text-align: center">
            <view>无通知</view>
          </card>
          <card
            v-for="(item, index) in announcementList"
            :key="index"
            class="announcement-card"
            :title="item.title"
          >
            <view> {{ item.content.replace(/\\n/g, "\n") }}</view>
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
          <information-card v-for="item in informationList" :key="item.id" :source="item" />
        </template>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, ref } from "vue";

import { Card, ThemeConfig, TitleBar } from "@/components";
import { serviceStore } from "@/store";

import InformationCard from "./InformationCard/index.vue";
// 根据路由导航
const instance = Taro.getCurrentInstance();
const currentTab = ref<"announcement" | "information">(
  // @ts-expect-error 路由 query 的参数类型在外部保证了
  instance.router?.params.tab || "announcement"
);

const informationList = computed(() => {
  return [...serviceStore.information.informationList];
});

const announcementList = computed(() => {
  return [...serviceStore.announcement.announcements].reverse();
});

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};

const handleTabClick = (tab: "announcement" | "information") => {
  currentTab.value = tab;
};
</script>
