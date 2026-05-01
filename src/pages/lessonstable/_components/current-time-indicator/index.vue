<template>
  <view :class="styles['now-index']" :style="nowStyle" />
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
  DAY_SCHEDULE_START_TIME,
  LESSON_DURATION_MINUTES
} from "@/constants/day-schedule-start-time";

import styles from "./index.module.scss";

const nowStyle = computed(() => {
  const now = new Date();
  const nowTime = now.getHours() * 60 + now.getMinutes();

  /** 当前时间距离所在课程已过去的时间，单位为分钟 */
  let duration = 0;
  let lessonIndex = -1;

  for (let i = 0; i < DAY_SCHEDULE_START_TIME.length; i++) {
    const start = DAY_SCHEDULE_START_TIME[i].hour * 60 + DAY_SCHEDULE_START_TIME[i].min;
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
