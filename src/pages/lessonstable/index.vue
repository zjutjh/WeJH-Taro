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
    <lesson-popover
      v-model:show="showPop"
      :selection="selection"
      :selection-conflicts="selectionConflicts"
      :conflict-time="conflictTime"
      :detail-time-interval="detailTimeInterval"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import {
  BottomPanel,
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
import type { Lesson } from "@/types/Lesson";

import LessonsTable from "./_components/lesson-grid/index.vue";
import LessonPopover from "./_components/lesson-popover/index.vue";
import { computeOverlapWeeks, formatWeeks, isLessonActiveInWeek, parseWeeks } from "./_utils/weeks";
import styles from "./index.module.scss";

const showPop = ref(false);
const selection = ref<Lesson>();
const selectionConflicts = ref<Lesson[] | null>(null);
const selectionSource = ref<Lesson | null>(null);

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
  return lessonsTableData.value.filter((item) => isLessonActiveInWeek(item.week, selectWeek.value));
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
  const sections = selection.value?.sections;
  if (!sections) return "";

  const [startText, endText = startText] = sections.split("-");
  const startIndex = Number(startText);
  const endIndex = Number(endText);
  if (!Number.isInteger(startIndex) || !Number.isInteger(endIndex)) return "";
  if (
    startIndex < 1 ||
    endIndex < 1 ||
    startIndex > dayScheduleStartTime.length ||
    endIndex > dayScheduleStartTime.length
  ) {
    return "";
  }

  const startSlot = dayScheduleStartTime[startIndex - 1];
  const endSlot = dayScheduleStartTime[endIndex - 1];

  const startTime = useTimeInstance(startSlot.hour, startSlot.min).format("HH:mm");
  const endTime = useTimeInstance(endSlot.hour, endSlot.min + 45).format("HH:mm");

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
  const clickedStack = theClass.stack || 0;

  function sectionsOverlap(a: string, b: string) {
    const [a1, a2] = a.split("-").map(Number);
    const [b1, b2] = b.split("-").map(Number);
    return !(a2 < b1 || b2 < a1);
  }

  const conflicts = lessonsTableData.value.filter((l) => {
    if (l.weekday !== theClass.weekday) return false;
    if (showWeekPicker.value && !isLessonActiveInWeek(l.week, selectWeek.value)) return false;
    if (clickedStack > 0) {
      const stack = l.stack || 0;
      return stack < clickedStack && sectionsOverlap(l.sections, theClass.sections);
    }
    return l.sections === theClass.sections;
  });

  if (conflicts.length > 1) {
    selectionConflicts.value = conflicts;
    selection.value = undefined;
    selectionSource.value = theClass;
    const sourceWeek = theClass.week || "";
    for (const item of conflicts) {
      (item as unknown as Record<string, string>)._overlap = computeOverlapWeeks(
        sourceWeek,
        item.week || ""
      );
    }
    showPop.value = true;
  } else {
    selectionConflicts.value = null;
    selection.value = theClass;
    selectionSource.value = null;
    showPop.value = true;
  }
}
function backToOriginWeek() {
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
    else {
      for (const w of Array.from(inter)) if (!s.has(w)) inter.delete(w);
    }
  }
  if (!inter || inter.size === 0) return "无";
  return `${formatWeeks(inter)}周`;
});
</script>
