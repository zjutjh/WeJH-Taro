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
              <view> 时间：{{ c.week }}丨{{ detailWeekDay(c.weekday) }} ({{ c.sections }}) </view>
              <view>学分：{{ c.credits }} </view>
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="selectionConflicts && selectionConflicts.length > 0"
        :class="styles['conflict-time']"
      >
        冲突时间：{{ conflictTime }}
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
import {
  computeOverlapWeeks,
  formatWeeks,
  isLessonActiveInWeek,
  parseWeeks
} from "@/utils/lessonTable/weeks";

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
  const conflicts = lessonsTableData.value.filter((l) => {
    if (!showWeekPicker.value) {
      return l.weekday === theClass.weekday && l.sections === theClass.sections;
    }
    return (
      l.weekday === theClass.weekday &&
      l.sections === theClass.sections &&
      isLessonActiveInWeek(l.week, selectWeek.value)
    );
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

function detailWeekDay(weekDay: string) {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  return `周${charEnum[parseInt(weekDay) - 1]}`;
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
