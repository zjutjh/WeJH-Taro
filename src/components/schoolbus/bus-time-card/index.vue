<template>
  <!-- 班车信息卡片 -->
  <card :class="styles['bus-information-container']">
    <view :class="styles['bus-information-title']">
      <view :class="styles['start-time']"> {{ props.departureTime }}发车</view>
      <view :class="styles['route-name']">{{
        `${props.routeName} (${props.start}-${props.end})`
      }}</view>
    </view>
    <view :class="styles['bus-information-content']">
      <view :class="styles['row-item']">{{ `起终点站: ${props.start}-${props.end}` }} </view>
      <view :class="styles['row-item']">
        余票:
        <span
          :class="styles['remain-seats']"
          :style="{ color: props.remainSeats <= 0 ? 'red' : 'yellowgreen' }"
          >{{ props.remainSeats }}</span
        >
        {{ `| 已约：${props.orderedSeats}` }}
      </view>

      <view :class="styles['row-item']">{{ `票价: ${props.price}元` }}</view>
      <view :class="styles['detail-button']" @tap="nav2Detail()">班车详情</view>
    </view>
  </card>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";

import { Card } from "@/components";
import { BusTime } from "@/types/schoolbus";

import styles from "./index.module.scss";

const props = defineProps<BusTime>();

const nav2Detail = () => {
  Taro.navigateTo({
    url: `/pages/schoolbus/bus-detail/index?routeName=${props.routeName}&start=${props.start}&end=${props.end}`
  });
};
</script>
