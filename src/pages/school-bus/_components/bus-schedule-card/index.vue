<template>
  <card :class="styles.container">
    <view v-if="!isEmpty(openTypeText)" :class="styles['open-type-tag']">
      <view class="iconfont icon-tag" />
      <text :class="styles['tag-text']">
        {{ openTypeText }}
      </text>
    </view>
    <view :class="styles['bus-information-title']" @tap="handleClickDepartureText">
      <view :class="styles['start-time']"> {{ departureText }}</view>
      <view :class="styles['route-name']">
        {{ `${schedule.busName} (${schedule.startDirection}-${schedule.endDirection})` }}
      </view>
    </view>
    <view :class="styles['bus-information-content']">
      <view v-if="!isEmpty(schedule.startStation)" :class="styles['row-item']">
        {{ `起终点站：${schedule.startStation}-${schedule.endStation}` }}
      </view>
      <view :class="styles['row-item']">
        余票：
        <text :style="{ color: schedule.remainSeats <= 0 ? '#F56C6C' : '#49DF17' }">
          {{ schedule.remainSeats }}
        </text>
        <text :class="styles.divider" />
        <text>
          {{ `已约：${schedule.orderedSeats}` }}
        </text>
      </view>

      <view :class="styles['row-item']">{{ `票价：${priceText}` }}</view>
      <w-button :class="styles['detail-button']" @tap="handleClickDetail">班车详情</w-button>
    </view>
  </card>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { isEmpty, isNil } from "lodash-es";
import urlcat from "urlcat";
import { computed, ref, toRefs } from "vue";

import { Card, WButton } from "@/components";

import { SCHEDULE_OPEN_TYPE_TEXT_RECORD } from "../../_constants";
import { OpenTypeEnum, type ParsedBusSchedule } from "../../_types";
import { formatRelativeDayPeriod } from "../../_utils";
import styles from "./index.module.scss";

interface BusScheduleCardProps {
  schedule: ParsedBusSchedule;
}

const props = defineProps<BusScheduleCardProps>();
const { schedule } = toRefs(props);
const showRelativeDate = ref(true);

const handleClickDepartureText = () => {
  showRelativeDate.value = !showRelativeDate.value;
};

const handleClickDetail = () => {
  const url = urlcat("/pages/school-bus/bus-detail/index", {
    busName: schedule.value.busName,
    startDirection: schedule.value.startDirection,
    endDirection: schedule.value.endDirection
  });
  Taro.navigateTo({ url });
};

const departureText = computed(() => {
  if (showRelativeDate.value) {
    return `${formatRelativeDayPeriod(schedule.value.departureTime)} 发车`;
  }
  return `${schedule.value.departureTime.format("MM 月 DD 日 HH:mm")} 发车`;
});

const openTypeText = computed(() => {
  if (isNil(schedule.value.openType)) {
    return SCHEDULE_OPEN_TYPE_TEXT_RECORD[OpenTypeEnum.Unknown];
  }

  return SCHEDULE_OPEN_TYPE_TEXT_RECORD[schedule.value.openType];
});

const priceText = computed(() => {
  if (isNaN(schedule.value.price)) {
    return "--";
  } else if (schedule.value.price === 0) {
    return "免费";
  }
  return `${(schedule.value.price / 100).toFixed(2)} 元`;
});
</script>
