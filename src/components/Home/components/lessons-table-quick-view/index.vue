<template>
  <quick-view-container
    title="课程表"
    icon-name="lessonstable"
    class="lessons-table-quick-view"
    :help="true"
    @tap="nav2Lesson"
    @handle-tap-help="emit('showHelp', 'lessons-table')"
  >
    <text class="sub-text">
      {{ `${showTomorrow ? "明" : "今"}日课表 (${updateTimeString})` }}
    </text>

    <card
      v-for="(item, index) in lessonTable"
      :key="item.lessonName"
      :style="{
        '--bg-color': index % 2 ? 'var(--wjh-color-primary)' : 'var(--wjh-color-primary-dark)'
      }"
    >
      <view :key="updateRestTimeCounter + index" class="lesson-item">
        <view class="important-line">
          <text class="lesson-place"> {{ item.lessonPlace }} </text>
          <text v-if="lessonState(item.sections) === 'before'" class="before-lesson">
            还有 {{ getRestTimeString(item.sections) }} 上课
          </text>
          <text v-else-if="lessonState(item.sections) === 'taking'" class="taking-lesson">
            上课中
          </text>
        </view>
        <view class="teacher">
          <text class="iconfont icon-teacher" />
          <text class="teacher-name"> {{ ` ${item.teacherName}` }} </text>
          <text class="duration"> ({{ sectionsTimeString(item.sections) }}) </text>
        </view>
        <text class="lesson-name"> {{ item.lessonName }} </text>
      </view>
    </card>
    <view v-if="!lessonTable" class="default-content"> 点击获取你的课表 ～ </view>
    <view v-else-if="lessonTable.length === 0" class="default-content">
      {{ showTomorrow ? "明" : "今" }}天居然没有课😄
    </view>
  </quick-view-container>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { useArrayFilter, useIntervalFn } from "@vueuse/core";
import dayjs from "dayjs";
import { computed, ref, toRef } from "vue";

import { Card } from "@/components";
import {
  DAY_SCHEDULE_START_TIME,
  LESSON_DURATION_MINUTES
} from "@/constants/day-schedule-start-time";
import { useTimeInstance } from "@/hooks";
import { isLessonActiveInWeek } from "@/pages/lessonstable/_utils/weeks";
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";
import { getMinuteInterval } from "@/utils";

import QuickViewContainer from "../quick-view-container/index.vue";

const emit = defineEmits(["showHelp"]);

const { data, isError, dataUpdatedAt } = useQuery({
  queryKey: [
    QUERY_KEY.ZF_LESSONS_TABLE,
    toRef(() => systemStore.generalInfo.termYear),
    toRef(() => systemStore.generalInfo.term)
  ] as const,
  queryFn: ({ queryKey }) =>
    zfServiceNext.QueryLessonsTable({ year: queryKey[1], term: queryKey[2] }),
  select: (res) => res.lessonsTable
});

const tenPM = dayjs().startOf("day").add(22, "hour");
const showTomorrow = dayjs().isAfter(tenPM);

// 筛选出第一天或第二天的课表
const lessonTable = useArrayFilter(
  () => data.value ?? [],
  (item) => {
    /** 周日值为 7，周一值为 1 */
    const queryIsoDay =
      dayjs()
        .add(showTomorrow ? 1 : 0, "day")
        .day() || 7;

    const nextWeekOffset = queryIsoDay === 1 ? 1 : 0;
    const queryWeek = showTomorrow
      ? systemStore.generalInfo.week + nextWeekOffset // 如果明天是周一，意味着要查询下一周
      : systemStore.generalInfo.week;

    if (queryIsoDay !== Number.parseInt(item.weekday)) return false;

    return isLessonActiveInWeek(item.week, queryWeek);
  }
);

const updateRestTimeCounter = ref(0);
useIntervalFn(() => updateRestTimeCounter.value++, 5000);

const updateTimeString = computed(() => {
  if (isError.value) return "更新失败";
  return dataUpdatedAt.value ? dayjs(dataUpdatedAt.value).fromNow() : "请稍候";
});

function nav2Lesson() {
  return Taro.navigateTo({ url: "/pages/lessonstable/index" });
}

function sectionsTimeString(sections: string) {
  const arr = sections.split("-");
  return `${getLessonTimeInstance(Number.parseInt(arr[0])).format("HH:mm")}-${getLessonTimeInstance(Number.parseInt(arr[1]), LESSON_DURATION_MINUTES).format("HH:mm")}`;
}

function getLessonTimeInstance(jc: number, offset = 0) {
  if (jc < 1) return useTimeInstance(0, offset);
  return useTimeInstance(
    DAY_SCHEDULE_START_TIME.at(jc - 1)?.hour || 0,
    (DAY_SCHEDULE_START_TIME.at(jc - 1)?.min || 0) + offset
  );
}

function getRestTimeString(sections: string) {
  const begin = Number.parseInt(sections.split("-")[0]);
  const time =
    begin < 1
      ? { hour: 0, min: 0 }
      : (DAY_SCHEDULE_START_TIME.at(begin - 1) ?? { hour: 0, min: 0 });

  const minutesCount = time.hour * 60 + time.min;
  const currentMinutes = getMinuteInterval();

  const hour = Math.floor((minutesCount - currentMinutes) / 60);
  const min = minutesCount - currentMinutes - hour * 60;

  let restTimeString = "";
  if (hour) restTimeString += `${hour}小时`;
  if (min) restTimeString += `${min}分钟`;

  return restTimeString;
}

function lessonState(sections: string): "before" | "taking" | "after" {
  const now = dayjs();
  const arr = sections.split("-");
  const detAfter = getLessonTimeInstance(Number(arr[0])).diff(now);
  const detBefore = getLessonTimeInstance(Number(arr[1]), LESSON_DURATION_MINUTES).diff(now);

  if (detAfter > 0) return "before";
  if (detAfter < 0 && detBefore > 0) return "taking";
  return "after";
}
</script>
