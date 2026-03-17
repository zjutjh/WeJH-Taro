<template>
  <card :class="[styles.container, isShowOpenTypeList ? styles['container--with-open-type'] : '']">
    <template #header>
      <view :class="styles['bus-information-title']" @tap="handleClickDepartureText">
        <view :class="styles['start-time']"> {{ departureText }}</view>
        <view :class="styles['route-name']">
          {{ `${schedule.busName} (${schedule.startDirection}-${schedule.endDirection})` }}
        </view>
      </view>
      <view v-if="isShowOpenTypeList" :class="styles['open-type-list']">
        <view
          v-for="item in openTypeOptionList"
          :key="item.value"
          :class="[styles['open-type-item'], item.active ? styles['open-type-item__active'] : '']"
        >
          <text :class="styles['open-type-item-text']">{{ item.label }}</text>
        </view>
      </view>
    </template>

    <view :class="styles['bus-information-content']">
      <view v-if="!isEmpty(schedule.stationList)" :class="styles['row-item']">
        {{ directionText }}
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
    <template v-if="schedule.matchReason" #footer>
      <view :class="styles['match-reason']">
        <text :class="styles['match-reason-property']">
          {{ schedule.matchReason.matchProperty }}
        </text>
        <text>包含：</text>
        <text :class="styles['match-reason-value']">
          {{ schedule.matchReason.matchValue }}
        </text>
      </view>
    </template>
  </card>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { first, isEmpty, last } from "lodash-es";
import urlcat from "urlcat";
import { computed, ref, toRefs } from "vue";

import { Card, WButton } from "@/components";
import { aegisReportEvent } from "@/plugins/aegis";

import { SCHEDULE_OPEN_TYPE_OPTIONS, SCHEDULE_OPEN_TYPE_TEXT_RECORD } from "../../_constants";
import { type ParsedBusSchedule } from "../../_types";
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

  aegisReportEvent("WjhFuncClick", {
    moduleName: "校车-班次卡片",
    funcName: "打开班车详情",
    extra: JSON.stringify({
      busName: schedule.value.busName,
      startDirection: schedule.value.startDirection,
      endDirection: schedule.value.endDirection
    })
  });

  Taro.navigateTo({ url });
};

const departureText = computed(() => {
  if (showRelativeDate.value) {
    return `${formatRelativeDayPeriod(schedule.value.departureTime)} 发车`;
  }
  return `${schedule.value.departureTime.format("M 月 D 日 HH:mm")} 发车`;
});

const isShowOpenTypeList = computed(() => {
  return !isEmpty(schedule.value.openType);
});

const openTypeOptionList = computed(() => {
  return SCHEDULE_OPEN_TYPE_OPTIONS.map((openType) => {
    return {
      value: openType,
      label: SCHEDULE_OPEN_TYPE_TEXT_RECORD[openType],
      active: schedule.value.openType?.includes(openType) ?? false
    };
  });
});

const priceText = computed(() => {
  if (isNaN(schedule.value.price)) {
    return "--";
  } else if (schedule.value.price === 0) {
    return "免费";
  }
  return `${(schedule.value.price / 100).toFixed(2)} 元`;
});

const directionText = computed(() => {
  const startStationText = first(schedule.value.stationList) ?? "--";
  const endStationText = last(schedule.value.stationList) ?? "--";

  return `起终点站：${startStationText}-${endStationText}`;
});
</script>
