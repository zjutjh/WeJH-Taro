<template>
  <!-- 班车详情卡片 -->
  <card :class="styles['bus-detail-container']">
    <view :class="styles['bus-detail-title']">
      {{ props.name }}
    </view>
    <view :class="styles['bus-detail-route']">
      <view :class="styles['dot']" />
      <span :class="styles['text']">{{ props.start }}</span>
      <Image :class="styles['triple-arrow']" /><span :class="styles['text']">{{ props.end }}</span>
    </view>
    <view :class="styles['schedule-table']">
      <!-- 表头 -->
      <view :class="[styles['table-row'], styles['table-header']]">
        <text :class="[styles['col'], styles['col-date']]">日期</text>
        <text :class="[styles['col'], styles['col-time']]">发车时间</text>
        <text :class="[styles['col'], styles['col-seats']]">余票</text>
      </view>

      <!-- 内容行 -->
      <view
        v-for="item in props.busTime"
        :key="item.id"
        :class="[styles['table-row'], styles['table-body-row']]"
      >
        <!-- 日期 (这里假设是当天，实际项目可能需要根据逻辑传入) -->
        <text :class="[styles['col'], styles['col-date']]">2024.11.22</text>

        <!-- 时间 -->
        <text :class="[styles['col'], styles['col-time']]">{{ item.departureTime }}</text>

        <!-- 余票状态处理 -->
        <view :class="[styles['col'], styles['col-seats']]">
          <!-- 情况1: 特殊类型 (如仅工作日) -->
          <text v-if="item.openType === 'weekday'" :class="styles['status-text']">
            仅工作日发车
          </text>
          <!-- 情况2: 票数为0 -->
          <text v-else-if="item.remainSeats === 0" :class="[styles['seats-num'], styles['zero']]">
            0
          </text>
          <!-- 情况3: 正常余票 -->
          <text v-else :class="styles['seats-num']">
            {{ item.remainSeats }}
          </text>
        </view>
      </view>
    </view>
  </card>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { Card } from "@/components";
import { FEBusInformation, OpenTypeEnum } from "@/types/schoolbus";

import styles from "./index.module.scss";
const props = ref<FEBusInformation>({
  id: "line-06",
  name: "6号线",
  start: "翰墨香林",
  end: "朝晖",
  price: 4, // 图片未显示，假设为4元
  seats: 45, // 图片未显示，假设总座位45

  // 对应图片中 “翰墨香林苑” 和 “朝晖体育馆北” 两个具体站点
  stations: [
    { id: "station-01", stationName: "翰墨香林苑" },
    { id: "station-02", stationName: "朝晖体育馆北" }
  ],

  busTime: [
    // 第1行：7:20，显示“仅工作日发车”
    {
      id: "bus-time-01",
      departureTime: "07:20",
      remainSeats: 45, // 虽显示文字，但数据层面通常有余票
      orderedSeats: 0,
      openType: OpenTypeEnum.Weekday, // 对应“仅工作日发车”

      // 下面是 FEBusTime 要求的冗余字段
      routeName: "6号线",
      start: "翰墨香林",
      end: "朝晖",
      price: 4
    },
    // 第2行：12:20，余票 0
    {
      id: "bus-time-02",
      departureTime: "12:20",
      remainSeats: 0, // 余票 0
      orderedSeats: 45, // 假设满座
      openType: OpenTypeEnum.All, // 没写限制，暂定为All

      routeName: "6号线",
      start: "翰墨香林",
      end: "朝晖",
      price: 4
    },
    // 第3行：15:30，显示“仅工作日发车”
    {
      id: "bus-time-03",
      departureTime: "15:30",
      remainSeats: 45,
      orderedSeats: 0,
      openType: OpenTypeEnum.Weekday, // 对应“仅工作日发车”

      routeName: "6号线",
      start: "翰墨香林",
      end: "朝晖",
      price: 4
    },
    // 第4行：16:30，余票 12
    {
      id: "bus-time-04",
      departureTime: "16:30",
      remainSeats: 12, // 余票 12
      orderedSeats: 33, // 45 - 12
      openType: OpenTypeEnum.All,

      routeName: "6号线",
      start: "翰墨香林",
      end: "朝晖",
      price: 4
    },
    // 第5行：20:30，余票 20
    {
      id: "bus-time-05",
      departureTime: "20:30",
      remainSeats: 20, // 余票 20
      orderedSeats: 25, // 45 - 20
      openType: OpenTypeEnum.All,

      routeName: "6号线",
      start: "翰墨香林",
      end: "朝晖",
      price: 4
    }
  ]
});
</script>
