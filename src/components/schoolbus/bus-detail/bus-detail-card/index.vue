<template>
  <!-- 班车详情卡片 -->
  <card v-if="props.list && props.list.length > 0" :class="styles['bus-detail-container']">
    <view :class="styles['bus-detail-title']">
      {{ props.list[0].routeName }}
    </view>
    <view :class="styles['bus-detail-route']">
      <view :class="styles['dot']" />
      <span :class="styles['text']">{{ props.list[0].start }}</span>
      <span :class="styles['triple-arrow']" class="iconfont icon-triple-arrow" />
      <span :class="styles['text']">{{ props.list[0].end }}</span>
    </view>
    <view :class="styles['schedule-table']">
      <view :class="[styles['table-row'], styles['table-header']]">
        <span :class="[styles['col']]">发车时间</span>
        <span :class="[styles['col']]">余票</span>
        <span :class="[styles['col']]">发车情况</span>
      </view>

      <view
        v-for="(item, index) in props.list"
        :key="`${item.start}-${item.end}-${item.departureTime}`"
        :class="[styles['table-row']]"
        :style="index % 2 === 1 ? { backgroundColor: 'var(--wjh-color-primary-light)' } : {}"
      >
        <span :class="[styles['col']]">{{ item.departureTime }}</span>
        <view :class="[styles['col']]">
          <span
            v-if="item.remainSeats === -1 || item.remainSeats === 0"
            :class="[styles['seats-num'], styles['zero']]"
          >
            {{ item.remainSeats === -1 ? "-" : "0" }}
          </span>
          <span v-else :class="styles['seats-num']">
            {{ item.remainSeats }}
          </span>
        </view>
        <span :class="[styles['col']]">{{ openTypeMap[item.openType] }}</span>
      </view>
    </view>
  </card>
</template>
<script setup lang="ts">
import { Card } from "@/components";
import { FEBusTime, OpenTypeEnum } from "@/types/schoolbus";

import styles from "./index.module.scss";

const props = defineProps<{
  list: FEBusTime[];
}>();

const openTypeMap = {
  [OpenTypeEnum.All]: "正常发车",
  [OpenTypeEnum.Weekday]: "仅工作日发车",
  [OpenTypeEnum.Weekend]: "仅节假日发车"
};
</script>
