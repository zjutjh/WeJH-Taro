<template>
  <view :class="styles['now-index']" :style="nowStyle" />
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
  DAY_SCHEDULE_START_TIME,
  LESSON_DURATION_MINUTES
} from "@/constants/day-schedule-start-time";
import { getMinuteInterval } from "@/utils";

import styles from "./index.module.scss";

const nowStyle = computed(() => {
  const nowTime = getMinuteInterval();

  /** [0, 100] 区间的一个数，表示当前时间线所处的位置 */
  let position = 100;
  for (const [index, { hour, min }] of DAY_SCHEDULE_START_TIME.entries()) {
    const start = hour * 60 + min;
    const end = start + LESSON_DURATION_MINUTES;

    if (nowTime <= end) {
      const progress = Math.max(0, nowTime - start) / LESSON_DURATION_MINUTES;
      position = ((index + progress) / DAY_SCHEDULE_START_TIME.length) * 100;
      break;
    }
  }

  if (Number.isNaN(position)) return { display: "none" };
  return { top: `${position}%` };
});
</script>
