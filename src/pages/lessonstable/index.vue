<template>
  <theme-config>
    <title-bar title="课程表" :back-button="true" />
    <view :class="styles['table-wrapper']">
      <lessons-table
        :lessons="!showWeekPicker ? lessonsTableData : lessonsTableWeek"
        :is-this-week="isThisWeek"
        @class-click="classClick"
      />
    </view>

    <bottom-panel :class="styles['lessons-table-bottom-panel']">
      <view :class="styles['col']">
        <refresh-button
          v-if="showWeekPicker && isThisWeek"
          :is-refreshing="isRefreshing"
          @refresh="refresh"
        />
        <w-button
          v-else-if="showWeekPicker"
          :class="styles['back-button']"
          size="large"
          shape="circle"
          @tap="backToOriginWeek"
        >
          <view class="iconfont icon-back" />
        </w-button>
      </view>
      <view v-if="showWeekPicker" :class="styles['col']">
        <week-picker v-model:week="selectWeek" />
      </view>
      <view v-else :class="styles['col']">
        <term-picker
          :class="styles['picker']"
          :year="selectTerm.year"
          :term="selectTerm.term"
          :selectflag="0"
          @changed="termChanged"
        />
      </view>
      <view :class="styles['col']">
        <view :class="styles['switch-button']" @tap="pickerModeSwitch">
          <image v-if="!showWeekPicker" src="@/assets/icons/term-week-swicher/term.svg" />
          <image v-else src="@/assets/icons/term-week-swicher/week.svg" />
        </view>
      </view>
    </bottom-panel>
    <pop-view v-model:show="showPop" style="z-index: 4000">
      <view v-if="selection" :class="styles['lesson-detail']">
        <view :class="styles['lesson-title']">
          {{ selection.lessonName }}
        </view>
        <view>地点：{{ selection.campus }}-{{ selection.lessonPlace }} </view>
        <view>班级：{{ selection.className }} </view>
        <view>教师：{{ selection.teacherName }} </view>
        <view>
          时间：{{ selection.week }}丨{{ detailWeekDay(selection.weekday) }} ({{
            selection.sections
          }})丨{{ detailTimeInterval }}
        </view>
        <view>学分：{{ selection.credits }} </view>
      </view>

      <view
        v-else-if="selectionConflicts && selectionConflicts.length > 0"
        :class="styles['lesson-detail']"
      >
        <view :class="styles['lesson-title']">冲突课程（{{ selectionConflicts.length }}）</view>
        <view :class="styles['conflict-list']">
          <view
            v-for="(c, idx) in selectionConflicts"
            :key="`${c.id}-${c.week}-${c.weekday}-${c.sections}-${idx}`"
            :class="styles['conflict-item']"
          >
            <view class="row">
              <view>地点：{{ c.campus }}-{{ c.lessonPlace }} </view>
              <view>班级：{{ c.className }} </view>
              <view>教师：{{ c.teacherName }} </view>
              <view>
                时间：{{ c.week }}丨{{ detailWeekDay(c.weekday) }} ({{ c.sections }})丨{{
                  detailTimeInterval
                }}
              </view>
              <view>学分：{{ c.credits }} </view>
            </view>
          </view>
        </view>
      </view>
    </pop-view>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import {
  BottomPanel,
  LessonsTable,
  PopView,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WButton,
  WeekPicker
} from "@/components";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";
import { ZFService } from "@/services";
import { systemStore } from "@/store";
import { Lesson } from "@/types/Lesson";

import styles from "./index.module.scss";

const showPop = ref(false);
const selection = ref<Lesson>();
const selectionConflicts = ref<Lesson[] | null>(null);

// 本学期
const originTerm = {
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term
};
const selectTerm = ref(originTerm);

// 本周
const originWeek = Math.max(systemStore.generalInfo.week, 0);
const selectWeek = ref(originWeek);

const lessonsTableData = computed(() => {
  return ZFService.getLessonTable(selectTerm.value) || [];
});

const lessonsTableWeek = computed(() => {
  return lessonsTableData.value.filter((item) => {
    for (const time of item.week.split(",")) {
      if (time.includes("-")) {
        const start = parseInt(time.split("-")[0]);
        const end = parseInt(time.split("-")[1]);
        if (selectWeek.value <= end && selectWeek.value >= start)
          if (!time.includes("单") && !time.includes("双")) return true;
          else if (time.includes("单") && selectWeek.value % 2 === 1) return true;
          else if (time.includes("双") && selectWeek.value % 2 === 0) return true;
      } else if (selectWeek.value === parseInt(time)) return true;
    }
    return false;
  });
});
const isThisWeek = computed(() => {
  return (
    selectWeek.value === originWeek &&
    JSON.stringify(originTerm) === JSON.stringify(selectTerm.value)
  );
});
const isRefreshing = ref(false);

async function refresh() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await ZFService.updateLessonTable(selectTerm.value);
  isRefreshing.value = false;
}

const detailTimeInterval = computed(() => {
  const startIndex = parseInt(selection.value?.sections.split("-")[0] ?? "");
  const endIndex = parseInt(selection.value?.sections.split("-")[1] ?? "");
  const startTime = useTimeInstance(
    dayScheduleStartTime[startIndex - 1].hour,
    dayScheduleStartTime[startIndex - 1].min
  ).format("HH:mm");
  const endTime = useTimeInstance(
    dayScheduleStartTime[endIndex - 1].hour,
    dayScheduleStartTime[endIndex - 1].min + 45
  ).format("HH:mm");

  return `${startTime}-${endTime}`;
});

async function termChanged(e) {
  isRefreshing.value = true;
  selectTerm.value = e;
  await ZFService.updateLessonTable(e);
  isRefreshing.value = false;
}

onMounted(async () => {
  await refresh();
});

const showWeekPicker = ref(true);
function pickerModeSwitch() {
  selectWeek.value = 1;
  showWeekPicker.value = !showWeekPicker.value;
}

// 课程点击事件更新，分为冲突和非冲突课程展示
function classClick(theClass: Lesson) {
  function isLessonInWeek(lesson: Lesson, week: number) {
    if (!lesson.week) return false;
    for (const time of lesson.week.split(",")) {
      if (time.includes("-")) {
        const start = parseInt(time.split("-")[0]);
        const end = parseInt(time.split("-")[1]);
        if (week <= end && week >= start) {
          if (!time.includes("单") && !time.includes("双")) return true;
          if (time.includes("单") && week % 2 === 1) return true;
          if (time.includes("双") && week % 2 === 0) return true;
        }
      } else if (week === parseInt(time)) return true;
    }
    return false;
  }

  const conflicts = lessonsTableData.value.filter((l) => {
    if (!showWeekPicker.value) {
      return l.weekday === theClass.weekday && l.sections === theClass.sections;
    }
    return (
      l.weekday === theClass.weekday &&
      l.sections === theClass.sections &&
      isLessonInWeek(l, selectWeek.value)
    );
  });

  if (conflicts.length > 1) {
    selectionConflicts.value = conflicts;
    selection.value = undefined;
    showPop.value = true;
  } else {
    selectionConflicts.value = null;
    selection.value = theClass;
    showPop.value = true;
  }
}
function backToOriginWeek() {
  selectTerm.value = originTerm;
  selectWeek.value = originWeek;
}

function detailWeekDay(weekDay: string) {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  return `周${charEnum[parseInt(weekDay) - 1]}`;
}
</script>
