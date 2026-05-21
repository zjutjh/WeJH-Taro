<template>
  <theme-config>
    <title-bar title="课程表" :back-button="true" />
    <view :class="styles['table-wrapper']">
      <lessons-table
        :lessons="(!showWeekPicker ? lessonsData : lessonsTableWeek) ?? []"
        :is-this-week="isThisWeek"
        @lesson-click="handleLessonClick"
      />
    </view>

    <bottom-panel :class="styles['lessons-table-bottom-panel']">
      <view :class="styles['col']">
        <refresh-button
          v-if="showWeekPicker && isThisWeek"
          :is-refreshing="isPending"
          @refresh="refetch"
        />
        <w-button
          v-else-if="showWeekPicker"
          :class="styles['panel-button']"
          size="large"
          shape="circle"
          @tap="handleBackToOriginWeek"
        >
          <view class="iconfont icon-back" />
        </w-button>
        <w-button
          v-else-if="!showWeekPicker && !isEmpty(practiceLessonsData)"
          :class="styles['panel-button']"
          @tap="showPracticePopover = true"
        >
          <image src="@/assets/icons/practice-lesson/index.svg" />
        </w-button>
      </view>
      <view v-if="showWeekPicker" :class="styles['col']">
        <week-picker v-model:week="selectWeek" />
      </view>
      <view v-else :class="styles['col']">
        <term-picker
          v-model="selectTerm"
          :class="styles['picker']"
          :term-year="Number(systemStore.generalInfo.termYear)"
        />
      </view>
      <view :class="styles['col']">
        <view :class="styles['switch-button']" @tap="handlePickerModeSwitch">
          <image v-if="!showWeekPicker" src="@/assets/icons/term-week-swicher/term.svg" />
          <image v-else src="@/assets/icons/term-week-swicher/week.svg" />
        </view>
      </view>
    </bottom-panel>
    <lesson-popover
      v-model="showLessonPopover"
      :selection="selection"
      :selection-conflicts="selectionConflicts"
      :conflict-time="conflictTime"
      :detail-time-interval="detailTimeInterval"
    />
    <practice-lesson-popover
      v-model="showPracticePopover"
      :practice-lessons="practiceLessonsData"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { isEmpty, isEqual } from "lodash-es";
import { computed, ref, toRef } from "vue";

import {
  BottomPanel,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WButton,
  WeekPicker
} from "@/components";
import { DAY_SCHEDULE_START_TIME } from "@/constants/day-schedule-start-time";
import { useTimeInstance } from "@/hooks";
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";
import type { Lesson, PracticeLesson } from "@/types/lesson";

import LessonPopover from "./_components/conflict-lesson-popover/index.vue";
import LessonsTable from "./_components/lesson-grid/index.vue";
import PracticeLessonPopover from "./_components/practice-lesson-popover/index.vue";
import { isSectionsOverlap } from "./_utils/sections";
import { formatWeeks, isLessonActiveInWeek, parseWeeks } from "./_utils/weeks";
import styles from "./index.module.scss";

const showLessonPopover = ref(false);
const showPracticePopover = ref(false);
const selection = ref<Lesson>();
const selectionConflicts = ref<Lesson[]>();

// 本学期
const originTerm = {
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term
};
const selectTerm = ref(originTerm);

// 本周
const originWeek = Math.max(systemStore.generalInfo.week, 0);
const selectWeek = ref(originWeek);

const { data, isPending, refetch } = useQuery({
  queryKey: [
    QUERY_KEY.ZF_LESSONS_TABLE,
    toRef(() => selectTerm.value.year),
    toRef(() => selectTerm.value.term)
  ] as const,
  queryFn: ({ queryKey }) =>
    zfServiceNext.QueryLessonsTable({ year: queryKey[1], term: queryKey[2] })
});

const lessonsData = computed(() => data.value?.lessonsTable as Lesson[] | undefined);
const practiceLessonsData = computed(
  () => data.value?.practiceLessons as PracticeLesson[] | undefined
);

const lessonsTableWeek = computed(() =>
  lessonsData.value?.filter((l) => isLessonActiveInWeek(l.week, selectWeek.value))
);

const isThisWeek = computed(
  () => selectWeek.value === originWeek && isEqual(selectTerm.value, originTerm)
);

const detailTimeInterval = computed(() => {
  const sections = selection.value?.sections;
  if (!sections) return "";

  const [startText, endText = startText] = sections.split("-");
  const startIndex = Number(startText);
  const endIndex = Number(endText);
  if (!Number.isInteger(startIndex) || !Number.isInteger(endIndex)) return "";
  if (
    startIndex < 1 ||
    endIndex < 1 ||
    startIndex > DAY_SCHEDULE_START_TIME.length ||
    endIndex > DAY_SCHEDULE_START_TIME.length
  )
    return "";

  const startSlot = DAY_SCHEDULE_START_TIME[startIndex - 1];
  const endSlot = DAY_SCHEDULE_START_TIME[endIndex - 1];

  const startTime = useTimeInstance(startSlot.hour, startSlot.min).format("HH:mm");
  const endTime = useTimeInstance(endSlot.hour, endSlot.min + 45).format("HH:mm");

  return `${startTime}-${endTime}`;
});

const showWeekPicker = ref(true);
function handlePickerModeSwitch() {
  selectWeek.value = 1;
  showWeekPicker.value = !showWeekPicker.value;
}

// 课程点击事件更新，分为冲突和非冲突课程展示
function handleLessonClick(lesson: Lesson) {
  const clickedStack = lesson.stack || 0;

  const conflicts = lessonsData.value?.filter((l) => {
    if (l.weekday !== lesson.weekday) return false;
    if (showWeekPicker.value && !isLessonActiveInWeek(l.week, selectWeek.value)) return false;
    if (clickedStack > 0) {
      const stack = l.stack || 0;
      return stack < clickedStack && isSectionsOverlap(l.sections, lesson.sections);
    }
    return l.sections === lesson.sections;
  });

  if (conflicts && conflicts.length > 1) {
    selectionConflicts.value = conflicts;
    selection.value = undefined;
  } else {
    selectionConflicts.value = undefined;
    selection.value = lesson;
  }
  showLessonPopover.value = true;
}

function handleBackToOriginWeek() {
  selectTerm.value = originTerm;
  selectWeek.value = originWeek;
}

const conflictTime = computed(() => {
  const arr = selectionConflicts.value;
  if (!arr || arr.length === 0) return "";
  let inter: Set<number> | null = null;
  for (const it of arr) {
    const s = parseWeeks(it.week || "");
    if (inter === null) inter = new Set(s);
    else for (const w of inter) if (!s.has(w)) inter.delete(w);
  }
  if (!inter || inter.size === 0) return "无";
  return `${formatWeeks(inter)}周`;
});
</script>
