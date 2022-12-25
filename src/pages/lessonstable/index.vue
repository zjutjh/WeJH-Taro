<template>
  <view class="background">
    <title-bar title="课程表" back-button />
    <scroll-view :scrollY="true">
      <lessons-table
        :lessons="!showWeekPicker ? lessonsTableData : lessonsTableWeek"
        :is-this-week="isThisWeek"
        @classClick="classClick"
      />
    </scroll-view>

    <bottom-panel class="lessons-table-bottom-panel">
      <view class="col">
        <refresh-button
          v-if="showWeekPicker && isThisWeek"
          @refresh="refresh"
          :is-refreshing="isRefreshing"
        ></refresh-button>
        <w-button
          v-else-if="showWeekPicker"
          class="back-button"
          @tap="backToOriginWeek"
          size="large"
          shape="circle"
        >
          <view class="iconfont icon-back"> </view>
        </w-button>
      </view>
      <view class="col" v-if="showWeekPicker">
        <week-picker v-model:week="selectWeek"></week-picker>
      </view>
      <view class="col" v-else>
        <term-picker
          class="picker"
          @changed="termChanged"
          :year="selectTerm.year"
          :term="selectTerm.term"
        ></term-picker>
      </view>
      <view class="col">
        <view @tap="pickerModeSwitch" class="switch-button">
          <image
            v-if="!showWeekPicker"
            src="@/assets/icons/term-week-swicher/term.svg"
          ></image>
          <image v-else src="@/assets/icons/term-week-swicher/week.svg"></image>
        </view>
      </view>
    </bottom-panel>
  </view>
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { serviceStore, systemStore } from "@/store";
import {
  BottomPanel,
  TermPicker,
  TitleBar,
  LessonsTable,
  PopView,
  RefreshButton,
  WeekPicker,
  WButton
} from "@/components";
import { Lesson } from "@/types/Lesson";
import { ZFService } from "@/services";
import "./index.scss";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";

const showPop = ref(false);
const selection = ref<Lesson>();

//本学期
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
const isRefreshing = ref(false);

async function refresh() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await ZFService.updateLessonTable(selectTerm.value);
  isRefreshing.value = false;
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
  isRefreshing.value = true;
  selectTerm.value = e;
  await ZFService.updateLessonTable(e);
  isRefreshing.value = false;
}

onMounted(async () => {
  if (serviceStore.user.isBindZF) {
    await refresh();
  }
});

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
