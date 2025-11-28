<template>
  <theme-config>
    <title-bar title="班车详情" :back-button="true" />
    <scroll-view :scroll-y="true" :class="styles['bus-detail-container']">
      <bus-detail-card :key="testData.id" :class="styles['bus-detail-card']" v-bind="testData" />
    </scroll-view>

    <bus-detail-bottom-panel />
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { ref } from "vue";

import { BusDetailCard, ThemeConfig, TitleBar } from "@/components";
import BusDetailBottomPanel from "@/components/schoolbus/bus-detail-card/bus-detail-bottom-panel/index.vue";
import { FEBusInformation, OpenTypeEnum } from "@/types/schoolbus";

import styles from "./index.module.scss";

const testData = ref<FEBusInformation>({
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
