<template>
  <quick-view
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
          <text class="lesson-place">
            {{ item.lessonPlace }}
          </text>
          <text v-if="lessonState(item.sections) === 'before'" class="before-lesson">
            还有 {{ getRestTimeString(item.sections) }} 上课
          </text>
          <text v-else-if="lessonState(item.sections) === 'taking'" class="taking-lesson">
            上课中
          </text>
        </view>
        <view class="teacher">
          <text class="iconfont icon-teacher" />
          <text class="teacher-name">
            {{ ` ${item.teacherName}` }}
          </text>
          <text class="duration"> ({{ sectionsTimeString(item.sections) }}) </text>
        </view>
        <text class="lesson-name">
          {{ item.lessonName }}
        </text>
      </view>
    </card>

    <view v-if="lessonTable?.length === 0 && !showTomorrow" class="default-content">
      今天居然没有课😄
    </view>
    <view v-if="lessonTable?.length === 0 && showTomorrow" class="default-content">
      明天居然没有课😄
    </view>
    <view v-if="!lessonTable" class="default-content"> 点击获取你的课表 ～ </view>
  </quick-view>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, CSSProperties, onMounted, onUnmounted, Ref, ref, toRef } from "vue";

import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";
import { QUERY_KEY } from "@/services/api/queryKey";
import { getLessonsTable } from "@/services/services/zfService";
import { systemStore } from "@/store";

import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";

const tenPM = dayjs().set("hour", 22).set("minute", 0).set("second", 0);
const emit = defineEmits(["showHelp"]);
const timer: Ref<ReturnType<typeof setInterval> | null> = ref(null);

const showTomorrow = dayjs().isAfter(tenPM);

const {
  data: lessonTable,
  isError,
  dataUpdatedAt
} = useQuery({
  queryKey: [
    QUERY_KEY.ZF.LESSONS_TABLE,
    toRef(() => systemStore.generalInfo.termYear),
    toRef(() => systemStore.generalInfo.term)
  ] as const,
  queryFn: ({ queryKey }) => getLessonsTable({ year: queryKey[1], term: queryKey[2] }),
  // 筛选出当天或第二天的课表
  select: (res) =>
    res.lessonsTable.filter((item) => {
      /** 周日值为 7，周一值为 1 */
      const queryDay = !showTomorrow ? new Date().getDay() || 7 : new Date().getDay() + 1;
      const queryWeek = !showTomorrow
        ? systemStore.generalInfo.week
        : // 如果明天是周一，意味着要查询下一周
          systemStore.generalInfo.week + Number(queryDay === 1);
      if (queryDay !== parseInt(item.weekday)) return false;

      for (const time of item.week.split(",")) {
        if (time.includes("-")) {
          const start = parseInt(time.split("-")[0]);
          const end = parseInt(time.split("-")[1]);
          if (queryWeek <= end && queryWeek >= start)
            if (!time.includes("单") && !time.includes("双")) return true;
            else if (time.includes("单") && queryWeek % 2 === 1) return true;
            else if (time.includes("双") && queryWeek % 2 === 0) return true;
        } else if (queryWeek === parseInt(time)) return true;
      }
      return false;
    })
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

function nav2Lesson() {
  Taro.navigateTo({ url: "/pages/lessonstable/index" });
}

function sectionsTimeString(sections: string) {
  const arr = sections.split("-");
  return `${getLessonTimeInstance(parseInt(arr[0])).format("HH:mm")}-${getLessonTimeInstance(parseInt(arr[1]), 45).format("HH:mm")}`;
}

function getLessonTimeInstance(jc: number, offset = 0) {
  return useTimeInstance(
    dayScheduleStartTime[jc - 1].hour,
    dayScheduleStartTime[jc - 1].min + offset
  );
}

function getRestTimeString(sections: string) {
  const begin = parseInt(sections.split("-")[0]);
  const time = dayScheduleStartTime[begin - 1];
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
