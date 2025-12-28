<template>
  <card :class="styles.container">
    <view v-if="!isEmpty(openTypeText)" :class="['iconfont', 'icon-tag', styles['tag']]">
      <span :class="styles['tag-text']">
        {{ openTypeText }}
      </span>
    </view>
    <view :class="styles['bus-information-title']" @tap="handleClickDepartureText">
      <view :class="styles['start-time']"> {{ departureText }}</view>
      <view :class="styles['route-name']">
        {{ `${schedule.busName} (${schedule.start}-${schedule.end})` }}
      </view>
    </view>
    <view :class="styles['bus-information-content']">
      <view :class="styles['row-item']">{{ `起终点站：${schedule.start}-${schedule.end}` }} </view>
      <view :class="styles['row-item']">
        余票：
        <span :style="{ color: schedule.remainSeats <= 0 ? '#F56C6C' : '#49DF17' }">
          {{ schedule.remainSeats }}
        </span>
        <span :class="styles.divider" />
        <span>
          {{ `已约：${schedule.orderedSeats}` }}
        </span>
      </view>

      <view :class="styles['row-item']">{{ `票价：${schedule.price}元` }}</view>
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
    start: schedule.value.start,
    end: schedule.value.end
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
</script>
