<template>
  <card :class="styles['bus-information-container']">
    <view
      v-if="schedule.openType !== OpenTypeEnum.All"
      :class="['iconfont', 'icon-tag', styles['tag']]"
    >
      <span :class="styles['tag-text']">
        {{ openTypeText }}
      </span>
    </view>
    <view :class="styles['bus-information-title']" @tap="handleClickDepartureText">
      <view :class="styles['start-time']"> {{ departureText }}</view>
      <view :class="styles['route-name']">
        {{ `${schedule.routeName} (${schedule.start}-${schedule.end})` }}
      </view>
    </view>
    <view :class="styles['bus-information-content']">
      <view :class="styles['row-item']">{{ `起终点站: ${schedule.start}-${schedule.end}` }} </view>
      <view :class="styles['row-item']">
        余票:
        <span
          :class="styles['remain-seats']"
          :style="{ color: schedule.remainSeats <= 0 ? 'red' : 'yellowgreen' }"
        >
          {{ schedule.remainSeats }}
        </span>
        {{ `| 已约：${schedule.orderedSeats}` }}
      </view>

      <view :class="styles['row-item']">{{ `票价: ${schedule.price}元` }}</view>
      <view :class="styles['detail-button']" @tap="handleClickDetail">班车详情</view>
    </view>
  </card>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import urlcat from "urlcat";
import { computed, ref, toRefs } from "vue";

import { Card } from "@/components";

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
    routeName: schedule.value.routeName,
    start: schedule.value.start,
    end: schedule.value.end
  });
  Taro.navigateTo({ url });
};

const departureText = computed(() => {
  if (showRelativeDate.value) {
    return `${formatRelativeDayPeriod(schedule.value.departureTime)} 发车`;
  }
  return `${schedule.value.departureTime.format("MM月DD日 HH:mm")} 发车`;
});

const openTypeText = computed(() => {
  return schedule.value.openType === OpenTypeEnum.Weekday ? "仅工作日" : "仅节假日";
});
</script>
