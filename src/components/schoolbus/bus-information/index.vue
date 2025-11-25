<template>
  <!-- 班车信息卡片 -->
  <card :class="styles['bus-information-container']">
    <view :class="styles['bus-information-title']">
      <view :class="styles['start-time']"> {{ props.departureTime }}发车</view>
      <view :class="styles['route-name']">{{ props.routeName }}</view>
    </view>
    <view :class="styles['bus-information-content']">
      <view :class="styles['row-item']">{{ `起终点站: ${props.start}——${props.end}` }} </view>
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
      <view :class="styles['detail-button']">班车详情</view>
    </view>
  </card>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Card } from "@/components";
import { FEBusTime, OpenTypeEnum } from "@/types/school-bus";

import styles from "./index.module.scss";

// const props = defineProps<FEBusTime>();

const props = ref<FEBusTime>({
  departureTime: "11.19 13:00",
  id: "bus-time-001",
  orderedSeats: 10,
  openType: OpenTypeEnum.All,
  remainSeats: 5,
  routeName: "直达线  ( 朝晖——屏峰 )",
  price: 4,
  start: "邵科馆",
  end: "语林楼"
});
</script>
