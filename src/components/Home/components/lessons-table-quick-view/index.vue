<template>
  <quick-view-container
    title="课程表"
    icon-name="lessonstable"
    class="lessons-table-quick-view"
    :help="true"
    @tap="nav2Lesson"
    @handle-tap-help="handleTapHelp"
  >
    <text v-if="!showTomorrow" class="sub-text"> 今日课表 ({{ updateTimeString }}) </text>
    <text v-else class="sub-text"> 明日课表 ({{ updateTimeString }}) </text>

    <card
      v-for="(item, index) in lessonTable"
      :key="item.lessonName"
      :style="
        {
          '--bg-color': index % 2 ? 'var(--wjh-color-primary)' : 'var(--wjh-color-primary-dark)'
        } as CSSProperties
      "
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

    <view v-if="lessonTable?.length === 0 && !showTomorrow" class="default-content">
      今天居然没有课😄
    </view>
    <view v-if="lessonTable?.length === 0 && showTomorrow" class="default-content">
      明天居然没有课😄
    </view>
    <view v-if="!lessonTable" class="default-content"> 点击获取你的课表 ～ </view>
  </quick-view-container>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, CSSProperties, onMounted, onUnmounted, Ref, ref, toRef } from "vue";

import { Card } from "@/components";
import { DAY_SCHEDULE_START_TIME } from "@/constants/day-schedule-start-time";
import { useTimeInstance } from "@/hooks";
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";

import QuickViewContainer from "../quick-view-container/index.vue";

const tenPM = dayjs().set("hour", 22).set("minute", 0).set("second", 0);
const emit = defineEmits(["showHelp"]);
const timer: Ref<ReturnType<typeof setInterval> | null> = ref(null);

const showTomorrow = dayjs().isAfter(tenPM);

// 筛选出第一天或第二天的课表
const lessonTable = computed(() =>
  data.value?.filter((item) => {
    /** 周日值为 7，周一值为 1 */
    const queryDay = showTomorrow ? new Date().getDay() + 1 : new Date().getDay() || 7;
    const queryWeek = showTomorrow
      ? systemStore.generalInfo.week + Number(queryDay === 1)
      : // 如果明天是周一，意味着要查询下一周
        systemStore.generalInfo.week;
    if (queryDay !== Number.parseInt(item.weekday)) return false;

    for (const time of item.week.split(","))
      if (time.includes("-")) {
        const start = Number.parseInt(time.split("-")[0]);
        const end = Number.parseInt(time.split("-")[1]);
        if (queryWeek <= end && queryWeek >= start)
          if (!time.includes("单") && !time.includes("双")) return true;
          else if (time.includes("单") && queryWeek % 2 === 1) return true;
          else if (time.includes("双") && queryWeek % 2 === 0) return true;
      } else if (queryWeek === Number.parseInt(time)) return true;

    return false;
  })
);

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

const updateRestTimeCounter = ref(0);

onMounted(() => {
  timer.value = setInterval(() => {
    updateRestTimeCounter.value++;
  }, 5000);
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});

const updateTimeString = computed(() => {
  if (isError.value) return "更新失败";
  return dataUpdatedAt.value ? dayjs(new Date(dataUpdatedAt.value)).fromNow() : "请稍候";
});

async function nav2Lesson() {
  await Taro.navigateTo({ url: "/pages/lessonstable/index" });
}

function sectionsTimeString(sections: string) {
  const arr = sections.split("-");
  return `${getLessonTimeInstance(Number.parseInt(arr[0])).format("HH:mm")}-${getLessonTimeInstance(Number.parseInt(arr[1]), 45).format("HH:mm")}`;
}

function getLessonTimeInstance(jc: number, offset = 0) {
  return useTimeInstance(
    DAY_SCHEDULE_START_TIME[jc - 1].hour,
    DAY_SCHEDULE_START_TIME[jc - 1].min + offset
  );
}

function getRestTimeString(sections: string) {
  const begin = Number.parseInt(sections.split("-")[0]);
  const time = DAY_SCHEDULE_START_TIME[begin - 1];
  const minutesCount = time.hour * 60 + time.min;
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const hour = Math.floor((minutesCount - currentMinutes) / 60);
  const min = minutesCount - currentMinutes - hour * 60;
  return `${hour ? `${hour}小时` : ""}${min ? `${min}分钟` : ""}`;
}

function lessonState(sections: string): "before" | "taking" | "after" {
  const arr = sections.split("-");
  const detAfter = getLessonTimeInstance(Number(arr[0])).valueOf() - dayjs().valueOf();
  const detBefore = getLessonTimeInstance(Number(arr[1]), 45).valueOf() - dayjs().valueOf();
  if (detAfter > 0) return "before";
  if (detAfter < 0 && detBefore > 0) return "taking";
  return "after";
}

function handleTapHelp() {
  emit("showHelp", "lessons-table");
}
</script>
