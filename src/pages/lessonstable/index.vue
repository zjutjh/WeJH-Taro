<template>
  <theme-config>
    <title-bar title="课程表" back-button />
    <view class="table-wrapper">
      <lessons-table
        :lessons="!isShowWeekTable ? (data?.lessons ?? []) : lessonsTableWeek"
        :is-this-week="isThisWeek"
        @class-click="handleTapLesson"
      />
    </view>

    <bottom-panel class="lessons-table-bottom-panel">
      <view class="col">
        <refresh-button
          v-if="isShowWeekTable && isThisWeek"
          :is-refreshing="isFetching"
          @refresh="refetch"
        />
        <w-button
          v-else-if="isShowWeekTable"
          class="back-button"
          size="large"
          shape="circle"
          @tap="backToOriginWeek"
        >
          <view class="iconfont icon-back" />
        </w-button>
      </view>
      <view v-if="isShowWeekTable" class="col">
        <week-picker v-model="fieldWeek" />
      </view>
      <view v-else class="col">
        <term-picker
          v-model="fieldTerm"
          class="picker"
        />
      </view>
      <view class="col">
        <view class="switch-button" @tap="handleChangeViewMode">
          <taro-image v-if="!isShowWeekTable" :src="TermSwitcherIcon" />
          <taro-image v-else :src="WeekSwitcherIcon" />
        </view>
      </view>
    </bottom-panel>
    <pop-view v-model:show="showPop">
      <view v-if="lookUpLesson" class="lesson-detail">
        <view class="lesson-title">
          {{ lookUpLesson.lessonName }}
        </view>
        <view>地点：{{ lookUpLesson.campus }}-{{ lookUpLesson.lessonPlace }} </view>
        <view>班级：{{ lookUpLesson.className }} </view>
        <view>教师：{{ lookUpLesson.teacherName }} </view>
        <view>
          时间：{{ lookUpLesson.week }}丨{{ detailWeekDay(lookUpLesson.weekday) }} ({{
            lookUpLesson.sections
          }})丨{{ detailTimeInterval }}
        </view>
        <view>学分：{{ lookUpLesson.credits }} </view>
      </view>
    </pop-view>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watchEffect } from "vue";
import {
  BottomPanel,
  PopView,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WButton
} from "@/components";
import WeekPicker from "./components/week-picker/index.vue";
import LessonsTable from "./components/lessons-table/index.vue";
import { Lesson } from "@/types/Lesson";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";
import useGeneralInfo from "@/store/system/generalInfo";
import TermSwitcherIcon from "@/assets/icons/term-week-swicher/term.svg";
import WeekSwitcherIcon from "@/assets/icons/term-week-swicher/week.svg";
import { Image as TaroImage } from "@tarojs/components";
import useLessonTableQuery from "@/store/service/lessonTable";
import Taro from "@tarojs/taro";
import "./index.scss";

const generalInfo = useGeneralInfo();
/** 本学期 */
const ORIGIN_TERM = {
  year: generalInfo.value.termYear,
  term: generalInfo.value.term
} as const;
/** 本周，在表单中的周数值为实际值减 1 */
const ORIGIN_WEEK = Math.max(+generalInfo.value.week - 1, 0);

const showPop = ref(false);
const fieldTerm = ref(ORIGIN_TERM);
const fieldWeek = ref(ORIGIN_WEEK);
/** 正在查阅的课程 */
const lookUpLesson = ref<Lesson>();

const { data, error, refetch, isFetching } = useLessonTableQuery({
  year: toRef(() => fieldTerm.value.year),
  term: toRef(() => fieldTerm.value.term)
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({ title: `更新课表失败: ${error.value.message}`, icon: "none" });
  }
});

const lessonsTableWeek = computed(() => {
  const selectedWeek = fieldWeek.value + 1;
  return data.value?.lessons?.filter((item) => {
    for (const time of item.week.split(",")) {
      if (time.includes("-")) {
        const start = parseInt(time.split("-")[0]);
        const end = parseInt(time.split("-")[1]);
        if (selectedWeek <= end && selectedWeek >= start)
          if (!time.includes("单") && !time.includes("双")) return true;
          else if (time.includes("单") && selectedWeek % 2 === 1)
            return true;
          else if (time.includes("双") && selectedWeek % 2 === 0)
            return true;
      } else if (selectedWeek === parseInt(time)) return true;
    }
    return false;
  }) ?? [];
});

const isThisWeek = computed(() => {
  return (
    fieldWeek.value === ORIGIN_WEEK &&
          JSON.stringify(ORIGIN_TERM) === JSON.stringify(fieldTerm.value)
  );
});

const detailTimeInterval = computed(() => {
  const startIndex = parseInt(lookUpLesson?.value!.sections.split("-")[0]);
  const endIndex = parseInt(lookUpLesson?.value!.sections.split("-")[1]);
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

/** 周课表和学期课表切换 */
const isShowWeekTable = ref(true);
function handleChangeViewMode() {
  fieldWeek.value = 0;
  isShowWeekTable.value = !isShowWeekTable.value;
}

function handleTapLesson(theClass: Lesson) {
  showPop.value = true;
  lookUpLesson.value = theClass;
}

function backToOriginWeek() {
  fieldTerm.value = ORIGIN_TERM;
  fieldWeek.value = ORIGIN_WEEK;
}

function detailWeekDay(weekDay: string) {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  return `周${charEnum[parseInt(weekDay) - 1]}`;
}

</script>
