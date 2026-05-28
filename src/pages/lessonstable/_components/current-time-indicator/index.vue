<template>
  <view :class="styles['now-index']" :style="nowStyle" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed } from "vue";

import {
  DAY_SCHEDULE_START_TIME,
  LESSON_DURATION_MINUTES
} from "@/constants/day-schedule-start-time";

import styles from "./index.module.scss";

const nowStyle = computed(() => {
  const nowTime = dayjs().diff(dayjs().startOf("day"), "minute");

  /** 当前时间距离所在课程已过去的时间，单位为分钟 */
  let duration = 0;
  let lessonIndex = -1;

  for (const [i, element] of DAY_SCHEDULE_START_TIME.entries()) {
    const start = element.hour * 60 + element.min;
    const end = start + LESSON_DURATION_MINUTES;

    if (nowTime >= start && nowTime <= end) {
      lessonIndex = i;
      duration = nowTime - start;
      break;
    }
  }

  if (lessonIndex === -1) {
    const nextIndex = DAY_SCHEDULE_START_TIME.findIndex(
      (item) => nowTime < item.hour * 60 + item.min
    );
    lessonIndex = nextIndex === -1 ? DAY_SCHEDULE_START_TIME.length : nextIndex;
    duration = 0;
  }

  return {
    top: `${((lessonIndex + duration / LESSON_DURATION_MINUTES) / DAY_SCHEDULE_START_TIME.length) * 100}%`
  };
});
</script>
