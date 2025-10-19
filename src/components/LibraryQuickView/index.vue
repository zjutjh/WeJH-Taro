<template>
  <quick-view title="借阅信息" icon-name="library" class="book-quick-view" @tap="nav">
    <text class="sub-text"> 当前借阅 ({{ borrowUpdateTimeString }}) </text>
    <view v-if="!current || current.length === 0" class="default-content"> 当前无借阅图书 </view>
    <card
      v-for="(item, index) in current.slice(0, 3)"
      :key="item.loanId"
      :style="
        {
          '--bg-color': index % 2 ? 'var(--wjh-color-primary-dark)' : 'var(--wjh-color-primary)'
        } as CSSProperties
      "
    >
      <view class="book-name">
        {{ item.title }}
      </view>
      <view class="borrow-time"> 应还日期：{{ item.normReturnDate }} </view>
    </card>
    <view v-if="current?.length > 3" class="more-detail"> 点击查看更多记录 </view>
  </quick-view>
</template>

<script setup lang="ts">
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, CSSProperties } from "vue";

import { serviceStore } from "@/store";

import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";

const borrowUpdateTimeString = computed(() => {
  const updateTime = serviceStore.library.updateTime.current;
  if (updateTime) return dayjs(updateTime).fromNow();
  return "更新失败";
});

const current = computed(() => {
  return serviceStore.library.current;
});

function nav() {
  Taro.navigateTo({ url: "/pages/library/index" });
}
</script>
