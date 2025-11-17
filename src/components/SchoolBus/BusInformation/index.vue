<template>
  <!-- 班车信息卡片 -->
  <view :class="styles['busInformationContainer']">
    <view :class="styles['busInformationTitle']">
      <view :class="styles['startTime']"> {{ props.departureTime }}发车</view>
      <view :class="styles['routeName']">{{ props.routeName }}</view>
    </view>
    <view :class="styles['busInformationContent']">
      <view :class="styles['rowItem']">{{ `起终点站: ${props.start}——${props.end}` }} </view>
      <view :class="styles['rowItem']">
        余票:
        <span
          :class="styles['remainSeats']"
          :style="{ color: props.remainSeats <= 0 ? 'red' : 'yellowgreen' }"
          >{{ props.remainSeats }}</span
        >
        {{ `| 已约：${props.orderedSeats}` }}
      </view>
      <view :class="styles['rowItem']">{{ `票价: ${props.price}元` }}</view>
      <view :class="styles['detailButton']">班车详情</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

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
