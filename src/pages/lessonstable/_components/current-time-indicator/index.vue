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

  const firstLesson = DAY_SCHEDULE_START_TIME.at(0);
  const lastLesson = DAY_SCHEDULE_START_TIME.at(-1);

  if (!firstLesson || !lastLesson) return;

  const start = firstLesson.hour * 60 + firstLesson.min;
  const end = lastLesson.hour * 60 + lastLesson.min + LESSON_DURATION_MINUTES;
  const total = end - start;

  if (nowTime <= start) return { top: "0%" };
  if (nowTime >= end) return { top: "100%" };

  return { top: `${((nowTime - start) / total) * 100}%` };
});
</script>
