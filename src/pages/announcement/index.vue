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
import { onMounted } from "vue";
import store from "@/store";
import { SystemService } from "@/services";
// 根据路由导航
const instance = Taro.getCurrentInstance();
const currentTab = ref<"announcement" | "information">(
  // @ts-ignore
  instance.router?.params.tab || "announcement"
);

onMounted(async () => {
  try {
    const informationList = (await SystemService.getInformation()).data.data || [];
    store.commit("setInformationList", informationList);
  } catch (e) {
    console.log(e);
  }
});

const informationList = computed(() => {
  return [...serviceStore.information.informationList].reverse();
});

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
