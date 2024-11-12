<template>
  <theme-config>
    <title-bar title="课程表" back-button />
    <view class="table-wrapper">
      <lessons-table
        :lessons="!showWeekPicker ? lessonsOfSelectedTerm : lessonsTableWeek"
        :is-this-week="isThisWeek"
        @class-click="classClick"
      />
    </view>

    <bottom-panel class="lessons-table-bottom-panel">
      <view class="col">
        <refresh-button
          v-if="showWeekPicker && isThisWeek"
          :is-refreshing="lessonTableStore.loading"
          @refresh="refresh"
        />
        <w-button
          v-else-if="showWeekPicker"
          class="back-button"
          size="large"
          shape="circle"
          @tap="backToOriginWeek"
        >
          <view class="iconfont icon-back" />
        </w-button>
      </view>
      <view v-if="showWeekPicker" class="col">
        <week-picker v-model:week="selectWeek" />
      </view>
      <view v-else class="col">
        <term-picker
          class="picker"
          :year="selectTerm.year"
          :term="selectTerm.term"
          :selectflag="0"
          @changed="termChanged"
        />
      </view>
      <view class="col">
        <view class="switch-button" @tap="pickerModeSwitch">
          <taro-image v-if="!showWeekPicker" :src="TermSwitcherIcon" />
          <taro-image v-else :src="WeekSwitcherIcon" />
        </view>
      </view>
    </bottom-panel>
    <pop-view v-model:show="showPop">
      <view v-if="selection" class="lesson-detail">
        <view class="lesson-title">
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
    </pop-view>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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
import { Lesson } from "@/types/Lesson";
import "./index.scss";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";
import { storeToRefs } from "pinia";
import useGeneralInfoStore from "@/store/system/generalInfo";
import useLessonTableStore from "@/store/service/lessonTable";
import TermSwitcherIcon from "@/assets/icons/term-week-swicher/term.svg";
import WeekSwitcherIcon from "@/assets/icons/term-week-swicher/week.svg";
import { Image as TaroImage } from "@tarojs/components";

const showPop = ref(false);
const selection = ref<Lesson>();
const { info: generalInfo } = storeToRefs(useGeneralInfoStore());
const lessonTableStore = useLessonTableStore();

// 本学期
const originTerm = {
  year: generalInfo.value.termYear,
  term: generalInfo.value.term
};
const selectTerm = ref(originTerm);

// 本周
const originWeek = Math.max(generalInfo.value.week, 0);
const selectWeek = ref(originWeek);

const lessonsOfSelectedTerm = computed(() => {
  return lessonTableStore.collections.find(term => {
    return term.year === selectTerm.value.year && term.term === selectTerm.value.term;
  })?.lessons || [];
});

const lessonsTableWeek = computed(() => {
  return lessonsOfSelectedTerm.value.filter((item) => {
    for (const time of item.week.split(",")) {
      if (time.includes("-")) {
        const start = parseInt(time.split("-")[0]);
        const end = parseInt(time.split("-")[1]);
        if (selectWeek.value <= end && selectWeek.value >= start)
          if (!time.includes("单") && !time.includes("双")) return true;
          else if (time.includes("单") && selectWeek.value % 2 === 1)
            return true;
          else if (time.includes("双") && selectWeek.value % 2 === 0)
            return true;
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

function refresh() {
  if (lessonTableStore.loading) return;
  lessonTableStore.fetchLessonTable(selectTerm.value);
}

const detailTimeInterval = computed(() => {
  const startIndex = parseInt(selection?.value!.sections.split("-")[0]);
  const endIndex = parseInt(selection?.value!.sections.split("-")[1]);
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
  selectTerm.value = e;
  lessonTableStore.fetchLessonTable(e);
}

const showWeekPicker = ref(true);
function pickerModeSwitch() {
  selectWeek.value = 1;
  showWeekPicker.value = !showWeekPicker.value;
}

function classClick(theClass: Lesson) {
  showPop.value = true;
  selection.value = theClass;
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

<style>
  @keyframes rote {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .refresh-running {
    animation: rote 1s alternate infinite;
  }
</style>
