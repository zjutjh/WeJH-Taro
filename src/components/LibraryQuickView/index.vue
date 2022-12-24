<template>
  <quick-view title="借阅信息" icon-name="library" @tap="nav">
    <text class="sub-text">
      当前借阅 ({{ borrowUpdateTimeString }})
    </text>
    <view v-if="!current" class="default-content">
      当前无借阅图书
    </view>
    <card v-for="(item, index) in current.slice(0, 3)" v-else :key="item.libraryID" class="book-card"
      :style="bookCardBackgroundColor(index)">
      <view class="book-name">
        {{ item.name }}
      </view>
      <view class="borrrow-date">
        借阅日期：{{ item.time }}
      </view>
    </card>
    <view v-if="current?.length > 3" class="more-detail">
      点击查看更多记录
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import Card from "../Card/index.vue";
import { CSSProperties, computed } from "vue";
import { serviceStore } from "@/store";
import "./index.scss";

const borrowUpdateTimeString = computed(() => {
  const updateTime = serviceStore.library.updateTime?.current;
  if (updateTime) return dayjs(updateTime).fromNow();
  else return "更新失败";
});

const current = computed(() => {
  return serviceStore.library.current;
});

const bookCardBackgroundColor = (index: number): CSSProperties => {
  return {
    backgroundColor: `
      var(--wjh-color-
      ${index % 2 ? "yellow" : "orange"}
      -light)`
  };
};

function nav() {
  Taro.navigateTo({ url: "/pages/library/index" });
}

</script>
