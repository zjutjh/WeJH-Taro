<template>
  <!-- 班车详情卡片 -->
  <card v-if="props.list && props.list.length > 0" :class="styles['bus-detail-container']">
    <view :class="styles['bus-detail-title']">
      {{ props.list[0].routeName }}
    </view>
    <view :class="styles['bus-detail-route']">
      <view :class="styles['dot']" />
      <span :class="styles['text']">{{ props.list[0].start }}</span>
      <Image :class="styles['triple-arrow']" /><span :class="styles['text']">{{
        props.list[0].end
      }}</span>
    </view>
    <view :class="styles['schedule-table']">
      <view :class="[styles['table-row'], styles['table-header']]">
        <span :class="[styles['col']]">日期</span>
        <span :class="[styles['col']]">发车时间</span>
        <span :class="[styles['col']]">余票</span>
      </view>

      <view
        v-for="(item, index) in props.list"
        :key="`${item.start}-${item.end}-${item.departureTime}`"
        :class="[styles['table-row']]"
        :style="index % 2 === 1 ? { backgroundColor: 'var(--wjh-color-primary-light)' } : {}"
      >
        <span :class="[styles['col']]">{{ item.departureTime }}</span>
        <view :class="[styles['col']]">
          <span v-if="item.openType === 'weekday'" :class="styles['status-span']">
            仅工作日发车
          </span>
          <span v-else-if="item.remainSeats === 0" :class="[styles['seats-num'], styles['zero']]">
            0
          </span>
          <span v-else :class="styles['seats-num']">
            {{ item.remainSeats }}
          </span>
        </view>
      </view>
    </view>
  </card>
</template>
<script setup lang="ts">
import { Card } from "@/components";
import { FEBusTime } from "@/types/schoolbus";

import styles from "./index.module.scss";

const props = defineProps<{
  list: FEBusTime[];
}>();
</script>
