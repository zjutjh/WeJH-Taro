<template>
  <card :class="styles['bus-detail-container']">
    <template #header>
      <view :class="styles.header">
        <view :class="styles['bus-detail-route']">
          <text>{{ routeNameParams.startDirection }}</text>
          <view :class="styles['triple-arrow-container']">
            <text :class="[styles['triple-arrow'], 'iconfont', 'icon-triple-arrow']" />
          </view>

          <text>{{ routeNameParams.endDirection }}</text>
        </view>

        <view :class="styles.extra" @tap="handleClickStations">
          <text>途径站点</text>
          <text :class="['iconfont', 'icon-arrow-right']" />
        </view>
      </view>
    </template>

    <view :class="styles['schedule-table']">
      <view :class="[styles['table-row'], styles['table-header'], styles['has-divider']]">
        <text :class="styles['col']">发车时间</text>
        <text :class="styles['divider']">|</text>
        <text :class="styles['col']">发车情况</text>
      </view>

      <view
        v-for="(item, index) in tableRowList"
        :key="`${item.startDirection}-${item.endDirection}-${item.departureTimeText}`"
        :class="[styles['table-row'], index % 2 === 1 ? styles['has-divider'] : '']"
        :style="index % 2 === 1 ? { backgroundColor: 'var(--wjh-color-primary-light)' } : {}"
      >
        <text :class="styles['col']">{{ item.departureTimeText }}</text>
        <text :class="styles['divider']">|</text>
        <text :class="styles['col']">{{ SCHEDULE_OPEN_TYPE_TEXT_RECORD[item.openType] }}</text>
      </view>
    </view>

    <pop-view v-model:show="isShowStationPopover" :class="styles['station-popover']">
      <view :class="styles['station-popover-header']">
        <text>{{ routeInConfig.name }} </text>
      </view>
      <view :class="styles['station-popover-content']">
        <view v-for="(station, index) in routeInConfig.stations" :key="`${station}-${index}`">
          <text>{{ station }}</text>
        </view>
      </view>
    </pop-view>
  </card>
</template>

<script setup lang="ts">
import { padStart } from "lodash-es";
import { computed, ref } from "vue";

import { BusStaticConfigItem } from "@/api/types/yxy";
import { Card, PopView } from "@/components";
import { SCHEDULE_OPEN_TYPE_TEXT_RECORD } from "@/pages/school-bus/_constants";
import { parseRouteName } from "@/pages/school-bus/_utils";

import { OpenTypeEnum } from "../../../_types";
import styles from "./index.module.scss";

const props = defineProps<{
  routeInConfig: BusStaticConfigItem;
}>();

const isShowStationPopover = ref(false);

const routeNameParams = computed(() => parseRouteName(props.routeInConfig.name));

const tableRowList = computed(() => {
  return props.routeInConfig.bus_time.map((scheduleConfig) => {
    const [configHour, configMinute] = scheduleConfig.departure_time.split(":");

    return {
      departureTimeText: `${padStart(configHour, 2, "0")}:${padStart(configMinute, 2, "0")}`,
      openType: scheduleConfig.open_type as OpenTypeEnum,
      busName: routeNameParams.value.busName,
      startDirection: routeNameParams.value.startDirection,
      endDirection: routeNameParams.value.endDirection
    };
  });
});

const handleClickStations = () => {
  isShowStationPopover.value = true;
};
</script>
